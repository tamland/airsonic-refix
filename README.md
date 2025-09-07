# Airsonic (refix) UI

[![Build](https://img.shields.io/github/actions/workflow/status/tamland/airsonic-refix/ci.yml?style=flat-square)](https://github.com/tamland/airsonic-refix/actions)
[![Docker Pulls](https://img.shields.io/docker/pulls/tamland/airsonic-refix?branch=master&style=flat-square)](https://hub.docker.com/r/tamland/airsonic-refix)

Modern responsive web frontend for [airsonic-advanced](https://github.com/airsonic-advanced/airsonic-advanced), [navidrome](https://github.com/navidrome/navidrome),
[gonic](https://github.com/sentriz/gonic) and other [subsonic](https://github.com/topics/subsonic) compatible music servers.

## Features

- Responsive UI for desktop and mobile
- Browse library for albums, artist, genres
- Playback with persistent queue, repeat & shuffle
- MediaSession integration
- View, create, and edit playlists with drag and drop
- Built-in 'random' playlist
- Search
- Favourites
- Internet radio
- Podcasts

## [Live demo](https://airsonic-refix.netlify.app)

Enter the URL and credentials for your subsonic compatible server, or use one of the following public demo servers:

**Subsonic**
Server: `https://airsonic-refix.netlify.app/api`
Username: `guest4`, `guest5`, `guest6` etc.
Password:`guest`

**Navidrome**
Server: `https://demo.navidrome.org`
Username: `demo`
Password:`demo`

**Note**: if the server is using http only you must allow mixed content in your browser otherwise login will not work.

## Screenshots

![Screenshot](screenshots/album.png)

![Screenshot](screenshots/album-list.png)

![Screenshot](screenshots/artist.png)

![Screenshot](screenshots/artist-list.png)

## Install

### Docker

```shell
docker run --detach --publish 8080:8080 tamland/airsonic-refix:latest
```

You can now access the application at http://localhost:8080/

Environment variables:

- `SERVER_URL` (Optional): The backend server URL. When set the server input on the login page will not be displayed.

#### Rootless Docker

The container image also supports running with additional security measures, such as read-only rootfs:

```shell
docker run --read-only --cap-drop ALL \
  --tmpfs /tmp:noexec,nosuid,size=100m \
  --detach --publish 8080:8080 \
  --volume app:/app tamland/airsonic-refix:latest
```

### Pre-built bundle

Pre-built bundles can be found in the [Actions](https://github.com/tamland/airsonic-refix/actions)
tab. Download/extract artifact and serve with any web server such as nginx or apache.

### Build from source

```shell
yarn install
yarn build
```

Bundle can be found in the `dist` folder.

Build docker image:

```shell
docker build -f docker/Dockerfile .
```

## Develop

```shel
yarn install
yarn dev
```

## OpenSubsonic support

- HTTP form POST extension
- Multiple artists/genres

## License

Licensed under the [AGPLv3](LICENSE) license.
