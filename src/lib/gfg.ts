export async function getGFGStats(username: string) {
    try {
      const res = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://gfgstatscard.vercel.app/${username}?raw=true`)}`
      );
  
      const data = await res.json();
  
      if (!data.userHandle) return null;
  
      return {
        totalSolved: data.total_problems_solved ?? 0,
        totalScore: data.total_score ?? 0,
        monthlyScore: data.monthly_score ?? 0,
        streak: data.pod_solved_current_streak ?? 0,
        school: data.School ?? 0,
        basic: data.Basic ?? 0,
        easy: data.Easy ?? 0,
        medium: data.Medium ?? 0,
        hard: data.Hard ?? 0,
      };
    } catch (e) {
      console.error("GFG API error:", e);
      return null;
    }
  }