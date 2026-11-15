export enum SceneKey {
  Boot = "BootScene",
  Menu = "MenuScene",
  Game = "GameScene",
}

export enum TextureKey {
  AliceIdle = "alice-idle",
  AliceWalkA = "alice-walk-a",
  AliceWalkB = "alice-walk-b",
  AliceJump = "alice-jump",
  Ground = "ground",
  Hills = "hills",
  Clouds = "clouds",
  Watch = "watch",
  Card = "card",
  Door = "door",
  Petal = "petal",
}

export enum AnimKey {
  AliceIdle = "alice-idle-anim",
  AliceWalk = "alice-walk-anim",
  AliceJump = "alice-jump-anim",
}

export enum Season {
  Spring = "spring",
  Summer = "summer",
  Autumn = "autumn",
  Winter = "winter",
}

export enum GameStatus {
  Playing = "playing",
  Won = "won",
  Lost = "lost",
}

export enum GameEvent {
  HudChanged = "hud-changed",
  SelectSeason = "select-season",
  ToggleMute = "toggle-mute",
  RestartRequested = "restart-requested",
}

export enum RegistryKey {
  HighScore = "high-score",
}