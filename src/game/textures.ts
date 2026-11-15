import Phaser from "phaser";
import { TextureKey } from "./keys";

function createPen(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  return scene.make.graphics({ x: 0, y: 0 }, false);
}

function finishTexture(pen: Phaser.GameObjects.Graphics, key: TextureKey, width: number, height: number): void {
  pen.generateTexture(key, width, height);
  pen.destroy();
}

interface LegPose {
  leftX: number;
  rightX: number;
  leftLift: number;
  rightLift: number;
}

function drawAlice(scene: Phaser.Scene, key: TextureKey, pose: LegPose): void {
  if (scene.textures.exists(key)) return;
  const pen = createPen(scene);

  pen.fillStyle(0xf5d76e, 1);
  pen.fillCircle(16, 11, 10);
  pen.fillStyle(0xffe0bd, 1);
  pen.fillCircle(16, 13, 7);
  pen.fillStyle(0x333333, 1);
  pen.fillCircle(13, 13, 1);
  pen.fillCircle(19, 13, 1);

  pen.fillStyle(0x4a90d9, 1);
  pen.fillTriangle(16, 20, 3, 39, 29, 39);
  pen.fillRect(10, 20, 12, 8);
  pen.fillStyle(0xffffff, 1);
  pen.fillTriangle(16, 25, 9, 39, 23, 39);

  pen.fillStyle(0xffe0bd, 1);
  pen.fillRect(pose.leftX, 39 - pose.leftLift, 4, 7);
  pen.fillRect(pose.rightX, 39 - pose.rightLift, 4, 7);
  pen.fillStyle(0x333333, 1);
  pen.fillRect(pose.leftX, 46 - pose.leftLift, 5, 2);
  pen.fillRect(pose.rightX, 46 - pose.rightLift, 5, 2);

  finishTexture(pen, key, 32, 48);
}

function drawGround(scene: Phaser.Scene): void {
  if (scene.textures.exists(TextureKey.Ground)) return;
  const pen = createPen(scene);
  pen.fillStyle(0xffffff, 1);
  pen.fillRect(0, 0, 32, 32);
  pen.fillStyle(0xc8c8c8, 1);
  pen.fillRect(0, 28, 32, 4);
  finishTexture(pen, TextureKey.Ground, 32, 32);
}

function drawHills(scene: Phaser.Scene): void {
  if (scene.textures.exists(TextureKey.Hills)) return;
  const pen = createPen(scene);
  pen.fillStyle(0xffffff, 1);
  [-400, 0, 400].forEach((shift) => {
    pen.fillCircle(60 + shift, 180, 100);
    pen.fillCircle(200 + shift, 180, 140);
    pen.fillCircle(350 + shift, 180, 110);
  });
  finishTexture(pen, TextureKey.Hills, 400, 180);
}

function drawClouds(scene: Phaser.Scene): void {
  if (scene.textures.exists(TextureKey.Clouds)) return;
  const pen = createPen(scene);
  pen.fillStyle(0xffffff, 0.85);
  [-512, 0, 512].forEach((shift) => {
    pen.fillEllipse(90 + shift, 40, 110, 34);
    pen.fillEllipse(130 + shift, 30, 70, 30);
    pen.fillEllipse(330 + shift, 60, 130, 38);
    pen.fillEllipse(380 + shift, 50, 80, 30);
  });
  finishTexture(pen, TextureKey.Clouds, 512, 100);
}

function drawWatch(scene: Phaser.Scene): void {
  if (scene.textures.exists(TextureKey.Watch)) return;
  const pen = createPen(scene);
  pen.fillStyle(0xffc107, 1);
  pen.fillCircle(11, 11, 10);
  pen.lineStyle(2, 0xb8860b, 1);
  pen.strokeCircle(11, 11, 10);
  pen.fillStyle(0xffffff, 1);
  pen.fillCircle(11, 11, 6);
  pen.lineStyle(2, 0x333333, 1);
  pen.lineBetween(11, 11, 11, 6);
  pen.lineBetween(11, 11, 15, 11);
  finishTexture(pen, TextureKey.Watch, 22, 22);
}

function drawCard(scene: Phaser.Scene): void {
  if (scene.textures.exists(TextureKey.Card)) return;
  const pen = createPen(scene);
  pen.fillStyle(0xffffff, 1);
  pen.fillRoundedRect(0, 0, 26, 36, 4);
  pen.lineStyle(2, 0xd32f2f, 1);
  pen.strokeRoundedRect(1, 1, 24, 34, 4);
  pen.fillStyle(0xd32f2f, 1);
  pen.fillCircle(10, 16, 4);
  pen.fillCircle(16, 16, 4);
  pen.fillTriangle(6, 18, 20, 18, 13, 28);
  finishTexture(pen, TextureKey.Card, 26, 36);
}

function drawDoor(scene: Phaser.Scene): void {
  if (scene.textures.exists(TextureKey.Door)) return;
  const pen = createPen(scene);
  pen.fillStyle(0x6a1b9a, 1);
  pen.fillRect(0, 22, 44, 54);
  pen.fillCircle(22, 22, 22);
  pen.fillStyle(0x8e24aa, 1);
  pen.fillRect(6, 28, 32, 48);
  pen.fillCircle(22, 28, 16);
  pen.fillStyle(0xffc107, 1);
  pen.fillCircle(33, 52, 3);
  finishTexture(pen, TextureKey.Door, 44, 76);
}

function drawPetal(scene: Phaser.Scene): void {
  if (scene.textures.exists(TextureKey.Petal)) return;
  const pen = createPen(scene);
  pen.fillStyle(0xffffff, 1);
  pen.fillCircle(5, 5, 5);
  finishTexture(pen, TextureKey.Petal, 10, 10);
}

export function createAllTextures(scene: Phaser.Scene): void {
  drawAlice(scene, TextureKey.AliceIdle, { leftX: 11, rightX: 17, leftLift: 0, rightLift: 0 });
  drawAlice(scene, TextureKey.AliceWalkA, { leftX: 8, rightX: 20, leftLift: 0, rightLift: 2 });
  drawAlice(scene, TextureKey.AliceWalkB, { leftX: 13, rightX: 15, leftLift: 2, rightLift: 0 });
  drawAlice(scene, TextureKey.AliceJump, { leftX: 9, rightX: 19, leftLift: 3, rightLift: 5 });
  drawGround(scene);
  drawHills(scene);
  drawClouds(scene);
  drawWatch(scene);
  drawCard(scene);
  drawDoor(scene);
  drawPetal(scene);
}