import { GAME_HEIGHT, SEASON_WIDTH } from "./config";
import { Season } from "./keys";
import type { SeasonTheme } from "./types";

export const SEASON_ORDER: Season[] = [Season.Spring, Season.Summer, Season.Autumn, Season.Winter];

export const SEASON_THEMES: Record<Season, SeasonTheme> = {
  [Season.Spring]: {
    label: "Spring",
    sky: 0xbfe8ff,
    groundTint: 0x7cc576,
    hillsTint: 0xa5d6a7,
    particleTint: [0xffb7c5, 0xffd1dc, 0xffffff],
    speedX: { min: -25, max: 25 },
    speedY: { min: 35, max: 80 },
    spawnY: -10,
    lifespan: 9000,
    frequency: 140,
    chime: [523, 659, 784],
  },
  [Season.Summer]: {
    label: "Summer",
    sky: 0x6ec6ff,
    groundTint: 0x9ccc44,
    hillsTint: 0x66bb6a,
    particleTint: [0xfff176, 0xffffff],
    speedX: { min: -15, max: 15 },
    speedY: { min: -45, max: -15 },
    spawnY: GAME_HEIGHT + 10,
    lifespan: 9000,
    frequency: 180,
    chime: [587, 740, 880],
  },
  [Season.Autumn]: {
    label: "Autumn",
    sky: 0xffd9a8,
    groundTint: 0xc98a4b,
    hillsTint: 0xe08a3c,
    particleTint: [0xff7043, 0xffb300, 0xd84315],
    speedX: { min: -50, max: 10 },
    speedY: { min: 60, max: 130 },
    spawnY: -10,
    lifespan: 6000,
    frequency: 110,
    chime: [440, 523, 659],
  },
  [Season.Winter]: {
    label: "Winter",
    sky: 0xb7c9e2,
    groundTint: 0xf4f8fb,
    hillsTint: 0xdbe6f2,
    particleTint: [0xffffff],
    speedX: { min: -20, max: 20 },
    speedY: { min: 40, max: 95 },
    spawnY: -10,
    lifespan: 8000,
    frequency: 60,
    chime: [392, 494, 587],
  },
};

export function getSeasonAtX(x: number): Season {
  const index = Math.min(Math.max(Math.floor(x / SEASON_WIDTH), 0), SEASON_ORDER.length - 1);
  return SEASON_ORDER[index];
}