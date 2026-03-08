export async function getGitHubData(username: string) {
    try {
      const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
      };
  
      // Optional: add a token to avoid rate limits
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
  
      const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
      if (!userRes.ok) throw new Error(`GitHub user API returned ${userRes.status}`);
      const user = await userRes.json();
  
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos?sort=stars&per_page=6`,
        { headers }
      );
      if (!reposRes.ok) throw new Error(`GitHub repos API returned ${reposRes.status}`);
      const repos = await reposRes.json();
  
      return {
        public_repos: user.public_repos || 0,
        followers: user.followers || 0,
        repos: repos.map((r: any) => ({
          name: r.name,
          desc: r.description || "",
          language: r.language || "Code",
          stars: r.stargazers_count || 0,
          url: r.html_url,
        })),
      };
    } catch (e) {
      console.error("GitHub API error:", e);
      return null;
    }
  }