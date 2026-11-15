import Phaser from "phaser";

export function playTone(sound: Phaser.Sound.BaseSoundManager, frequency: number, duration: number, volume: number = 0.12): void {
  if (!(sound instanceof Phaser.Sound.WebAudioSoundManager)) return;

  const context = sound.context;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(sound.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

export function playChime(sound: Phaser.Sound.BaseSoundManager, notes: number[]): void {
  notes.forEach((note, index) => {
    window.setTimeout(() => playTone(sound, note, 0.25), index * 110);
  });
}