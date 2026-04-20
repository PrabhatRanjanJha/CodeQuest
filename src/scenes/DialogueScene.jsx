import React from 'react';
import { useGame } from "../context/useGame";

export default function DialogueScene() {
  const { scene, setScene, completeNode } = useGame();
  const node = scene.node;
  const lesson = node?.lesson || null;

  if (!node) {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-10 font-mono">
        <div className="max-w-xl w-full border border-slate-700 bg-slate-950 p-8 rounded-2xl text-center">
          <p className="text-slate-300 mb-5">No learning node selected.</p>
          <button
            onClick={() => setScene({ type: "map" })}
            className="bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-all"
          >
            Return to Map
          </button>
        </div>
      </div>
    );
  }

  const title = lesson?.title || node.title || `Learning Node ${node?.slot || "?"}`;
  const quote = lesson?.summary || "Practice one clear idea at a time and build from it.";
  const concepts = lesson?.bullets || ["Learn the concept.", "Apply it once.", "Move forward."];

  const handleFinish = () => {
    completeNode(node);
    setScene({ type: "map" });
  };

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center p-10 font-mono">
      <div className="max-w-2xl w-full bg-slate-950 border-2 border-slate-800 p-10 rounded-3xl relative">
        <div className="absolute -top-6 left-10 bg-yellow-600 text-black px-4 py-1 font-black text-xs rounded">
          {title.toUpperCase()}
        </div>
        
        <p className="text-xl text-slate-300 leading-relaxed mb-10 italic">
          {quote}
        </p>

        <div className="mb-8 bg-black/40 border border-slate-800 rounded-xl p-6">
          <h3 className="text-yellow-500 font-black uppercase tracking-widest text-xs mb-4">What you learn</h3>
          <ul className="space-y-3 text-slate-300 text-sm">
            {concepts.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        {lesson?.exampleCode && (
          <div className="mb-10 bg-black border border-slate-800 rounded-xl p-5">
            <div className="text-blue-400 font-black uppercase tracking-widest text-xs mb-3">{lesson.exampleTitle}</div>
            <pre className="text-green-400 text-xs whitespace-pre-wrap">{lesson.exampleCode}</pre>
          </div>
        )}

        <button 
          onClick={handleFinish}
          className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest"
        >
          I have learned enough
        </button>
      </div>
    </div>
  );
}