import { STARTING_LIVES } from "./config";
import { GameStatus, Season } from "./keys";
import type { HudState } from "./types";

export function getInitialHudState(): HudState {
  return {
    score: 0,
    highScore: 0,
    lives: STARTING_LIVES,
    coins: 0,
    totalCoins: 0,
    season: Season.Spring,
    status: GameStatus.Playing,
    muted: false,
  };
}