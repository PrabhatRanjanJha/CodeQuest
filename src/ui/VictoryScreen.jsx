import React from 'react';

export default function VictoryScreen({
  onContinue,
  onClose,
  title = "Victory",
  message = "The enemy has been vanquished. Your logic was flawless and the path forward is clear.",
  buttonText = "CONTINUE JOURNEY",
}) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6">
      <div className="max-w-sm w-full bg-slate-950 border-2 border-yellow-600 p-8 rounded-3xl text-center shadow-[0_0_50px_rgba(234,179,8,0.2)] animate-in fade-in zoom-in duration-300 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
        )}
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">{title}</h2>
        <p className="text-slate-400 mb-6 text-sm">
          {message}
        </p>
        <div className="bg-slate-900 p-4 rounded-xl mb-6 border border-slate-800 text-yellow-500 font-bold">
          +50 EXPERIENCE POINTS
        </div>
        <button 
          onClick={onContinue} 
          className="w-full bg-yellow-600 py-4 rounded-xl font-bold text-black hover:bg-yellow-500 transition-all active:scale-95 shadow-lg"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}