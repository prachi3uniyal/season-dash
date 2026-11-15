import Phaser from "phaser";
import { GAME_WIDTH, GROUND_HEIGHT, GROUND_TOP, PLATFORM_HEIGHT, RUN_SPEED, WORLD_WIDTH } from "../config";
import { SceneKey, TextureKey } from "../keys";
import { getCoinPositions, PLATFORMS } from "../levelData";

export class GameScene extends Phaser.Scene {
  private alice!: Phaser.GameObjects.Image;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: SceneKey.Game });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0xbfe8ff);

    this.add.tileSprite(0, 20, GAME_WIDTH, 100, TextureKey.Clouds).setOrigin(0, 0).setDepth(-20);
    this.add.tileSprite(0, GROUND_TOP, GAME_WIDTH, 180, TextureKey.Hills).setOrigin(0, 1).setTint(0xa5d6a7).setDepth(-10);

    this.add
      .image(WORLD_WIDTH / 2, GROUND_TOP + GROUND_HEIGHT / 2, TextureKey.Ground)
      .setDisplaySize(WORLD_WIDTH, GROUND_HEIGHT)
      .setTint(0x7cc576);

    PLATFORMS.forEach((data) => {
      this.add
        .image(data.x, data.top + PLATFORM_HEIGHT / 2, TextureKey.Ground)
        .setDisplaySize(data.width, PLATFORM_HEIGHT)
        .setTint(0x7cc576);
    });

    getCoinPositions().forEach((position) => {
      this.add.image(position.x, position.y, TextureKey.Watch);
    });

    this.add.image(WORLD_WIDTH - 90, GROUND_TOP - 38, TextureKey.Door);

    this.alice = this.add.image(80, GROUND_TOP - 24, TextureKey.AliceIdle).setDepth(5);
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update(_time: number, delta: number): void {
    const distance = RUN_SPEED * (delta / 1000);

    if (this.cursors.left.isDown) {
      this.alice.x -= distance;
      this.alice.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.alice.x += distance;
      this.alice.setFlipX(false);
    }
  }
}