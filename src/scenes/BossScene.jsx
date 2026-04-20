import React from 'react';
import BattleScene from "./BattleScene";

// For now, we reuse BattleScene but with a different UI skin or difficulty
// In a full game, you'd add multi-phase logic here.
export default function BossScene() {
  return (
    <div className="boss-fight-wrapper">
      <div className="fixed top-0 inset-x-0 h-1 bg-red-600 animate-pulse z-50 shadow-[0_0_20px_red]" />
      <BattleScene />
    </div>
  );
}