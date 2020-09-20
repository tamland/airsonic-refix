import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'
import { AuthService } from '@/auth/service'

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
  starred: boolean
  image?: string
  url?: string
  track?: number
  album?: string
  albumId?: string
  artist?: string
  artistId?: string
}

export interface Album {
  id: string
  name: string
  artist: string
  artistId: string
  year: number
  starred: boolean
  genre?: string
  image?: string
  tracks?: Track[]
}

export interface Artist {
  id: string
  name: string
  albumCount: number
  description?: string
  starred: boolean
  lastFmUrl?: string
  musicBrainzUrl?: string
  similarArtist?: Artist[]
  albums?: Album[]
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

export class API {
  readonly http: AxiosInstance;
  readonly get: (path: string, params?: any) => Promise<any>;
  readonly post: (path: string, params?: any) => Promise<any>;
  readonly clientName = window.origin || 'web';

  constructor(private auth: AuthService) {
    this.http = axios.create({})
    this.http.interceptors.request.use((config: AxiosRequestConfig) => {
      config.params = config.params || {}
      config.baseURL = this.auth.server
      config.params.u = this.auth.username
      config.params.s = this.auth.salt
      config.params.t = this.auth.hash
      config.params.c = this.clientName
      config.params.f = 'json'
      config.params.v = '1.15.0'
      return config
    })

    this.get = (path: string, params: any = {}) => {
      return this.http.get(path, { params }).then(response => {
        const subsonicResponse = response.data['subsonic-response']
        if (subsonicResponse.status !== 'ok') {
          const message = subsonicResponse.error?.message || subsonicResponse.status
          const err = new Error(message)
          return Promise.reject(err)
        }
        return Promise.resolve(subsonicResponse)
      })
    }

    this.post = (path: string, params: any = {}) => {
      return this.http.post(path, params).then(response => {
        const subsonicResponse = response.data['subsonic-response']
        if (subsonicResponse.status !== 'ok') {
          const err = new Error(subsonicResponse.status)
          return Promise.reject(err)
        }
        return Promise.resolve(subsonicResponse)
      })
    }
  }

  async getGenres() {
    const response = await this.get('rest/getGenres', {})
    return response.genres.genre
      .map((item: any) => ({
        id: item.value,
        name: item.value,
        ...item,
      }))
      .sort((a: any, b:any) => a.name.localeCompare(b.name))
  }

  async getAlbumsByGenre(id: string) {
    const params = {
      type: 'byGenre',
      genre: id,
      count: 500,
      offset: 0,
    }
    const response = await this.get('rest/getAlbumList2', params)
    return (response.albumList2?.album || []).map(this.normalizeAlbum, this)
  }

  async getTracksByGenre(id: string) {
    const params = {
      genre: id,
      count: 500,
      offset: 0,
    }
    const response = await this.get('rest/getSongsByGenre', params)
    return (response.songsByGenre?.song || []).map(this.normalizeTrack, this)
  }

  async getArtists(): Promise<Artist[]> {
    const response = await this.get('rest/getArtists')
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
    const response = await this.get('rest/getAlbumList2', params)
    const albums = response.albumList2?.album || []
    return albums.map(this.normalizeAlbum, this)
  }

  async getArtistDetails(id: string): Promise<Artist> {
    const params = { id }
    const [info1, info2] = await Promise.all([
      this.get('rest/getArtist', params).then(r => r.artist),
      this.get('rest/getArtistInfo2', params).then(r => r.artistInfo2),
    ])
    return this.normalizeArtist({ ...info1, ...info2 })
  }

  async getAlbumDetails(id: string): Promise<Album> {
    const params = { id }
    const data = await this.get('rest/getAlbum', params)
    return this.normalizeAlbum(data.album)
  }

  async getPlaylists() {
    const response = await this.get('rest/getPlaylists')
    return (response.playlists?.playlist || []).map((playlist: any) => ({
      ...playlist,
      name: playlist.name || '(Unnamed)',
      image: playlist.songCount > 0 ? this.getCoverArtUrl(playlist) : undefined,
    }))
  }

  async getPlaylist(id: string) {
    if (id === 'random') {
      return {
        id,
        name: 'Random',
        tracks: await this.getRandomSongs(),
      }
    }
    const response = await this.get('rest/getPlaylist', { id })
    return {
      ...response.playlist,
      name: response.playlist.name || '(Unnamed)',
      tracks: (response.playlist.entry || []).map(this.normalizeTrack, this),
    }
  }

  async createPlaylist(name: string) {
    await this.get('rest/createPlaylist', { name })
    return this.getPlaylists()
  }

  async deletePlaylist(id: string) {
    await this.get('rest/deletePlaylist', { id })
  }

  async addToPlaylist(playlistId: string, trackId: string) {
    const params = {
      playlistId,
      songIdToAdd: trackId,
    }
    await this.get('rest/updatePlaylist', params)
  }

  async removeFromPlaylist(playlistId: string, index: string) {
    const params = {
      playlistId,
      songIndexToRemove: index,
    }
    await this.get('rest/updatePlaylist', params)
  }

  async getRandomSongs(): Promise<Track[]> {
    const params = {
      size: 200,
    }
    const response = await this.get('rest/getRandomSongs', params)
    return (response.randomSongs?.song || []).map(this.normalizeTrack, this)
  }

  async getStarred() {
    const response = await this.get('rest/getStarred2')
    return {
      albums: (response.starred2?.album || []).map(this.normalizeAlbum, this),
      artists: (response.starred2?.artist || []).map(this.normalizeArtist, this),
      tracks: (response.starred2?.song || []).map(this.normalizeTrack, this)
    }
  }

  starAlbum(id: string) {
    return this.star('album', id)
  }

  unstarAlbum(id: string) {
    return this.unstar('album', id)
  }

  async star(type: 'track' | 'album' | 'artist', id: string) {
    const params = {
      id: type === 'track' ? id : undefined,
      albumId: type === 'album' ? id : undefined,
      artistId: type === 'artist' ? id : undefined,
    }
    await this.get('rest/star', params)
  }

  async unstar(type: 'track' | 'album' | 'artist', id: string) {
    const params = {
      id: type === 'track' ? id : undefined,
      albumId: type === 'album' ? id : undefined,
      artistId: type === 'artist' ? id : undefined,
    }
    await this.get('rest/unstar', params)
  }

  async search(query: string): Promise<SearchResult> {
    const params = {
      query,
    }
    const data = await this.get('rest/search3', params)
    return {
      tracks: (data.searchResult3.song || []).map(this.normalizeTrack, this),
      albums: (data.searchResult3.album || []).map(this.normalizeAlbum, this),
      artists: (data.searchResult3.artist || []).map(this.normalizeArtist, this),
    }
  }

  async getRadioStations(): Promise<RadioStation[]> {
    const response = await this.get('rest/getInternetRadioStations')
    return (response?.internetRadioStations?.internetRadioStation || [])
      .map(this.normalizeRadioStation, this)
  }

  async addRadioStation(title: string, url: string): Promise<RadioStation> {
    const params = {
      name: title,
      streamUrl: url,
    }
    return this
      .get('rest/createInternetRadioStation', params)
      .then(this.normalizeRadioStation)
  }

  async updateRadioStation(item: RadioStation): Promise<RadioStation> {
    const params = {
      id: item.id,
      name: item.title,
      streamUrl: item.url,
    }
    return this
      .get('rest/updateInternetRadioStation', params)
      .then(this.normalizeRadioStation)
  }

  async deleteRadioStation(id: string): Promise<void> {
    return this.get('rest/deleteInternetRadioStation', { id })
  }

  private normalizeRadioStation(item: any): Track & RadioStation {
    return {
      id: `radio-${item.id}`,
      title: item.name,
      description: item.homePageUrl,
      url: item.streamUrl,
      duration: 0,
      starred: false,
    }
  }

  private normalizeTrack(item: any): Track {
    return {
      id: item.id,
      title: item.title,
      duration: item.duration,
      starred: !!item.starred,
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
      starred: !!item.starred,
      genre: item.genre,
      tracks: (item.song || []).map(this.normalizeTrack, this)
    }
  }

  private normalizeArtist(item: any): Artist {
    const albums = item.album
      ?.map(this.normalizeAlbum, this)
      .sort((a: any, b: any) => b.year - a.year)

    return {
      id: item.id,
      name: item.name,
      description: (item.biography || '').replace(/<a[^>]*>.*?<\/a>/gm, ''),
      starred: !!item.starred,
      albumCount: item.albumCount,
      lastFmUrl: item.lastFmUrl,
      musicBrainzUrl: item.musicBrainzId
        ? `https://musicbrainz.org/artist/${item.musicBrainzId}`
        : undefined,
      albums,
      similarArtist: (item.similarArtist || []).map(this.normalizeArtist, this)
    }
  }

  private getCoverArtUrl(item: any) {
    if (!item.coverArt) {
      return undefined
    }
    const { server, username, salt, hash } = this.auth
    return `${server}/rest/getCoverArt` +
      `?id=${item.coverArt}` +
      '&v=1.15.0' +
      `&u=${username}` +
      `&s=${salt}` +
      `&t=${hash}` +
      `&c=${this.clientName}` +
      '&size=300'
  }

  private getStreamUrl(id: any) {
    const { server, username, salt, hash } = this.auth
    return `${server}/rest/stream` +
      `?id=${id}` +
      '&format=raw' +
      '&v=1.15.0' +
      `&u=${username}` +
      `&s=${salt}` +
      `&t=${hash}` +
      `&c=${this.clientName}` +
      '&size=300'
  }
}
