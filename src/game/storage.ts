import { HIGH_SCORE_STORAGE_KEY } from "./config";

export function loadHighScore(): number {
  try {
    const raw = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
    const parsed = raw === null ? 0 : Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(score: number): void {
  try {
    localStorage.setItem(HIGH_SCORE_STORAGE_KEY, String(score));
  } catch {
    return;
  }
}