import { AuthService } from '@/auth/service'
import { map, max, orderBy, uniq } from 'lodash-es'
import { toQueryString } from '@/shared/utils'

export type AlbumSort =
  'a-z' |
  'recently-added'|
  'recently-played' |
  'most-played' |
  'random'

export interface Track {
  id: string
  title: string
  duration: number
  favourite: boolean
  image?: string
  url?: string
  track?: number
  album?: string
  albumId?: string
  artist?: string
  artistId?: string
  isStream?: boolean
  isPodcast?: boolean
  isUnavailable?: boolean
  playCount? : number
  podcastStatus? : string
}

export interface Album {
  id: string
  name: string
  artist: string
  artistId: string
  year: number
  favourite: boolean
  genreId?: string
  image?: string
  tracks?: Track[]
}

export interface Artist {
  id: string
  name: string
  description?: string
  genres: string[]
  albumCount: number
  trackCount: number
  favourite: boolean
  lastFmUrl?: string
  musicBrainzUrl?: string
  topTracks?: Track[]
  similarArtist?: Artist[]
  albums?: Album[]
  image?: string
}

export interface SearchResult {
  artists: Artist[]
  albums: Album[]
  tracks: Track[]
}

export interface RadioStation {
  id: string
  title: string
  description: string
  url: string
}

export interface PodcastEpisode {
  id: string
  title: string
  description: string
}

export interface Playlist {
  id: string
  name: string
  comment: string
  isPublic: boolean
  trackCount: number
  createdAt: string
  updatedAt: string
  image?: string
  tracks?: Track[]
}

export class UnsupportedOperationError extends Error { }

export class API {
  private readonly fetch: (path: string, params?: any) => Promise<any>
  private readonly clientName = window.origin || 'web'

  constructor(private auth: AuthService) {
    this.fetch = (path: string, params: any) => {
      const url = `${this.auth.server}/${path}?${toQueryString({
        ...params,
        v: '1.15.0',
        f: 'json',
        c: this.clientName,
      })}&${this.auth.urlParams}`

      return window
        .fetch(url, {
          method: 'GET',
          headers: { Accept: 'application/json' }
        })
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          const message = `Request failed with status ${response.status}`
          // Handle non-standard Navidrome response
          if (response.status === 501) {
            return Promise.reject(new UnsupportedOperationError(message))
          }
          return Promise.reject(new Error(message))
        })
        .then(response => {
          const subsonicResponse = response['subsonic-response']
          if (subsonicResponse.status === 'ok') {
            return subsonicResponse
          }
          const message = subsonicResponse.error?.message || subsonicResponse.status
          throw new Error(message)
        })
    }
  }

  async getGenres() {
    const response = await this.fetch('rest/getGenres', {})
    return (response.genres.genre || [])
      .map((item: any) => ({
        id: item.value,
        name: item.value,
        albumCount: item.albumCount,
        trackCount: item.songCount,
      }))
      .sort((a: any, b:any) => b.albumCount - a.albumCount)
  }

  async getAlbumsByGenre(id: string, size: number, offset = 0) {
    const params = {
      type: 'byGenre',
      genre: id,
      size,
      offset,
    }
    const response = await this.fetch('rest/getAlbumList2', params)
    return (response.albumList2?.album || []).map(this.normalizeAlbum, this)
  }

  async getTracksByGenre(id: string, size: number, offset = 0) {
    const params = {
      genre: id,
      count: size,
      offset,
    }
    const response = await this.fetch('rest/getSongsByGenre', params)
    return (response.songsByGenre?.song || []).map(this.normalizeTrack, this)
  }

  async getArtists(): Promise<Artist[]> {
    const response = await this.fetch('rest/getArtists')
    return (response.artists?.index || [])
      .flatMap((index: any) => index.artist)
      .map(this.normalizeArtist, this)
  }

  async getAlbums(sort: AlbumSort, size: number, offset = 0): Promise<Album[]> {
    const type = {
      'a-z': 'alphabeticalByName',
      'recently-added': 'newest',
      'recently-played': 'recent',
      'most-played': 'frequent',
      random: 'random',
    }[sort]

    const params = { type, offset, size }
    const response = await this.fetch('rest/getAlbumList2', params)
    const albums = response.albumList2?.album || []
    return albums.map(this.normalizeAlbum, this)
  }

  async getArtistDetails(id: string): Promise<Artist> {
    const info2Promise = this.fetch('rest/getArtistInfo2', { id }).then(r => r.artistInfo2)
    const artist = await this.fetch('rest/getArtist', { id }).then(r => r.artist)
    const topSongs = await this.fetch('rest/getTopSongs', { artist: artist.name }).then(r => r.topSongs?.song)
    const info2 = await info2Promise
    return this.normalizeArtist({ ...artist, ...info2, topSongs })
  }

  async * getTracksByArtist(id: string): AsyncGenerator<Track[]> {
    const artist = await this
      .fetch('rest/getArtist', { id })
      .then(r => r.artist)

    const albumIds = orderBy(artist.album || [], x => x.year || 0, 'desc').map(x => x.id)
    for (const id of albumIds) {
      const { tracks } = await this.getAlbumDetails(id)
      if (tracks && tracks.length > 0) {
        yield tracks
      }
    }
  }

  async getAlbumDetails(id: string): Promise<Album> {
    const params = { id }
    const data = await this.fetch('rest/getAlbum', params)
    return this.normalizeAlbum(data.album)
  }

  async getPlaylists() {
    const response = await this.fetch('rest/getPlaylists')
    return (response.playlists?.playlist || []).map(this.normalizePlaylist, this)
  }

  async getPlaylist(id: string) {
    if (id === 'random') {
      return {
        id,
        name: 'Random',
        tracks: await this.getRandomSongs(),
      }
    }
    const response = await this.fetch('rest/getPlaylist', { id })
    return {
      ...this.normalizePlaylist(response.playlist),
      tracks: (response.playlist.entry || []).map(this.normalizeTrack, this),
    }
  }

  async createPlaylist(name: string) {
    await this.fetch('rest/createPlaylist', { name })
    return this.getPlaylists()
  }

  async editPlaylist(playlistId: string, name: string, comment: string, isPublic: boolean) {
    const params = {
      playlistId,
      name,
      comment,
      public: isPublic,
    }
    await this.fetch('rest/updatePlaylist', params)
  }

  async deletePlaylist(id: string) {
    await this.fetch('rest/deletePlaylist', { id })
  }

  async addToPlaylist(playlistId: string, tracks: string[]) {
    const params = {
      playlistId,
      songIdToAdd: tracks,
    }
    await this.fetch('rest/updatePlaylist', params)
  }

  async removeFromPlaylist(playlistId: string, index: number) {
    const params = {
      playlistId,
      songIndexToRemove: index,
    }
    await this.fetch('rest/updatePlaylist', params)
  }

  async getRandomSongs(): Promise<Track[]> {
    const params = {
      size: 200,
    }
    const response = await this.fetch('rest/getRandomSongs', params)
    return (response.randomSongs?.song || []).map(this.normalizeTrack, this)
  }

  async getFavourites() {
    const response = await this.fetch('rest/getStarred2')
    return {
      albums: (response.starred2?.album || []).map(this.normalizeAlbum, this),
      artists: (response.starred2?.artist || []).map(this.normalizeArtist, this),
      tracks: (response.starred2?.song || []).map(this.normalizeTrack, this)
    }
  }

  async addFavourite(id: string, type: 'track' | 'album' | 'artist') {
    const params = {
      id: type === 'track' ? id : undefined,
      albumId: type === 'album' ? id : undefined,
      artistId: type === 'artist' ? id : undefined,
    }
    await this.fetch('rest/star', params)
  }

  async removeFavourite(id: string, type: 'track' | 'album' | 'artist') {
    const params = {
      id: type === 'track' ? id : undefined,
      albumId: type === 'album' ? id : undefined,
      artistId: type === 'artist' ? id : undefined,
    }
    await this.fetch('rest/unstar', params)
  }

  async search(query: string): Promise<SearchResult> {
    const params = {
      query,
    }
    const data = await this.fetch('rest/search3', params)
    return {
      tracks: (data.searchResult3.song || []).map(this.normalizeTrack, this),
      albums: (data.searchResult3.album || []).map(this.normalizeAlbum, this),
      artists: (data.searchResult3.artist || []).map(this.normalizeArtist, this),
    }
  }

  async getRadioStations(): Promise<RadioStation[]> {
    const response = await this.fetch('rest/getInternetRadioStations')
    return (response?.internetRadioStations?.internetRadioStation || [])
      .map((item: any, idx: number) => ({ ...item, track: idx + 1 }))
      .map(this.normalizeRadioStation, this)
  }

  async addRadioStation(title: string, url: string): Promise<RadioStation> {
    const params = {
      name: title,
      streamUrl: url,
    }
    return this
      .fetch('rest/createInternetRadioStation', params)
      .then(this.normalizeRadioStation)
  }

  async updateRadioStation(item: RadioStation): Promise<RadioStation> {
    const params = {
      id: item.id,
      name: item.title,
      streamUrl: item.url,
    }
    return this
      .fetch('rest/updateInternetRadioStation', params)
      .then(this.normalizeRadioStation)
  }

  async deleteRadioStation(id: string): Promise<void> {
    return this.fetch('rest/deleteInternetRadioStation', { id })
  }

  async getPodcasts(): Promise<any[]> {
    const response = await this.fetch('rest/getPodcasts')
    return (response?.podcasts?.channel || []).map(this.normalizePodcast, this)
  }

  async getPodcast(id: string): Promise<any> {
    const response = await this.fetch('rest/getPodcasts', { id })
    return this.normalizePodcast(response?.podcasts?.channel[0])
  }

  async addPodcast(url: string): Promise<any> {
    return this.fetch('rest/createPodcastChannel', { url })
  }

  async refreshPodcasts(): Promise<void> {
    return this.fetch('rest/refreshPodcasts')
  }

  async downloadPodcastEpisode(id: string): Promise<any> {
    return this.fetch('rest/downloadPodcastEpisode', { id })
  }

  async deletePodcastEpisode(id: string): Promise<any> {
    return this.fetch('rest/deletePodcastEpisode', { id })
  }

  async deletePodcast(id: string): Promise<any> {
    return this.fetch('rest/deletePodcastChannel', { id })
  }

  async scan(): Promise<void> {
    return this.fetch('rest/startScan')
  }

  async scrobble(id: string): Promise<void> {
    return this.fetch('rest/scrobble', { id, submission: true })
  }

  async updateNowPlaying(id: string): Promise<void> {
    return this.fetch('rest/scrobble', { id, submission: false })
  }

  private normalizeRadioStation(item: any): Track & RadioStation {
    return {
      id: `radio-${item.id}`,
      title: item.name,
      description: item.homePageUrl,
      album: item.name,
      track: item.track,
      url: item.streamUrl,
      duration: 0,
      favourite: false,
      isStream: true,
    }
  }

  private normalizeTrack(item: any): Track {
    return {
      id: item.id,
      title: item.title,
      duration: item.duration,
      favourite: !!item.starred,
      track: item.track,
      album: item.album,
      albumId: item.albumId,
      artist: item.artist,
      artistId: item.artistId,
      url: this.getStreamUrl(item.id),
      image: this.getCoverArtUrl(item),
    }
  }

  private normalizeAlbum(item: any): Album {
    return {
      id: item.id,
      name: item.name,
      artist: item.artist,
      artistId: item.artistId,
      image: this.getCoverArtUrl(item),
      year: item.year || 0,
      favourite: !!item.starred,
      genreId: item.genre,
      tracks: (item.song || []).map(this.normalizeTrack, this)
    }
  }

  private normalizeArtist(item: any): Artist {
    return {
      id: item.id,
      name: item.name,
      description: (item.biography || '').replace(/<a[^>]*>.*?<\/a>/gm, ''),
      genres: uniq((item.album || []).flatMap((album: any) => album.genre || [])),
      albumCount: item.albumCount,
      trackCount: (item.album || []).reduce((acc: number, album: any) => acc + (album.songCount || 0), 0),
      favourite: !!item.starred,
      lastFmUrl: item.lastFmUrl,
      musicBrainzUrl: item.musicBrainzId
        ? `https://musicbrainz.org/artist/${item.musicBrainzId}`
        : undefined,
      albums: (item.album || []).map(this.normalizeAlbum, this),
      similarArtist: (item.similarArtist || []).map(this.normalizeArtist, this),
      topTracks: (item.topSongs || []).slice(0, 5).map(this.normalizeTrack, this),
      image: item.coverArt ? this.getCoverArtUrl(item) : item.artistImageUrl
    }
  }

  private normalizePlaylist(response: any): Playlist {
    return {
      id: response.id,
      name: response.name || '(Unnamed)',
      comment: response.comment || '',
      createdAt: response.created || '',
      updatedAt: response.changed || '',
      trackCount: response.songCount,
      image: response.songCount > 0 ? this.getCoverArtUrl(response) : undefined,
      isPublic: response.public,
    }
  }

  private normalizePodcast(podcast: any): any {
    const image = podcast.originalImageUrl
    const episodes = podcast.episode || []
    return {
      id: podcast.id,
      name: podcast.title || podcast.url,
      description: podcast.description,
      image,
      url: podcast.url,
      trackCount: episodes.length,
      updatedAt: max(map(episodes, 'publishDate')),
      tracks: episodes.map((item: any, index: number): Track & PodcastEpisode => ({
        id: item.id,
        title: item.title,
        duration: item.duration,
        favourite: false,
        track: episodes.length - index,
        album: podcast.title,
        artist: '',
        albumId: undefined,
        artistId: undefined,
        image,
        isPodcast: true,
        podcastStatus: item.status,
        isUnavailable: item.status !== 'completed' || !item.streamId,
        url: item.status === 'completed' && item.streamId
          ? this.getStreamUrl(item.streamId)
          : undefined,
        description: item.description,
        playCount: item.playCount || 0,
      })),
    }
  }

  getDownloadUrl(id: any) {
    const { server, urlParams } = this.auth
    return `${server}/rest/download` +
      `?id=${id}` +
      '&v=1.15.0' +
      `&${urlParams}` +
      `&c=${this.clientName}`
  }

  private getCoverArtUrl(item: any) {
    if (!item.coverArt) {
      return undefined
    }
    const { server, urlParams } = this.auth
    return `${server}/rest/getCoverArt` +
      `?id=${item.coverArt}` +
      '&v=1.15.0' +
      `&${urlParams}` +
      `&c=${this.clientName}` +
      '&size=300'
  }

  private getStreamUrl(id: any) {
    const { server, urlParams } = this.auth
    return `${server}/rest/stream` +
      `?id=${id}` +
      '&v=1.15.0' +
      `&${urlParams}` +
      `&c=${this.clientName}`
  }
}
