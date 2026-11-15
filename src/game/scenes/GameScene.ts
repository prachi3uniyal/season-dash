import Phaser from "phaser";
import { SceneKey, TextureKey } from "../keys";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Game });
  }

  create(): void {
    const keys: TextureKey[] = [
      TextureKey.AliceIdle,
      TextureKey.AliceWalkA,
      TextureKey.AliceWalkB,
      TextureKey.AliceJump,
      TextureKey.Watch,
      TextureKey.Card,
      TextureKey.Door,
    ];

    keys.forEach((key, index) => {
      this.add.image(90 + index * 100, 225, key).setScale(1.6);
    });
  }
}