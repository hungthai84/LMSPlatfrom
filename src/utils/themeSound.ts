import { SystemThemeId } from "../types/lms";

export type ThemeSoundEvent = "click" | "nav" | "switch" | "success";

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!sharedAudioCtx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx) {
        sharedAudioCtx = new Ctx();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

interface ToneStep {
  freq: number;
  endFreq?: number;
  delay: number;
  duration: number;
  type: OscillatorType;
  gain: number;
}

const THEME_PROFILES: Record<SystemThemeId, Record<ThemeSoundEvent, ToneStep[]>> = {
  "glass-liquid": {
    click: [{ freq: 720, endFreq: 960, delay: 0, duration: 0.08, type: "sine", gain: 0.055 }],
    nav: [
      { freq: 660, delay: 0, duration: 0.07, type: "sine", gain: 0.05 },
      { freq: 990, delay: 0.045, duration: 0.11, type: "triangle", gain: 0.04 },
    ],
    switch: [
      { freq: 523.25, delay: 0, duration: 0.09, type: "sine", gain: 0.06 },
      { freq: 659.25, delay: 0.05, duration: 0.1, type: "sine", gain: 0.055 },
      { freq: 1046.5, delay: 0.1, duration: 0.16, type: "triangle", gain: 0.045 },
    ],
    success: [
      { freq: 587.33, delay: 0, duration: 0.09, type: "sine", gain: 0.06 },
      { freq: 880, delay: 0.07, duration: 0.16, type: "sine", gain: 0.055 },
    ],
  },
  "glass-light": {
    click: [{ freq: 1046, delay: 0, duration: 0.055, type: "sine", gain: 0.045 }],
    nav: [{ freq: 987.77, endFreq: 1174.66, delay: 0, duration: 0.08, type: "sine", gain: 0.045 }],
    switch: [
      { freq: 880, delay: 0, duration: 0.08, type: "sine", gain: 0.05 },
      { freq: 1318.5, delay: 0.055, duration: 0.15, type: "sine", gain: 0.045 },
    ],
    success: [
      { freq: 1046.5, delay: 0, duration: 0.08, type: "sine", gain: 0.05 },
      { freq: 1567.98, delay: 0.07, duration: 0.16, type: "sine", gain: 0.045 },
    ],
  },
  "ocean-navy-light": {
    click: [{ freq: 440, endFreq: 620, delay: 0, duration: 0.08, type: "sine", gain: 0.055 }],
    nav: [
      { freq: 392, endFreq: 523.25, delay: 0, duration: 0.1, type: "sine", gain: 0.055 },
    ],
    switch: [
      { freq: 392, delay: 0, duration: 0.09, type: "sine", gain: 0.06 },
      { freq: 493.88, delay: 0.06, duration: 0.1, type: "sine", gain: 0.055 },
      { freq: 659.25, delay: 0.12, duration: 0.18, type: "sine", gain: 0.05 },
    ],
    success: [
      { freq: 440, delay: 0, duration: 0.09, type: "sine", gain: 0.06 },
      { freq: 659.25, delay: 0.07, duration: 0.16, type: "sine", gain: 0.055 },
    ],
  },
  "ocean-navy-dark": {
    click: [{ freq: 240, endFreq: 196, delay: 0, duration: 0.1, type: "sine", gain: 0.065 }],
    nav: [{ freq: 220, endFreq: 293.66, delay: 0, duration: 0.13, type: "sine", gain: 0.06 }],
    switch: [
      { freq: 196, delay: 0, duration: 0.14, type: "sine", gain: 0.065 },
      { freq: 293.66, delay: 0.08, duration: 0.22, type: "triangle", gain: 0.05 },
    ],
    success: [
      { freq: 246.94, delay: 0, duration: 0.11, type: "sine", gain: 0.06 },
      { freq: 369.99, delay: 0.08, duration: 0.2, type: "sine", gain: 0.055 },
    ],
  },
  "dark-neon": {
    click: [{ freq: 520, endFreq: 1040, delay: 0, duration: 0.065, type: "triangle", gain: 0.055 }],
    nav: [
      { freq: 480, endFreq: 760, delay: 0, duration: 0.075, type: "sawtooth", gain: 0.032 },
    ],
    switch: [
      { freq: 330, endFreq: 660, delay: 0, duration: 0.08, type: "triangle", gain: 0.055 },
      { freq: 660, endFreq: 990, delay: 0.06, duration: 0.14, type: "sawtooth", gain: 0.035 },
    ],
    success: [
      { freq: 587.33, delay: 0, duration: 0.08, type: "triangle", gain: 0.055 },
      { freq: 880, delay: 0.06, duration: 0.14, type: "triangle", gain: 0.05 },
    ],
  },
  "flat-light": {
    click: [{ freq: 320, endFreq: 180, delay: 0, duration: 0.04, type: "triangle", gain: 0.05 }],
    nav: [{ freq: 420, endFreq: 310, delay: 0, duration: 0.045, type: "triangle", gain: 0.05 }],
    switch: [
      { freq: 440, delay: 0, duration: 0.05, type: "triangle", gain: 0.05 },
      { freq: 587.33, delay: 0.045, duration: 0.08, type: "triangle", gain: 0.05 },
    ],
    success: [
      { freq: 523.25, delay: 0, duration: 0.06, type: "triangle", gain: 0.05 },
      { freq: 659.25, delay: 0.05, duration: 0.1, type: "triangle", gain: 0.05 },
    ],
  },
  "origin-os": {
    click: [{ freq: 420, endFreq: 540, delay: 0, duration: 0.07, type: "sine", gain: 0.06 }],
    nav: [{ freq: 392, endFreq: 523.25, delay: 0, duration: 0.085, type: "sine", gain: 0.06 }],
    switch: [
      { freq: 392, delay: 0, duration: 0.08, type: "sine", gain: 0.065 },
      { freq: 493.88, delay: 0.055, duration: 0.09, type: "sine", gain: 0.06 },
      { freq: 587.33, delay: 0.11, duration: 0.14, type: "sine", gain: 0.055 },
    ],
    success: [
      { freq: 440, delay: 0, duration: 0.08, type: "sine", gain: 0.06 },
      { freq: 587.33, delay: 0.06, duration: 0.14, type: "sine", gain: 0.055 },
    ],
  },
};

export function playThemeSound(themeId: SystemThemeId, event: ThemeSoundEvent = "click"): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const profile = THEME_PROFILES[themeId] || THEME_PROFILES["glass-liquid"];
  const steps = profile[event] || profile.click;
  const now = ctx.currentTime;

  for (const step of steps) {
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = step.type;

      const start = now + step.delay;
      osc.frequency.setValueAtTime(step.freq, start);
      if (step.endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(step.endFreq, 20), start + step.duration);
      }

      gainNode.gain.setValueAtTime(0.0001, start);
      gainNode.gain.exponentialRampToValueAtTime(step.gain, start + 0.012);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, start + step.duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + step.duration + 0.02);
    } catch {
      // Ignore Web Audio edge errors silently
    }
  }
}
