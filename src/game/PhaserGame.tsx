import Phaser from "phaser";
import { useEffect, useRef } from "react";
import { createGameConfig } from "./gameConfig";

export function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const game = new Phaser.Game(createGameConfig(container));

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={containerRef} className="game-canvas" />;
}