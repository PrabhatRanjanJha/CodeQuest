import React from 'react';

export default function BattleHUD({ name = "Enemy Core", hp = 100, color = "bg-red-600" }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-widest text-slate-500">
        <span>{name}</span>
        <span className={hp < 30 ? "text-red-500 animate-pulse" : ""}>{hp}%</span>
      </div>
      <div className="h-4 bg-black border border-slate-800 rounded-full overflow-hidden p-0.5">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
          style={{ width: `${hp}%` }}
        />
      </div>
    </div>
  );
}