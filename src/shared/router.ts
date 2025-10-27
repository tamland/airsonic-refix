import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/auth/Login.vue'
import Queue from '@/player/Queue.vue'
import Discover from '@/discover/Discover.vue'
import ArtistDetails from '@/library/artist/ArtistDetails.vue'
import ArtistLibrary from '@/library/artist/ArtistLibrary.vue'
import AlbumDetails from '@/library/album/AlbumDetails.vue'
import AlbumLibrary from '@/library/album/AlbumLibrary.vue'
import GenreDetails from '@/library/genre/GenreDetails.vue'
import GenreLibrary from '@/library/genre/GenreLibrary.vue'
import Favourites from '@/library/favourite/Favourites.vue'
import RadioStations from '@/library/radio/RadioStations.vue'
import PodcastDetails from '@/library/podcast/PodcastDetails.vue'
import PodcastLibrary from '@/library/podcast/PodcastLibrary.vue'
import Playlist from '@/library/playlist/Playlist.vue'
import PlaylistLibrary from '@/library/playlist/PlaylistLibrary.vue'
import SearchResult from '@/library/search/SearchResult.vue'
import { AuthService } from '@/auth/service'
import ArtistTracks from '@/library/artist/ArtistTracks.vue'
import Files from '@/library/file/Files.vue'
import { isArray } from 'lodash-es'

export function setupRouter(auth: AuthService) {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
      {
        path: '/login',
        name: 'login',
        component: Login,
        props: (route) => ({
          returnTo: route.query.returnTo,
        }),
        meta: {
          layout: 'fullscreen'
        }
      },
      {
        path: '/',
        name: 'home',
        component: Discover
      },
      {
        path: '/queue',
        name: 'queue',
        component: Queue,
      },
      {
        path: '/albums',
        children: [
          { path: '', redirect: { name: 'albums', params: { sort: 'recently-added' } } },
          { path: ':sort', name: 'albums', component: AlbumLibrary, props: true },
          { path: 'id/:id', name: 'album', component: AlbumDetails, props: true },
        ]
      },
      {
        path: '/artists',
        children: [
          { path: '', redirect: { name: 'artists', params: { sort: 'most-albums' } } },
          { path: ':sort', name: 'artists', component: ArtistLibrary, props: true },
          { path: 'id/:id', name: 'artist', component: ArtistDetails, props: true },
          { path: 'id/:id/tracks', name: 'artist-tracks', component: ArtistTracks, props: true },
        ]
      },
      {
        path: '/genres',
        children: [
          { path: '', redirect: { name: 'genres', params: { sort: 'most-albums' } } },
          { path: ':sort', name: 'genres', component: GenreLibrary, props: true, },
          {
            path: 'id/:id',
            name: 'genre',
            redirect: to => ({ name: 'genre-section', params: { ...to.params, section: 'albums' } })
          },
          { path: 'id/:id/:section', name: 'genre-section', component: GenreDetails, props: true },
        ]
      },
      {
        path: '/favourites',
        children: [
          { path: '', redirect: { name: 'favourites', params: { section: 'albums' } } },
          { path: ':section', name: 'favourites', component: Favourites, props: true },
        ]
      },
      {
        path: '/radio',
        children: [
          { path: '', name: 'radio', component: RadioStations, props: true },
        ]
      },
      {
        path: '/podcasts',
        children: [
          { path: '', redirect: { name: 'podcasts', params: { sort: 'recently-updated' } } },
          { path: ':sort', name: 'podcasts', component: PodcastLibrary, props: true },
          { path: 'id/:id', name: 'podcast', component: PodcastDetails, props: true },
        ]
      },
      {
        path: '/files',
        children: [
          { path: '', component: Files, props: ({ path: '' }) },
          {
            path: ':path(.*)+',
            name: 'files',
            component: Files,
            props: (route) => ({
              ...route.params,
              path: isArray(route.params.path) ? route.params.path.join('/') : route.params.path
            })
          },
        ]
      },
      {
        path: '/playlists',
        children: [
          {
            path: '',
            redirect: { name: 'playlists', params: { sort: 'recently-added' } }
          },
          {
            path: ':sort',
            name: 'playlists',
            component: PlaylistLibrary,
            props: true,
          },

        ],
      },
      {
        path: '/playlists/id/:id',
        name: 'playlist',
        component: Playlist,
        props: true,
      },
      {
        path: '/search/:type?',
        name: 'search',
        component: SearchResult,
        props: (route) => ({
          ...route.params,
          ...route.query,
        })
      },
    ],
    scrollBehavior(to, from, savedPosition) {
      return savedPosition || { top: 0 }
    },
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
