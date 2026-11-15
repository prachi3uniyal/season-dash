import Phaser from "phaser";
import { AnimKey, TextureKey } from "./keys";

export function createAnimations(anims: Phaser.Animations.AnimationManager): void {
  if (anims.exists(AnimKey.AliceWalk)) return;

  anims.create({
    key: AnimKey.AliceIdle,
    frames: [{ key: TextureKey.AliceIdle }],
    frameRate: 1,
    repeat: -1,
  });

  anims.create({
    key: AnimKey.AliceWalk,
    frames: [{ key: TextureKey.AliceWalkA }, { key: TextureKey.AliceIdle }, { key: TextureKey.AliceWalkB }, { key: TextureKey.AliceIdle }],
    frameRate: 9,
    repeat: -1,
  });

  anims.create({
    key: AnimKey.AliceJump,
    frames: [{ key: TextureKey.AliceJump }],
    frameRate: 1,
    repeat: -1,
  });
}