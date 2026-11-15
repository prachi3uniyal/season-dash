import { GROUND_TOP, WORLD_WIDTH } from "./config";
import type { PlatformData, Position } from "./types";

export const PLATFORMS: PlatformData[] = [
  { x: 350, top: 330, width: 140 },
  { x: 580, top: 250, width: 140 },
  { x: 1000, top: 330, width: 160 },
  { x: 1250, top: 260, width: 140 },
  { x: 1480, top: 330, width: 120 },
  { x: 1800, top: 320, width: 140 },
  { x: 2050, top: 240, width: 140 },
  { x: 2320, top: 320, width: 160 },
  { x: 2600, top: 330, width: 140 },
  { x: 2820, top: 250, width: 140 },
  { x: 3020, top: 330, width: 120 },
];

export function getCoinPositions(): Position[] {
  const positions: Position[] = [];

  for (let x = 260; x < WORLD_WIDTH - 200; x += 230) {
    positions.push({ x, y: GROUND_TOP - 26 });
  }

  PLATFORMS.forEach((platform) => {
    positions.push({ x: platform.x, y: platform.top - 26 });
  });

  return positions;
}