import IcecastMetadataStats from 'icecast-metadata-stats'

export class AudioController {
  private audio = new Audio()
  private handle = -1
  private volume = 1.0
  private fadeDuration = 200
  private buffer = new Audio()
  private statsListener : any = null

  ontimeupdate: (value: number) => void = () => { /* do nothing */ }
  ondurationchange: (value: number) => void = () => { /* do nothing */ }
  onpause: () => void = () => { /* do nothing */ }
  onstreamtitlechange: (value: string | null) => void = () => { /* do nothing */ }
  onended: () => void = () => { /* do nothing */ }
  onerror: (err: MediaError | null) => void = () => { /* do nothing */ }

  currentTime() {
    return this.audio.currentTime
  }

  duration() {
    return this.audio.duration
  }

  setBuffer(url: string) {
    this.buffer.src = url
  }

  setVolume(value: number) {
    this.cancelFade()
    this.volume = value
    this.audio.volume = value
  }

  setPlaybackRate(value: number) {
    this.audio.playbackRate = value
  }

  async pause() {
    await this.fadeOut()
    this.audio.pause()
  }

  async resume() {
    this.audio.volume = 0.0
    await this.audio.play()
    this.fadeIn()
  }

  async seek(value: number) {
    await this.fadeOut(this.fadeDuration / 2.0)
    this.audio.volume = 0.0
    this.audio.currentTime = value
    await this.fadeIn(this.fadeDuration / 2.0)
  }

  async changeTrack(options: { url: string, paused?: boolean, isStream?: boolean, playbackRate?: number }) {
    if (this.audio) {
      this.cancelFade()
      endPlayback(this.audio, this.fadeDuration)
    }
    this.audio = new Audio(options.url)
    this.audio.onerror = () => {
      this.onerror(this.audio.error)
    }
    this.audio.onended = () => {
      this.onended()
    }
    this.audio.ontimeupdate = () => {
      this.ontimeupdate(this.audio.currentTime)
    }
    this.audio.ondurationchange = () => {
      this.ondurationchange(this.audio.duration)
    }
    this.audio.onpause = () => {
      this.onpause()
    }
    this.ondurationchange(this.audio.duration)
    this.ontimeupdate(this.audio.currentTime)
    this.onstreamtitlechange(null)
    this.audio.volume = 0.0
    this.audio.playbackRate = options.playbackRate ?? 1.0

    this.statsListener?.stop()
    if (options.isStream) {
      console.info('Icecast: starting stats listener')
      this.statsListener = new IcecastMetadataStats(options.url, {
        sources: ['icy'],
        onStats: (stats: any) => {
          if (stats?.icy === undefined) {
            console.info('Icecast: no metadata found. Stopping')
            this.statsListener?.stop()
          } else if (stats?.icy?.StreamTitle) {
            this.onstreamtitlechange(stats?.icy?.StreamTitle)
          }
        }
      })
      this.statsListener?.start()
    }

    if (options.paused !== true) {
      try {
        await this.audio.play()
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn(error)
          return
        }
        throw error
      }
      this.fadeIn()
    }
  }

  private cancelFade() {
    clearTimeout(this.handle)
  }

  private fadeIn(duration: number = this.fadeDuration) {
    this.fadeFromTo(0.0, this.volume, duration).then()
  }

  private fadeOut(duration: number = this.fadeDuration) {
    return this.fadeFromTo(this.volume, 0.0, duration)
  }

  private fadeFromTo(from: number, to: number, duration: number) {
    console.info(`AudioController: start fade (${from}, ${to}, ${duration})`)
    const startTime = Date.now()
    const step = (to - from) / duration
    if (duration <= 0.0) {
      this.audio.volume = to
    }
    clearTimeout(this.handle)
    return new Promise<void>((resolve) => {
      const run = () => {
        if (this.audio.volume === to) {
          console.info(
            'AudioController: fade result. ' +
            `duration: ${duration}ms, actual: ${Date.now() - startTime}ms, ` +
            `volume: ${this.audio.volume}`)
          resolve()
          return
        }
        const elapsed = Date.now() - startTime
        this.audio.volume = clamp(0.0, this.volume, from + (elapsed * step))
        this.handle = setTimeout(run, 10)
      }
      run()
    })
  }
}

function endPlayback(audio: HTMLAudioElement, duration: number) {
  async function fade(audio: HTMLAudioElement, from: number, to: number, duration: number) {
    if (duration <= 0.0) {
      audio.volume = to
      return audio
    }
    const startTime = Date.now()
    const step = (to - from) / duration
    while (audio.volume !== to) {
      const elapsed = Date.now() - startTime
      audio.volume = clamp(0.0, 1.0, from + (elapsed * step))
      await sleep(10)
    }
    return audio
  }
  console.info(`AudioController: ending payback for ${audio}`)
  audio.ontimeupdate = null
  audio.ondurationchange = null
  audio.onpause = null
  audio.onerror = null
  audio.onended = null
  audio.onloadedmetadata = null
  const startTime = Date.now()
  fade(audio, audio.volume, 0.0, duration)
    .catch((err) => console.warn('Error during fade out: ' + err.stack))
    .finally(() => {
      audio.pause()
      console.info(`AudioController: ending payback done. actual ${Date.now() - startTime}ms`)
    })
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function clamp(min: number, max: number, value: number) {
  return Math.max(min, Math.min(value, max))
}
