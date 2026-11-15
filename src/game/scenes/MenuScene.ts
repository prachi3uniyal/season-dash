import Phaser from "phaser";
import { SceneKey, TextureKey } from "../keys";

export class MenuScene extends Phaser.Scene {
  private isStarting: boolean = false;

  constructor() {
    super({ key: SceneKey.Menu });
  }

  create(): void {
    this.isStarting = false;

    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(0xbfe8ff);
    this.cameras.main.fadeIn(400, 0, 0, 0);

    const title = this.add
      .text(width / 2, height * 0.3, "Season\nDash", {
        fontFamily: "Georgia, serif",
        fontSize: "56px",
        color: "#ffffff",
        stroke: "#3b5b8c",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setScale(0);

    this.tweens.add({
      targets: title,
      scale: 1,
      duration: 700,
      ease: "Back.easeOut",
      onComplete: () => {
        this.tweens.add({
          targets: title,
          y: title.y - 10,
          duration: 1300,
          ease: "Sine.easeInOut",
          yoyo: true,
          repeat: -1,
        });
      },
    });

    const alice = this.add.image(width / 2, height * 0.7, TextureKey.AliceIdle).setScale(3);
    this.tweens.add({
      targets: alice,
      angle: { from: -4, to: 4 },
      duration: 900,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    const prompt = this.add
      .text(width / 2, height * 0.9, "Click or press SPACE to play", {
        fontFamily: "Georgia, serif",
        fontSize: "22px",
        color: "#ffffff",
        stroke: "#3b5b8c",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.tweens.add({ targets: prompt, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });

    this.input.once("pointerdown", this.startGame, this);
    this.input.keyboard!.once("keydown-SPACE", this.startGame, this);
  }

  private startGame(): void {
    if (this.isStarting) return;
    this.isStarting = true;

    this.cameras.main.fadeOut(350, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.start(SceneKey.Game);
    });
  }
}