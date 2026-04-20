import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGame } from "../context/useGame";
import { buildPageGraph } from "../data/spaceMapGraph";

const toPercentNumber = (value) => Number(String(value).replace("%", ""));

const buildCurvePoints = (from, to, seed = 0) => {
  const x1 = toPercentNumber(from.x);
  const y1 = toPercentNumber(from.y);
  const x2 = toPercentNumber(to.x);
  const y2 = toPercentNumber(to.y);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const offset = ((seed % 2 === 0 ? -1 : 1) * (10 + (seed % 3) * 2));
  const controlX = midX + offset;
  const controlY = midY - offset / 2;

  return {
    p0: { x: x1, y: y1 },
    p1: { x: controlX, y: controlY },
    p2: { x: x2, y: y2 },
  };
};

const buildCurvedPath = (from, to, seed = 0) => {
  const { p0, p1, p2 } = buildCurvePoints(from, to, seed);
  return `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`;
};

const getQuadraticPoint = (points, t) => {
  const inv = 1 - t;
  const x = inv * inv * points.p0.x + 2 * inv * t * points.p1.x + t * t * points.p2.x;
  const y = inv * inv * points.p0.y + 2 * inv * t * points.p1.y + t * t * points.p2.y;
  return { x, y };
};

const easeInOutCubic = (t) => (t < 0.5
  ? 4 * t * t * t
  : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function MapScene() {
  const { currentPage, setCurrentPage, maxUnlockedPage, currentPageData, completedCount, completedNodeKeys, pageCount, mapTraversal, setMapNode, setScene, goToDashboard, selectedTopic, topicStoryState, dismissTopicVictoryPopup } = useGame();

  const graph = useMemo(() => buildPageGraph(currentPageData), [currentPageData]);
  const pageId = currentPageData?.id;
  const pageKey = String(pageId);
  const currentNodeKey = mapTraversal.currentNodeByPage[pageKey] || graph.startNodeKey;
  const visitedKeys = mapTraversal.visitedNodeKeysByPage[pageKey] || [];
  const unlockedKeys = mapTraversal.unlockedNodeKeysByPage?.[pageKey] || [];
  const nodeByKey = useMemo(() => Object.fromEntries(graph.nodes.map((node) => [node.key, node])), [graph.nodes]);
  const [avatarPosition, setAvatarPosition] = useState(null);
  const [isAvatarMoving, setIsAvatarMoving] = useState(false);
  const [pendingNodeToStart, setPendingNodeToStart] = useState(null);
  const previousNodeRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!pageId) return;
    if (!mapTraversal.currentNodeByPage[pageKey]) {
      setMapNode(pageId, graph.startNodeKey, graph.edges);
    }
  }, [pageId, pageKey, graph.startNodeKey, graph.edges, mapTraversal.currentNodeByPage, setMapNode]);

  useEffect(() => {
    const currentNode = nodeByKey[currentNodeKey];
    if (!currentNode?.position) return;

    const previousNode = previousNodeRef.current;
    const canAnimate = Boolean(
      previousNode
      && previousNode.key !== currentNode.key
      && previousNode.pageId === currentNode.pageId
      && previousNode.position
    );

    if (!canAnimate) {
      setAvatarPosition(currentNode.position);
      setIsAvatarMoving(false);
      previousNodeRef.current = currentNode;
      return;
    }

    const edgeIndex = graph.edges.findIndex((edge) => edge.from === previousNode.key && edge.to === currentNode.key);
    const seed = (edgeIndex >= 0 ? edgeIndex : 0) + pageId;
    const points = buildCurvePoints(previousNode.position, currentNode.position, seed);
    const duration = 1000;
    const start = performance.now();

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsAvatarMoving(true);

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      const point = getQuadraticPoint(points, eased);

      setAvatarPosition({ x: `${point.x}%`, y: `${point.y}%` });

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setAvatarPosition(currentNode.position);
        setIsAvatarMoving(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    previousNodeRef.current = currentNode;
  }, [currentNodeKey, nodeByKey, graph.edges, pageId]);

  useEffect(() => () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  useEffect(() => {
    if (isAvatarMoving || !pendingNodeToStart) return;

    if (pendingNodeToStart.type === "learn") {
      setScene({ type: "dialogue", node: pendingNodeToStart });
    } else if (pendingNodeToStart.type === "battle" || pendingNodeToStart.type === "boss") {
      setScene({ type: "battle", node: pendingNodeToStart });
    }

    setPendingNodeToStart(null);
  }, [isAvatarMoving, pendingNodeToStart, setScene]);

  useEffect(() => {
    const isOnGoalNode = currentNodeKey === graph.goalNodeKey;
    const hasNextPage = currentPage < pageCount;
    const canMoveNext = currentPage < maxUnlockedPage;

    if (!isOnGoalNode || !hasNextPage || !canMoveNext) return;

    const timer = setTimeout(() => {
      setCurrentPage(currentPage + 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentNodeKey, graph.goalNodeKey, currentPage, pageCount, maxUnlockedPage, setCurrentPage]);

  const connectedEdgeKeys = graph.edges
    .filter((edge) => edge.from === currentNodeKey)
    .map((edge) => `${edge.from}-${edge.to}`);

  const isNodeAvailable = (nodeKey) =>
    nodeKey === currentNodeKey ||
    unlockedKeys.includes(nodeKey) ||
    connectedEdgeKeys.some((edgeKey) => edgeKey.endsWith(`-${nodeKey}`));
  const missionNodeCount = graph.nodes.filter((node) => node.type !== "dummy").length;
  const completedOnPage = graph.nodes.filter((node) => node.type !== "dummy" && completedNodeKeys.includes(node.key)).length;
  const isFirstPage = currentPage === 1;
  const isLastUnlockedPage = currentPage >= maxUnlockedPage;

  const goPrevious = () => {
    const previousPage = currentPage - 1;
    const previousPageData = selectedTopic?.pages?.[previousPage - 1];

    if (!previousPageData) {
      setCurrentPage(previousPage);
      return;
    }

    const previousGraph = buildPageGraph(previousPageData);
    const edgeIntoGoal = previousGraph.edges.find((edge) => edge.to === previousGraph.goalNodeKey);
    const fallbackNodeKey = edgeIntoGoal?.from || previousGraph.startNodeKey;

    setMapNode(previousPage, fallbackNodeKey, previousGraph.edges);
    setCurrentPage(previousPage);
  };
  const goNext = () => setCurrentPage(currentPage + 1);

  const handleNodeClick = (node) => {
    if (!isNodeAvailable(node.key)) return;

    setMapNode(pageId, node.key, graph.edges);
    setIsAvatarMoving(true);
    setPendingNodeToStart(node);
  };

  const renderNodeFill = (node, current, completed, available) => {
    if (node.type === "dummy") {
      return current
        ? "bg-cyan-300 border-cyan-100 text-black shadow-[0_0_28px_rgba(34,211,238,0.5)]"
        : available
        ? "bg-slate-300 border-slate-100 text-slate-900 shadow-[0_0_22px_rgba(226,232,240,0.24)]"
        : "bg-slate-700/90 border-slate-500/70 text-slate-300";
    }

    if (completed) return "bg-emerald-500 border-emerald-200 text-white shadow-[0_0_32px_rgba(16,185,129,0.5)]";
    if (current) return "bg-cyan-400 border-cyan-200 text-black shadow-[0_0_34px_rgba(34,211,238,0.55)]";
    if (!available) return "bg-slate-800/95 border-slate-600 text-slate-400";
    if (node.type === "learn") return "bg-sky-500 border-sky-200 text-white shadow-[0_0_32px_rgba(56,189,248,0.45)]";
    return "bg-amber-400 border-amber-200 text-black shadow-[0_0_36px_rgba(251,191,36,0.55)]";
  };

  return (
    <div className="h-screen w-screen bg-slate-950 p-5 overflow-hidden font-mono flex items-center justify-center">
      {/* The Map Container */}
      <div className="relative w-[74vw] h-[86vh] min-w-275 min-h-175 max-w-365 max-h-260 overflow-hidden border-4 border-slate-700/90 rounded-4xl shadow-[0_0_90px_rgba(0,0,0,0.58)] bg-[#050816]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_78%_14%,rgba(251,191,36,0.12),transparent_22%),radial-gradient(circle_at_50%_85%,rgba(168,85,247,0.15),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.97),rgba(15,23,42,0.99))]" />
        <div className="absolute inset-0 opacity-18 bg-[radial-gradient(circle,rgba(255,255,255,0.95)_1px,transparent_1.5px)] bg-size-[34px_34px] bg-position-[0_0]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,rgba(125,211,252,0.9)_1px,transparent_1.5px)] bg-size-[78px_78px] bg-position-[18px_28px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(2,6,23,0.55)_100%)]" />
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute top-16 right-0 w-80 h-80 rounded-full bg-amber-400/7 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-lg h-128 rounded-full bg-fuchsia-500/8 blur-3xl" />
        <div className="absolute inset-3.5 rounded-4xl border border-cyan-400/15 shadow-[inset_0_0_40px_rgba(34,211,238,0.12)]" />
        
        {/* Overlay for "Game" Feel */}
        <div className="absolute inset-0 bg-slate-950/12 backdrop-blur-[1px]" />

        <div className="absolute left-6 bottom-6 z-10 rounded-2xl border border-cyan-400/25 bg-black/50 px-4 py-3 shadow-[0_0_24px_rgba(34,211,238,0.15)]">
          <div className="text-[10px] uppercase tracking-[0.35em] text-cyan-300/90">World Map</div>
          <div className="mt-1 text-sm text-slate-200">Travel node to node across the star lanes.</div>
          <div className="mt-2 text-[11px] text-slate-300">Current: <span className="text-cyan-200">{nodeByKey[currentNodeKey]?.title || "Unknown"}</span></div>
        </div>

        <button
          onClick={goToDashboard}
          className="absolute left-6 bottom-30 z-20 rounded-xl border border-cyan-400/45 bg-black/70 text-cyan-200 text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-cyan-500/15 shadow-[0_0_20px_rgba(34,211,238,0.18)]"
        >
          Back to Enemies
        </button>

        {/* SVG Paths (The lines connecting levels) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.15)" />
              <stop offset="50%" stopColor="rgba(250,204,21,0.9)" />
              <stop offset="100%" stopColor="rgba(168,85,247,0.15)" />
            </linearGradient>
            <filter id="routeShadow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {graph.edges.map((edge, index) => {
            const from = nodeByKey[edge.from];
            const to = nodeByKey[edge.to];
            if (!from || !to) return null;

            const path = buildCurvedPath(from.position, to.position, index + pageId);
            const isActive = edge.from === currentNodeKey;
            const isRoute = isActive || visitedKeys.includes(edge.to);

            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={path}
                fill="none"
                stroke={isRoute ? "url(#routeGlow)" : "rgba(148,163,184,0.24)"}
                strokeWidth={isRoute ? 2.4 : 1.3}
                strokeDasharray={isRoute ? "5,6" : "3,6"}
                filter="url(#routeShadow)"
                className={isActive ? "opacity-90" : "opacity-45"}
              />
            );
          })}
        </svg>

        <button
          onClick={goPrevious}
          disabled={isFirstPage}
          className={`absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full border border-cyan-400/25 flex items-center justify-center text-2xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.18)] ${
            isFirstPage ? "bg-slate-900/70 border-slate-700 text-slate-600 cursor-not-allowed" : "bg-black/80 border-cyan-300/70 text-cyan-200 hover:scale-105 hover:shadow-[0_0_28px_rgba(56,189,248,0.35)]"
          }`}
          aria-label="Previous page"
        >
          ←
        </button>

        <button
          onClick={goNext}
          disabled={isLastUnlockedPage}
          className={`absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full border border-cyan-400/25 flex items-center justify-center text-2xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.18)] ${
            isLastUnlockedPage ? "bg-slate-900/70 border-slate-700 text-slate-600 cursor-not-allowed" : "bg-black/80 border-cyan-300/70 text-cyan-200 hover:scale-105 hover:shadow-[0_0_28px_rgba(56,189,248,0.35)]"
          }`}
          aria-label="Next page"
        >
          →
        </button>

        {/* Level Nodes */}
        {graph.nodes.map((node) => {
          const current = node.key === currentNodeKey;
          const available = isNodeAvailable(node.key);
          const completed = node.type !== "dummy" && completedNodeKeys.includes(node.key);
          const battleMeta = node.metadata || {};
          const isBattleNode = node.type === "battle" || node.type === "boss";
          const practiceCount = battleMeta.practiceCount || node.practiceQuestions?.length || 1;
          const isFinalBoss = Boolean(node.isFinalBoss || node.type === "boss");

          return (
            <button
              key={node.key}
              disabled={!available && !current}
              onClick={() => handleNodeClick(node)}
              style={{ left: node.position.x, top: node.position.y }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 transform active:scale-95 ${available || current ? "hover:scale-108" : "opacity-70 cursor-not-allowed"}`}
            >
              <div
                className={`relative rounded-full border-2 ${node.type === "dummy" ? "w-8 h-8" : "w-15 h-15"} ${renderNodeFill(node, current, completed, available)} ${current ? "scale-110" : ""}`}
              >
                <div className={`absolute inset-1 rounded-full border border-white/15 ${current ? "animate-pulse" : ""}`} />
                <div className="relative z-10 flex h-full w-full items-center justify-center text-center">
                  {node.type === "dummy" ? (
                    <span className="text-[10px] text-current opacity-70">✦</span>
                  ) : (
                    <span className="text-[11px] uppercase tracking-[0.2em] font-black">{node.label}</span>
                  )}
                </div>

                {isBattleNode && (
                  <div className="absolute -top-23 left-1/2 -translate-x-1/2 w-34 h-18 pointer-events-none">
                    <div className="absolute inset-0 rounded-xl border border-white/10 bg-slate-950/60 -translate-x-1.5 -translate-y-1" />
                    <div className="absolute inset-0 rounded-xl border border-white/12 bg-slate-950/70 translate-x-1.5 -translate-y-0.5" />
                    <div className="relative h-full w-full rounded-xl border border-amber-300/70 bg-[linear-gradient(180deg,rgba(30,41,59,0.94),rgba(15,23,42,0.98))] shadow-[0_12px_24px_rgba(0,0,0,0.45)] overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-1 bg-amber-300/80" />
                      <div className="absolute top-1.5 left-2 text-[9px] text-amber-200 uppercase tracking-[0.16em] font-bold">{isFinalBoss ? "Final Boss" : "Practice Pack"}</div>
                      <div className="absolute top-6 left-2 right-2 text-[10px] text-white font-bold leading-tight truncate">{battleMeta.enemyName || node.title}</div>
                      <div className="absolute bottom-1.5 left-2 text-[9px] text-cyan-200">Questions: {practiceCount}</div>
                      <div className="absolute bottom-1.5 right-2 text-[9px] text-amber-200">PWR {battleMeta.enemyPower || "?"}</div>
                    </div>
                  </div>
                )}
              </div>

              {!isBattleNode && node.type !== "dummy" && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[11px] text-slate-100 whitespace-nowrap drop-shadow bg-black/35 px-2 py-0.5 rounded-full border border-white/10">{node.title}</span>
              )}
            </button>
          );
        })}

        {/* Top HUD */}
        <div className="absolute top-3 left-6 pointer-events-none z-20 w-[min(38vw,30rem)]">
          <div className="bg-black/70 border border-cyan-400/30 px-5 py-3 rounded-2xl backdrop-blur-sm shadow-[0_0_24px_rgba(56,189,248,0.12)] text-left">
            <div className="text-cyan-300 text-sm font-bold uppercase tracking-[0.25em]">Current Enemy</div>
            <div className="text-white text-xl font-black mt-1 truncate">{currentPageData.title}</div>
            <div className="text-slate-300 text-xs mt-1 line-clamp-2">{currentPageData.storyBeat || currentPageData.subtitle}</div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 pointer-events-none">
          <div className="bg-black/70 border border-cyan-400/30 p-5 rounded-2xl text-right min-w-72 backdrop-blur-sm shadow-[0_0_24px_rgba(56,189,248,0.12)]">
            <div className="text-cyan-300 text-sm font-bold uppercase tracking-[0.25em]">Page Progress</div>
            <div className="text-white text-2xl font-black mt-1">Page {currentPage} / {pageCount}</div>
            <div className="text-slate-300 text-sm mt-1">Node {completedOnPage} / {missionNodeCount} • Total cleared {completedCount}</div>
          </div>
        </div>

        {avatarPosition && (
          <div
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: avatarPosition.x,
              top: avatarPosition.y,
            }}
          >
            <div className={`relative flex items-center justify-center w-7 h-7 rounded-full bg-cyan-300/25 border border-cyan-200/50 shadow-[0_0_20px_rgba(34,211,238,0.55)] ${isAvatarMoving ? "animate-pulse" : ""}`}>
              <span className="text-[12px]">🚀</span>
            </div>
          </div>
        )}

        {topicStoryState?.pendingVictoryPopup && (
          <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
            <div className="max-w-xl w-full rounded-3xl border border-yellow-500/60 bg-slate-950 p-8 text-center shadow-[0_0_40px_rgba(234,179,8,0.2)]">
              <div className="text-5xl mb-3">👑</div>
              <h2 className="text-2xl font-black text-yellow-300 uppercase tracking-wide mb-2">Enemy Defeated</h2>
              <p className="text-slate-200 text-sm leading-relaxed">
                {selectedTopic?.storyline?.outro || `You defeated ${selectedTopic?.title}. This story is complete, but many enemies are still waiting in other sectors.`}
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => {
                    dismissTopicVictoryPopup();
                    goToDashboard();
                  }}
                  className="px-5 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400"
                >
                  Start New Story
                </button>
                <button
                  onClick={dismissTopicVictoryPopup}
                  className="px-5 py-3 rounded-xl border border-slate-600 text-slate-200 hover:border-cyan-400"
                >
                  Stay on Map
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}