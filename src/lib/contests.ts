export async function getAllContests() {
  try {

    // -------- CODEFORCES API --------

    const res = await fetch(
      "https://codeforces.com/api/contest.list"
    );

    const data = await res.json();

    const upcomingCF = data.result
      .filter((c: any) => c.phase === "BEFORE")
      .slice(0, 6)
      .map((c: any) => ({
        platform: "Codeforces",
        title: c.name,
        start: c.startTimeSeconds,
        duration: c.durationSeconds,
        url: `https://codeforces.com/contest/${c.id}`
      }));


    // -------- MANUAL SCHEDULE (STABLE) --------

    const now = Math.floor(Date.now() / 1000);

    const manual = [

      {
        platform: "LeetCode",
        title: "LeetCode Weekly Contest",
        start: nextSunday(),
        duration: 5400,
        url: "https://leetcode.com/contest/"
      },

      {
        platform: "LeetCode",
        title: "LeetCode Biweekly Contest",
        start: nextSaturday(),
        duration: 5400,
        url: "https://leetcode.com/contest/"
      },

      {
        platform: "CodeChef",
        title: "CodeChef Starters",
        start: nextWednesday(),
        duration: 7200,
        url: "https://www.codechef.com/contests"
      },

      {
        platform: "AtCoder",
        title: "AtCoder Beginner Contest",
        start: nextSaturday(),
        duration: 6000,
        url: "https://atcoder.jp/contests/"
      },

      {
        platform: "HackerEarth",
        title: "HackerEarth Monthly Challenge",
        start: now + 86400 * 10,
        duration: 7200,
        url: "https://www.hackerearth.com/challenges/"
      },

      {
        platform: "GeeksforGeeks",
        title: "GFG Weekly Coding Contest",
        start: now + 86400 * 8,
        duration: 5400,
        url: "https://practice.geeksforgeeks.org/contest/"
      }

    ];

    return [...manual, ...upcomingCF];

  } catch (err) {

    console.error("Contest API error", err);

    return [];

  }
}



function nextSunday() {

  const now = new Date();
  const day = now.getDay();
  const diff = (7 - day) % 7;

  const next = new Date(now.getTime() + diff * 86400000);

  next.setHours(14, 30, 0, 0);

  return Math.floor(next.getTime() / 1000);
}



function nextSaturday() {

  const now = new Date();
  const day = now.getDay();
  const diff = (6 - day + 7) % 7;

  const next = new Date(now.getTime() + diff * 86400000);

  next.setHours(14, 30, 0, 0);

  return Math.floor(next.getTime() / 1000);
}



function nextWednesday() {

  const now = new Date();
  const day = now.getDay();
  const diff = (3 - day + 7) % 7;

  const next = new Date(now.getTime() + diff * 86400000);

  next.setHours(20, 0, 0, 0);

  return Math.floor(next.getTime() / 1000);
}