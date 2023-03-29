import Login from '@/auth/Login.vue'
import { AuthService } from '@/auth/service'
import Discover from '@/discover/Discover.vue'
import AlbumDetails from '@/library/album/AlbumDetails.vue'
import AlbumLibrary from '@/library/album/AlbumLibrary.vue'
import ArtistDetails from '@/library/artist/ArtistDetails.vue'
import ArtistLibrary from '@/library/artist/ArtistLibrary.vue'
import Favourites from '@/library/favourite/Favourites.vue'
import GenreDetails from '@/library/genre/GenreDetails.vue'
import GenreLibrary from '@/library/genre/GenreLibrary.vue'
import PodcastDetails from '@/library/podcast/PodcastDetails.vue'
import PodcastLibrary from '@/library/podcast/PodcastLibrary.vue'
import RadioStations from '@/library/radio/RadioStations.vue'
import Queue from '@/player/Queue.vue'
import Playlist from '@/library/playlist/Playlist.vue'
import PlaylistLibrary from '@/library/playlist/PlaylistLibrary.vue'
import SearchResult from '@/library/search/SearchResult.vue'
import { config } from '@/shared/config'
import Router from 'vue-router'

export function setupRouter(auth: AuthService) {
  const router = new Router({
    mode: 'history',
    linkExactActiveClass: 'active',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/',
        name: 'home',
        component: Discover
      },
      {
        name: 'login',
        path: '/login',
        component: Login,
        props: (route) => ({
          returnTo: route.query.returnTo,
        }),
        meta: {
          layout: 'fullscreen'
        }
      },
      {
        name: 'queue',
        path: '/queue',
        component: Queue,
      },
      {
        name: 'albums-default',
        path: '/albums',
        redirect: ({
          name: 'albums',
          params: { sort: config.defaultAlbumSort }
        }),
      },
      {
        name: 'albums',
        path: '/albums/:sort',
        component: AlbumLibrary,
        props: true
      },
      {
        name: 'album',
        path: '/albums/id/:id',
        component: AlbumDetails,
        props: true,
      },
      {
        name: 'artists-default',
        path: '/artists',
        redirect: ({
          name: 'artists',
          params: { sort: config.defaultArtistSort }
        }),
      },
      {
        name: 'artists',
        path: '/artists/:sort',
        component: ArtistLibrary,
        props: true,
      },
      {
        name: 'artist',
        path: '/artists/id/:id',
        component: ArtistDetails,
        props: true,
      },
      {
        name: 'genres-default',
        path: '/genres',
        redirect: ({
          name: 'genres',
          params: { sort: config.defaultGenreSort }
        }),
      },
      {
        name: 'genres',
        path: '/genres/:sort',
        component: GenreLibrary,
        props: true,
      },
      {
        name: 'genre',
        path: '/genres/id/:id/:section?',
        component: GenreDetails,
        props: true,
      },
      {
        name: 'favourites-default',
        path: '/favourites',
        redirect: ({
          name: 'favourites',
          params: { section: config.defaultFavouritesSection }
        }),
      },
      {
        name: 'favourites',
        path: '/favourites/:section',
        component: Favourites,
        props: true,
      },
      {
        name: 'radio',
        path: '/radio',
        component: RadioStations,
      },
      {
        name: 'podcasts-default',
        path: '/podcasts',
        redirect: ({
          name: 'podcasts',
          params: { sort: config.defaultPodcastSort }
        }),
      },
      {
        name: 'podcasts',
        path: '/podcasts/:sort',
        component: PodcastLibrary,
        props: true,
      },
      {
        name: 'podcast',
        path: '/podcasts/id/:id',
        component: PodcastDetails,
        props: true,
      },
      {
        name: 'playlists-default',
        path: '/playlists',
        redirect: ({
          name: 'playlists',
          params: { sort: config.defaultPlaylistSort }
        }),
      },
      {
        name: 'playlists',
        path: '/playlists/:sort',
        component: PlaylistLibrary,
        props: true,
      },
      {
        name: 'playlist',
        path: '/playlist/:id',
        component: Playlist,
        props: true,
      },
      {
        name: 'search',
        path: '/search',
        component: SearchResult,
        props: (route) => ({
          query: route.query.q,
        })
      },
    ]
  })

  router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !auth.isAuthenticated()) {
      next({ name: 'login', query: { returnTo: to.fullPath } })
    } else {
      next()
    }
  })

  return router
}
