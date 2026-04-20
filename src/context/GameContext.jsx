import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { GameContext } from "./gameContextObject";
import { topics, topicsById } from "../data/topicsCatalog";

const NODE_DRAFTS_STORAGE_KEY = "codequest_node_drafts";
const SELECTED_LANGUAGE_STORAGE_KEY = "codequest_selected_language";
const SELECTED_TOPIC_STORAGE_KEY = "codequest_selected_topic";

const DEFAULT_TOPIC_ID = "prefix-sum";

const buildDefaultTopicProgressById = () =>
  Object.fromEntries(
    topics.map((topic) => [
      topic.id,
      {
        currentPage: 1,
        maxUnlockedPage: 1,
        completedNodeKeys: [],
        mapTraversal: { currentNodeByPage: {}, visitedNodeKeysByPage: {}, unlockedNodeKeysByPage: {} },
        battleProgressByNode: {},
        storyState: { completed: false, pendingVictoryPopup: false },
      },
    ])
  );

const getInitialLanguage = () => {
  if (typeof window === "undefined") return "java";

  try {
    return window.localStorage.getItem(SELECTED_LANGUAGE_STORAGE_KEY) || "java";
  } catch {
    return "java";
  }
};

const getInitialSelectedTopicId = () => {
  if (typeof window === "undefined") return DEFAULT_TOPIC_ID;

  try {
    return window.localStorage.getItem(SELECTED_TOPIC_STORAGE_KEY) || DEFAULT_TOPIC_ID;
  } catch {
    return DEFAULT_TOPIC_ID;
  }
};

export function GameProvider({ children }) {
  const [isAuthHydrated, setIsAuthHydrated] = useState(false);
  const [user, setUser] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [selectedTopicId, setSelectedTopicId] = useState(getInitialSelectedTopicId());
  const [topicProgressById, setTopicProgressById] = useState(buildDefaultTopicProgressById);
  const [playerHp, setPlayerHp] = useState(100);
  const [scene, setScene] = useState({ type: "dashboard", node: null });
  const [selectedLanguage, setSelectedLanguage] = useState(getInitialLanguage());
  const [nodeDrafts, setNodeDrafts] = useState(() => {
    if (typeof window === "undefined") return {};

    try {
      const raw = window.localStorage.getItem(NODE_DRAFTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const d = snap.data();
          setXp(d.xp || 0);
          setLevel(d.level || 1);
          const incomingTopicProgress = d.topicProgressById;
          if (incomingTopicProgress && typeof incomingTopicProgress === "object") {
            const defaults = buildDefaultTopicProgressById();
            const merged = { ...defaults };

            Object.keys(incomingTopicProgress).forEach((topicId) => {
              const base = defaults[topicId] || {
                currentPage: 1,
                maxUnlockedPage: 1,
                completedNodeKeys: [],
                mapTraversal: { currentNodeByPage: {}, visitedNodeKeysByPage: {}, unlockedNodeKeysByPage: {} },
                battleProgressByNode: {},
                storyState: { completed: false, pendingVictoryPopup: false },
              };
              const incoming = incomingTopicProgress[topicId] || {};

              merged[topicId] = {
                currentPage: incoming.currentPage || base.currentPage,
                maxUnlockedPage: incoming.maxUnlockedPage || base.maxUnlockedPage,
                completedNodeKeys: Array.isArray(incoming.completedNodeKeys) ? incoming.completedNodeKeys : base.completedNodeKeys,
                mapTraversal: {
                  currentNodeByPage: incoming.mapTraversal?.currentNodeByPage || base.mapTraversal.currentNodeByPage,
                  visitedNodeKeysByPage: incoming.mapTraversal?.visitedNodeKeysByPage || base.mapTraversal.visitedNodeKeysByPage,
                  unlockedNodeKeysByPage: incoming.mapTraversal?.unlockedNodeKeysByPage || base.mapTraversal.unlockedNodeKeysByPage,
                },
                battleProgressByNode: incoming.battleProgressByNode || base.battleProgressByNode,
                storyState: {
                  completed: incoming.storyState?.completed || base.storyState.completed,
                  pendingVictoryPopup: incoming.storyState?.pendingVictoryPopup || base.storyState.pendingVictoryPopup,
                },
              };
            });

            setTopicProgressById(merged);
          } else {
            const legacyProgress = buildDefaultTopicProgressById();
            legacyProgress[DEFAULT_TOPIC_ID] = {
              currentPage: Math.max(d.currentPage || 1, 1),
              maxUnlockedPage: Math.max(d.maxUnlockedPage || 1, 1),
              completedNodeKeys: Array.isArray(d.completedNodeKeys) ? d.completedNodeKeys : [],
              mapTraversal: {
                currentNodeByPage: d.mapTraversal?.currentNodeByPage || {},
                visitedNodeKeysByPage: d.mapTraversal?.visitedNodeKeysByPage || {},
                unlockedNodeKeysByPage: d.mapTraversal?.unlockedNodeKeysByPage || {},
              },
              battleProgressByNode: {},
              storyState: { completed: false, pendingVictoryPopup: false },
            };
            setTopicProgressById(legacyProgress);
          }

          if (typeof d.selectedTopicId === "string" && topicsById[d.selectedTopicId]) {
            setSelectedTopicId(d.selectedTopicId);
          }

          if (d.selectedLanguage === "java" || d.selectedLanguage === "python") {
            setSelectedLanguage(d.selectedLanguage);
          }
        }
        setIsAuthHydrated(true);
      } else {
        setXp(0);
        setLevel(1);
        setSelectedTopicId(DEFAULT_TOPIC_ID);
        setTopicProgressById(buildDefaultTopicProgressById());
        setPlayerHp(100);
        setScene({ type: "dashboard", node: null });
        setIsAuthHydrated(false);
      }
    });
    return unsub;
  }, []);

  const saveProgress = async (data) => {
    if (!auth.currentUser) return;
    await setDoc(doc(db, "users", auth.currentUser.uid), data, { merge: true });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(NODE_DRAFTS_STORAGE_KEY, JSON.stringify(nodeDrafts));
  }, [nodeDrafts]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(SELECTED_TOPIC_STORAGE_KEY, selectedTopicId);
  }, [selectedTopicId]);

  useEffect(() => {
    if (!isAuthHydrated || !auth.currentUser) return;
    saveProgress({ topicProgressById, selectedTopicId });
  }, [topicProgressById, selectedTopicId, isAuthHydrated]);

  const selectedTopic = topicsById[selectedTopicId] || topicsById[DEFAULT_TOPIC_ID];
  const topicProgress = topicProgressById[selectedTopic.id] || buildDefaultTopicProgressById()[selectedTopic.id];
  const currentPage = topicProgress.currentPage;
  const maxUnlockedPage = topicProgress.maxUnlockedPage;
  const completedNodeKeys = topicProgress.completedNodeKeys;
  const mapTraversal = topicProgress.mapTraversal;
  const pageCount = selectedTopic.pages.length;

  const updateSelectedTopicProgress = (updater) => {
    setTopicProgressById((prev) => {
      const existing = prev[selectedTopic.id] || {
        currentPage: 1,
        maxUnlockedPage: 1,
        completedNodeKeys: [],
        mapTraversal: { currentNodeByPage: {}, visitedNodeKeysByPage: {}, unlockedNodeKeysByPage: {} },
        battleProgressByNode: {},
        storyState: { completed: false, pendingVictoryPopup: false },
      };
      return {
        ...prev,
        [selectedTopic.id]: updater(existing),
      };
    });
  };

  const completeNode = (node) => {
    if (!node?.key) return;

    const isAlreadyComplete = topicProgress.completedNodeKeys.includes(node.key);
    const page = selectedTopic.pages[node.pageId - 1];

    const nextCompletedKeys = isAlreadyComplete
      ? topicProgress.completedNodeKeys
      : [...topicProgress.completedNodeKeys, node.key];

    const newXp = xp + 50;
    const isPageComplete = page?.nodes?.every((pageNode) => nextCompletedKeys.includes(pageNode.key));
    const nextUnlockedPage = isPageComplete
      ? Math.min(Math.max(topicProgress.maxUnlockedPage, node.pageId + 1), pageCount)
      : Math.max(topicProgress.maxUnlockedPage, node.pageId);
    const nextPage = isPageComplete ? Math.min(node.pageId + 1, pageCount) : currentPage;

    if (!isAlreadyComplete) {
      setXp(newXp);
    }

    updateSelectedTopicProgress((existing) => ({
      ...existing,
      completedNodeKeys: nextCompletedKeys,
      maxUnlockedPage: nextUnlockedPage,
      currentPage: isPageComplete ? nextPage : existing.currentPage,
      storyState: node?.isFinalBoss
        ? { completed: true, pendingVictoryPopup: true }
        : existing.storyState || { completed: false, pendingVictoryPopup: false },
    }));

    saveProgress({
      xp: isAlreadyComplete ? xp : newXp,
      level,
      selectedTopicId: selectedTopic.id,
      selectedLanguage,
    });
  };

  const getBattleProgress = (nodeKey, totalQuestions) => {
    const solved = topicProgress.battleProgressByNode?.[nodeKey]?.solvedQuestionKeys || [];
    const safeTotal = Math.max(totalQuestions || 1, 1);
    const solvedCount = Math.min(solved.length, safeTotal);
    const hp = Math.max(0, Math.round(((safeTotal - solvedCount) / safeTotal) * 100));

    return {
      solvedQuestionKeys: solved,
      solvedCount,
      hp,
      defeated: solvedCount >= safeTotal,
    };
  };

  const recordQuestionVictory = (node, questionKey, totalQuestions) => {
    if (!node?.key || !questionKey) {
      return { alreadySolved: false, solvedCount: 0, hp: 100, nodeDefeated: false };
    }

    const existing = topicProgress.battleProgressByNode?.[node.key]?.solvedQuestionKeys || [];
    const solvedSet = new Set(existing);
    const alreadySolved = solvedSet.has(questionKey);

    if (!alreadySolved) solvedSet.add(questionKey);

    const safeTotal = Math.max(totalQuestions || 1, 1);
    const solvedCount = Math.min(solvedSet.size, safeTotal);
    const hp = Math.max(0, Math.round(((safeTotal - solvedCount) / safeTotal) * 100));
    const nodeDefeated = solvedCount >= safeTotal;

    updateSelectedTopicProgress((progress) => ({
      ...progress,
      battleProgressByNode: {
        ...(progress.battleProgressByNode || {}),
        [node.key]: {
          solvedQuestionKeys: Array.from(solvedSet),
        },
      },
    }));

    return { alreadySolved, solvedCount, hp, nodeDefeated };
  };

  const dismissTopicVictoryPopup = () => {
    updateSelectedTopicProgress((existing) => ({
      ...existing,
      storyState: {
        ...(existing.storyState || { completed: false, pendingVictoryPopup: false }),
        pendingVictoryPopup: false,
      },
    }));
  };

  const startNode = (node) => {
    setPlayerHp(100);
    if (node.type === "learn") setScene({ type: "dialogue", node });
    else if (node.type === "boss") setScene({ type: "boss", node });
    else setScene({ type: "battle", node });
  };

  const setMapNode = (pageId, nodeKey, edges = []) => {
    const pageKey = String(pageId);

    updateSelectedTopicProgress((existing) => {
      const traversal = existing.mapTraversal || { currentNodeByPage: {}, visitedNodeKeysByPage: {}, unlockedNodeKeysByPage: {} };
      const currentNodeByPage = { ...traversal.currentNodeByPage, [pageKey]: nodeKey };
      const existingVisited = new Set(traversal.visitedNodeKeysByPage[pageKey] || []);
      const existingUnlocked = new Set(traversal.unlockedNodeKeysByPage[pageKey] || []);

      existingVisited.add(nodeKey);
      existingUnlocked.add(nodeKey);

      edges
        .filter((edge) => edge.from === nodeKey)
        .forEach((edge) => existingUnlocked.add(edge.to));

      return {
        ...existing,
        mapTraversal: {
          currentNodeByPage,
          visitedNodeKeysByPage: {
            ...traversal.visitedNodeKeysByPage,
            [pageKey]: Array.from(existingVisited),
          },
          unlockedNodeKeysByPage: {
            ...traversal.unlockedNodeKeysByPage,
            [pageKey]: Array.from(existingUnlocked),
          },
        },
      };
    });
  };

  const updateNodeDraft = (nodeId, code) => {
    const draftKey = String(nodeId);

    setNodeDrafts((prev) => {
      if (prev[draftKey] === code) return prev;
      return { ...prev, [draftKey]: code };
    });
  };

  const setSelectedLanguageAndPersist = (language) => {
    setSelectedLanguage(language);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(SELECTED_LANGUAGE_STORAGE_KEY, language);
      } catch {
        // ignore storage errors
      }
    }
    if (auth.currentUser) {
      saveProgress({ selectedLanguage: language });
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const goToPage = (pageNumber) => {
    const safePage = Math.min(Math.max(pageNumber, 1), maxUnlockedPage);
    updateSelectedTopicProgress((existing) => ({
      ...existing,
      currentPage: safePage,
    }));
  };

  const selectTopic = (topicId) => {
    if (!topicsById[topicId]) return;
    setSelectedTopicId(topicId);
    setScene({ type: "map", node: null });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(SELECTED_TOPIC_STORAGE_KEY, topicId);
      } catch {
        // ignore storage errors
      }
    }
    if (auth.currentUser) {
      saveProgress({ selectedTopicId: topicId });
    }
  };

  const goToDashboard = () => setScene({ type: "dashboard", node: null });

  const currentPageData = selectedTopic.pages[currentPage - 1] || selectedTopic.pages[0];
  const completedCount = completedNodeKeys.length;
  const topicStoryState = topicProgress.storyState || { completed: false, pendingVictoryPopup: false };

  return (
    <GameContext.Provider value={{
      user, xp, level, playerHp, setPlayerHp,
      scene, setScene, startNode, completeNode,
      currentPage, setCurrentPage: goToPage, maxUnlockedPage, currentPageData,
      completedNodeKeys, completedCount,
      selectedLanguage, setSelectedLanguage: setSelectedLanguageAndPersist,
      mapTraversal, setMapNode,
      getBattleProgress,
      recordQuestionVictory,
      topicStoryState,
      dismissTopicVictoryPopup,
      topics,
      topicProgressById,
      selectedTopicId: selectedTopic.id,
      selectedTopic,
      selectTopic,
      goToDashboard,
      signOutUser,
      nodeDrafts, updateNodeDraft,
      pageCount,
    }}>
      {children}
    </GameContext.Provider>
  );
}
