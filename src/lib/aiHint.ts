// Groq-powered DSA hint — throttled to avoid rate limits
// Place at: src/lib/aiHint.ts

let lastHintCall = 0;
const HINT_COOLDOWN_MS = 3000; // 3s between calls

export async function getAIHint(
  name: string,
  topic: string,
  difficulty: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) return "⚠️ Add VITE_GROQ_API_KEY to your .env file to enable hints.";

  // Throttle: wait if called too fast
  const wait = HINT_COOLDOWN_MS - (Date.now() - lastHintCall);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastHintCall = Date.now();

  const prompt = `Give a concise hint (NOT the full solution) for the DSA problem: "${name}"
Topic: ${topic} | Difficulty: ${difficulty}

Format your response exactly like this:
💡 **Approach**: [1 sentence on the right data structure or technique to use]
🔑 **Key Insight**: [The single most important trick or observation]
⏱️ **Target Complexity**: [Expected time and space complexity]

Rules: Under 80 words total. No code. No spoilers.`;

  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
          max_tokens: 200,
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content: "You are a concise DSA mentor. Give hints that guide without spoiling. Always follow the exact format requested.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, attempt * 5000));
          continue;
        }
        return "⚠️ Rate limit hit. Groq free tier allows 30 req/min. Wait a moment and try again.";
      }

      if (!res.ok) {
        if (res.status === 401) return "⚠️ Invalid Groq API key. Check VITE_GROQ_API_KEY in .env.";
        return `⚠️ API error (${res.status}): ${data?.error?.message || "Unknown error"}`;
      }

      return data?.choices?.[0]?.message?.content || "Unable to generate hint right now.";
    } catch (e: any) {
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      return `⚠️ Network error: ${e?.message || "Unknown"}`;
    }
  }

  return "⚠️ Failed after retries. Please try again.";
}