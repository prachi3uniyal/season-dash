import { useEffect, useState } from "react";
import "./App.css";
import { eventBus } from "./game/eventBus";
import { PhaserGame } from "./game/PhaserGame";
import { GameEvent, GameStatus, Season } from "./game/keys";
import { SEASON_ORDER, SEASON_THEMES } from "./game/seasons";
import { getInitialHudState } from "./game/state";
import type { HudState } from "./game/types";

function App() {
  const [hud, setHud] = useState<HudState>(getInitialHudState);

  useEffect(() => {
    const handleHudChanged = (state: HudState): void => {
      setHud(state);
    };

    eventBus.on(GameEvent.HudChanged, handleHudChanged);

    return () => {
      eventBus.off(GameEvent.HudChanged, handleHudChanged);
    };
  }, []);

  const selectSeason = (season: Season): void => {
    eventBus.emit(GameEvent.SelectSeason, season);
  };

  const toggleMute = (): void => {
    eventBus.emit(GameEvent.ToggleMute);
  };

  const restart = (): void => {
    eventBus.emit(GameEvent.RestartRequested);
  };

  const isFinished = hud.status !== GameStatus.Playing;

  return (
    <main className="app">
      <h1 className="app-title">Season Dash</h1>

      <section className="hud">
        <span>Score: {hud.score}</span>
        <span>Best: {hud.highScore}</span>
        <span>
          Watches: {hud.coins}/{hud.totalCoins}
        </span>
        <span>Lives: {"♥".repeat(Math.max(hud.lives, 0))}</span>
        <span>Season: {SEASON_THEMES[hud.season].label}</span>
      </section>

      <div className="game-frame">
        <PhaserGame />
        {isFinished && (
          <div className="overlay">
            <h2>{hud.status === GameStatus.Won ? "You reached the door!" : "The Queen's cards got you"}</h2>
            <p>Score: {hud.score}</p>
            <button onClick={restart}>Play again</button>
          </div>
        )}
      </div>

      <section className="controls">
        {SEASON_ORDER.map((season) => (
          <button key={season} className={hud.season === season ? "active" : ""} onClick={() => selectSeason(season)}>
            {SEASON_THEMES[season].label}
          </button>
        ))}
        <button onClick={toggleMute}>{hud.muted ? "Unmute" : "Mute"}</button>
      </section>

      <p className="hint">Arrow keys to move, Up or Space to jump, D toggles the physics debug view. On a phone, tap the left, middle or right of the game.</p>
    </main>
  );
}

export default App;