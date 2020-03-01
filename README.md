# Airsonic Web Client

[![pipeline status](https://gitlab.com/tamland/airsonic-frontend/badges/master/pipeline.svg)](https://gitlab.com/tamland/airsonic-ui/pipelines)

Modern responsive web frontend for [Airsonic](https://github.com/airsonic/airsonic). It's currently based on the [Subsonic API](http://www.subsonic.org/pages/api.jsp) and should work with other backends implementing this API as well.

![Screenshot](screenshots/albumlist.jpg)

![Screenshot](screenshots/album.png)


## Supported features
- Responsive UI. Works on mobile and desktop
- Playback with presistent queue
- Browse library for albums, artist, generes and starred songs
- Create, delete and edit playlists
- Search for artists, albums and songs
- Play random songs with the built-in smart playlist


## Demo

https://airsonic.netlify.com

Use address/credentials for your own Airsonic server, or use the subsonic.org demo server:
- server: http://demo.subsonic.org
- username: guest1
- password guest


## Build

```
yarn install
yarn build
```

Bundle can be found in the `dist` folder.


## Develop

```
yarn install
yarn serve
```


## License

Licensed under the [AGPLv3](LICENSE) license.
