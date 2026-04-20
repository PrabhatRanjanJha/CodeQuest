const PAGE_LAYOUTS = [
  [
    { x: "12%", y: "52%" },
    { x: "24%", y: "28%" },
    { x: "30%", y: "64%" },
    { x: "46%", y: "34%" },
    { x: "56%", y: "68%" },
    { x: "76%", y: "44%" },
    { x: "90%", y: "70%" },
  ],
  [
    { x: "12%", y: "20%" },
    { x: "24%", y: "42%" },
    { x: "32%", y: "76%" },
    { x: "50%", y: "30%" },
    { x: "58%", y: "56%" },
    { x: "76%", y: "28%" },
    { x: "90%", y: "54%" },
  ],
  [
    { x: "12%", y: "70%" },
    { x: "24%", y: "46%" },
    { x: "30%", y: "20%" },
    { x: "48%", y: "60%" },
    { x: "56%", y: "34%" },
    { x: "76%", y: "60%" },
    { x: "90%", y: "28%" },
  ],
  [
    { x: "12%", y: "58%" },
    { x: "24%", y: "78%" },
    { x: "30%", y: "34%" },
    { x: "48%", y: "18%" },
    { x: "58%", y: "48%" },
    { x: "76%", y: "22%" },
    { x: "90%", y: "60%" },
  ],
  [
    { x: "12%", y: "36%" },
    { x: "24%", y: "62%" },
    { x: "32%", y: "22%" },
    { x: "48%", y: "66%" },
    { x: "58%", y: "36%" },
    { x: "76%", y: "54%" },
    { x: "90%", y: "24%" },
  ],
  [
    { x: "12%", y: "74%" },
    { x: "24%", y: "54%" },
    { x: "32%", y: "28%" },
    { x: "48%", y: "54%" },
    { x: "58%", y: "26%" },
    { x: "76%", y: "38%" },
    { x: "90%", y: "72%" },
  ],
  [
    { x: "12%", y: "30%" },
    { x: "24%", y: "54%" },
    { x: "32%", y: "82%" },
    { x: "48%", y: "38%" },
    { x: "58%", y: "62%" },
    { x: "76%", y: "34%" },
    { x: "90%", y: "52%" },
  ],
  [
    { x: "12%", y: "60%" },
    { x: "24%", y: "26%" },
    { x: "32%", y: "52%" },
    { x: "48%", y: "20%" },
    { x: "58%", y: "74%" },
    { x: "76%", y: "44%" },
    { x: "90%", y: "18%" },
  ],
];

const normalizePagePositions = (pageId) => PAGE_LAYOUTS[(pageId - 1) % PAGE_LAYOUTS.length] || PAGE_LAYOUTS[0];

const connect = (from, to) => ({ from, to });

export function buildPageGraph(page) {
  const layout = normalizePagePositions(page.id);
  const missionNodes = page.nodes || [];

  const [learnA, learnB, battle] = missionNodes;
  const startKey = `page-${page.id}-start`;
  const branchKey = `page-${page.id}-branch`;
  const midKey = `page-${page.id}-mid`;
  const sideKey = `page-${page.id}-side`;
  const goalKey = `page-${page.id}-goal`;

  const battleProfile = battle?.challenge?.java || battle?.challenge?.python || {};
  const enemyName =
    battle?.title ||
    battleProfile.enemyName ||
    "Space Sentinel";

  const graphNodes = [
    {
      key: startKey,
      pageId: page.id,
      type: "dummy",
      label: "START",
      title: page.title,
      position: layout[0],
      metadata: { role: "hub", reward: "Navigation unlocked" },
    },
    {
      key: branchKey,
      pageId: page.id,
      type: "dummy",
      label: "•",
      title: "Nebula Gate",
      position: layout[1],
      metadata: { role: "branch", reward: "Stardust" },
    },
    {
      ...learnA,
      position: layout[2],
      metadata: {
        ...(learnA?.lesson ? { lesson: learnA.lesson } : {}),
        role: "learn",
        reward: "Intel Fragment",
      },
    },
    {
      key: sideKey,
      pageId: page.id,
      type: "dummy",
      label: "•",
      title: "Orbital Link",
      position: layout[3],
      metadata: { role: "link", reward: "Fuel Cell" },
    },
    {
      ...learnB,
      position: layout[4],
      metadata: {
        ...(learnB?.lesson ? { lesson: learnB.lesson } : {}),
        role: "learn",
        reward: "Intel Fragment",
      },
    },
    {
      ...battle,
      position: layout[5],
      metadata: {
        ...(battle?.mission ? { mission: battle.mission } : {}),
        role: "battle",
        enemyName,
        enemyPower: 800 + page.id * 220,
        practiceCount: battle?.practiceQuestions?.length || 1,
        reward: "Core Energy",
        difficulty: battle?.difficulty || "Challenge",
      },
    },
    {
      key: goalKey,
      pageId: page.id,
      type: "dummy",
      label: "END",
      title: "Forward Relay",
      position: layout[6],
      metadata: { role: "goal", reward: "Page unlocked" },
    },
  ];

  const graphEdges = [
    connect(startKey, branchKey),
    connect(branchKey, learnA.key),
    connect(learnA.key, sideKey),
    connect(sideKey, learnB.key),
    connect(learnB.key, battle.key),
    connect(battle.key, goalKey),
  ];

  return {
    pageId: page.id,
    startNodeKey: startKey,
    goalNodeKey: goalKey,
    nodes: graphNodes,
    edges: graphEdges,
  };
}

export default buildPageGraph;
