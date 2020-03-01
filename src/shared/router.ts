import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/auth/Login.vue'
import Queue from '@/player/Queue.vue'
import Home from '@/home/Home.vue'
import AlbumList from '@/library/album/AlbumList.vue'
import ArtistDetails from '@/library/artist/ArtistDetails.vue'
import ArtistList from '@/library/artist/ArtistList.vue'
import Album from '@/library/album/Album.vue'
import RandomSongs from '@/playlist/RandomSongs.vue'
import GenreList from '@/library/genre/GenreList.vue'
import GenreDetails from '@/library/genre/GenreDetails.vue'
import Starred from '@/library/starred/Starred.vue'
import Playlist from '@/playlist/Playlist.vue'
import PlaylistList from '@/playlist/PlaylistList.vue'
import SearchResult from '@/search/SearchResult.vue'
import { AuthService } from '@/auth/service';


export function setupRouter(auth: AuthService) {
  const router = new Router({
    mode: 'history',
    linkExactActiveClass: 'active',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        name: 'login',
        path: '/login',
        component: Login,
        props: (route) => ({
          returnTo: route.query.returnTo,
        })
      },
      {
        name: 'queue',
        path: '/queue',
        component: Queue,
      },
      {
        name: 'albums',
        path: '/albums',
        component: AlbumList
      },
      {
        name: 'album',
        path: '/album/:id',
        component: Album,
        props: true,
      },
      {
        name: 'artists',
        path: '/artists',
        component: ArtistList
      },
      {
        name: 'artist',
        path: '/artist/:id',
        component: ArtistDetails,
        props: true,
      },
      {
        name: 'genres',
        path: '/genres',
        component: GenreList,
      },
      {
        name: 'genre',
        path: '/genre/:id',
        component: GenreDetails,
        props: true,
      },
      {
        name: 'starred',
        path: '/starred',
        component: Starred,
      },
      {
        name: 'playlists',
        path: '/playlists',
        component: PlaylistList,
      },
      {
        name: 'playlist',
        path: '/playlist/:id',
        component: Playlist,
        props: true,
      },
      {
        name: 'playlist-random',
        path: '/random',
        component: RandomSongs,
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
  });

  router.beforeEach((to, from, next) => {
    if (to.name !== 'login' && !auth.isAuthenticated()) {
      next({name: 'login', query: { returnTo: to.fullPath }});
    } else {
      next();
    }
  });

  return router;
}
