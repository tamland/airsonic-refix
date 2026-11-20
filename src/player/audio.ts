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

type Pipeline = {
  audio: HTMLAudioElement
  volumeNode: GainNode
  replayGainNode: GainNode
  fadeNode: GainNode
  disconnect: () => void
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
  onplaying: () => void = () => { /* do nothing */ }
  onstreamtitlechange: (value: string | null) => void = () => { /* do nothing */ }
  onended: () => void = () => { /* do nothing */ }
  onerror: (err: MediaError | null) => void = () => { /* do nothing */ }

  // All playback operations are serialized through this queue so that
  // pause/resume/seek/changeTrack cannot interleave: an operation always
  // re-reads this.pipeline only while no other operation can swap it.
  // Fixes https://github.com/tamland/airsonic-refix/issues/72
  private ops: Promise<unknown> = Promise.resolve()

  private serialize<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.ops.then(operation, operation)
    this.ops = result.then(() => undefined, () => undefined)
    return result
  }

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
    return this.serialize(() => this.doPause())
  }

  async resume() {
    return this.serialize(() => this.doResume())
  }

  async seek(value: number) {
    return this.serialize(() => this.doSeek(value))
  }

  async changeTrack(options: { url?: string, paused?: boolean, replayGain?: ReplayGain, isStream?: boolean, playbackRate?: number }) {
    return this.serialize(() => this.doChangeTrack(options))
  }

  private async doPause() {
    const pipeline = this.pipeline
    await this.fadeOut(pipeline, this.fadeDuration)
    pipeline.audio.pause()
  }

  private async doResume() {
    const pipeline = this.pipeline
    await this.context.resume()
    await pipeline.audio.play()
    await this.fadeIn(pipeline, this.fadeDuration)
  }

  private async doSeek(value: number) {
    const pipeline = this.pipeline
    if (!pipeline.audio.paused) {
      await this.fadeOut(pipeline, this.fadeDuration / 2.0)
    }
    pipeline.audio.currentTime = value
    if (!pipeline.audio.paused) {
      await this.fadeIn(pipeline, this.fadeDuration / 2.0)
    }
  }

  private async doChangeTrack(options: { url?: string, paused?: boolean, replayGain?: ReplayGain, isStream?: boolean, playbackRate?: number }) {
    const prev = this.pipeline
    endPlayback(this.context, prev, 1.0)

    this.replayGain = options.replayGain || null

    const pipeline = creatPipeline(this.context, {
      url: options.url,
      volume: prev.volumeNode.gain.value,
      replayGain: this.replayGainFactor(),
    })
    this.pipeline = pipeline

    pipeline.audio.onerror = () => {
      this.onerror(pipeline.audio.error)
    }
    pipeline.audio.onended = () => {
      this.onended()
    }
    pipeline.audio.ontimeupdate = () => {
      this.ontimeupdate(pipeline.audio.currentTime)
    }
    pipeline.audio.ondurationchange = () => {
      this.ondurationchange(pipeline.audio.duration)
    }
    pipeline.audio.onpause = () => {
      this.onpause()
    }
    pipeline.audio.onplaying = () => {
      this.onplaying()
    }
    this.ondurationchange(pipeline.audio.duration)
    this.ontimeupdate(pipeline.audio.currentTime)
    this.onstreamtitlechange(null)
    pipeline.audio.playbackRate = options.playbackRate ?? 1.0

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
      pipeline.audio.load()
    }

    if (options.paused !== true) {
      try {
        await this.context.resume()
        await pipeline.audio.play()
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // The play() request was interrupted (e.g. by the browser or an
          // extension pausing the element). If the element did end up
          // playing, the gain must still be faded in, otherwise playback
          // continues silently with fadeGain stuck at 0.
          console.warn(error)
          if (!pipeline.audio.paused) {
            await this.fadeIn(pipeline, this.fadeDuration)
          }
          return
        }
        throw error
      }
      await this.fadeIn(pipeline, this.fadeDuration)
    }
  }

  private async fadeIn(pipeline: Pipeline, duration: number) {
    const value = pipeline.fadeNode.gain.value
    pipeline.fadeNode.gain.cancelScheduledValues(0)
    pipeline.fadeNode.gain.setValueAtTime(value, this.context.currentTime)
    pipeline.fadeNode.gain.linearRampToValueAtTime(1, this.context.currentTime + duration)
    await sleep(duration * 1000)
  }

  private async fadeOut(pipeline: Pipeline, duration: number) {
    const value = pipeline.fadeNode.gain.value
    pipeline.fadeNode.gain.cancelScheduledValues(0)
    pipeline.fadeNode.gain.setValueAtTime(value, this.context.currentTime)
    pipeline.fadeNode.gain.linearRampToValueAtTime(0, this.context.currentTime + duration)
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

function creatPipeline(context: AudioContext, options: { url?: string, volume?: number, replayGain?: number }): Pipeline {
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

function endPlayback(context: AudioContext, pipeline: Pipeline, duration: number) {
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
