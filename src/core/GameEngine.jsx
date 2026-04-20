import { useGame } from "../context/useGame";
import MapScene from "../scenes/MapScene";
import BattleScene from "../scenes/BattleScene";
import DialogueScene from "../scenes/DialogueScene";
import BossScene from "../scenes/BossScene";
import DashboardScene from "../scenes/DashboardScene";

export default function GameEngine() {
  const { scene, signOutUser } = useGame();

  // This handles the switching between scenes based on the Global State
  const renderScene = () => {
    switch (scene.type) {
      case "dashboard":
        return <DashboardScene />;
      case "battle":
        return <BattleScene />;
      case "dialogue":
        return <DialogueScene />;
      case "boss":
        return <BossScene />;
      case "map":
      default:
        return <MapScene />;
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      {scene.type !== "battle" && (
        <button
          onClick={signOutUser}
          className="fixed top-4 left-4 z-999 bg-black/80 border border-cyan-400/40 text-cyan-200 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-cyan-500/20 hover:border-cyan-300 transition-all"
        >
          Sign Out
        </button>
      )}
      {renderScene()}
    </main>
  );
}