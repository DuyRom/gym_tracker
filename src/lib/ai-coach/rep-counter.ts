export type RepPhase = 'READY' | 'DOWN' | 'UP';

export interface RepCounterConfig {
  upThreshold: number;      // Extended / starting position angle
  downThreshold: number;    // Contracted / inflection position angle
  hysteresis: number;       // Safety noise threshold (in degrees)
  minRepDurationMs?: number; // Minimum time for 1 rep to avoid false positives (e.g. 1000ms)
}

export interface RepResult {
  count: number;
  phase: RepPhase;
  progressPercent: number;  // 0 - 100% of current rep completion
  repCompleted: boolean;
  minAngleInRep: number;
  maxAngleInRep: number;
  lastRepDurationSec: number;
}

export class RepCounter {
  private phase: RepPhase = 'READY';
  private count = 0;
  private angleHistory: number[] = [];
  private readonly SMOOTHING_WINDOW = 5;

  private repStartTime: number = 0;
  private minAngleReached: number = 180;
  private maxAngleReached: number = 0;
  private lastRepDuration: number = 0;

  constructor(private config: RepCounterConfig) {}

  public update(rawAngle: number): RepResult {
    // 1. Moving Average Smoothing
    this.angleHistory.push(rawAngle);
    if (this.angleHistory.length > this.SMOOTHING_WINDOW) {
      this.angleHistory.shift();
    }
    const smoothedAngle =
      this.angleHistory.reduce((acc, curr) => acc + curr, 0) /
      this.angleHistory.length;

    // Track extremes in current rep cycle
    if (smoothedAngle < this.minAngleReached) this.minAngleReached = smoothedAngle;
    if (smoothedAngle > this.maxAngleReached) this.maxAngleReached = smoothedAngle;

    const { upThreshold, downThreshold, hysteresis, minRepDurationMs = 900 } =
      this.config;

    let repCompleted = false;
    const now = Date.now();

    // Calculate progression percentage (0 - 100%)
    const range = Math.max(1, Math.abs(upThreshold - downThreshold));
    const currentDiff = Math.abs(smoothedAngle - upThreshold);
    const progressPercent = Math.min(100, Math.max(0, Math.round((currentDiff / range) * 100)));

    // State machine transitions
    switch (this.phase) {
      case 'READY':
        if (smoothedAngle >= upThreshold - hysteresis) {
          this.phase = 'UP';
          this.repStartTime = now;
          this.minAngleReached = smoothedAngle;
          this.maxAngleReached = smoothedAngle;
        }
        break;

      case 'UP':
        // Moving downward/contracting into the bottom position
        if (smoothedAngle <= downThreshold + hysteresis) {
          this.phase = 'DOWN';
        }
        break;

      case 'DOWN':
        // Returning back up to starting lockout position
        if (smoothedAngle >= upThreshold - hysteresis) {
          const duration = now - this.repStartTime;
          if (duration >= minRepDurationMs) {
            this.count += 1;
            repCompleted = true;
            this.lastRepDuration = Math.round((duration / 1000) * 10) / 10;
          }
          // Reset for next rep
          this.phase = 'UP';
          this.repStartTime = now;
          this.minAngleReached = smoothedAngle;
          this.maxAngleReached = smoothedAngle;
        }
        break;
    }

    return {
      count: this.count,
      phase: this.phase,
      progressPercent,
      repCompleted,
      minAngleInRep: this.minAngleReached,
      maxAngleInRep: this.maxAngleReached,
      lastRepDurationSec: this.lastRepDuration,
    };
  }

  public reset() {
    this.count = 0;
    this.phase = 'READY';
    this.angleHistory = [];
    this.minAngleReached = 180;
    this.maxAngleReached = 0;
    this.lastRepDuration = 0;
    this.repStartTime = 0;
  }

  public getCount(): number {
    return this.count;
  }
}

export const EXERCISE_CONFIGS: Record<string, RepCounterConfig> = {
  squat: {
    upThreshold: 165,
    downThreshold: 95,
    hysteresis: 8,
    minRepDurationMs: 1200,
  },
  bicep_curl: {
    upThreshold: 155,
    downThreshold: 55,
    hysteresis: 8,
    minRepDurationMs: 1000,
  },
  shoulder_press: {
    upThreshold: 160,
    downThreshold: 85,
    hysteresis: 8,
    minRepDurationMs: 1100,
  },
  pushup: {
    upThreshold: 155,
    downThreshold: 85,
    hysteresis: 8,
    minRepDurationMs: 1000,
  },
};
