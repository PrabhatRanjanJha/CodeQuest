import { curriculumPages as prefixSumPages } from "./curriculum.js";

const difficultyLadder = ["Easy", "Easy", "Easy-Medium", "Medium", "Medium", "Medium-Hard", "Hard", "Hard"];

const operationBank = [
  {
    title: "Array Sum",
    statement: "Return the sum of all values in nums.",
    explanation: "Iterate through nums once and accumulate total.",
    javaStarterCode: `static int solve(int[] nums) {
    // Return sum of nums
    return 0;
}`,
    pythonStarterCode: `def solve(nums):
    # Return sum of nums
    return 0`,
    cases: [[2, 4, 1], [5, -2, 3, 1], [0, 0, 7]],
    solver: (nums) => nums.reduce((sum, value) => sum + value, 0),
  },
  {
    title: "Range Spread",
    statement: "Return max(nums) - min(nums).",
    explanation: "Track minimum and maximum in one pass.",
    javaStarterCode: `static int solve(int[] nums) {
    // Return max(nums) - min(nums)
    return 0;
}`,
    pythonStarterCode: `def solve(nums):
    # Return max(nums) - min(nums)
    return 0`,
    cases: [[3, 7, 2, 9], [5, 5, 5], [-1, 4, 0]],
    solver: (nums) => Math.max(...nums) - Math.min(...nums),
  },
  {
    title: "Even Counter",
    statement: "Return how many values in nums are even.",
    explanation: "Count values where value % 2 equals 0.",
    javaStarterCode: `static int solve(int[] nums) {
    // Count even numbers
    return 0;
}`,
    pythonStarterCode: `def solve(nums):
    # Count even numbers
    return 0`,
    cases: [[1, 2, 4, 5, 6], [3, 3, 3], [8, 10]],
    solver: (nums) => nums.filter((value) => value % 2 === 0).length,
  },
  {
    title: "Distinct Count",
    statement: "Return number of distinct values in nums.",
    explanation: "Use a set-like structure to remove duplicates.",
    javaStarterCode: `static int solve(int[] nums) {
    // Count distinct numbers
    return 0;
}`,
    pythonStarterCode: `def solve(nums):
    # Count distinct numbers
    return 0`,
    cases: [[1, 1, 2, 3], [5, 5, 5], [2, 3, 2, 4, 4]],
    solver: (nums) => new Set(nums).size,
  },
  {
    title: "XOR Aggregate",
    statement: "Return bitwise XOR of all values in nums.",
    explanation: "XOR fold over the array from left to right.",
    javaStarterCode: `static int solve(int[] nums) {
    // Return XOR of all values
    return 0;
}`,
    pythonStarterCode: `def solve(nums):
    # Return XOR of all values
    return 0`,
    cases: [[5, 1, 2, 3], [4, 4, 4], [7, 8]],
    solver: (nums) => nums.reduce((acc, value) => acc ^ value, 0),
  },
  {
    title: "Sorted Flag",
    statement: "Return 1 if nums is non-decreasing, otherwise 0.",
    explanation: "If any nums[i] < nums[i-1], return 0.",
    javaStarterCode: `static int solve(int[] nums) {
    // Return 1 if non-decreasing else 0
    return 0;
}`,
    pythonStarterCode: `def solve(nums):
    # Return 1 if non-decreasing else 0
    return 0`,
    cases: [[1, 2, 2, 5], [3, 1, 2], [4, 4, 4]],
    solver: (nums) => {
      for (let index = 1; index < nums.length; index += 1) {
        if (nums[index] < nums[index - 1]) return 0;
      }
      return 1;
    },
  },
  {
    title: "Peak Index",
    statement: "Return index of first maximum value in nums.",
    explanation: "Track best value and earliest index.",
    javaStarterCode: `static int solve(int[] nums) {
    // Return first index of maximum value
    return 0;
}`,
    pythonStarterCode: `def solve(nums):
    # Return first index of maximum value
    return 0`,
    cases: [[1, 9, 3, 9], [5, 4, 3], [2, 2, 2]],
    solver: (nums) => {
      let bestIndex = 0;
      for (let index = 1; index < nums.length; index += 1) {
        if (nums[index] > nums[bestIndex]) bestIndex = index;
      }
      return bestIndex;
    },
  },
  {
    title: "Longest Non-Decreasing Streak",
    statement: "Return length of longest contiguous non-decreasing segment.",
    explanation: "Grow current streak while nums[i] >= nums[i-1].",
    javaStarterCode: `static int solve(int[] nums) {
    // Return longest non-decreasing contiguous streak length
    return 0;
}`,
    pythonStarterCode: `def solve(nums):
    # Return longest non-decreasing contiguous streak length
    return 0`,
    cases: [[1, 2, 2, 1, 3, 4], [5, 4, 3], [2, 2, 2, 2]],
    solver: (nums) => {
      if (!nums.length) return 0;
      let best = 1;
      let current = 1;
      for (let index = 1; index < nums.length; index += 1) {
        if (nums[index] >= nums[index - 1]) {
          current += 1;
        } else {
          current = 1;
        }
        if (current > best) best = current;
      }
      return best;
    },
  },
];

const topicBlueprints = [
  {
    id: "time-space-complexity",
    title: "TimeComplexity and SpaceComplexity",
    subtitle: "Reason about runtime and memory growth",
    subparts: [
      "Big-O basics",
      "Constant, linear, logarithmic",
      "Nested loop analysis",
      "Amortized reasoning",
      "Space complexity",
      "Recurrence intuition",
      "Trade-offs in design",
      "Complexity checkpoints",
    ],
  },
  {
    id: "oops",
    title: "OOPS",
    subtitle: "Build with classes, objects, and abstraction",
    subparts: [
      "Class and object essentials",
      "Encapsulation",
      "Inheritance",
      "Polymorphism",
      "Abstraction",
      "Composition over inheritance",
      "Interfaces and contracts",
      "Design practice",
    ],
  },
  {
    id: "prefix-sum",
    title: "Prefix Sum",
    subtitle: "Fast range and cumulative techniques",
    subparts: [],
  },
  {
    id: "carry-forward",
    title: "Carry Forward",
    subtitle: "Reuse previous computation smartly",
    subparts: [
      "Carry-forward mindset",
      "Prefix carry arrays",
      "Suffix carry arrays",
      "State transitions",
      "Directional scans",
      "Two-pass optimization",
      "Constraint-aware carry",
      "Pattern recognition",
    ],
  },
  {
    id: "contribution-technique",
    title: "Contribution Technique",
    subtitle: "Count element contribution without brute force",
    subparts: [
      "Contribution intuition",
      "Index-based contribution",
      "Min/max contribution",
      "Subarray contribution",
      "Boundary counting",
      "Combinatorics tie-in",
      "Contribution pitfalls",
      "Applied contribution",
    ],
  },
  {
    id: "sliding-window",
    title: "Sliding Window",
    subtitle: "Optimize contiguous segment problems",
    subparts: [
      "Fixed window basics",
      "Variable window pattern",
      "Window expansion/contraction",
      "Frequency-map windows",
      "Distinct constraints",
      "At-most vs exactly",
      "Window edge cases",
      "Hybrid windows",
    ],
  },
  {
    id: "string",
    title: "String",
    subtitle: "Core string processing patterns",
    subparts: [
      "Character handling",
      "Frequency and counting",
      "Two-pointer string scans",
      "Substring techniques",
      "Pattern matching",
      "Palindromic checks",
      "String hashing basics",
      "String optimization",
    ],
  },
  {
    id: "recursion",
    title: "Recursion",
    subtitle: "Solve by smaller self-similar problems",
    subparts: [
      "Base case and recurrence",
      "Call stack flow",
      "Tree recursion",
      "Backtracking basics",
      "Recursion to DP bridge",
      "Memoization intro",
      "Pruning strategies",
      "Recursive design",
    ],
  },
  {
    id: "sorting",
    title: "Sorting",
    subtitle: "Order data with efficient methods",
    subparts: [
      "Comparison sorting",
      "Bubble and insertion",
      "Merge sort",
      "Quick sort",
      "Counting-based sorting",
      "Stability and in-place",
      "Sorting for problem solving",
      "Sorting complexity review",
    ],
  },
  {
    id: "two-pointers",
    title: "Two Pointers",
    subtitle: "Use dual-index scans for linear solutions",
    subparts: [
      "Opposite-direction pointers",
      "Same-direction pointers",
      "Pair-sum pattern",
      "Dedup and compression",
      "Partitioning tricks",
      "Pointer invariants",
      "Sorted data leverage",
      "Pointer hybrids",
    ],
  },
  {
    id: "bit-manipulation",
    title: "Bit Manipulation",
    subtitle: "Use binary operations for speed",
    subparts: [
      "Bitwise operators",
      "Set/clear/toggle bit",
      "Masks and checks",
      "XOR patterns",
      "Power of two tricks",
      "Bit counting",
      "Subset bitmasks",
      "Bit problem patterns",
    ],
  },
  {
    id: "binary-search",
    title: "Binary Search",
    subtitle: "Logarithmic search on ordered spaces",
    subparts: [
      "Classic binary search",
      "Lower/upper bounds",
      "Answer-space search",
      "Predicate monotonicity",
      "Binary search on arrays",
      "Binary search on values",
      "Edge-case handling",
      "Search strategy review",
    ],
  },
  {
    id: "hashing",
    title: "Hashing",
    subtitle: "Use hash maps/sets for near O(1) lookups",
    subparts: [
      "Hash map basics",
      "Counting and frequency",
      "Presence checks",
      "Prefix + hash map",
      "Collision intuition",
      "Custom key usage",
      "Space-time tradeoffs",
      "Hashing patterns",
    ],
  },
  {
    id: "linked-list",
    title: "LinkedList",
    subtitle: "Pointer-based sequential data structures",
    subparts: [
      "Node fundamentals",
      "Insertion and deletion",
      "Traversal patterns",
      "Reverse list",
      "Fast and slow pointers",
      "Cycle detection",
      "Merging lists",
      "Linked-list drills",
    ],
  },
  {
    id: "stacks",
    title: "Stacks",
    subtitle: "LIFO logic for nested and monotonic patterns",
    subparts: [
      "Stack operations",
      "Balanced symbols",
      "Monotonic stacks",
      "Next greater element",
      "Expression parsing",
      "Stack simulation",
      "Optimization with stack",
      "Stack pattern review",
    ],
  },
  {
    id: "queue",
    title: "Queue",
    subtitle: "FIFO processing and scheduling flows",
    subparts: [
      "Queue operations",
      "Circular queue",
      "Deque patterns",
      "BFS queue usage",
      "Window queue tricks",
      "Priority queue intro",
      "Producer-consumer model",
      "Queue design review",
    ],
  },
  {
    id: "binary-tree",
    title: "Binary Tree",
    subtitle: "Hierarchical traversal and divide-conquer",
    subparts: [
      "Tree anatomy",
      "DFS traversals",
      "BFS traversal",
      "Height and depth",
      "Path-based questions",
      "Balanced tree checks",
      "BST basics",
      "Tree problem synthesis",
    ],
  },
];

const topicContentProfiles = {
  "time-space-complexity": {
    intro: "Learn how to measure the cost of an algorithm before you write it.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to judge how ${topicTitle.toLowerCase()} scales as inputs grow. Focus on what gets slower first, what memory grows, and where a better trade-off might exist.`,
    bullets: [
      "Name the operation that repeats the most.",
      "Compare the fastest and slowest growth patterns.",
      "Spot whether extra memory buys you better speed.",
    ],
    example: (subpart) => `Example for ${subpart}:\nInput size doubles -> does the work double, grow by a small constant, or explode into nested repeated scans?\nUse that answer to label the complexity.`,
  },
  oops: {
    intro: "Learn how objects, responsibilities, and reusable design blocks work together.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to structure ${topicTitle.toLowerCase()} code so each object does one clear job and the design stays easy to extend.`,
    bullets: [
      "Identify the object and its job.",
      "Keep state private unless it must be shared.",
      "Choose a design that can grow without breaking callers.",
    ],
    example: (subpart) => `Example for ${subpart}:\nclass Account {\n  balance\n  deposit()\n  withdraw()\n}\nThe methods protect the balance and keep the behavior inside the object.`,
  },
  "carry-forward": {
    intro: "Learn how to reuse previously computed state instead of starting over.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to carry useful state across ${topicTitle.toLowerCase()} scans so each step builds on what you already know.`,
    bullets: [
      "Track the state that survives to the next position.",
      "Update the carried value only when the rule changes.",
      "Use one direction or two passes when that reduces work.",
    ],
    example: (subpart) => `Example for ${subpart}:\nscan left to right\nkeep the best value seen so far\ncarry it to the next index instead of recomputing from scratch`,
  },
  "contribution-technique": {
    intro: "Learn how to count each element’s influence without brute force.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to measure how each element contributes to the final answer in ${topicTitle.toLowerCase()} problems.`,
    bullets: [
      "Find the span where one element matters.",
      "Multiply the number of valid left and right choices.",
      "Use contribution counting instead of enumerating all subarrays.",
    ],
    example: (subpart) => `Example for ${subpart}:\nif a value is the minimum for 3 left choices and 4 right choices, then it contributes to 12 subarrays.`,
  },
  "sliding-window": {
    intro: "Learn how to keep a valid window moving across the array or string.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to keep a ${topicTitle.toLowerCase()} window valid while expanding and shrinking only when needed.`,
    bullets: [
      "Know the condition that makes the window valid.",
      "Expand to include new data, shrink to restore validity.",
      "Count or optimize only while the window stays legal.",
    ],
    example: (subpart) => `Example for ${subpart}:\nmove right pointer to add values\nmove left pointer when the window breaks the rule\nrecord the best window during the process`,
  },
  string: {
    intro: "Learn how to process text by reading characters and substrings carefully.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to handle ${topicTitle.toLowerCase()} problems with character counts, boundaries, and repeated patterns.`,
    bullets: [
      "Decide whether you need per-character or per-substring logic.",
      "Use frequencies when repeated characters matter.",
      "Watch for palindromes, separators, and matching windows.",
    ],
    example: (subpart) => `Example for ${subpart}:\ntext = "abca"\ncheck each character once\nupdate a count map or compare mirrored positions`,
  },
  recursion: {
    intro: "Learn how a problem can call itself on smaller pieces.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to break ${topicTitle.toLowerCase()} into a base case and a smaller recursive step.`,
    bullets: [
      "Write the smallest case that stops recursion.",
      "Describe the smaller subproblem clearly.",
      "Understand what the call stack is storing for you.",
    ],
    example: (subpart) => `Example for ${subpart}:\nsolve(n) -> solve(n - 1) + work for n\nBase case stops when n is small enough`,
  },
  sorting: {
    intro: "Learn how ordering data can simplify later logic.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to order ${topicTitle.toLowerCase()} data so comparisons, grouping, or greedy choices become easier.`,
    bullets: [
      "Decide why sorting helps this problem.",
      "Compare stable vs in-place behavior.",
      "Check if you only need partial ordering rather than full sorting.",
    ],
    example: (subpart) => `Example for ${subpart}:\nunsorted scores -> sort once\nthen scan adjacent values or group equal values more easily`,
  },
  "two-pointers": {
    intro: "Learn how two indices can cooperate to scan efficiently.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to let two indices work together across ${topicTitle.toLowerCase()} data without rescanning every pair.`,
    bullets: [
      "Give each pointer a separate job.",
      "Move the pointer that fixes the current condition.",
      "Exploit sorted order when it gives a clean rule.",
    ],
    example: (subpart) => `Example for ${subpart}:\nleft pointer starts at the beginning\nright pointer starts at the end\nmove the side that brings the pair closer to the target`,
  },
  "bit-manipulation": {
    intro: "Learn how binary bits can store and reveal information quickly.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to inspect, modify, or combine ${topicTitle.toLowerCase()} values at the bit level.`,
    bullets: [
      "Know what each bitwise operator does.",
      "Use masks to isolate or flip selected bits.",
      "Remember XOR tricks for toggling and pairing.",
    ],
    example: (subpart) => `Example for ${subpart}:\nvalue = 13 (1101)\nmask = 4 (0100)\napply the bit rule and read the result in binary`,
  },
  "binary-search": {
    intro: "Learn how to discard half the search space at each step.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to search ${topicTitle.toLowerCase()} space by keeping only the half that can still contain the answer.`,
    bullets: [
      "Keep an invariant about where the answer can live.",
      "Move left or right based on the predicate.",
      "Be careful with boundaries, especially duplicates.",
    ],
    example: (subpart) => `Example for ${subpart}:\nlow = 0, high = n - 1\ncompare middle value to target\ncut the search space in half each time`,
  },
  hashing: {
    intro: "Learn how a map or set can turn a repeated scan into a fast lookup.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to store previously seen ${topicTitle.toLowerCase()} information so lookups stay close to O(1).`,
    bullets: [
      "Decide what key the map must remember.",
      "Use counts when repeats matter and a set when presence is enough.",
      "Watch for collisions only if the problem asks about implementation details.",
    ],
    example: (subpart) => `Example for ${subpart}:\nseen = {}\nfor each value:\n  if value already exists, use it immediately\n  otherwise store it for later`,
  },
  "linked-list": {
    intro: "Learn how node links change the way you traverse and modify data.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to work with ${topicTitle.toLowerCase()} nodes one pointer at a time.`,
    bullets: [
      "Track the current node and the next node carefully.",
      "Rewire links in the right order.",
      "Use slow and fast pointers when cycle or middle detection matters.",
    ],
    example: (subpart) => `Example for ${subpart}:\ncurrent -> next -> next\nchange one link at a time so you do not lose the rest of the chain`,
  },
  stacks: {
    intro: "Learn how last-in, first-out behavior helps with nesting and matching.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to manage ${topicTitle.toLowerCase()} problems where the most recent item must be handled first.`,
    bullets: [
      "Push when you need to remember something recent.",
      "Pop when the current item resolves the last one.",
      "Use monotonic order when next-greater style logic appears.",
    ],
    example: (subpart) => `Example for ${subpart}:\nopen bracket -> push\nmatching close bracket -> pop\nstack empty at the end means the expression is balanced`,
  },
  queue: {
    intro: "Learn how first-in, first-out order helps with processing and scheduling.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to process ${topicTitle.toLowerCase()} items in the order they arrive or in the order the problem demands.`,
    bullets: [
      "Enqueue new items at the back.",
      "Dequeue the oldest item first.",
      "Use deque or priority rules when the plain queue is not enough.",
    ],
    example: (subpart) => `Example for ${subpart}:\narrivals -> [A, B, C]\nprocess A first, then B, then C`,
  },
  "binary-tree": {
    intro: "Learn how branching structure changes traversal and search.",
    summary: (subpart, topicTitle) => `Use ${subpart.toLowerCase()} to explore ${topicTitle.toLowerCase()} nodes through recursive structure, layered traversal, and path reasoning.`,
    bullets: [
      "Know what left and right subtrees represent.",
      "Choose DFS or BFS based on the question.",
      "Track height, depth, and path information carefully.",
    ],
    example: (subpart) => `Example for ${subpart}:\nvisit left subtree\nvisit current node\nvisit right subtree\nThis pattern changes depending on the traversal order.`,
  },
};

const getTopicProfile = (topicId, topicTitle) => topicContentProfiles[topicId] || {
  intro: `Learn the core pattern behind ${topicTitle}.`,
  summary: (subpart) => `Use ${subpart.toLowerCase()} as a reusable pattern in ${topicTitle.toLowerCase()}.`,
  bullets: [
    "Understand the shape of the problem.",
    "Choose the state or data structure you need to remember.",
    "Verify one normal case and one edge case.",
  ],
  example: (subpart) => `Example for ${subpart}:\nwrite a tiny walkthrough, then apply the same idea on the full input.`,
};

const topicBattleProfiles = {
  "time-space-complexity": {
    labels: ["Complexity Check", "Cost Tradeoff", "Big-O Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} changes runtime or memory cost`,
  },
  oops: {
    labels: ["Object Flow", "Encapsulation Test", "Design Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} keeps responsibility inside the object`,
  },
  "carry-forward": {
    labels: ["Carry Check", "State Flow", "Two-Pass Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} reuses earlier state instead of restarting`,
  },
  "contribution-technique": {
    labels: ["Span Count", "Contribution Count", "Boundary Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} counts each element’s contribution`,
  },
  "sliding-window": {
    labels: ["Window Start", "Window Shift", "Window Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} expands and shrinks a valid window`,
  },
  string: {
    labels: ["String Scan", "Pattern Match", "Text Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} handles characters, substrings, or repeated patterns`,
  },
  recursion: {
    labels: ["Base Case", "Recursive Step", "Call Stack Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} reduces the problem into smaller calls`,
  },
  sorting: {
    labels: ["Order Check", "Sort Pass", "Sorting Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} uses ordering to simplify later work`,
  },
  "two-pointers": {
    labels: ["Left Pointer", "Right Pointer", "Pointer Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} uses two indices to avoid rescanning`,
  },
  "bit-manipulation": {
    labels: ["Bit Check", "Mask Shift", "Binary Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} uses binary rules and masks`,
  },
  "binary-search": {
    labels: ["Search Half", "Boundary Find", "Log Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} cuts the search space in half`,
  },
  hashing: {
    labels: ["Map Start", "Lookup Burst", "Hash Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} stores what was seen before`,
  },
  "linked-list": {
    labels: ["Node Link", "Pointer Jump", "List Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} moves through nodes one link at a time`,
  },
  stacks: {
    labels: ["Push Start", "Pop Shift", "Stack Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} uses last-in, first-out behavior`,
  },
  queue: {
    labels: ["Enqueue Start", "Dequeue Shift", "Queue Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} uses first-in, first-out behavior`,
  },
  "binary-tree": {
    labels: ["Tree Entry", "Traversal Move", "Tree Boss"],
    focus: (subpart) => `think about how ${subpart.toLowerCase()} explores branching nodes and paths`,
  },
};

const getBattleProfile = (topicId, topicTitle) => topicBattleProfiles[topicId] || {
  labels: ["Warmup", "Application", "Challenge"],
  focus: (subpart) => `think about how ${subpart.toLowerCase()} applies inside ${topicTitle.toLowerCase()}`,
};

const buildStorylineForTopic = (topicId, topicTitle, subparts) => {
  const profile = getTopicProfile(topicId, topicTitle);
  const chapterBeats = [
    (subpart, title) => `Start with ${subpart}. Focus on the core idea in ${title} and solve one clean warm-up problem.`,
    (subpart, title) => `Now apply ${subpart} on slightly messier ${title.toLowerCase()} inputs where edge cases start to matter.`,
    (subpart, title) => `Use ${subpart} under time pressure: same pattern, tighter constraints, fewer mistakes allowed.`,
    (subpart, title) => `This chapter mixes ${subpart} with previous ideas so your solution strategy has to stay consistent.`,
  ];
  const chapters = subparts.map((subpart, index) => ({
    pageId: index + 1,
    title: `Chapter ${index + 1}: ${subpart}`,
    beat: chapterBeats[index % chapterBeats.length](subpart, topicTitle),
  }));

  return {
    intro: `${profile.intro} Finish all chapters in ${topicTitle} and close with a final challenge that combines what you practiced.`,
    bossName: `${topicTitle} Overlord`,
    outro: `${topicTitle} is complete. Pick your next topic and keep building consistency across different problem patterns.`,
    chapters,
  };
};

const toJavaArray = (nums) => `{${nums.join(", ")}}`;
const toPyArray = (nums) => JSON.stringify(nums);
const expectedToString = (value) => String(value);

const createChallengeFromOperation = (operation, pageId, cases, difficulty) => {
  const buildHarness = (language, nums) => {
    if (language === "java") {
      return `public static void main(String[] args) {\n    int result = solve(new int[]${toJavaArray(nums)});\n    System.out.println(result);\n}`;
    }

    return `if __name__ == "__main__":\n    print(solve(${toPyArray(nums)}))`;
  };

  const javaTestCases = cases.map((nums) => ({
    harness: buildHarness("java", nums),
    expected: expectedToString(operation.solver(nums)),
  }));

  const pythonTestCases = cases.map((nums) => ({
    harness: buildHarness("python", nums),
    expected: expectedToString(operation.solver(nums)),
  }));

  return {
    mission: {
      statement: operation.statement,
      exampleInput: `nums = ${JSON.stringify(cases[0])}`,
      exampleOutput: expectedToString(operation.solver(cases[0])),
      exampleExplanation: operation.explanation,
    },
    difficulty,
    challenge: {
      java: {
        starterCode: operation.javaStarterCode,
        harness: javaTestCases[0].harness,
        expected: javaTestCases[0].expected,
        testCases: javaTestCases,
      },
      python: {
        starterCode: operation.pythonStarterCode,
        harness: pythonTestCases[0].harness,
        expected: pythonTestCases[0].expected,
        testCases: pythonTestCases,
      },
    },
  };
};

const buildPracticeQuestions = (topicId, topicTitle, subpart, pageIndex) => {
  const battleProfile = getBattleProfile(topicId, topicTitle);
  const topicSeed = Array.from(topicId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const easy = operationBank[(topicSeed + pageIndex * 2) % operationBank.length];
  const medium = operationBank[(topicSeed + pageIndex * 2 + 3) % operationBank.length];
  const hard = operationBank[(topicSeed + pageIndex * 2 + 5) % operationBank.length];

  const easyChallenge = createChallengeFromOperation(easy, pageIndex + 1, easy.cases, "Easy");
  const mediumChallenge = createChallengeFromOperation(medium, pageIndex + 1, medium.cases, "Medium");
  const hardChallenge = createChallengeFromOperation(hard, pageIndex + 1, hard.cases, "Hard");

  const enrichExplanation = (mission, operationName) => {
    const chapterName = subpart.toLowerCase();
    return `${mission.exampleExplanation} Keep the solution simple, then verify one edge case. In this chapter, ${operationName.toLowerCase()} is used to reinforce ${chapterName}.`;
  };

  return [
    {
      key: `${topicTitle}-q${pageIndex + 1}-1`,
      title: `${subpart} · ${battleProfile.labels[0]}`,
      mission: {
        ...easyChallenge.mission,
        statement: `${topicTitle} · ${subpart}: ${battleProfile.focus(subpart)}. ${easyChallenge.mission.statement}`,
        exampleExplanation: `${enrichExplanation(easyChallenge.mission, easy.title)} Start with correctness before optimizing.`,
      },
      challenge: easyChallenge.challenge,
      difficulty: "Easy",
    },
    {
      key: `${topicTitle}-q${pageIndex + 1}-2`,
      title: `${subpart} · ${battleProfile.labels[1]}`,
      mission: {
        ...mediumChallenge.mission,
        statement: `${topicTitle} · ${subpart}: ${battleProfile.focus(subpart)} with a slightly trickier case. ${mediumChallenge.mission.statement}`,
        exampleExplanation: `${enrichExplanation(mediumChallenge.mission, medium.title)} Handle repeated values and boundaries carefully.`,
      },
      challenge: mediumChallenge.challenge,
      difficulty: "Medium",
    },
    {
      key: `${topicTitle}-q${pageIndex + 1}-3`,
      title: `${subpart} · ${battleProfile.labels[2]}`,
      mission: {
        ...hardChallenge.mission,
        statement: `${topicTitle} · ${subpart}: ${battleProfile.focus(subpart)} under harder constraints. ${hardChallenge.mission.statement}`,
        exampleExplanation: `${enrichExplanation(hardChallenge.mission, hard.title)} Aim for a solution that still reads clearly.`,
      },
      challenge: hardChallenge.challenge,
      difficulty: "Hard",
    },
  ];
};

const buildTopicPages = (topicId, topicTitle, subparts, storyline) => {
  const profile = getTopicProfile(topicId, topicTitle);

  return subparts.map((subpart, index) => {
    const pageId = index + 1;
    const chapter = storyline.chapters[index];
    const isFinalBossPage = pageId === subparts.length;
    const practiceQuestions = buildPracticeQuestions(topicId, topicTitle, subpart, index);
    const firstQuestion = practiceQuestions[0];

    return {
      id: pageId,
      title: subpart,
      subtitle: chapter?.beat || `${topicTitle} · Stage ${pageId}`,
      storyBeat: chapter?.beat,
      nodes: [
        {
          key: `${topicId}-p${pageId}-n1`,
          pageId,
          slot: 1,
          type: "learn",
          title: `Core: ${subpart}`,
          label: "L1",
          lesson: {
            title: `Core: ${subpart}`,
            summary: chapter?.beat || profile.summary(subpart, topicTitle),
            bullets: profile.bullets,
            exampleTitle: "Starter Insight",
            exampleCode: profile.example(subpart),
          },
        },
        {
          key: `${topicId}-p${pageId}-n2`,
          pageId,
          slot: 2,
          type: "learn",
          title: `Applied: ${subpart}`,
          label: "L2",
          lesson: {
            title: `Applied: ${subpart}`,
            summary: `Apply ${subpart} to realistic ${topicTitle.toLowerCase()} tasks: read constraints first, pick the right structure, and protect your invariant from edge cases.`,
            bullets: [
              `Translate ${subpart.toLowerCase()} into a clear solving rule.`,
              "Track the invariant that must stay true after each step.",
              "Check boundaries, empty input, and repeated values.",
            ],
            exampleTitle: "Strategy Notes",
            exampleCode: `Worked example for ${subpart}:\n1) Read a tiny sample input first\n2) Decide the state that must be remembered\n3) Update it one step at a time\n4) Test a normal case and one edge case`,
          },
        },
        {
          key: `${topicId}-p${pageId}-n3`,
          pageId,
          slot: 3,
          type: isFinalBossPage ? "boss" : "battle",
          title: isFinalBossPage ? `${storyline.bossName} Final Battle` : `${subpart} Challenge`,
          label: "Q3",
          difficulty: difficultyLadder[index] || "Medium",
          isFinalBoss: isFinalBossPage,
          storyOutro: isFinalBossPage ? storyline.outro : undefined,
          mission: firstQuestion.mission,
          challenge: firstQuestion.challenge,
          practiceQuestions,
        },
      ],
    };
  });
};

const cloneAndScopePages = (topicId, pages, storyline) =>
  pages.map((page) => ({
    ...page,
    subtitle: storyline.chapters[page.id - 1]?.beat || page.subtitle,
    storyBeat: storyline.chapters[page.id - 1]?.beat,
    nodes: (page.nodes || []).map((node) => ({
      ...node,
      key: `${topicId}-${node.key}`,
      type: page.id === pages.length && (node.type === "battle" || node.type === "boss") ? "boss" : node.type,
      isFinalBoss: page.id === pages.length && (node.type === "battle" || node.type === "boss"),
      title: page.id === pages.length && (node.type === "battle" || node.type === "boss")
        ? `${storyline.bossName} Final Battle`
        : node.title,
      storyOutro: page.id === pages.length && (node.type === "battle" || node.type === "boss")
        ? storyline.outro
        : node.storyOutro,
      practiceQuestions: node.practiceQuestions
        ? node.practiceQuestions.map((question) => ({
            ...question,
            key: `${topicId}-${question.key}`,
          }))
        : node.practiceQuestions,
    })),
  }));

const topics = topicBlueprints.map((topic) => {
  const storyline = buildStorylineForTopic(topic.id, topic.title, topic.subparts.length ? topic.subparts : prefixSumPages.map((p) => p.title));

  if (topic.id === "prefix-sum") {
    return {
      ...topic,
      storyline,
      pages: cloneAndScopePages(topic.id, prefixSumPages, storyline),
    };
  }

  return {
    ...topic,
    storyline,
    pages: buildTopicPages(topic.id, topic.title, topic.subparts, storyline),
  };
});

const topicsById = Object.fromEntries(topics.map((topic) => [topic.id, topic]));

export { topics, topicsById };
export default topics;
