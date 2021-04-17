export class AudioController {
  private audio = new Audio()
  private handle = -1
  private volume = 1.0
  private fadeDuration = 200
  private eventHandlers = null as any
  private buffer = new Audio()

  currentTime() {
    return this.audio.currentTime
  }

  duration() {
    return this.audio.duration
  }

  setEventHandlers(handlers: any) {
    this.eventHandlers = handlers
  }

  setBuffer(url: string) {
    this.buffer.src = url
  }

  setVolume(value: number) {
    this.cancelFade()
    this.volume = value
    this.audio.volume = value
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

  async changeTrack(url: string, options: { paused?: boolean } = {}) {
    if (this.audio) {
      this.cancelFade()
      endPlayback(this.audio, this.fadeDuration)
    }
    this.audio = new Audio(url)
    this.audio.ondurationchange = () => {
      this.eventHandlers?.onDurationChange(this.audio.duration)
    }
    this.audio.onerror = () => {
      this.eventHandlers?.onError(this.audio.error)
    }
    this.audio.onended = () => {
      this.eventHandlers?.onEnded()
    }
    this.audio.ontimeupdate = () => {
      this.eventHandlers?.onTimeUpdate(this.audio.currentTime)
    }
    this.eventHandlers?.onDurationChange(this.audio.duration)
    this.eventHandlers?.onTimeUpdate(this.audio.currentTime)
    this.audio.volume = 0.0

    if (options.paused !== true) {
      await this.audio.play()
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
  audio.onerror = null
  audio.onended = null
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
