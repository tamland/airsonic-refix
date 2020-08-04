import axios, { AxiosRequestConfig, AxiosInstance } from "axios"
import { AuthService } from '@/auth/service';

export type AlbumSort = "alphabeticalByName" | "newest" |  "recent" | "frequent" | "random"


export class API {
  readonly http: AxiosInstance;
  readonly get: (path: string, params?: any) => Promise<any>;
  readonly post: (path: string, params?: any) => Promise<any>;

  constructor(private auth: AuthService) {

    this.http = axios.create({});
    this.http.interceptors.request.use((config: AxiosRequestConfig) => {
      config.params = config.params || {};
      config.baseURL = this.auth.server
      config.params.u = this.auth.username;
      config.params.s = this.auth.salt;
      config.params.t = this.auth.hash;
      config.params.c = "app";
      config.params.f = "json";
      config.params.v = "1.15.0";
      return config;
    });

    this.get = (path: string, params: any = {}) => {
      return this.http.get(path, {params}).then(response => {
        const subsonicResponse = response.data["subsonic-response"];
        if (subsonicResponse.status !== "ok") {
          const err = new Error(subsonicResponse.status);
          return Promise.reject(err);
        } 
        return Promise.resolve(subsonicResponse);
      })
    }

    this.post = (path: string, params: any = {}) => {
      return this.http.post(path, params).then(response => {
        const subsonicResponse = response.data["subsonic-response"];
        if (subsonicResponse.status !== "ok") {
          const err = new Error(subsonicResponse.status);
          return Promise.reject(err);
        } 
        return Promise.resolve(subsonicResponse);
      })
    }
  }

  async getGenres() {
    const response = await this.get("rest/getGenres", {});
    return response.genres.genre
      .map((item: any) => ({
        id: encodeURIComponent(item.value),
        name: item.value,
        ...item,
      }))
      .sort((a: any, b:any) => a.name.localeCompare(b.name));;
  }

  async getGenreDetails(id: string) {
    const params = {
      genre: decodeURIComponent(id),
      count: 500,
      offset: 0,
    }
    const response = await this.get("rest/getSongsByGenre", params);
    return {
      name: id,
      tracks: this.normalizeTrackList(response.songsByGenre.song),
    }
  }

  async getArtists() {
    const data = await this.get("rest/getArtists");
    return data.artists.index.flatMap((index: any) => index.artist.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      ...artist
    })));
  }

  async getAlbums(sort: AlbumSort, size: number = 500) {
    const params = {
      type: sort,
      offset: "0",
      size: size,
    };
    const data = await this.get("rest/getAlbumList2", params);
    return data.albumList2.album.map((item: any) => ({
      ...item,
      image: item.coverArt ? this.getCoverArtUrl(item) : undefined,
    }));
  }

  async getArtistDetails(id: string) {
    const params = { id };
    const [info1, info2] = await Promise.all([
      this.get("rest/getArtist", params).then(r => r.artist),
      this.get("rest/getArtistInfo2", params).then(r => r.artistInfo2),
    ])
    return {
      id: info1.id,
      name: info1.name,
      description: (info2.biography || "").replace(/<a[^>]*>.*?<\/a>/gm, ''),
      image: info2.largeImageUrl || info2.mediumImageUrl || info2.smallImageUrl,
      lastFmUrl: info2.lastFmUrl,
      musicBrainzUrl: info2.musicBrainzId
        ? `https://musicbrainz.org/artist/${info2.musicBrainzId}` : null,
      albums: info1.album.map((album: any) => this.normalizeAlbumResponse(album)),
      similarArtist: (info2.similarArtist || []).map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        ...artist
      }))
    };
  }

  async getAlbumDetails(id: string) {
    const params = {id};
    const data = await this.get("rest/getAlbum", params);
    const item = data.album;
    const image = this.getCoverArtUrl(item);
    const trackList = item.song.map((s: any) => ({
      ...s,
      image,
      url: this.getStreamUrl(s.id),
    }))
    return {
      ...item,
      image,
      song: trackList,
    };
  }

  async getPlaylists() {
    const response = await this.get("rest/getPlaylists");
    return response.playlists.playlist.map((playlist: any) => ({
      ...playlist,
      name: playlist.name || "(Unnamed)",
      image: playlist.songCount > 0 ? this.getCoverArtUrl(playlist) : undefined,
    }));
  }

  async getPlaylist(id: string) {
    if (id === 'random') {
      return {
        id,
        name: 'Random',
        tracks: await this.getRandomSongs(),
      };
    }
    const response = await this.get("rest/getPlaylist", { id });
    return {
      ...response.playlist,
      name: response.playlist.name || "(Unnamed)",
      tracks: this.normalizeTrackList(response.playlist.entry || []),
    };
  }

  async createPlaylist(name: string) {
    await this.get("rest/createPlaylist", { name });
    return this.getPlaylists();
  }

  async deletePlaylist(id: string) {
    await this.get("rest/deletePlaylist", { id });
  }

  async addToPlaylist(playlistId: string, trackId: string) {
    const params = {
      playlistId,
      songIdToAdd: trackId,
    }
    await this.get("rest/updatePlaylist", params);
  }

  async removeFromPlaylist(playlistId: string, index: string) {
    const params = {
      playlistId,
      songIndexToRemove: index,
    }
    await this.get("rest/updatePlaylist", params);
  }

  async getRandomSongs() {
    const params = {
      size: 200,
    };
    const data = await this.get("rest/getRandomSongs", params);
    return this.normalizeTrackList(data.randomSongs.song);
  }

  async getStarred() {
    return this
      .get("rest/getStarred2")
      .then(r => this.normalizeTrackList(r.starred2.song))
  }

  async star(type: 'track' | 'album' | 'artist', id: string) {
    const params = {
      id: type === 'track' ? id : undefined,
      albumId: type === 'album' ? id : undefined,
      artistId: type === 'artist' ? id : undefined,
    }
    await this.get("rest/star", params);
  }

  async unstar(type: 'track' | 'album' | 'artist', id: string) {
    const params = {
      id: type === 'track' ? id : undefined,
      albumId: type === 'album' ? id : undefined,
      artistId: type === 'artist' ? id : undefined,
    }
    await this.get("rest/unstar", params);
  }

  async search(query: string) {
    const params = {
      query,
    };
    const data = await this.get("rest/search3", params);
    return {
      tracks: this.normalizeTrackList(data.searchResult3.song || []),
      albums: (data.searchResult3.album || []).map((x: any) => this.normalizeAlbumResponse(x)),
      artists: (data.searchResult3.artist || []).map((x: any) => this.normalizeArtistResponse(x)),
    };
  }

  private normalizeTrackList(items: any[]) {
    return items.map((item => ({
      ...item,
      url: this.getStreamUrl(item.id),
      image: this.getCoverArtUrl(item),
    })))
  }

  private normalizeAlbumResponse(item: any) {
    return {
      ...item,
      image: this.getCoverArtUrl(item)
    }
  }

  private normalizeArtistResponse(item: any) {
    return {
      ...item,
      image: this.getCoverArtUrl(item)
    }
  }

  private getCoverArtUrl(item: any) {
    if (!item.coverArt) {
      return undefined;
    }
    const { server, username, salt, hash } = this.auth;
    return `${server}/rest/getCoverArt?id=${item.coverArt}&v=1.15.0&u=${username}&s=${salt}&t=${hash}&c=test&size=300`
  }

  private getStreamUrl(id: any) {
    const { server, username, salt, hash } = this.auth;
    return `${server}/rest/stream?id=${id}&format=raw&v=1.15.0&u=${username}&s=${salt}&t=${hash}&c=test&size=300`
  }
}
