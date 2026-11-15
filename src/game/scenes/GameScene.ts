import Phaser from "phaser";
import { playChime, playTone } from "../audio";
import { COIN_POINTS, GAME_HEIGHT, GAME_WIDTH, GROUND_HEIGHT, GROUND_TOP, HAZARD_SPAWN_DELAY, JUMP_SPEED, PLATFORM_HEIGHT, RUN_SPEED, WORLD_WIDTH } from "../config";
import { AnimKey, GameStatus, SceneKey, Season, TextureKey } from "../keys";
import { getCoinPositions, PLATFORMS } from "../levelData";
import { getSeasonAtX, SEASON_THEMES } from "../seasons";
import { getInitialHudState } from "../state";
import type { HudState, SeasonTheme } from "../types";

export class GameScene extends Phaser.Scene {
  private alice!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private coins!: Phaser.Physics.Arcade.Group;
  private hazards!: Phaser.Physics.Arcade.Group;
  private door!: Phaser.Physics.Arcade.Image;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private hills!: Phaser.GameObjects.TileSprite;
  private clouds!: Phaser.GameObjects.TileSprite;
  private scoreText!: Phaser.GameObjects.Text;
  private sparkles!: Phaser.GameObjects.Particles.ParticleEmitter;
  private weather: Phaser.GameObjects.Particles.ParticleEmitter | undefined;
  private skyTween: Phaser.Tweens.Tween | undefined;
  private currentSky: number = SEASON_THEMES[Season.Spring].sky;
  private hud: HudState = getInitialHudState();
  private isInvulnerable: boolean = false;

  constructor() {
    super({ key: SceneKey.Game });
  }

  create(): void {
    this.physics.resume();
    this.hud = getInitialHudState();
    this.isInvulnerable = false;

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, GAME_HEIGHT);
    this.currentSky = SEASON_THEMES[Season.Spring].sky;
    this.cameras.main.setBackgroundColor(this.currentSky);
    this.cameras.main.fadeIn(400, 0, 0, 0);

    this.createBackground();
    this.createPlatforms();
    this.createCoins();
    this.createDoor();
    this.createAlice();
    this.createHazards();
    this.createEffects();
    this.createInput();
    this.createColliders();
    this.createScoreText();
    this.applySeason(Season.Spring, false);
  }

  update(): void {
    const camera = this.cameras.main;
    this.clouds.tilePositionX = camera.scrollX * 0.15;
    this.hills.tilePositionX = camera.scrollX * 0.35;

    if (this.hud.status !== GameStatus.Playing) return;

    this.handleMovement();
    this.handleSeasonZones();
  }

  private createBackground(): void {
    this.clouds = this.add.tileSprite(0, 20, GAME_WIDTH, 100, TextureKey.Clouds).setOrigin(0, 0).setScrollFactor(0).setDepth(-20);
    this.hills = this.add
      .tileSprite(0, GROUND_TOP, GAME_WIDTH, 180, TextureKey.Hills)
      .setOrigin(0, 1)
      .setScrollFactor(0)
      .setDepth(-10);
  }

  private createPlatforms(): void {
    this.platforms = this.physics.add.staticGroup();

    const ground = this.platforms.create(WORLD_WIDTH / 2, GROUND_TOP + GROUND_HEIGHT / 2, TextureKey.Ground);
    ground.setDisplaySize(WORLD_WIDTH, GROUND_HEIGHT).refreshBody();

    PLATFORMS.forEach((data) => {
      const platform = this.platforms.create(data.x, data.top + PLATFORM_HEIGHT / 2, TextureKey.Ground);
      platform.setDisplaySize(data.width, PLATFORM_HEIGHT).refreshBody();
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

  private createHazards(): void {
    this.hazards = this.physics.add.group({ allowGravity: false });

    this.time.addEvent({
      delay: HAZARD_SPAWN_DELAY,
      loop: true,
      callback: this.spawnHazard,
      callbackScope: this,
    });
  }

  private createEffects(): void {
    this.sparkles = this.add
      .particles(0, 0, TextureKey.Petal, {
        speed: { min: 60, max: 200 },
        scale: { start: 0.8, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 450,
        tint: [0xffd54f, 0xffffff],
        emitting: false,
      })
      .setDepth(8);
  }

  private createInput(): void {
    const keyboard = this.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.jumpKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    keyboard.on("keydown-D", this.toggleDebug, this);
  }

  private createColliders(): void {
    this.physics.add.collider(this.alice, this.platforms);
    this.physics.add.collider(this.hazards, this.platforms, this.onHazardLanded, undefined, this);
    this.physics.add.overlap(this.alice, this.hazards, this.onHitByCard, undefined, this);
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
    const pointer = this.input.activePointer;

    const touchLeft = pointer.isDown && pointer.x < GAME_WIDTH * 0.33;
    const touchRight = pointer.isDown && pointer.x > GAME_WIDTH * 0.66;
    const touchJump = pointer.isDown && !touchLeft && !touchRight;

    const goLeft = this.cursors.left.isDown || touchLeft;
    const goRight = this.cursors.right.isDown || touchRight;
    const wantsJump = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.jumpKey) || touchJump;

    if (goLeft) {
      this.alice.setVelocityX(-RUN_SPEED);
      this.alice.setFlipX(true);
    } else if (goRight) {
      this.alice.setVelocityX(RUN_SPEED);
      this.alice.setFlipX(false);
    } else {
      this.alice.setVelocityX(0);
    }

    const onGround = body.blocked.down;

    if (wantsJump && onGround) {
      this.alice.setVelocityY(-JUMP_SPEED);
      this.sparkles.explode(6, this.alice.x, this.alice.y + 22);
      playTone(this.sound, 660, 0.12);
    }

    if (!onGround) {
      this.alice.anims.play(AnimKey.AliceJump, true);
    } else if (body.velocity.x !== 0) {
      this.alice.anims.play(AnimKey.AliceWalk, true);
    } else {
      this.alice.anims.play(AnimKey.AliceIdle, true);
    }
  }

  private handleSeasonZones(): void {
    const season = getSeasonAtX(this.alice.x);
    if (season !== this.hud.season) this.applySeason(season, true);
  }

  private applySeason(season: Season, announce: boolean): void {
    const theme = SEASON_THEMES[season];
    this.hud.season = season;

    this.tweenSkyTo(theme.sky);
    this.hills.setTint(theme.hillsTint);
    this.platforms.getChildren().forEach((child) => {
      (child as Phaser.GameObjects.Image).setTint(theme.groundTint);
    });
    this.buildWeather(theme);

    if (announce) {
      this.showSeasonBanner(theme.label);
      playChime(this.sound, theme.chime);
    }
  }

  private tweenSkyTo(target: number): void {
    this.skyTween?.stop();

    const from = Phaser.Display.Color.ValueToColor(this.currentSky);
    const to = Phaser.Display.Color.ValueToColor(target);

    this.skyTween = this.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 700,
      onUpdate: (tween: Phaser.Tweens.Tween) => {
        const mixed = Phaser.Display.Color.Interpolate.ColorWithColor(from, to, 100, tween.getValue() ?? 0);
        this.cameras.main.setBackgroundColor(Phaser.Display.Color.GetColor(mixed.r, mixed.g, mixed.b));
      },
      onComplete: () => {
        this.currentSky = target;
      },
    });
  }

  private buildWeather(theme: SeasonTheme): void {
    this.weather?.destroy();

    this.weather = this.add
      .particles(0, 0, TextureKey.Petal, {
        x: { min: 0, max: GAME_WIDTH },
        y: theme.spawnY,
        lifespan: theme.lifespan,
        speedX: theme.speedX,
        speedY: theme.speedY,
        scale: { start: 0.7, end: 0.5 },
        alpha: { start: 0.9, end: 0.3 },
        tint: theme.particleTint,
        frequency: theme.frequency,
        quantity: 1,
      })
      .setScrollFactor(0)
      .setDepth(7);
  }

  private showSeasonBanner(label: string): void {
    const banner = this.add
      .text(GAME_WIDTH / 2, 90, label, {
        fontFamily: "Georgia, serif",
        fontSize: "52px",
        color: "#ffffff",
        stroke: "#3b5b8c",
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(30)
      .setScale(0);

    this.tweens.chain({
      targets: banner,
      tweens: [
        { scale: 1, duration: 350, ease: "Back.easeOut" },
        { alpha: 0, duration: 600, delay: 700 },
      ],
      onComplete: () => banner.destroy(),
    });
  }

  private spawnHazard(): void {
    if (this.hud.status !== GameStatus.Playing) return;

    const camera = this.cameras.main;
    const x = Phaser.Math.Between(camera.scrollX + 40, camera.scrollX + GAME_WIDTH - 40);
    const card = this.hazards.create(x, -30, TextureKey.Card) as Phaser.Physics.Arcade.Sprite;

    card.setDepth(4);
    card.setVelocity(Phaser.Math.Between(-30, 30), Phaser.Math.Between(150, 240));
    card.setAngularVelocity(Phaser.Math.Between(-120, 120));
  }

  private onHazardLanded: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (hazardObject) => {
    const card = hazardObject as Phaser.Physics.Arcade.Sprite;
    this.sparkles.explode(5, card.x, card.y);
    card.destroy();
  };

  private onCollectCoin: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_aliceObject, coinObject) => {
    const coin = coinObject as Phaser.Physics.Arcade.Sprite;

    this.tweens.killTweensOf(coin);
    coin.disableBody(true, true);

    this.hud.coins += 1;
    this.hud.score += COIN_POINTS;

    this.sparkles.explode(10, coin.x, coin.y);
    playTone(this.sound, SEASON_THEMES[this.hud.season].chime[2], 0.14);

    const popup = this.add
      .text(coin.x, coin.y, `+${COIN_POINTS}`, { fontFamily: "Georgia, serif", fontSize: "22px", color: "#fff59d", stroke: "#333333", strokeThickness: 4 })
      .setOrigin(0.5)
      .setDepth(9);

    this.tweens.add({
      targets: popup,
      y: coin.y - 50,
      alpha: 0,
      duration: 600,
      ease: "Cubic.easeOut",
      onComplete: () => popup.destroy(),
    });

    this.refreshScoreText();
  };

  private onHitByCard: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_aliceObject, cardObject) => {
    const card = cardObject as Phaser.Physics.Arcade.Sprite;
    this.sparkles.explode(8, card.x, card.y);
    card.destroy();

    if (this.isInvulnerable || this.hud.status !== GameStatus.Playing) return;

    this.hud.lives -= 1;
    this.cameras.main.shake(200, 0.01);
    playTone(this.sound, 180, 0.25);
    this.refreshScoreText();

    if (this.hud.lives <= 0) {
      this.endGame(GameStatus.Lost);
      return;
    }

    this.isInvulnerable = true;
    this.tweens.add({
      targets: this.alice,
      alpha: 0.25,
      duration: 100,
      yoyo: true,
      repeat: 7,
      onComplete: () => {
        this.alice.setAlpha(1);
        this.isInvulnerable = false;
      },
    });
  };

  private onReachDoor: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = () => {
    if (this.hud.status !== GameStatus.Playing) return;
    this.endGame(GameStatus.Won);
  };

  private endGame(status: GameStatus): void {
    this.hud.status = status;

    this.alice.setVelocity(0, 0);
    this.physics.pause();
    this.alice.anims.play(AnimKey.AliceIdle, true);

    if (status === GameStatus.Lost) {
      this.alice.setTint(0xff6b6b);
    } else {
      playChime(this.sound, [523, 659, 784, 1047]);
    }

    const message = status === GameStatus.Won ? "You reached the door!" : "The Queen's cards got you";

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, message, {
        fontFamily: "Georgia, serif",
        fontSize: "40px",
        color: "#ffffff",
        stroke: "#3b5b8c",
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(30);
  }

  private toggleDebug(): void {
    const world = this.physics.world;

    if (!world.debugGraphic) {
      world.createDebugGraphic();
      return;
    }

    world.drawDebug = !world.drawDebug;
    if (!world.drawDebug) world.debugGraphic.clear();
  }

  private refreshScoreText(): void {
    this.scoreText.setText(`Score: ${this.hud.score}   Watches: ${this.hud.coins}/${this.hud.totalCoins}   Lives: ${this.hud.lives}`);
  }
}