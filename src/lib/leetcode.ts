const BASE = import.meta.env.VITE_LEETCODE_API_URL;

export async function getLeetCodeStats(username: string) {
  if (!BASE) {
    console.error("VITE_LEETCODE_API_URL is not configured");
    return null;
  }

  try {
    const solvedRes = await fetch(`${BASE}/${username}/solved`);
    if (!solvedRes.ok) throw new Error(`LeetCode solved API returned ${solvedRes.status}`);
    const solved = await solvedRes.json();

    const contestRes = await fetch(`${BASE}/${username}/contest`);
    if (!contestRes.ok) throw new Error(`LeetCode contest API returned ${contestRes.status}`);
    const contest = await contestRes.json();

    return {
      totalSolved: solved.solvedProblem || 0,
      easySolved: solved.easySolved || 0,
      mediumSolved: solved.mediumSolved || 0,
      hardSolved: solved.hardSolved || 0,
      contestRating: Math.round(contest.contestRating || 0),
    };
  } catch (e) {
    console.error("LeetCode API error:", e);
    return null;
  }
}