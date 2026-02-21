
/**
 * Minimalist Audio Service using Web Audio API
 * Prevents reliance on external assets and ensures crisp, clean tones.
 */
import { TONE_COMPLETION, TONE_START } from '../constants';
import type { TonePreset } from '../constants';

class AudioService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(tone: TonePreset) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = tone.waveform;
    osc.frequency.setValueAtTime(tone.frequencyStart, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(tone.frequencyEnd, this.ctx.currentTime + tone.frequencyRampDuration);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(tone.gainPeak, this.ctx.currentTime + tone.gainAttack);
    gain.gain.exponentialRampToValueAtTime(tone.gainFloor, this.ctx.currentTime + tone.duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + tone.duration);
  }

  playCompletion() {
    this.playTone(TONE_COMPLETION);
  }

  playStart() {
    this.playTone(TONE_START);
  }
}

export const audioService = new AudioService();
