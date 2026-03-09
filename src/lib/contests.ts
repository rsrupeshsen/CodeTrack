export async function getUpcomingContests() {
    try {
      const data = await fetch("https://kontests.net/api/v1/all").then(r => r.json());
      return data
        .filter((c: any) => c.site === "LeetCode" || c.site === "CodeChef")
        .sort((a: any, b: any) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        .map((c: any) => ({
          id:         c.name,
          name:       c.name,
          platform:   c.site,
          url:        c.url,
          date:       c.start_time,
          duration:   c.duration,
          color:      c.site === "LeetCode" ? "#f59e0b" : "#8b5cf6",
          registered: false,
        }));
    } catch (e) {
      console.error("Contests API error:", e);
      return [];
    }
  }