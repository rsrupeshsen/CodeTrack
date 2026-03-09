export async function getContestInfo(username: string) {
    try {
      const res = await fetch(
        `https://alfa-leetcode-api-production-80f3.up.railway.app/${username}/contest`
      );
  
      const data = await res.json();
  
      if (!data) return null;
  
      return {
        rating: Math.round(data.contestRating),
        globalRank: data.contestGlobalRanking,
        topPercent: data.contestTopPercentage,
        attended: data.contestAttend,
  
        history: data.contestParticipation.map((c: any) => ({
          name: c.contest.title,
          rating: Math.round(c.rating),
        })),
      };
  
    } catch (err) {
      console.error(err);
      return null;
    }
  }