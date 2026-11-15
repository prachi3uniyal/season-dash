import Phaser from "phaser";
import { SceneKey } from "../keys";
import { createAllTextures } from "../textures";
import { createAnimations } from "../animations";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Boot });
  }

  preload(): void {
    const { width, height } = this.scale;

    const barBackground = this.add.rectangle(width / 2, height / 2, 320, 20, 0x333333);
    const bar = this.add.rectangle(width / 2 - 160, height / 2, 0, 20, 0x4caf50).setOrigin(0, 0.5);

    this.load.on("progress", (value: number) => {
      bar.width = 320 * value;
    });

    this.load.once("complete", () => {
      barBackground.destroy();
      bar.destroy();
    });
  }

 create(): void {
  createAllTextures(this);
  createAnimations(this.anims);
  this.scene.start(SceneKey.Menu);
}
}