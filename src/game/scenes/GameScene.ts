import Phaser from "phaser";
import { COIN_POINTS, GAME_HEIGHT, GAME_WIDTH, GROUND_HEIGHT, GROUND_TOP, JUMP_SPEED, PLATFORM_HEIGHT, RUN_SPEED, WORLD_WIDTH } from "../config";
import { GameStatus, SceneKey, TextureKey } from "../keys";
import { getCoinPositions, PLATFORMS } from "../levelData";
import { getInitialHudState } from "../state";
import type { HudState } from "../types";

export class GameScene extends Phaser.Scene {
  private alice!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private coins!: Phaser.Physics.Arcade.Group;
  private door!: Phaser.Physics.Arcade.Image;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private hills!: Phaser.GameObjects.TileSprite;
  private clouds!: Phaser.GameObjects.TileSprite;
  private scoreText!: Phaser.GameObjects.Text;
  private hud: HudState = getInitialHudState();

  constructor() {
    super({ key: SceneKey.Game });
  }

  create(): void {
    this.physics.resume();
    this.hud = getInitialHudState();

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);
    this.cameras.main.setBackgroundColor(0xbfe8ff);
    this.cameras.main.fadeIn(400, 0, 0, 0);

    this.createBackground();
    this.createPlatforms();
    this.createCoins();
    this.createDoor();
    this.createAlice();
    this.createInput();
    this.createColliders();
    this.createScoreText();
  }

  update(): void {
    const camera = this.cameras.main;
    this.clouds.tilePositionX = camera.scrollX * 0.15;
    this.hills.tilePositionX = camera.scrollX * 0.35;

    if (this.hud.status !== GameStatus.Playing) return;

    this.handleMovement();
  }

  private createBackground(): void {
    this.clouds = this.add.tileSprite(0, 20, GAME_WIDTH, 100, TextureKey.Clouds).setOrigin(0, 0).setScrollFactor(0).setDepth(-20);
    this.hills = this.add
      .tileSprite(0, GROUND_TOP, GAME_WIDTH, 180, TextureKey.Hills)
      .setOrigin(0, 1)
      .setScrollFactor(0)
      .setTint(0xa5d6a7)
      .setDepth(-10);
  }

  private createPlatforms(): void {
    this.platforms = this.physics.add.staticGroup();

    const ground = this.platforms.create(WORLD_WIDTH / 2, GROUND_TOP + GROUND_HEIGHT / 2, TextureKey.Ground);
    ground.setDisplaySize(WORLD_WIDTH, GROUND_HEIGHT).refreshBody();
    ground.setTint(0x7cc576);

    PLATFORMS.forEach((data) => {
      const platform = this.platforms.create(data.x, data.top + PLATFORM_HEIGHT / 2, TextureKey.Ground);
      platform.setDisplaySize(data.width, PLATFORM_HEIGHT).refreshBody();
      platform.setTint(0x7cc576);
    });
  }

  private createCoins(): void {
    this.coins = this.physics.add.group({ allowGravity: false });

    getCoinPositions().forEach((position) => {
      const coin = this.coins.create(position.x, position.y, TextureKey.Watch) as Phaser.Physics.Arcade.Sprite;

      this.tweens.add({
        targets: coin,
        y: position.y - 8,
        duration: Phaser.Math.Between(650, 950),
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });
    });

    this.hud.totalCoins = this.coins.getLength();
  }

  private createDoor(): void {
    this.door = this.physics.add.staticImage(WORLD_WIDTH - 90, GROUND_TOP - 38, TextureKey.Door);

    this.tweens.add({
      targets: this.door,
      alpha: 0.6,
      duration: 700,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  private createAlice(): void {
    this.alice = this.physics.add.sprite(80, GROUND_TOP - 60, TextureKey.AliceIdle);
    this.alice.setCollideWorldBounds(true);
    this.alice.setDepth(5);
    (this.alice.body as Phaser.Physics.Arcade.Body).setSize(20, 44).setOffset(6, 4);

    this.cameras.main.startFollow(this.alice, true, 0.1, 0.1);
  }

  private createInput(): void {
    const keyboard = this.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.jumpKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  private createColliders(): void {
    this.physics.add.collider(this.alice, this.platforms);
    this.physics.add.overlap(this.alice, this.coins, this.onCollectCoin, undefined, this);
    this.physics.add.overlap(this.alice, this.door, this.onReachDoor, undefined, this);
  }

  private createScoreText(): void {
    this.scoreText = this.add
      .text(16, 12, "", { fontFamily: "Georgia, serif", fontSize: "22px", color: "#26364f" })
      .setScrollFactor(0)
      .setDepth(30);

    this.refreshScoreText();
  }

  private handleMovement(): void {
    const body = this.alice.body as Phaser.Physics.Arcade.Body;

    if (this.cursors.left.isDown) {
      this.alice.setVelocityX(-RUN_SPEED);
      this.alice.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.alice.setVelocityX(RUN_SPEED);
      this.alice.setFlipX(false);
    } else {
      this.alice.setVelocityX(0);
    }

    const wantsJump = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.jumpKey);

    if (wantsJump && body.blocked.down) {
      this.alice.setVelocityY(-JUMP_SPEED);
    }
  }

  private onCollectCoin: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_aliceObject, coinObject) => {
    const coin = coinObject as Phaser.Physics.Arcade.Sprite;

    this.tweens.killTweensOf(coin);
    coin.disableBody(true, true);

    this.hud.coins += 1;
    this.hud.score += COIN_POINTS;
    this.refreshScoreText();
  };

  private onReachDoor: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = () => {
    if (this.hud.status !== GameStatus.Playing) return;

    this.hud.status = GameStatus.Won;
    this.physics.pause();

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "You reached the door!", {
        fontFamily: "Georgia, serif",
        fontSize: "40px",
        color: "#ffffff",
        stroke: "#3b5b8c",
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(30);
  };

  private refreshScoreText(): void {
    this.scoreText.setText(`Score: ${this.hud.score}   Watches: ${this.hud.coins}/${this.hud.totalCoins}`);
  }
}