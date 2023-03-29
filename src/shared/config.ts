export interface Config {
  serverUrl: string,
  defaultAlbumSort: string,
  defaultArtistSort: string,
  defaultGenreSort: string,
  defaultFavouritesSection: string,
  defaultPodcastSort: string,
  defaultPlaylistSort: string,
}

const env = (window as any).env

export const config: Config = {
  serverUrl: env?.SERVER_URL || '',
  defaultAlbumSort: env?.DEFAULT_ALBUM_SORT || 'recently-added',
  defaultArtistSort: env?.DEFAULT_ARTIST_SORT || 'most-albums',
  defaultGenreSort: env?.DEFAULT_GENRE_SORT || 'most-albums',
  defaultFavouritesSection: env?.DEFAULT_FAVOURITES_SECTION || 'artists',
  defaultPodcastSort: env?.DEFAULT_PODCAST_SORT || 'recently-updated',
  defaultPlaylistSort: env?.DEFAULT_PLAYLIST_SORT || 'recently-added',
}
