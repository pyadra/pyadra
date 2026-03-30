export class AudioEngine {
  ctx: AudioContext | null = null;
  droneOsc: OscillatorNode | null = null;
  droneGain: GainNode | null = null;
  humOsc: OscillatorNode | null = null;
  humGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.startAmbient();
  }

  // 1. Harmonious Ethereal Chords (432Hz Healing Frequency Base)
  startAmbient() {
    if (!this.ctx || this.droneOsc) return;
    
    // Base singing bowl (A4 = 432Hz)
    this.droneOsc = this.ctx.createOscillator();
    this.droneOsc.type = 'sine';
    this.droneOsc.frequency.value = 432; 
    
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.value = 0.03; // Very soft, harmonious

    this.droneOsc.connect(this.droneGain);
    this.droneGain.connect(this.ctx.destination);
    this.droneOsc.start();

    // 2. Secondary Harmonic (Ethereal overtone - Perfect Fifth)
    this.humOsc = this.ctx.createOscillator();
    this.humOsc.type = 'sine';
    this.humOsc.frequency.value = 648; // Perfect fifth above 432Hz
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    this.humGain = this.ctx.createGain();
    this.humGain.gain.value = 0; // Starts at 0 volume and swells on hover

    this.humOsc.connect(filter);
    filter.connect(this.humGain);
    this.humGain.connect(this.ctx.destination);
    this.humOsc.start();
  }

  setHumVolume(normalizedProximity: number) {
    if (this.humGain && this.ctx) {
      // Subtly increase the volume based on proximity
      this.humGain.gain.setTargetAtTime(normalizedProximity * 0.15, this.ctx.currentTime, 0.2);
    }
  }

  // 3. Crystalline Shimmer (Hover over text)
  playShimmer() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // High crystalline frequency
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // 4. Lithic Click (System Telemetry hover)
  playLithicClick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // 5. Deep Resonant Thud (Hover Enter Exhibit)
  playResonantThud() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }

  // 6. Vacuum Suction / Shatter (Click Enter)
  playShatter() {
    if (!this.ctx) return;
    // Create a white noise buffer to simulate disintegration
    const bufferSize = this.ctx.sampleRate * 1.5; // 1.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to sound like a suction (vacuum wind)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(100, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(5000, this.ctx.currentTime + 1.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 1.5); // Increase volume like suction
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5); // Then suddenly disappear

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }

  // 7. Amber Crystallization (Seal/Edit)
  playCrystallize() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency rises to simulate a locking/solidifying process
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 1.5);

    // Subtle vibrato/shimmer
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.value = 12;
    vibratoGain.gain.value = 10;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start();

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.5);
    vibrato.stop(this.ctx.currentTime + 1.5);
  }

}

// Singleton global
export const audioAPI = new AudioEngine();
