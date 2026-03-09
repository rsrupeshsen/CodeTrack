export async function getGitHubData(username: string) {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`),
    ]);

    const user = await userRes.json();
    const repos = await reposRes.json();

    if (user.message === "Not Found") {
      console.error("GitHub user not found:", username);
      return null;
    }

    return {
      public_repos: user.public_repos || 0,
      followers:    user.followers    || 0,
      repos: (Array.isArray(repos) ? repos : [])
        .filter((r: any) => !r.fork)
        .map((r: any) => ({
          name:     r.name,
          desc:     r.description || "",
          language: r.language    || "Code",
          stars:    r.stargazers_count || 0,
          url:      r.html_url,
        })),
    };
  } catch (e) {
    console.error("GitHub API error:", e);
    return null;
  }
}