const TOTAL_PAGES = 8;

const nodeSlots = [
  { x: "20%", y: "74%" },
  { x: "48%", y: "48%" },
  { x: "78%", y: "24%" },
];

const PRACTICE_CASES_BY_PAGE = {
  1: [
    { nums: [1, 2, 3, 4], expected: [1, 3, 6, 10] },
    { nums: [5, 1, 2], expected: [5, 6, 8] },
    { nums: [3, 3, 3, 3], expected: [3, 6, 9, 12] },
    { nums: [10, -2, 4], expected: [10, 8, 12] },
  ],
  2: [
    { nums: [2, 1, 3, 5, 4], left: 1, right: 3, expected: 9 },
    { nums: [7, 2, 5, 1], left: 0, right: 2, expected: 14 },
    { nums: [4, 4, 4, 4], left: 2, right: 3, expected: 8 },
    { nums: [9, -1, 2, 6], left: 1, right: 3, expected: 7 },
  ],
  3: [
    { nums: [3, 1, 4, 1, 5, 9], queries: [[0, 2], [2, 5], [1, 4]], expected: [8, 19, 11] },
    { nums: [2, 7, 1, 8], queries: [[0, 0], [1, 3], [2, 2]], expected: [2, 16, 1] },
    { nums: [5, 5, 5], queries: [[0, 2], [1, 1]], expected: [15, 5] },
    { nums: [1, 2, 3, 4, 5], queries: [[0, 4], [3, 4], [2, 2]], expected: [15, 9, 3] },
  ],
  4: [
    { nums: [1, 1, 1], k: 2, expected: 2 },
    { nums: [1, 2, 3], k: 3, expected: 2 },
    { nums: [3, 4, 7, 2, -3, 1, 4, 2], k: 7, expected: 4 },
    { nums: [1, -1, 0], k: 0, expected: 3 },
  ],
  5: [
    { nums: [1, -1, 5, -2, 3], k: 3, expected: 4 },
    { nums: [-2, -1, 2, 1], k: 1, expected: 2 },
    { nums: [2, 3, 1, 1, 1, 1], k: 5, expected: 3 },
    { nums: [1, 2, 3], k: 6, expected: 3 },
  ],
  6: [
    { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], r1: 0, c1: 1, r2: 2, c2: 2, expected: 33 },
    { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], r1: 1, c1: 0, r2: 2, c2: 1, expected: 24 },
    { matrix: [[5, 1], [2, 3]], r1: 0, c1: 0, r2: 1, c2: 1, expected: 11 },
    { matrix: [[3, 0, 1, 4], [5, 6, 3, 2], [1, 2, 0, 1]], r1: 0, c1: 1, r2: 2, c2: 2, expected: 12 },
  ],
  7: [
    { matrix: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], target: 0, expected: 4 },
    { matrix: [[1, -1], [-1, 1]], target: 0, expected: 5 },
    { matrix: [[1, 2], [3, 4]], target: 3, expected: 2 },
  ],
  8: [
    { matrix: [[1, 0, 1], [0, -2, 3]], k: 2, expected: 2 },
    { matrix: [[2, 2, -1]], k: 3, expected: 3 },
    { matrix: [[2, 2], [-1, 4]], k: 4, expected: 4 },
  ],
};

const QUESTION_PROMPTS_BY_PAGE = {
  1: [
    {
      title: "Build Prefix Array",
      statement: "Return prefix[i] as the sum of nums[0..i].",
      explanation: "Maintain a running sum and write it at every index.",
    },
    {
      title: "Cumulative Scores",
      statement: "Given game scores per round, return cumulative scores up to each round.",
      explanation: "Each output index must include all earlier rounds including current.",
    },
    {
      title: "Running Ledger",
      statement: "Given daily profit/loss entries, output the running account balance list.",
      explanation: "Add each day to previous balance and append to result.",
    },
    {
      title: "Signal Accumulator",
      statement: "Convert the signal stream into a running total array.",
      explanation: "This is equivalent to a classic 1D prefix sum build.",
    },
  ],
  2: [
    {
      title: "Single Range Sum",
      statement: "Return sum(nums[left..right]) for one inclusive query.",
      explanation: "Use a prefix strategy so the query can be answered with subtraction.",
    },
    {
      title: "Invoice Window Total",
      statement: "Compute the total invoice amount between indices left and right inclusive.",
      explanation: "Avoid looping entire window repeatedly in concept.",
    },
    {
      title: "Segment Energy",
      statement: "Given energy readings, return the total energy in the requested segment.",
      explanation: "Treat boundaries carefully; inclusive endpoints are required.",
    },
    {
      title: "Subarray Bill",
      statement: "Find the billed sum between two range boundaries.",
      explanation: "This is the same range-sum query pattern with prefix sums.",
    },
  ],
  3: [
    {
      title: "Batch Range Queries",
      statement: "For each [l, r] query, return its range sum in order.",
      explanation: "Build once, answer many queries efficiently.",
    },
    {
      title: "Analytics Query Pack",
      statement: "Given many window requests, return all window totals.",
      explanation: "Each request is independent but uses the same prefix table.",
    },
    {
      title: "Bulk Segment Sums",
      statement: "Return sum results for all requested segments.",
      explanation: "Output order must match incoming query order.",
    },
    {
      title: "Report Query Engine",
      statement: "Implement a mini query engine for repeated inclusive range sums.",
      explanation: "Use O(n) preprocessing and O(1) per query logic.",
    },
  ],
  4: [
    {
      title: "Count Subarrays = k",
      statement: "Return how many continuous subarrays sum exactly to k.",
      explanation: "Use prefix sums with frequency counting.",
    },
    {
      title: "Target Streak Counter",
      statement: "Count all contiguous streaks whose total equals k.",
      explanation: "Map of seen prefix values is the key optimization.",
    },
    {
      title: "Exact Revenue Windows",
      statement: "Count windows with exact total revenue k.",
      explanation: "Look for previousPrefix = currentPrefix - k.",
    },
    {
      title: "Signal Match Count",
      statement: "Count contiguous segments matching target sum k.",
      explanation: "Initialize prefix 0 with count 1 for ranges starting at index 0.",
    },
  ],
  5: [
    {
      title: "Longest Subarray = k",
      statement: "Return the maximum length of a subarray with sum exactly k.",
      explanation: "Store earliest index of each prefix sum.",
    },
    {
      title: "Longest Balanced Window",
      statement: "Find the longest continuous window whose sum is k.",
      explanation: "First occurrence of a prefix gives longest reach.",
    },
    {
      title: "Max-Length Target Segment",
      statement: "Compute longest contiguous target-sum segment length.",
      explanation: "Do not overwrite earliest prefix occurrence.",
    },
    {
      title: "Longest k-Span",
      statement: "Return length of longest span totaling k.",
      explanation: "Prefix + hash map yields linear-time solution.",
    },
  ],
  6: [
    {
      title: "Rectangle Sum Query",
      statement: "Return sum of matrix cells in rectangle (r1,c1) to (r2,c2).",
      explanation: "Apply 2D prefix / inclusion-exclusion logic.",
    },
    {
      title: "Grid Window Total",
      statement: "Compute inclusive rectangular sum for the given matrix window.",
      explanation: "Subtract overlap correctly to avoid double counting.",
    },
    {
      title: "2D Range Aggregator",
      statement: "Implement rectangle range sum in a 2D grid.",
      explanation: "This is 1D prefix idea extended to two axes.",
    },
    {
      title: "Matrix Area Sum",
      statement: "Return total value inside the requested matrix area.",
      explanation: "Corners determine inclusion-exclusion equation.",
    },
  ],
  7: [
    {
      title: "Count Submatrices = target",
      statement: "Return number of non-empty submatrices with sum target.",
      explanation: "Compress row bands and count 1D target subarrays.",
    },
    {
      title: "Target Rectangle Counter",
      statement: "Count all rectangles whose sum equals target.",
      explanation: "Repeat prefix-hash counting for each row pair.",
    },
    {
      title: "2D Target Frequency",
      statement: "How many submatrices produce exact target total?",
      explanation: "Row compression reduces 2D search to repeated 1D counting.",
    },
  ],
  8: [
    {
      title: "Max Rectangle ≤ k",
      statement: "Return the maximum rectangle sum that does not exceed k.",
      explanation: "Evaluate row-compressed sums and choose best <= k.",
    },
    {
      title: "Bounded Best Area",
      statement: "Find best rectangle sum bounded by k from above.",
      explanation: "Track best candidate while respecting upper limit k.",
    },
    {
      title: "Final Constraint Rectangle",
      statement: "Compute the largest valid rectangle sum where sum <= k.",
      explanation: "Hard mode: maximize without crossing threshold.",
    },
  ],
};

const toJsList = (value) => JSON.stringify(value);
const toJava1D = (arr) => `{${arr.join(", ")}}`;
const toJava2D = (matrix) => `{${matrix.map((row) => `{${row.join(", ")}}`).join(", ")}}`;
const formatExpected = (value) => (Array.isArray(value) ? `[${value.join(", ")}]` : String(value));

const buildHarness = (pageId, language, data) => {
  if (language === "java") {
    switch (pageId) {
      case 1:
        return `public static void main(String[] args) {
    int[] result = solve(new int[]${toJava1D(data.nums)});
    System.out.println(Arrays.toString(result));
}`;
      case 2:
        return `public static void main(String[] args) {
    int result = solve(new int[]${toJava1D(data.nums)}, ${data.left}, ${data.right});
    System.out.println(result);
}`;
      case 3:
        return `public static void main(String[] args) {
    int[][] queries = new int[][]${toJava2D(data.queries)};
    int[] result = solve(new int[]${toJava1D(data.nums)}, queries);
    System.out.println(Arrays.toString(result));
}`;
      case 4:
      case 5:
        return `public static void main(String[] args) {
    int result = solve(new int[]${toJava1D(data.nums)}, ${data.k});
    System.out.println(result);
}`;
      case 6:
        return `public static void main(String[] args) {
    int[][] matrix = new int[][]${toJava2D(data.matrix)};
    int result = solve(matrix, ${data.r1}, ${data.c1}, ${data.r2}, ${data.c2});
    System.out.println(result);
}`;
      case 7:
        return `public static void main(String[] args) {
    int[][] matrix = new int[][]${toJava2D(data.matrix)};
    int result = solve(matrix, ${data.target});
    System.out.println(result);
}`;
      case 8:
        return `public static void main(String[] args) {
    int[][] matrix = new int[][]${toJava2D(data.matrix)};
    int result = solve(matrix, ${data.k});
    System.out.println(result);
}`;
      default:
        return "";
    }
  }

  switch (pageId) {
    case 1:
      return `if __name__ == "__main__":
    print(solve(${toJsList(data.nums)}))`;
    case 2:
      return `if __name__ == "__main__":
    print(solve(${toJsList(data.nums)}, ${data.left}, ${data.right}))`;
    case 3:
      return `if __name__ == "__main__":
    print(solve(${toJsList(data.nums)}, ${toJsList(data.queries)}))`;
    case 4:
    case 5:
      return `if __name__ == "__main__":
    print(solve(${toJsList(data.nums)}, ${data.k}))`;
    case 6:
      return `if __name__ == "__main__":
    matrix = ${toJsList(data.matrix)}
    print(solve(matrix, ${data.r1}, ${data.c1}, ${data.r2}, ${data.c2}))`;
    case 7:
      return `if __name__ == "__main__":
    matrix = ${toJsList(data.matrix)}
    print(solve(matrix, ${data.target}))`;
    case 8:
      return `if __name__ == "__main__":
    matrix = ${toJsList(data.matrix)}
    print(solve(matrix, ${data.k}))`;
    default:
      return "";
  }
};

const buildExampleInput = (pageId, data) => {
  switch (pageId) {
    case 1:
      return `nums = ${toJsList(data.nums)}`;
    case 2:
      return `nums = ${toJsList(data.nums)}, left = ${data.left}, right = ${data.right}`;
    case 3:
      return `nums = ${toJsList(data.nums)}, queries = ${toJsList(data.queries)}`;
    case 4:
    case 5:
      return `nums = ${toJsList(data.nums)}, k = ${data.k}`;
    case 6:
      return `matrix = ${toJsList(data.matrix)}, r1 = ${data.r1}, c1 = ${data.c1}, r2 = ${data.r2}, c2 = ${data.c2}`;
    case 7:
      return `matrix = ${toJsList(data.matrix)}, target = ${data.target}`;
    case 8:
      return `matrix = ${toJsList(data.matrix)}, k = ${data.k}`;
    default:
      return "";
  }
};

const QUESTION_BANK_BY_PAGE = {
  1: [
    {
      title: "Build Prefix Array",
      statement: "Return prefix[i] as the sum of nums[0..i].",
      explanation: "Track a running total and append at each position.",
      javaStarterCode: `static int[] solve(int[] nums) {
    // Return prefix sums for nums
    return new int[0];
}`,
      pythonStarterCode: `def solve(nums):
    # Return prefix sums for nums
    return []`,
      cases: [
        { nums: [2, 1, 3], expected: [2, 3, 6] },
        { nums: [5, -2, 4], expected: [5, 3, 7] },
        { nums: [0, 0, 7], expected: [0, 0, 7] },
      ],
    },
    {
      title: "Prefix Maximum",
      statement: "Return an array where ans[i] is max(nums[0..i]).",
      explanation: "Carry forward the largest value seen so far.",
      javaStarterCode: `static int[] solve(int[] nums) {
    // Return prefix maximum values
    return new int[0];
}`,
      pythonStarterCode: `def solve(nums):
    # Return prefix maximum values
    return []`,
      cases: [
        { nums: [3, 1, 5, 2], expected: [3, 3, 5, 5] },
        { nums: [2, 2, 2], expected: [2, 2, 2] },
        { nums: [1, 4, 0, 6], expected: [1, 4, 4, 6] },
      ],
    },
    {
      title: "Prefix Even Counter",
      statement: "Return ans[i] = number of even values in nums[0..i].",
      explanation: "Increase count only when current value is even.",
      javaStarterCode: `static int[] solve(int[] nums) {
    // Return prefix count of even numbers
    return new int[0];
}`,
      pythonStarterCode: `def solve(nums):
    # Return prefix count of even numbers
    return []`,
      cases: [
        { nums: [1, 2, 4, 5, 6], expected: [0, 1, 2, 2, 3] },
        { nums: [2, 2, 2], expected: [1, 2, 3] },
        { nums: [1, 3, 5], expected: [0, 0, 0] },
      ],
    },
    {
      title: "Floor Prefix Average",
      statement: "Return floor average of nums[0..i] for each i.",
      explanation: "Keep running sum; ans[i] = floor(sum / (i+1)).",
      javaStarterCode: `static int[] solve(int[] nums) {
    // Return floor prefix averages
    return new int[0];
}`,
      pythonStarterCode: `def solve(nums):
    # Return floor prefix averages
    return []`,
      cases: [
        { nums: [2, 4, 6, 8], expected: [2, 3, 4, 5] },
        { nums: [5, 5, 5], expected: [5, 5, 5] },
        { nums: [1, 2, 2, 1], expected: [1, 1, 1, 1] },
      ],
    },
  ],
  2: [
    {
      title: "Inclusive Range Sum",
      statement: "Return sum(nums[left..right]).",
      explanation: "Inclusive boundaries: both left and right are part of range.",
      javaStarterCode: `static int solve(int[] nums, int left, int right) {
    // Return inclusive range sum
    return 0;
}`,
      pythonStarterCode: `def solve(nums, left, right):
    # Return inclusive range sum
    return 0`,
      cases: [
        { nums: [4, 1, 7, 2, 5], left: 1, right: 3, expected: 10 },
        { nums: [3, 3, 3], left: 0, right: 2, expected: 9 },
        { nums: [10, -2, 1], left: 1, right: 2, expected: -1 },
      ],
    },
    {
      title: "Weighted Range Sum",
      statement: "Return Σ((i-left+1) * nums[i]) for i in [left..right].",
      explanation: "First index weight is 1, then 2, then 3, ...",
      javaStarterCode: `static int solve(int[] nums, int left, int right) {
    // Return weighted range sum
    return 0;
}`,
      pythonStarterCode: `def solve(nums, left, right):
    # Return weighted range sum
    return 0`,
      cases: [
        { nums: [2, 3, 4, 5], left: 1, right: 3, expected: 26 },
        { nums: [1, 1, 1], left: 0, right: 2, expected: 6 },
        { nums: [5, 2], left: 0, right: 1, expected: 9 },
      ],
    },
    {
      title: "Positive Count in Range",
      statement: "Return how many values > 0 appear in nums[left..right].",
      explanation: "Only strictly positive numbers are counted.",
      javaStarterCode: `static int solve(int[] nums, int left, int right) {
    // Count positives in inclusive range
    return 0;
}`,
      pythonStarterCode: `def solve(nums, left, right):
    # Count positives in inclusive range
    return 0`,
      cases: [
        { nums: [1, -1, 2, 0, 3], left: 0, right: 4, expected: 3 },
        { nums: [-2, -1, 0], left: 0, right: 2, expected: 0 },
        { nums: [5, 6, -7], left: 1, right: 2, expected: 1 },
      ],
    },
    {
      title: "Range XOR",
      statement: "Return XOR of nums[left..right].",
      explanation: "Apply bitwise xor across inclusive segment.",
      javaStarterCode: `static int solve(int[] nums, int left, int right) {
    // Return xor of inclusive range
    return 0;
}`,
      pythonStarterCode: `def solve(nums, left, right):
    # Return xor of inclusive range
    return 0`,
      cases: [
        { nums: [5, 1, 2, 3], left: 1, right: 3, expected: 0 },
        { nums: [4, 4, 4], left: 0, right: 2, expected: 4 },
        { nums: [7, 8], left: 0, right: 1, expected: 15 },
      ],
    },
  ],
  3: [
    {
      title: "Batch Range Sums",
      statement: "For each query [l, r], return sum(nums[l..r]).",
      explanation: "Output array must follow query order.",
      javaStarterCode: `static int[] solve(int[] nums, int[][] queries) {
    // Return range sums for each query
    return new int[0];
}`,
      pythonStarterCode: `def solve(nums, queries):
    # Return range sums for each query
    return []`,
      cases: [
        { nums: [1, 2, 3, 4], queries: [[0, 1], [1, 3], [2, 2]], expected: [3, 9, 3] },
        { nums: [5, 5, 5], queries: [[0, 2], [1, 1]], expected: [15, 5] },
        { nums: [2, 1, 2], queries: [[0, 0], [0, 2]], expected: [2, 5] },
      ],
    },
    {
      title: "Batch Range Maximums",
      statement: "For each query [l, r], return max(nums[l..r]).",
      explanation: "Each query is inclusive.",
      javaStarterCode: `static int[] solve(int[] nums, int[][] queries) {
    // Return range maximums for each query
    return new int[0];
}`,
      pythonStarterCode: `def solve(nums, queries):
    # Return range maximums for each query
    return []`,
      cases: [
        { nums: [1, 7, 3, 9], queries: [[0, 2], [1, 3]], expected: [7, 9] },
        { nums: [5, 4, 3], queries: [[0, 2], [2, 2]], expected: [5, 3] },
        { nums: [2, 8, 1, 6], queries: [[1, 1], [0, 3]], expected: [8, 8] },
      ],
    },
    {
      title: "Batch Even Counts",
      statement: "For each [l, r], return count of even values in nums[l..r].",
      explanation: "Only even integers are counted.",
      javaStarterCode: `static int[] solve(int[] nums, int[][] queries) {
    // Return even counts per query
    return new int[0];
}`,
      pythonStarterCode: `def solve(nums, queries):
    # Return even counts per query
    return []`,
      cases: [
        { nums: [1, 2, 4, 5, 6], queries: [[0, 4], [1, 2], [3, 3]], expected: [3, 2, 0] },
        { nums: [2, 2, 2], queries: [[0, 1], [1, 2]], expected: [2, 2] },
        { nums: [1, 3, 5], queries: [[0, 2]], expected: [0] },
      ],
    },
    {
      title: "Batch Range XOR",
      statement: "For each [l, r], return xor(nums[l..r]).",
      explanation: "Use bitwise xor across each inclusive segment.",
      javaStarterCode: `static int[] solve(int[] nums, int[][] queries) {
    // Return xor values for each query
    return new int[0];
}`,
      pythonStarterCode: `def solve(nums, queries):
    # Return xor values for each query
    return []`,
      cases: [
        { nums: [5, 1, 2, 3], queries: [[0, 3], [1, 2], [2, 3]], expected: [5, 3, 1] },
        { nums: [4, 4, 4], queries: [[0, 2], [0, 1]], expected: [4, 0] },
        { nums: [7, 8], queries: [[0, 1]], expected: [15] },
      ],
    },
  ],
  4: [
    {
      title: "Count Subarrays Equal K",
      statement: "Return number of contiguous subarrays whose sum is exactly k.",
      explanation: "Classic prefix-sum frequency map problem.",
      javaStarterCode: `static int solve(int[] nums, int k) {
    // Count subarrays with exact sum k
    return 0;
}`,
      pythonStarterCode: `def solve(nums, k):
    # Count subarrays with exact sum k
    return 0`,
      cases: [
        { nums: [1, 1, 1], k: 2, expected: 2 },
        { nums: [1, 2, 1, 2], k: 3, expected: 3 },
        { nums: [0, 0, 0], k: 0, expected: 6 },
      ],
    },
    {
      title: "Longest Subarray Equal K",
      statement: "Return max length of contiguous subarray summing to k.",
      explanation: "Store earliest occurrence of each prefix.",
      javaStarterCode: `static int solve(int[] nums, int k) {
    // Return longest subarray length with sum k
    return 0;
}`,
      pythonStarterCode: `def solve(nums, k):
    # Return longest subarray length with sum k
    return 0`,
      cases: [
        { nums: [1, -1, 5, -2, 3], k: 3, expected: 4 },
        { nums: [2, 3, 1, 1, 1], k: 5, expected: 3 },
        { nums: [1, 2, 3], k: 7, expected: 0 },
      ],
    },
    {
      title: "Count Prefixes Equal K",
      statement: "Return how many prefixes have sum exactly k.",
      explanation: "Only ranges starting from index 0 are considered.",
      javaStarterCode: `static int solve(int[] nums, int k) {
    // Count prefixes with sum exactly k
    return 0;
}`,
      pythonStarterCode: `def solve(nums, k):
    # Count prefixes with sum exactly k
    return 0`,
      cases: [
        { nums: [1, 2, 3, 0], k: 3, expected: 1 },
        { nums: [3, 0, 0], k: 3, expected: 3 },
        { nums: [1, 1, 1], k: 5, expected: 0 },
      ],
    },
    {
      title: "Min Length Sum At Least K",
      statement: "Return minimum length of subarray with sum >= k, else 0.",
      explanation: "Sliding-window style objective with integer arrays.",
      javaStarterCode: `static int solve(int[] nums, int k) {
    // Return minimum length subarray with sum >= k
    return 0;
}`,
      pythonStarterCode: `def solve(nums, k):
    # Return minimum length subarray with sum >= k
    return 0`,
      cases: [
        { nums: [2, 3, 1, 2, 4, 3], k: 7, expected: 2 },
        { nums: [1, 1, 1, 1], k: 5, expected: 0 },
        { nums: [5, 1, 1], k: 5, expected: 1 },
      ],
    },
  ],
  5: [
    {
      title: "Subarrays Divisible by K",
      statement: "Return count of subarrays whose sum is divisible by k.",
      explanation: "Use prefix modulo frequencies.",
      javaStarterCode: `static int solve(int[] nums, int k) {
    // Count subarrays divisible by k
    return 0;
}`,
      pythonStarterCode: `def solve(nums, k):
    # Count subarrays divisible by k
    return 0`,
      cases: [
        { nums: [4, 5, 0, -2, -3, 1], k: 5, expected: 7 },
        { nums: [5, 10], k: 5, expected: 3 },
        { nums: [1, 2, 3], k: 3, expected: 3 },
      ],
    },
    {
      title: "Best Prefix Under K",
      statement: "Return maximum prefix sum <= k, else -1.",
      explanation: "Inspect prefix sums from start to each index.",
      javaStarterCode: `static int solve(int[] nums, int k) {
    // Return best prefix sum <= k
    return -1;
}`,
      pythonStarterCode: `def solve(nums, k):
    # Return best prefix sum <= k
    return -1`,
      cases: [
        { nums: [2, 1, 3], k: 4, expected: 3 },
        { nums: [5, 1], k: 4, expected: -1 },
        { nums: [-1, 2, 2], k: 2, expected: 1 },
      ],
    },
    {
      title: "First Prefix Reaching K",
      statement: "Return first index i where prefixSum(i) >= k, else -1.",
      explanation: "0-based index is required.",
      javaStarterCode: `static int solve(int[] nums, int k) {
    // Return first index where prefix sum >= k
    return -1;
}`,
      pythonStarterCode: `def solve(nums, k):
    # Return first index where prefix sum >= k
    return -1`,
      cases: [
        { nums: [1, 2, 3], k: 3, expected: 1 },
        { nums: [2, 2, 2], k: 7, expected: -1 },
        { nums: [5], k: 1, expected: 0 },
      ],
    },
    {
      title: "Longest Non-Neg Prefix",
      statement: "Return length of longest prefix with sum >= 0.",
      explanation: "Check each prefix sum and track farthest valid index.",
      javaStarterCode: `static int solve(int[] nums, int k) {
    // Ignore k and return longest non-negative prefix length
    return 0;
}`,
      pythonStarterCode: `def solve(nums, k):
    # Ignore k and return longest non-negative prefix length
    return 0`,
      cases: [
        { nums: [1, -2, 3, -1], k: 0, expected: 4 },
        { nums: [-1, -1], k: 0, expected: 0 },
        { nums: [0, 0, 0], k: 0, expected: 3 },
      ],
    },
  ],
  6: [
    {
      title: "Rectangle Sum",
      statement: "Return matrix sum in inclusive rectangle (r1,c1) to (r2,c2).",
      explanation: "Use nested loops or 2D prefix strategy.",
      javaStarterCode: `static int solve(int[][] matrix, int r1, int c1, int r2, int c2) {
    // Return rectangle sum
    return 0;
}`,
      pythonStarterCode: `def solve(matrix, r1, c1, r2, c2):
    # Return rectangle sum
    return 0`,
      cases: [
        { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], r1: 0, c1: 1, r2: 2, c2: 2, expected: 33 },
        { matrix: [[5, 1], [2, 3]], r1: 0, c1: 0, r2: 1, c2: 1, expected: 11 },
        { matrix: [[3, 0, 1], [2, 4, 5]], r1: 1, c1: 1, r2: 1, c2: 2, expected: 9 },
      ],
    },
    {
      title: "Rectangle Maximum",
      statement: "Return the maximum value inside the rectangle.",
      explanation: "Scan only the specified bounds.",
      javaStarterCode: `static int solve(int[][] matrix, int r1, int c1, int r2, int c2) {
    // Return rectangle maximum
    return Integer.MIN_VALUE;
}`,
      pythonStarterCode: `def solve(matrix, r1, c1, r2, c2):
    # Return rectangle maximum
    return float("-inf")`,
      cases: [
        { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], r1: 0, c1: 0, r2: 2, c2: 1, expected: 8 },
        { matrix: [[-1, -2], [-3, -4]], r1: 0, c1: 0, r2: 1, c2: 1, expected: -1 },
        { matrix: [[5, 6, 7]], r1: 0, c1: 1, r2: 0, c2: 2, expected: 7 },
      ],
    },
    {
      title: "Rectangle Minimum",
      statement: "Return the minimum value inside the rectangle.",
      explanation: "Scan the chosen submatrix and keep smallest value.",
      javaStarterCode: `static int solve(int[][] matrix, int r1, int c1, int r2, int c2) {
    // Return rectangle minimum
    return Integer.MAX_VALUE;
}`,
      pythonStarterCode: `def solve(matrix, r1, c1, r2, c2):
    # Return rectangle minimum
    return float("inf")`,
      cases: [
        { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], r1: 0, c1: 1, r2: 2, c2: 2, expected: 2 },
        { matrix: [[-1, -2], [-3, -4]], r1: 0, c1: 0, r2: 1, c2: 1, expected: -4 },
        { matrix: [[5, 6, 7]], r1: 0, c1: 1, r2: 0, c2: 2, expected: 6 },
      ],
    },
    {
      title: "Odd Count in Rectangle",
      statement: "Return how many odd numbers are in the rectangle.",
      explanation: "Count values where value % 2 != 0.",
      javaStarterCode: `static int solve(int[][] matrix, int r1, int c1, int r2, int c2) {
    // Count odd values in rectangle
    return 0;
}`,
      pythonStarterCode: `def solve(matrix, r1, c1, r2, c2):
    # Count odd values in rectangle
    return 0`,
      cases: [
        { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]], r1: 0, c1: 0, r2: 2, c2: 2, expected: 5 },
        { matrix: [[2, 4], [6, 8]], r1: 0, c1: 0, r2: 1, c2: 1, expected: 0 },
        { matrix: [[1, 2, 3], [4, 5, 6]], r1: 0, c1: 0, r2: 1, c2: 1, expected: 2 },
      ],
    },
  ],
  7: [
    {
      title: "Rows Matching Target Sum",
      statement: "Return number of rows whose total equals target.",
      explanation: "Compute row sums and compare with target.",
      javaStarterCode: `static int solve(int[][] matrix, int target) {
    // Count rows with sum == target
    return 0;
}`,
      pythonStarterCode: `def solve(matrix, target):
    # Count rows with sum == target
    return 0`,
      cases: [
        { matrix: [[1, 2], [3, 0], [2, 1]], target: 3, expected: 3 },
        { matrix: [[0, 0], [1, -1]], target: 0, expected: 2 },
        { matrix: [[5], [6]], target: 5, expected: 1 },
      ],
    },
    {
      title: "Columns Matching Target Sum",
      statement: "Return number of columns whose total equals target.",
      explanation: "Compute each column sum independently.",
      javaStarterCode: `static int solve(int[][] matrix, int target) {
    // Count columns with sum == target
    return 0;
}`,
      pythonStarterCode: `def solve(matrix, target):
    # Count columns with sum == target
    return 0`,
      cases: [
        { matrix: [[1, 2, 0], [2, 1, 0]], target: 3, expected: 2 },
        { matrix: [[1, 1], [1, 1]], target: 2, expected: 2 },
        { matrix: [[2, 2], [2, 2]], target: 5, expected: 0 },
      ],
    },
    {
      title: "Submatrices Equal Target",
      statement: "Return number of non-empty submatrices summing to target.",
      explanation: "Use row compression + prefix counting.",
      javaStarterCode: `static int solve(int[][] matrix, int target) {
    // Count submatrices with sum == target
    return 0;
}`,
      pythonStarterCode: `def solve(matrix, target):
    # Count submatrices with sum == target
    return 0`,
      cases: [
        { matrix: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], target: 0, expected: 4 },
        { matrix: [[1, -1], [-1, 1]], target: 0, expected: 5 },
        { matrix: [[1, 2], [3, 4]], target: 3, expected: 2 },
      ],
    },
  ],
  8: [
    {
      title: "Count Elements <= K",
      statement: "Return how many matrix elements are <= k.",
      explanation: "Simple traversal with threshold check.",
      javaStarterCode: `static int solve(int[][] matrix, int k) {
    // Count matrix elements <= k
    return 0;
}`,
      pythonStarterCode: `def solve(matrix, k):
    # Count matrix elements <= k
    return 0`,
      cases: [
        { matrix: [[1, 0, 1], [0, -2, 3]], k: 1, expected: 5 },
        { matrix: [[2, 2], [-1, 4]], k: 2, expected: 3 },
        { matrix: [[5]], k: 4, expected: 0 },
      ],
    },
    {
      title: "Best Row Sum Under K",
      statement: "Return max row sum <= k, else -1.",
      explanation: "Evaluate each row total and keep best valid one.",
      javaStarterCode: `static int solve(int[][] matrix, int k) {
    // Return max row sum <= k
    return -1;
}`,
      pythonStarterCode: `def solve(matrix, k):
    # Return max row sum <= k
    return -1`,
      cases: [
        { matrix: [[1, 2], [3, 4]], k: 5, expected: 3 },
        { matrix: [[5, 5], [1, 1]], k: 4, expected: 2 },
        { matrix: [[6], [7]], k: 5, expected: -1 },
      ],
    },
    {
      title: "Max Rectangle Sum <= K",
      statement: "Return maximum rectangle sum not exceeding k.",
      explanation: "Advanced version: optimize while respecting upper bound.",
      javaStarterCode: `static int solve(int[][] matrix, int k) {
    // Return max rectangle sum <= k
    return Integer.MIN_VALUE;
}`,
      pythonStarterCode: `def solve(matrix, k):
    # Return max rectangle sum <= k
    return -10**9`,
      cases: [
        { matrix: [[1, 0, 1], [0, -2, 3]], k: 2, expected: 2 },
        { matrix: [[2, 2, -1]], k: 3, expected: 3 },
        { matrix: [[2, 2], [-1, 4]], k: 4, expected: 4 },
      ],
    },
  ],
};

const buildChallengeWithTests = (starterCode, pageId, cases, language) => {
  const testCases = cases.map((caseData) => ({
    harness: buildHarness(pageId, language, caseData),
    expected: formatExpected(caseData.expected),
  }));

  return {
    starterCode,
    harness: testCases[0]?.harness || "",
    expected: testCases[0]?.expected || "",
    testCases,
  };
};

const learn = (pageId, slot, title, summary, bullets, exampleTitle, exampleCode) => ({
  key: `p${pageId}-n${slot}`,
  pageId,
  slot,
  type: "learn",
  title,
  label: `L${slot}`,
  ...nodeSlots[slot - 1],
  lesson: {
    title,
    summary,
    bullets,
    exampleTitle,
    exampleCode,
  },
});

const createPracticeQuestions = (pageId, slot, title, mission, challenge) => {
  const questions = QUESTION_BANK_BY_PAGE[pageId] || [];

  return questions.map((question, index) => {
    const number = index + 1;
    const count = questions.length;
    const questionCases = question.cases;
    const sampleCase = questionCases[0];

    return {
      key: `p${pageId}-n${slot}-q${number}`,
      title: `${question.title}`,
      mission: {
        ...mission,
        statement: `${question.statement} (Practice ${number}/${count})`,
        exampleInput: buildExampleInput(pageId, sampleCase),
        exampleOutput: formatExpected(sampleCase.expected),
        exampleExplanation: `${question.explanation} The sample output is ${formatExpected(sampleCase.expected)}.`,
      },
      challenge: {
        java: buildChallengeWithTests(question.javaStarterCode, pageId, questionCases, "java"),
        python: buildChallengeWithTests(question.pythonStarterCode, pageId, questionCases, "python"),
      },
    };
  });
};

const battle = (pageId, slot, title, difficulty, mission, languageVariants) => {
  const practiceQuestions = createPracticeQuestions(pageId, slot, title, mission, languageVariants);

  return {
    key: `p${pageId}-n${slot}`,
    pageId,
    slot,
    type: "battle",
    title,
    difficulty,
    mission,
    label: `Q${slot}`,
    ...nodeSlots[slot - 1],
    challenge: languageVariants,
    practiceQuestions,
  };
};

const pages = [
  {
    id: 1,
    title: "Prefix Sum Basics",
    subtitle: "Learn what a running total is and why it speeds things up",
    nodes: [
      learn(
        1,
        1,
        "Running Total",
        "A prefix sum is a running total that remembers every partial result. Instead of starting over for each new position, you carry the sum forward and save the accumulated value.",
        [
          "Start with the first value as the first total.",
          "Each next value is previous total + current number.",
          "The saved totals let you reuse work instead of recalculating it.",
        ],
        "Worked Example",
        `nums = [2, 4, 1, 3]\nstep 1: 2\nstep 2: 2 + 4 = 6\nstep 3: 6 + 1 = 7\nstep 4: 7 + 3 = 10\nprefix = [2, 6, 7, 10]`
      ),
      learn(
        1,
        2,
        "Why it Helps",
        "Once you have prefix sums, a range sum becomes a subtraction problem instead of a looping problem. That is the main reason prefix sums are so useful in interview questions.",
        [
          "Without prefix sums, every query repeats the same additions.",
          "With prefix sums, use prefix[right] - prefix[left - 1] for a middle range.",
          "The saved totals turn repeated work into one constant-time answer.",
        ],
        "Range Example",
        `nums = [2, 4, 1, 3]\nprefix = [2, 6, 7, 10]\nsum(1..3) = prefix[3] - prefix[0] = 10 - 2 = 8`
      ),
      battle(
        1,
        3,
        "Build the Prefix Array",
        "Easy",
        {
          statement: "Given an integer array nums, return an array prefix where prefix[i] is the sum of nums[0] to nums[i].",
          exampleInput: "nums = [1, 2, 3, 4]",
          exampleOutput: "[1, 3, 6, 10]",
          exampleExplanation: "Build the answer one step at a time: keep a running sum, add the current number, and store that total at the same index. The array becomes [1, 3, 6, 10].",
        },
        {
          java: {
            starterCode: `static int[] solve(int[] nums) {
    // Write your code here
    return new int[0];
}`,
            harness: `public static void main(String[] args) {
    int[] result = solve(new int[]{1, 2, 3, 4});
    System.out.println(Arrays.toString(result));
}`,
            expected: "[1, 3, 6, 10]",
          },
          python: {
            starterCode: `def solve(nums):
    # Write your code here
    return []`,
            harness: `if __name__ == "__main__":
    print(solve([1, 2, 3, 4]))`,
            expected: "[1, 3, 6, 10]",
          },
        }
      ),
    ],
  },
  {
    id: 2,
    title: "Range Sum Queries",
    subtitle: "Use prefix sums to answer one range quickly and safely",
    nodes: [
      learn(
        2,
        1,
        "Index Carefully",
        "Most prefix-sum bugs come from off-by-one mistakes. Decide whether your range is 0-based or 1-based before coding so your subtraction formula stays correct.",
        [
          "Write the range rule on paper before coding.",
          "Use one consistent indexing style from start to finish.",
          "If left is 0, the answer is just prefix[right].",
        ],
        "Tiny Rule",
        `If the range starts at 0, no subtraction is needed: rangeSum(0..r) = prefix[r]`
      ),
      learn(
        2,
        2,
        "Subtraction Trick",
        "For a range from left to right, subtract the prefix before the range from the prefix at the end of the range. This is the key move that turns a slow scan into a quick answer.",
        [
          "If left > 0, use prefix[right] - prefix[left - 1].",
          "If left is 0, do not subtract anything.",
          "The full query then costs O(1) after the O(n) build step.",
        ],
        "Formula",
        `answer = prefix[r] - prefix[l - 1]\nExample: nums = [2, 4, 1, 3], sum(1..3) = 10 - 2 = 8`
      ),
      battle(
        2,
        3,
        "Range Sum Check",
        "Easy-Medium",
        {
          statement: "Given nums and two indices left and right (inclusive), return the sum of elements from nums[left] to nums[right].",
          exampleInput: "nums = [2, 1, 3, 5, 4], left = 1, right = 3",
          exampleOutput: "9",
          exampleExplanation: "The required range is [1, 3], so the answer is 1 + 3 + 5 = 9. Prefix sums would reach the same result faster when there are many queries.",
        },
        {
          java: {
            starterCode: `static int solve(int[] nums, int left, int right) {
    // Write your code here
    return 0;
}`,
            harness: `public static void main(String[] args) {
    int result = solve(new int[]{2, 1, 3, 5, 4}, 1, 3);
    System.out.println(result);
}`,
            expected: "9",
          },
          python: {
            starterCode: `def solve(nums, left, right):
    # Write your code here
    return 0`,
            harness: `if __name__ == "__main__":
    print(solve([2, 1, 3, 5, 4], 1, 3))`,
            expected: "9",
          },
        }
      ),
    ],
  },
  {
    id: 3,
    title: "Many Queries",
    subtitle: "Answer several range requests without repeating work",
    nodes: [
      learn(
        3,
        1,
        "One Build, Many Answers",
        "Build the prefix array one time so repeated queries never need to scan the same numbers again. The upfront work is small, but the savings grow quickly when the array is reused many times.",
        [
          "This is useful when the array stays the same.",
          "The more queries you have, the bigger the win.",
          "The first build costs O(n), each query after that costs O(1).",
        ],
        "Cost",
        `build once: O(n)\nquery later: O(1)`
      ),
      learn(
        3,
        2,
        "Batch Queries",
        "Sometimes a problem gives many [left, right] pairs. Prefix sums let you answer all of them cleanly because the same subtraction rule works for every query.",
        [
          "Loop through each query.",
          "Apply the same subtraction rule every time.",
          "Return the answers in the same order as the queries.",
        ],
        "Batch Rule",
        `answers[i] = prefix[r] - prefix[l - 1]`
      ),
      battle(
        3,
        3,
        "Range Query Pack",
        "Medium",
        {
          statement: "Given nums and queries where each query is [left, right], return an array containing the sum of each query range.",
          exampleInput: "nums = [3, 1, 4, 1, 5, 9], queries = [[0, 2], [2, 5], [1, 4]]",
          exampleOutput: "[8, 19, 11]",
          exampleExplanation: "[0,2] => 3+1+4=8, [2,5] => 4+1+5+9=19, [1,4] => 1+4+1+5=11.",
        },
        {
          java: {
            starterCode: `static int[] solve(int[] nums, int[][] queries) {
    // Write your code here
    return new int[0];
}`,
            harness: `public static void main(String[] args) {
    int[][] queries = new int[][]{{0, 2}, {2, 5}, {1, 4}};
    int[] result = solve(new int[]{3, 1, 4, 1, 5, 9}, queries);
    System.out.println(Arrays.toString(result));
}`,
            expected: "[8, 19, 11]",
          },
          python: {
            starterCode: `def solve(nums, queries):
    # Write your code here
    return []`,
            harness: `if __name__ == "__main__":
    print(solve([3, 1, 4, 1, 5, 9], [[0, 2], [2, 5], [1, 4]]))`,
            expected: "[8, 19, 11]",
          },
        }
      ),
    ],
  },
  {
    id: 4,
    title: "Prefix + Hash Maps",
    subtitle: "Use prefix sums to count subarrays",
    nodes: [
      learn(
        4,
        1,
        "Prefix Sums Can Count",
        "Prefix sums can count subarrays when you compare the current prefix to an earlier prefix. If the difference is k, everything between those two positions adds up to k.",
        [
          "Track how many times each prefix sum has appeared.",
          "When currentPrefix - k exists, you found a matching subarray.",
          "A hash map makes this fast.",
        ],
        "Idea",
        `currentPrefix - previousPrefix = k`
      ),
      learn(
        4,
        2,
        "Why the Map Works",
        "The map remembers how many times each prefix sum has appeared. Every time you compute a new prefix, you can instantly count how many earlier positions create a valid subarray.",
        [
          "Use 0 as an initial prefix sum count of 1.",
          "That handles subarrays that start at index 0.",
          "This turns an O(n^2) problem into O(n).",
        ],
        "Starter Map",
        `map.put(0, 1);`
      ),
      battle(
        4,
        3,
        "Count Subarrays Equal K",
        "Medium",
        {
          statement: "Given nums and k, return the number of continuous subarrays whose sum is exactly k.",
          exampleInput: "nums = [1, 1, 1], k = 2",
          exampleOutput: "2",
          exampleExplanation: "Two subarrays have sum 2: nums[0..1] and nums[1..2].",
        },
        {
          java: {
            starterCode: `static int solve(int[] nums, int k) {
    // Write your code here
    return 0;
}`,
            harness: `public static void main(String[] args) {
    int result = solve(new int[]{1, 1, 1}, 2);
    System.out.println(result);
}`,
            expected: "2",
          },
          python: {
            starterCode: `def solve(nums, k):
    # Write your code here
    return 0`,
            harness: `if __name__ == "__main__":
    print(solve([1, 1, 1], 2))`,
            expected: "2",
          },
        }
      ),
    ],
  },
  {
    id: 5,
    title: "Hard Prefix Tricks",
    subtitle: "Store the earliest index to find longer answers",
    nodes: [
      learn(
        5,
        1,
        "Longest Means Earliest",
        "When you want the longest subarray, keep the earliest place where each prefix sum first appeared. That earliest index gives the widest possible distance to the current position.",
        [
          "Earliest index gives the biggest distance.",
          "Do not overwrite an index once it has been stored.",
          "This is a very common prefix-sum trick.",
        ],
        "Remember",
        `firstSeen[prefix] = earliest index`
      ),
      learn(
        5,
        2,
        "Harder But Same Idea",
        "The problem may look harder, but the core tool is still the same: a running total plus a hash map. The trick is to ask which earlier prefix would make the current segment valid.",
        [
          "Think about what your prefix sum is telling you.",
          "Ask: what previous prefix would make this range work?",
          "Then search for that value in the map.",
        ],
        "Question",
        `What previous prefix makes the answer equal k?`
      ),
      battle(
        5,
        3,
        "Longest Subarray Sum K",
        "Hard",
        {
          statement: "Given nums and k, return the length of the longest continuous subarray whose sum is exactly k.",
          exampleInput: "nums = [1, -1, 5, -2, 3], k = 3",
          exampleOutput: "4",
          exampleExplanation: "The longest valid subarray is [1, -1, 5, -2], which has sum 3 and length 4.",
        },
        {
          java: {
            starterCode: `static int solve(int[] nums, int k) {
    // Write your code here
    return 0;
}`,
            harness: `public static void main(String[] args) {
    int result = solve(new int[]{1, -1, 5, -2, 3}, 3);
    System.out.println(result);
}`,
            expected: "4",
          },
          python: {
            starterCode: `def solve(nums, k):
    # Write your code here
    return 0`,
            harness: `if __name__ == "__main__":
    print(solve([1, -1, 5, -2, 3], 3))`,
            expected: "4",
          },
        }
      ),
    ],
  },
  {
    id: 6,
    title: "2D Prefix Sum",
    subtitle: "Move from arrays to matrices",
    nodes: [
      learn(
        6,
        1,
        "Prefix on a Grid",
        "A 2D prefix sum stores the total of everything from the top-left corner to each cell, so each rectangle query can reuse previously computed area instead of summing every cell again.",
        [
          "Think row by row and column by column.",
          "Each cell remembers the total above and to the left.",
          "This gives fast rectangle queries later.",
        ],
        "Grid Idea",
        `prefix[r][c] = total in rectangle (0,0) -> (r,c)`
      ),
      learn(
        6,
        2,
        "Rectangle Formula",
        "To get the sum of a rectangle, add the big area and subtract the overlapping parts. That inclusion-exclusion pattern is the 2D version of the prefix-sum subtraction trick.",
        [
          "This is the same idea as 1D prefix sums.",
          "The only change is that you now subtract on two axes.",
          "That is called inclusion-exclusion.",
        ],
        "Inclusion-Exclusion",
        `answer = A - B - C + D`
      ),
      battle(
        6,
        3,
        "Matrix Range Sum",
        "Medium-Hard",
        {
          statement: "Given a matrix and coordinates (r1, c1) to (r2, c2), return the sum of all values inside that rectangle (inclusive).",
          exampleInput: "matrix = [[1,2,3],[4,5,6],[7,8,9]], r1 = 0, c1 = 1, r2 = 2, c2 = 2",
          exampleOutput: "33",
          exampleExplanation: "The rectangle includes [2,3],[5,6],[8,9]. Their sum is 2+3+5+6+8+9 = 33.",
        },
        {
          java: {
            starterCode: `static int solve(int[][] matrix, int r1, int c1, int r2, int c2) {
    // Write your code here
    return 0;
}`,
            harness: `public static void main(String[] args) {
    int[][] matrix = new int[][]{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    int result = solve(matrix, 0, 1, 2, 2);
    System.out.println(result);
}`,
            expected: "33",
          },
          python: {
            starterCode: `def solve(matrix, r1, c1, r2, c2):
    # Write your code here
    return 0`,
            harness: `if __name__ == "__main__":
    matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    print(solve(matrix, 0, 1, 2, 2))`,
            expected: "33",
          },
        }
      ),
    ],
  },
  {
    id: 7,
    title: "Counting Submatrices",
    subtitle: "Use row compression and prefix sums together",
    nodes: [
      learn(
        7,
        1,
        "Row Compression",
        "A 2D problem can often be turned into many 1D problems by combining rows. Once you compress the matrix into column sums, the familiar prefix-sum tools become usable again.",
        [
          "Fix the top row and bottom row.",
          "Compress the matrix into one array of column sums.",
          "Then use your 1D prefix-sum skills.",
        ],
        "Small Trick",
        `2D problem -> many 1D prefix problems`
      ),
      learn(
        7,
        2,
        "Count Target Rectangles",
        "After compression, count how many subarrays hit the target. The reason this works is that every rectangle becomes a normal 1D sum problem after row pairing.",
        [
          "This is the same counting trick as subarray sum equals k.",
          "Prefix sums + hash map are still the core tools.",
          "The only difference is that you repeat it for each row pair.",
        ],
        "Repeat",
        `for each row pair -> count subarrays`
      ),
      battle(
        7,
        3,
        "Submatrices Equal Target",
        "Hard",
        {
          statement: "Given a matrix and target, return how many non-empty submatrices have sum exactly equal to target.",
          exampleInput: "matrix = [[0,1,0],[1,1,1],[0,1,0]], target = 0",
          exampleOutput: "4",
          exampleExplanation: "There are 4 submatrices made of single 0-cells that sum to 0.",
        },
        {
          java: {
            starterCode: `static int solve(int[][] matrix, int target) {
    // Write your code here
    return 0;
}`,
            harness: `public static void main(String[] args) {
    int[][] matrix = new int[][]{{0, 1, 0}, {1, 1, 1}, {0, 1, 0}};
    int result = solve(matrix, 0);
    System.out.println(result);
}`,
            expected: "4",
          },
          python: {
            starterCode: `def solve(matrix, target):
    # Write your code here
    return 0`,
            harness: `if __name__ == "__main__":
    matrix = [[0, 1, 0], [1, 1, 1], [0, 1, 0]]
    print(solve(matrix, 0))`,
            expected: "4",
          },
        }
      ),
    ],
  },
  {
    id: 8,
    title: "Final Boss",
    subtitle: "The hardest rectangle challenge in the journey",
    nodes: [
      learn(
        8,
        1,
        "Final Strategy",
        "The boss stage combines everything: 2D thinking, prefix sums, and careful searching. Break the matrix into smaller row bands, test each compressed array, and keep the best result that stays within the limit.",
        [
          "Break the matrix into row ranges.",
          "Compress rows into one array.",
          "Use prefix sums to test the result quickly.",
        ],
        "Plan",
        `split -> compress -> count`
      ),
      learn(
        8,
        2,
        "Stay Calm",
        "Hard problems become easier when you reduce them to a familiar smaller problem. In this topic, the hard rectangle question becomes manageable when you remember the 1D prefix logic hiding inside it.",
        [
          "Ask what smaller problem repeats inside the big one.",
          "Prefix sums often reveal that smaller problem.",
          "One good reduction can save a lot of work.",
        ],
        "Mindset",
        `make the problem look like a prefix-sum problem`
      ),
      battle(
        8,
        3,
        "Max Rectangle No Larger Than K",
        "Very Hard",
        {
          statement: "Given matrix and k, return the maximum sum of any rectangle such that the sum is less than or equal to k.",
          exampleInput: "matrix = [[1,0,1],[0,-2,3]], k = 2",
          exampleOutput: "2",
          exampleExplanation: "One valid rectangle is the first row [1, 0, 1], whose sum is 2. No rectangle has sum > 2 while still staying <= k.",
        },
        {
          java: {
            starterCode: `static int solve(int[][] matrix, int k) {
    // Write your code here
    return 0;
}`,
            harness: `public static void main(String[] args) {
    int[][] matrix = new int[][]{{1, 0, 1}, {0, -2, 3}};
    int result = solve(matrix, 2);
    System.out.println(result);
}`,
            expected: "2",
          },
          python: {
            starterCode: `def solve(matrix, k):
    # Write your code here
    return 0`,
            harness: `if __name__ == "__main__":
    matrix = [[1, 0, 1], [0, -2, 3]]
    print(solve(matrix, 2))`,
            expected: "2",
          },
        }
      ),
    ],
  },
];

export { pages as curriculumPages, TOTAL_PAGES };
export default pages;
