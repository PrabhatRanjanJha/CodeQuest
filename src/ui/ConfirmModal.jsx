import React from 'react';

export default function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100 backdrop-blur-sm">
      <div className="bg-slate-950 border-2 border-slate-800 p-8 rounded-2xl max-w-xs w-full text-center shadow-2xl">
        <div className="text-3xl mb-4">🏳️</div>
        <p className="text-slate-300 mb-6 font-bold uppercase tracking-widest text-xs">
          Abandon the fight and lose your current combat progress?
        </p>
        <div className="flex gap-4">
          <button 
            onClick={onConfirm} 
            className="flex-1 bg-red-900/20 border border-red-600/50 py-3 rounded-xl font-bold text-red-500 hover:bg-red-600 hover:text-white transition-all"
          >
            FORFEIT
          </button>
          <button 
            onClick={onCancel} 
            className="flex-1 bg-slate-800 py-3 rounded-xl font-bold text-white hover:bg-slate-700 transition-all"
          >
            STAY
          </button>
        </div>
      </div>
    </div>
  );
}