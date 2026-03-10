export interface InsightPayload {
    lcStats: any;
    gfgData: any;
    currentStreak: number;
    longestStreak: number;
    totalSolved: number;
    userName?: string; // pass user's actual name
  }
  
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  
  export async function getAIInsights(payload: InsightPayload): Promise<string> {
    const { lcStats, gfgData, currentStreak, longestStreak, totalSolved, userName } = payload;
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    const name = userName && userName !== "Developer" ? userName : null;
  
    if (!apiKey) return "⚠️ Groq API key not found. Add VITE_GROQ_API_KEY to your .env file.";
  
    const prompt = `You are an expert coding mentor reviewing a developer's competitive programming stats. Give a detailed, well-structured analysis. Always address the developer by their first name "${name || "the developer"}".
  
  Developer: ${name || "Anonymous"}
  Stats:
  - Total Problems Solved: ${totalSolved}
  - LeetCode: ${lcStats?.easySolved || 0} Easy | ${lcStats?.mediumSolved || 0} Medium | ${lcStats?.hardSolved || 0} Hard
  - LeetCode Contest Rating: ${lcStats?.contestRating || "Not rated"}
  - GeeksForGeeks: ${gfgData?.totalSolved || 0} problems | Score: ${gfgData?.totalScore || 0}
  - Current Streak: ${currentStreak} days
  - Longest Streak: ${longestStreak} days
  
  Provide your analysis in this exact format:
  
  📊 **Overall Assessment**
  [2-3 sentences addressing ${name || "the developer"} by name, about their current level and progress]
  
  💪 **Strengths**
  [2 specific strengths based on their numbers, mentioning their name]
  
  🎯 **Areas to Improve**
  [2-3 specific weaknesses with actionable advice]
  
  🚀 **Next Steps**
  [3 concrete, specific goals they should work toward this month]
  
  Be specific, encouraging, reference their actual numbers, and always use their name. Do not cut off mid-sentence.`;
  
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 1024,
            temperature: 0.7,
            messages: [
              {
                role: "system",
                content: "You are an expert coding mentor. Always address developers by their first name when provided. Give structured, personalized, encouraging analysis.",
              },
              { role: "user", content: prompt },
            ],
          }),
        });
  
        const data = await res.json();
  
        if (res.status === 429) {
          if (attempt < maxRetries) { await sleep(attempt * 5000); continue; }
          return "⚠️ Rate limit reached. Please wait a moment and try again.";
        }
        if (!res.ok) {
          if (res.status === 401) return "⚠️ Invalid Groq API key. Check VITE_GROQ_API_KEY in .env.";
          return `⚠️ API error (${res.status}): ${data?.error?.message || JSON.stringify(data)}`;
        }
        return data?.choices?.[0]?.message?.content || "Unable to generate insights right now.";
      } catch (e: any) {
        if (attempt < maxRetries) { await sleep(attempt * 2000); continue; }
        return `⚠️ Network error: ${e?.message || "Unknown error"}`;
      }
    }
    return "⚠️ Failed after multiple attempts. Please try again later.";
  }