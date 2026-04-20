import React, { useMemo, useState } from "react";
import { useGame } from "../context/useGame";

export default function DashboardScene() {
  const { topics, topicProgressById, selectTopic, selectedTopicId } = useGame();
  const [searchTerm, setSearchTerm] = useState("");

  const visibleTopics = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return topics;

    return topics.filter((topic) => {
      const titleMatch = topic.title.toLowerCase().includes(query);
      const subtitleMatch = topic.subtitle.toLowerCase().includes(query);
      return titleMatch || subtitleMatch;
    });
  }, [topics, searchTerm]);

  return (
    <div className="h-screen w-screen overflow-auto bg-slate-950 text-white font-mono">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_90%_8%,rgba(168,85,247,0.12),transparent_22%),linear-gradient(180deg,rgba(2,6,23,0.99),rgba(15,23,42,0.98))]" />

      <div className="relative max-w-7xl mx-auto px-6 py-8 lg:px-10">
        <section className="rounded-3xl border border-cyan-400/20 bg-slate-950/75 backdrop-blur-md shadow-[0_0_28px_rgba(34,211,238,0.12)] p-6 lg:p-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/90">Mission Hub</p>
              <h1 className="mt-2 text-3xl lg:text-4xl font-black tracking-tight">CodeQuest Dashboard</h1>
              <p className="mt-2 text-slate-300 text-sm lg:text-base">Pick an enemy track to launch its full 8-page learning map with battles and progression.</p>
            </div>

            <div className="w-full lg:w-md">
              <label htmlFor="topic-search" className="block text-[10px] uppercase tracking-[0.28em] text-cyan-300/90 mb-2">Search Enemies</label>
              <div className="relative">
                <input
                  id="topic-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by enemy name"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400/80 text-slate-100 pl-4 pr-20 py-2.5 rounded-xl outline-none transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border border-slate-600 text-slate-300 hover:text-cyan-200 hover:border-cyan-500/60"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Total Enemies: <span className="text-cyan-300">{topics.length}</span></span>
          <span>Showing: <span className="text-cyan-300">{visibleTopics.length}</span></span>
        </div>

        {visibleTopics.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-900/65 p-10 text-center text-slate-300">
            No enemies matched “{searchTerm}”.
          </div>
        ) : (
          <section className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
            {visibleTopics.map((topic) => {
              const isSelected = topic.id === selectedTopicId;
              const topicProgress = topicProgressById?.[topic.id];
              const totalNodes = topic.pages.reduce((sum, page) => sum + (page.nodes?.length || 0), 0);
              const completedNodes = topicProgress?.completedNodeKeys?.length || 0;
              const isCompleted = Boolean(
                topicProgress?.storyState?.completed
                || (topicProgress?.maxUnlockedPage >= topic.pages.length && completedNodes >= totalNodes)
              );
              const initials = topic.title
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 3)
                .toUpperCase();

              return (
                <button
                  key={topic.id}
                  onClick={() => selectTopic(topic.id)}
                  className={`relative group text-left rounded-2xl border p-5 transition-all duration-200 min-h-42 ${
                    isSelected
                      ? "border-cyan-300 bg-cyan-500/10 shadow-[0_0_26px_rgba(34,211,238,0.22)]"
                      : isCompleted
                        ? "border-emerald-400/65 bg-emerald-500/10 hover:border-emerald-300/80 hover:bg-emerald-500/15 shadow-[0_0_20px_rgba(16,185,129,0.16)]"
                      : "border-slate-700 bg-slate-900/70 hover:border-cyan-500/60 hover:bg-slate-900 hover:shadow-[0_0_20px_rgba(34,211,238,0.14)]"
                  }`}
                >
                  {isCompleted && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="-rotate-12 w-[92%] text-center rounded-xl border-4 border-emerald-300/70 bg-emerald-500/70 py-5 text-[28px] lg:text-[34px] leading-none font-black uppercase tracking-[0.22em] text-emerald-100/85 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                        Enemy Defeated
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-10 h-10 rounded-xl shrink-0 border border-cyan-400/40 bg-cyan-500/10 text-cyan-200 flex items-center justify-center text-xs font-black tracking-wider">
                        {initials}
                      </span>
                      <h2 className="text-lg font-black leading-tight pr-2 truncate">{topic.title}</h2>
                    </div>

                    <span className={`text-[10px] uppercase tracking-widest rounded-full border px-2 py-1 shrink-0 ${
                      isCompleted
                        ? "text-emerald-200 border-emerald-400/40 bg-emerald-500/15"
                        : "text-cyan-300 border-cyan-400/35"
                    }`}>
                      {topic.pages.length} pages
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-300 line-clamp-2">{topic.subtitle}</p>

                  <div className={`mt-5 text-[11px] uppercase tracking-wider transition-colors ${
                    isCompleted
                      ? "text-emerald-200"
                      : "text-slate-400 group-hover:text-cyan-200"
                  }`}>
                    {isCompleted ? "Enemy Defeated • Replay Journey →" : "Open Enemies Journey →"}
                  </div>
                </button>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
