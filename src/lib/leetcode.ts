export async function getLeetCodeStats(username: string) {
  const BASE = import.meta.env.VITE_LEETCODE_API_URL;

  if (!BASE) {
    console.error("VITE_LEETCODE_API_URL is not set in .env");
    return null;
  }

  try {
    const [solvedRes, contestRes] = await Promise.all([
      fetch(`${BASE}/${username}/solved`),
      fetch(`${BASE}/${username}/contest`),
    ]);

    const solved  = await solvedRes.json();
    const contest = await contestRes.json();

    if (solved.errors || solved.message) {
      console.error("LeetCode user not found or API error:", solved);
      return null;
    }

    return {
      totalSolved:   solved.solvedProblem  || 0,
      easySolved:    solved.easySolved     || 0,
      mediumSolved:  solved.mediumSolved   || 0,
      hardSolved:    solved.hardSolved     || 0,
      contestRating: Math.round(contest.contestRating || 0),
    };
  } catch (e) {
    console.error("LeetCode API error:", e);
    return null;
  }
}