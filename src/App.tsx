import "./App.css";
import { PhaserGame } from "./game/PhaserGame";

function App() {
  return (
    <main className="app">
      <h1 className="app-title">Season Dash</h1>
      <div className="game-frame">
        <PhaserGame />
      </div>
    </main>
  );
}

export default App;