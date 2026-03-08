export async function getGitHubData(username: string) {
    try {
      const user = await fetch(`https://api.github.com/users/${username}`)
        .then(r => r.json());
  
      const repos = await fetch(
        `https://api.github.com/users/${username}/repos?sort=stars&per_page=6`
      ).then(r => r.json());
  
      return {
        public_repos: user.public_repos || 0,
        followers: user.followers || 0,
        repos: repos.map((r: any) => ({
          name: r.name,
          desc: r.description || "",
          language: r.language || "Code",
          stars: r.stargazers_count || 0,
          url: r.html_url
        }))
      };
  
    } catch (e) {
      console.error(e);
      return null;
    }
  }