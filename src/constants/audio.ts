export interface TonePreset {
  waveform: OscillatorType;
  frequencyStart: number;
  frequencyEnd: number;
  frequencyRampDuration: number;
  gainPeak: number;
  gainAttack: number;
  gainFloor: number;
  duration: number;
}

export const TONE_COMPLETION: TonePreset = {
  waveform: 'sine',
  frequencyStart: 440,
  frequencyEnd: 880,
  frequencyRampDuration: 0.1,
  gainPeak: 0.1,
  gainAttack: 0.05,
  gainFloor: 0.0001,
  duration: 0.5,
};

export const TONE_START: TonePreset = {
  waveform: 'sine',
  frequencyStart: 220,
  frequencyEnd: 330,
  frequencyRampDuration: 0.1,
  gainPeak: 0.05,
  gainAttack: 0.05,
  gainFloor: 0.0001,
  duration: 0.3,
};
