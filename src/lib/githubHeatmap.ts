export async function getGitHubContributions(
    username: string,
    year?: number
  ): Promise<{ date: string; count: number }[]> {
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (!token) return [];
  
    const from = year ? `"${year}-01-01T00:00:00Z"` : null;
    const to   = year ? `"${year}-12-31T23:59:59Z"` : null;
    const dateArgs = from ? `(from: ${from}, to: ${to})` : "";
  
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection${dateArgs} {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;
  
    try {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Authorization": `bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables: { username } }),
      });
  
      const json = await res.json();
      const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
  
      return weeks.flatMap((week: any) =>
        week.contributionDays.map((day: any) => ({
          date:  day.date,
          count: day.contributionCount,
        }))
      );
    } catch (e) {
      console.error("GitHub contributions error:", e);
      return [];
    }
  }