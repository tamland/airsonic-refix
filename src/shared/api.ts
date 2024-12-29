import { AuthService } from '@/auth/service'
import { map, max, orderBy, sumBy, uniq, uniqBy } from 'lodash-es'
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
  artists: {name: string, id: string}[]
  isStream?: boolean
  isPodcast?: boolean
  isUnavailable?: boolean
  playCount?: number
  replayGain?: {trackGain: number, trackPeak: number, albumGain: number, albumPeak: number}
}

export interface Genre {
  name: string
}

export interface Album {
  id: string
  name: string
  description?: string
  artists: {name: string, id: string}[]
  year: number
  favourite: boolean
  genres: Genre[]
  image?: string
  lastFmUrl?: string
  musicBrainzUrl?: string
  tracks?: Track[]
}

export interface Artist {
  id: string
  name: string
  description?: string
  genres: Genre[]
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

export interface Directory {
  id: string
  name: string
  tracks: Track[]
  directories: {
    id: string
    name: string
  }[]
}

export interface Playlist {
  id: string
  name: string
  comment: string
  isPublic: boolean
  isReadOnly: boolean
  trackCount: number
  duration: number
  createdAt: string
  updatedAt: string
  image?: string
  tracks?: Track[]
}

export interface PlayQueue {
  tracks: Track[]
  currentTrack: number
  currentTrackPosition: number
}

export class UnsupportedOperationError extends Error { }

export class SubsonicError extends Error {
  readonly code: string | null
  constructor(message: string, code: string | null) {
    super(message)
    this.name = 'SubsonicError'
    this.code = code
  }
}

export class API {
  private readonly fetch: (path: string, params?: any) => Promise<any>
  private readonly clientName = window.origin || 'web'

  constructor(private auth: AuthService) {
    this.fetch = (path: string, params: any) => {
      params = { ...params, v: '1.15.0', f: 'json', c: this.clientName }

      const request = auth.serverInfo?.extensions.includes('formPost')
        ? new Request(`${this.auth.server}/${path}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `${toQueryString(params)}&${this.auth.urlParams}`
        })
        : new Request(`${this.auth.server}/${path}?${toQueryString(params)}&${this.auth.urlParams}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          }
        })

      return window
        .fetch(request)
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
          const code = subsonicResponse.error?.code
          const message = subsonicResponse.error?.message || subsonicResponse.status
          throw new SubsonicError(message, code)
        })
    }
  }

  async getGenres() {
    const response = await this.fetch('rest/getGenres', {})
    return (response.genres.genre || [])
      .map((item: any) => ({
        id: item.value,
        name: item.value,
        albumCount: item.albumCount ?? 0,
        trackCount: item.songCount ?? 0,
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
    const [info, info2] = await Promise.all([
      this.fetch('rest/getAlbum', params),
      this.fetch('rest/getAlbumInfo2', params),
    ])
    return this.normalizeAlbum({ ...info.album, ...info2.albumInfo })
  }

  async getPlaylists() {
    const response = await this.fetch('rest/getPlaylists')
    return (response.playlists?.playlist || []).map(this.normalizePlaylist, this)
  }

  async getPlaylist(id: string): Promise<Playlist> {
    if (id === 'random') {
      const tracks = await this.getRandomSongs()
      const duration = sumBy(tracks, 'duration')
      return {
        id,
        name: 'Random',
        comment: '',
        createdAt: '',
        updatedAt: '',
        tracks,
        trackCount: tracks.length,
        duration,
        isPublic: false,
        isReadOnly: true,
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

  async getPlayQueue(): Promise<PlayQueue> {
    const response = await this.fetch('rest/getPlayQueue')
    const tracks = (response.playQueue?.entry || []).map(this.normalizeTrack, this) as Track[]
    const currentTrackId = response.playQueue?.current?.toString()
    const currentTrack = tracks.findIndex(track => track.id === currentTrackId) ?? 0
    return {
      tracks,
      currentTrack,
      currentTrackPosition: (response.playQueue?.position || 0) / 1000,
    }
  }

  async savePlayQueue(tracks: Track[], currentTrack: Track | null, currentTime: number | null) {
    const tracksIds = tracks.filter(track => !track.isStream).map(track => track.id)
    const params = {
      id: tracksIds,
      current: !currentTrack?.isStream ? currentTrack?.id : undefined,
      position: currentTime != null ? Math.round(currentTime * 1000) : undefined,
    }
    try {
      await this.fetch('rest/savePlayQueue', params)
    } catch (err: any) {
      // ignore missing required parameter error
      if (err.code === 0 || err.code === 10) {
        return
      }
      throw err
    }
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

  async addRadioStation(title: string, url: string, description?: string): Promise<RadioStation[]> {
    const params = {
      name: title ?? '',
      streamUrl: url,
      homepageUrl: description?.trim() === '' ? undefined : description,
    }
    await this.fetch('rest/createInternetRadioStation', params)
    return await this.getRadioStations()
  }

  async updateRadioStation(item: RadioStation): Promise<RadioStation[]> {
    const params = {
      id: item.id.replace('radio-', ''),
      name: item.title ?? '',
      streamUrl: item.url,
      homepageUrl: item.description?.trim() === '' ? undefined : item.description
    }
    await this.fetch('rest/updateInternetRadioStation', params)
    return await this.getRadioStations()
  }

  async deleteRadioStation(id: string): Promise<void> {
    return this.fetch('rest/deleteInternetRadioStation', { id: id.replace('radio-', '') })
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

  async deletePodcast(id: string): Promise<any> {
    return this.fetch('rest/deletePodcastChannel', { id })
  }

  async getDirectory(path: string): Promise<Directory> {
    const parts = path.split('/')
    const musicFolderId = parts[0]
    const id = parts.length > 1 ? parts[parts.length - 1] : ''

    if (musicFolderId === '') {
      const response = await this.fetch('rest/getMusicFolders')
      const items = response?.musicFolders?.musicFolder ?? []
      return {
        id: '',
        name: '',
        tracks: [],
        directories: items.map((item: any) => ({ id: `${item?.id}`, name: item?.name, })),
      }
    }

    if (id === '') {
      const response = await this.fetch('rest/getIndexes', { musicFolderId })
      const directories = (response?.indexes?.index ?? []).flatMap((item: any) => [
        ...(item?.artist || []).map((i: any) => ({ id: i.id, name: i.name }))
      ])
      const tracks = (response?.indexes?.child ?? []).map(this.normalizeTrack, this)
      return {
        id: musicFolderId,
        name: musicFolderId,
        tracks,
        directories
      }
    }

    const response = await this.fetch('rest/getMusicDirectory', { id })
    const items = response?.directory?.child ?? []

    const directories = items
      .filter((item: any) => item.isDir)
      .map((item: any) => ({ id: item.id, name: item.title }))

    const tracks = items
      .filter((item: any) => !item.isDir && item.type === 'music' && item?.duration > 0)
      .map(this.normalizeTrack, this)

    return {
      id: response.directory.id,
      name: response.directory.name,
      tracks,
      directories,
    }
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
      // Workaround: airsonic-advanced does not use correct name
      description: item.homepageUrl || item.homePageUrl,
      album: item.name,
      track: item.track,
      url: item.streamUrl,
      duration: 0,
      favourite: false,
      isStream: true,
      artists: [],
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
      artists: item.artists?.length
        ? item.artists
        : [{ id: item.artistId, name: item.artist }],
      url: this.getStreamUrl(item.id),
      image: this.getCoverArtUrl(item),
      replayGain: item.replayGain,
    }
  }

  private normalizeGenres(item: any): Genre[] {
    if (item.genres?.length) {
      return item.genres
    }
    if (item.genre) {
      return [{ name: item.genre }]
    }
    return []
  }

  private normalizeAlbum(item: any): Album {
    return {
      id: item.id,
      name: item.name,
      description: (item.notes || '').replace(/<a[^>]*>.*?<\/a>/gm, ''),
      artists: item.artists?.length
        ? item.artists
        : [{ id: item.artistId, name: item.artist }],
      image: this.getCoverArtUrl(item),
      year: item.year || 0,
      favourite: !!item.starred,
      genres: this.normalizeGenres(item),
      lastFmUrl: item.lastFmUrl,
      musicBrainzUrl: item.musicBrainzId
        ? `https://musicbrainz.org/release/${item.musicBrainzId}`
        : undefined,
      tracks: (item.song || []).map(this.normalizeTrack, this)
    }
  }

  private normalizeArtist(item: any): Artist {
    return {
      id: item.id,
      name: item.name,
      description: (item.biography || '').replace(/<a[^>]*>.*?<\/a>/gm, ''),
      genres: uniqBy([...(item.album || []).flatMap(this.normalizeGenres, this)], 'name'),
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
      duration: response.duration,
      image: response.songCount > 0 ? this.getCoverArtUrl(response) : undefined,
      isPublic: response.public,
      isReadOnly: false,
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
        id: item.streamId,
        title: item.title,
        duration: item.duration,
        favourite: false,
        track: episodes.length - index,
        album: podcast.title,
        albumId: undefined,
        image,
        isPodcast: true,
        isUnavailable: item.status !== 'completed' || !item.streamId,
        url: item.status === 'completed' && item.streamId
          ? this.getStreamUrl(item.streamId)
          : undefined,
        description: item.description,
        playCount: item.playCount || 0,
        artists: [],
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
