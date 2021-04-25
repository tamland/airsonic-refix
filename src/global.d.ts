declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'md5-es';
declare module 'vue-slider-component';

type MediaSessionPlaybackState = 'none' | 'paused' | 'playing';

type MediaSessionAction =
  'play' |
  'pause' |
  'seekbackward' |
  'seekforward' |
  'seekto' |
  'previoustrack' |
  'nexttrack' |
  'skipad' |
  'stop';

interface MediaSessionActionDetails {
  action: MediaSessionAction;
  fastSeek?: boolean;
  seekOffset?: number;
  seekTime?: number;
}

interface MediaImage {
  src: string;
  sizes?: string;
  type?: string;
}

interface MediaMetadataInit {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: MediaImage[];
}

declare class MediaMetadata {
  constructor(init?: MediaMetadataInit);
}

interface MediaPositionState {
  duration?: number;
  playbackRate?: number;
  position?: number;
}

interface MediaSession {
  playbackState: MediaSessionPlaybackState;
  metadata: MediaMetadata | null;
  setActionHandler(
    action: MediaSessionAction,
    listener: ((details: MediaSessionActionDetails) => void)): void;
  setPositionState?(arg: MediaPositionState): void;
}

interface Navigator {
  readonly mediaSession?: MediaSession;
}

interface Window {
  MediaSession?: MediaSession;
}
