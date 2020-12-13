# Airsonic Web Client

[![](https://github.com/tamland/airsonic-frontend/workflows/CI/badge.svg)](https://github.com/tamland/airsonic-frontend/actions)

Modern responsive web frontend for [Airsonic](https://github.com/airsonic/airsonic). It's currently based on the [Subsonic API](http://www.subsonic.org/pages/api.jsp) and should work with other backends implementing this API as well.

![Screenshot](screenshots/album.png)

![Screenshot](screenshots/albumlist.png)


## Supported features
- Responsive UI for desktop and mobile
- Playback with persistent queue, repeat, shuffle and MediaSession integration
- Browse library for albums, artist, generes
- View, create, and edit playlists with drag and drop support
- Play random songs with the built-in smart playlist
- Favourites
- Internet radio
- Search

## Demo

https://airsonic.netlify.com

Server: `/api`  
Username: `guest2`, `guest3`, `guest4` etc.  
Password:`guest`

You can use the URL and credentials for your own server if you prefer. **Note**: if your server is using http only you must allow mixed content in your browser otherwise login will not work.


## Install

### Docker

```
$ docker run -d -p 8080:80 tamland/airsonic-frontend:latest
```

You can now access the application at http://localhost:8080/

Environment variables:
- `SERVER_URL` (Optional): The backend server URL. When set the server input on the login page will not be displayed.


### Pre-built bundle

Pre-built bundles can be found in the [Actions](https://github.com/tamland/airsonic-frontend/actions)
tab. Download/extract artifact and serve with any web server such as nginx or apache.

### Build from source

```
$ yarn install
$ yarn build
```

Bundle can be found in the `dist` folder.

Build docker image:

```
$ docker build -f docker/Dockerfile .
```

## Develop

```
$ yarn install
$ yarn serve
```


## License

Licensed under the [AGPLv3](LICENSE) license.
