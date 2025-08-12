import IcecastMetadataStats from 'icecast-metadata-stats'

export enum ReplayGainMode {
  None,
  Track,
  Album,
  _Length
}

type ReplayGain = {
  trackGain: number // dB
  trackPeak: number // 0.0-1.0
  albumGain: number // dB
  albumPeak: number // 0.0-1.0
}

export class AudioController {
  private fadeDuration = 0.2

  private buffer = new Audio()
  private statsListener : any = null
  private replayGainMode = ReplayGainMode.None
  private replayGain: ReplayGain | null = null

  private context = new AudioContext()
  private pipeline = creatPipeline(this.context, {})

  ontimeupdate: (value: number) => void = () => { /* do nothing */ }
  ondurationchange: (value: number) => void = () => { /* do nothing */ }
  onpause: () => void = () => { /* do nothing */ }
  onstreamtitlechange: (value: string | null) => void = () => { /* do nothing */ }
  onended: () => void = () => { /* do nothing */ }
  onerror: (err: MediaError | null) => void = () => { /* do nothing */ }

  currentTime() {
    return this.pipeline.audio.currentTime
  }

  duration() {
    return this.pipeline.audio.duration
  }

  setBuffer(url: string) {
    this.buffer.src = url
  }

  setVolume(value: number) {
    this.pipeline.volumeNode.gain.value = value
  }

  setReplayGainMode(value: ReplayGainMode) {
    this.replayGainMode = value
    this.pipeline.replayGainNode.gain.value = this.replayGainFactor()
    console.log('Set replay gain: ' + this.replayGainFactor())
  }

  setPlaybackRate(value: number) {
    this.pipeline.audio.playbackRate = value
  }

  async pause() {
    await this.fadeOut()
    this.pipeline.audio.pause()
  }

  async resume() {
    await this.context.resume()
    await this.pipeline.audio.play()
    await this.fadeIn()
  }

  async seek(value: number) {
    if (!this.pipeline.audio.paused) {
      await this.fadeOut(this.fadeDuration / 2.0)
    }
    this.pipeline.audio.currentTime = value
    if (!this.pipeline.audio.paused) {
      await this.fadeIn(this.fadeDuration / 2.0)
    }
  }

  async changeTrack(options: { url?: string, paused?: boolean, replayGain?: ReplayGain, isStream?: boolean, playbackRate?: number }) {
    if (this.pipeline.audio) {
      endPlayback(this.context, this.pipeline, 1.0)
    }

    this.replayGain = options.replayGain || null

    this.pipeline = creatPipeline(this.context, {
      url: options.url,
      volume: this.pipeline.volumeNode.gain.value,
      replayGain: this.replayGainFactor(),
    })

    this.pipeline.audio.onerror = () => {
      this.onerror(this.pipeline.audio.error)
    }
    this.pipeline.audio.onended = () => {
      this.onended()
    }
    this.pipeline.audio.ontimeupdate = () => {
      this.ontimeupdate(this.pipeline.audio.currentTime)
    }
    this.pipeline.audio.ondurationchange = () => {
      this.ondurationchange(this.pipeline.audio.duration)
    }
    this.pipeline.audio.onpause = () => {
      this.onpause()
    }
    this.ondurationchange(this.pipeline.audio.duration)
    this.ontimeupdate(this.pipeline.audio.currentTime)
    this.onstreamtitlechange(null)
    this.pipeline.audio.playbackRate = options.playbackRate ?? 1.0

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

    if (options.isStream) {
      this.pipeline.audio.load()
    }

    if (options.paused !== true) {
      try {
        await this.context.resume()
        await this.pipeline.audio.play()
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn(error)
          return
        }
        throw error
      }
      await this.fadeIn()
    }
  }

  private async fadeIn(duration: number = this.fadeDuration) {
    const value = this.pipeline.fadeNode.gain.value
    this.pipeline.fadeNode.gain.cancelScheduledValues(0)
    this.pipeline.fadeNode.gain.setValueAtTime(value, this.context.currentTime)
    this.pipeline.fadeNode.gain.linearRampToValueAtTime(1, this.context.currentTime + duration)
    await sleep(duration * 1000)
  }

  private async fadeOut(duration: number = this.fadeDuration) {
    const value = this.pipeline.fadeNode.gain.value
    this.pipeline.fadeNode.gain.cancelScheduledValues(0)
    this.pipeline.fadeNode.gain.setValueAtTime(value, this.context.currentTime)
    this.pipeline.fadeNode.gain.linearRampToValueAtTime(0, this.context.currentTime + duration)
    await sleep(duration * 1000)
  }

  private replayGainFactor(): number {
    if (this.replayGainMode === ReplayGainMode.None || !this.replayGain) {
      return 1.0
    }
    const gain = this.replayGainMode === ReplayGainMode.Track
      ? this.replayGain.trackGain
      : this.replayGain.albumGain

    const peak = this.replayGainMode === ReplayGainMode.Track
      ? this.replayGain.trackPeak
      : this.replayGain.albumPeak

    if (!Number.isFinite(gain) || !Number.isFinite(peak) || peak <= 0) {
      console.warn('AudioController: invalid ReplayGain settings', this.replayGain)
      return 1.0
    }

    // Implementing min(10^((RG + Gpre-amp)/20), 1/peakamplitude)
    // https://wiki.hydrogenaud.io/index.php?title=ReplayGain_2.0_specification
    const preAmp = 0.0
    const gainFactor = Math.pow(10, (gain + preAmp) / 20)
    const peakFactor = 1 / peak
    const factor = Math.min(gainFactor, peakFactor)
    console.info('AudioController: calculated ReplayGain factor', factor)
    return factor
  }
}

function creatPipeline(context: AudioContext, options: { url?: string, volume?: number, replayGain?: number }) {
  const audio = new Audio(options.url)
  audio.crossOrigin = 'anonymous'
  const sourceNode = context.createMediaElementSource(audio)

  const volumeNode = context.createGain()
  volumeNode.gain.value = options.volume ?? 1

  const replayGainNode = context.createGain()
  replayGainNode.gain.value = options.replayGain ?? 1

  const fadeNode = context.createGain()
  fadeNode.gain.value = 0

  sourceNode
    .connect(volumeNode)
    .connect(replayGainNode)
    .connect(fadeNode)
    .connect(context.destination)

  function disconnect() {
    audio.pause()
    sourceNode.disconnect()
    volumeNode.disconnect()
    replayGainNode.disconnect()
    fadeNode.disconnect()
  }

  return { audio, volumeNode, replayGainNode, fadeNode, disconnect }
}

function endPlayback(context: AudioContext, pipeline: ReturnType<typeof creatPipeline>, duration: number) {
  console.info(`AudioController: ending payback for ${pipeline.audio}`)
  pipeline.audio.ontimeupdate = null
  pipeline.audio.ondurationchange = null
  pipeline.audio.onpause = null
  pipeline.audio.onerror = null
  pipeline.audio.onended = null
  pipeline.audio.onloadedmetadata = null

  pipeline.fadeNode.gain.cancelScheduledValues(0)
  pipeline.fadeNode.gain.linearRampToValueAtTime(0, context.currentTime + duration)

  const startTime = Date.now()
  setTimeout(() => {
    console.info(`AudioController: ending payback done. actual ${Date.now() - startTime}ms`)
    pipeline.disconnect()
  }, duration * 1000)
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
