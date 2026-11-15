import type { GameStatus, Season } from "./keys";

export interface HudState {
  score: number;
  highScore: number;
  lives: number;
  coins: number;
  totalCoins: number;
  season: Season;
  status: GameStatus;
  muted: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface PlatformData {
  x: number;
  top: number;
  width: number;
}

export interface Range {
  min: number;
  max: number;
}

export interface SeasonTheme {
  label: string;
  sky: number;
  groundTint: number;
  hillsTint: number;
  particleTint: number[];
  speedX: Range;
  speedY: Range;
  spawnY: number;
  lifespan: number;
  frequency: number;
  chime: number[];
}