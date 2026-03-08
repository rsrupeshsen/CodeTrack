const BASE = import.meta.env.VITE_LEETCODE_API_URL;

export async function getLeetCodeStats(username: string) {
  try {
    const solved = await fetch(`${BASE}/${username}/solved`).then(r => r.json());
    const contest = await fetch(`${BASE}/${username}/contest`).then(r => r.json());

    return {
      totalSolved: solved.solvedProblem || 0,
      easySolved: solved.easySolved || 0,
      mediumSolved: solved.mediumSolved || 0,
      hardSolved: solved.hardSolved || 0,
      contestRating: Math.round(contest.contestRating || 0),
    };

  } catch (e) {
    console.error(e);
    return null;
  }
}