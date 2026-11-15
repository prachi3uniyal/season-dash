import Phaser from "phaser";
import { SceneKey } from "../keys";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Game });
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, "Hello Phaser inside React!", {
        fontFamily: "Georgia, serif",
        fontSize: "36px",
        color: "#3b5b8c",
      })
      .setOrigin(0.5);
  }
}