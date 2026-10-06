/**
 * Voice Coach (Text-to-Speech) for Gym Tracker AI Vision Coach
 * Uses Web Speech API (speechSynthesis) with intelligent rate-limiting and queuing.
 */

class VoiceCoach {
  private isEnabled: boolean = true;
  private lastSpokenText: string = '';
  private lastSpokenTime: number = 0;
  private minIntervalMs: number = 2500; // Minimum interval between any speech cues
  private repeatSameIntervalMs: number = 5000; // Minimum interval before repeating the exact same cue
  private synth: SpeechSynthesis | null = null;
  private vietnameseVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prefer Vietnamese voices
    const viVoice = voices.find(
      (v) => v.lang.includes('vi') || v.lang.toLowerCase().includes('vietnam')
    );
    this.vietnameseVoice = viVoice || null;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled && this.synth) {
      this.synth.cancel();
    }
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public speak(text: string, force: boolean = false) {
    if (!this.isEnabled || !this.synth) return;

    const now = Date.now();

    // Check throttle
    if (!force) {
      if (now - this.lastSpokenTime < this.minIntervalMs) {
        return;
      }
      if (text === this.lastSpokenText && now - this.lastSpokenTime < this.repeatSameIntervalMs) {
        return;
      }
    }

    try {
      // Cancel previous speech if forced or if still speaking
      if (this.synth.speaking) {
        this.synth.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05; // Slightly faster for workout cues
      utterance.pitch = 1.0;
      utterance.volume = 0.95;

      if (this.vietnameseVoice) {
        utterance.voice = this.vietnameseVoice;
        utterance.lang = this.vietnameseVoice.lang;
      } else {
        utterance.lang = 'vi-VN';
      }

      this.lastSpokenText = text;
      this.lastSpokenTime = now;

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Voice coach error:', err);
    }
  }

  public speakRepMilestone(count: number) {
    if (count <= 0) return;
    if (count % 5 === 0) {
      this.speak(`Đã xong ${count} reps! Cố lên!`, true);
    } else {
      this.speak(`${count}`);
    }
  }

  public speakFormCorrection(tip: string) {
    if (!tip) return;
    // Strip emojis or extra punctuation for cleaner speech
    const cleanTip = tip.replace(/[⚠️📏🔙💪🚀⚡🔥👍]/g, '').trim();
    if (cleanTip) {
      this.speak(cleanTip);
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

// Singleton instance
export const voiceCoach = typeof window !== 'undefined' ? new VoiceCoach() : (null as any);
