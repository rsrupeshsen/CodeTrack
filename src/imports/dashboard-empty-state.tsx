/*
Add empty state UI for when no platform username is connected.
In the Dashboard page, if lc_username is null/empty:
Replace the LeetCode stats card with an empty state card showing:
- A faded LeetCode logo icon
- Text: 'Connect LeetCode to see your stats'
- An indigo 'Connect' button that links to /dashboard/settings
Same pattern for CodeChef and GitHub cards.
In the Analytics page, if no data exists:
Show a centered empty state with:
- A BarChart3 icon (muted color, large)
- Heading: 'No analytics yet'
- Subtext: 'Connect your coding platforms in Settings to see insights'
- Button: 'Go to Settings'
Style: bg-card, border border-border border-dashed, rounded-2xl, p-8
Keep consistent with the existing dark design system.
DESIGN
PROMPT 3 Public Profile Page (/user/[username])
CodeFolio · Design Prompts + Backend Guide Complete Improvement Playbook
CodeFolio Improvement Guide · March 2026 Page 6
Create a new PUBLIC profile page accessible at /user/:username
This is DIFFERENT from the dashboard Portfolio tab.
This page has NO sidebar and works without login.
Create a new file: src/app/components/PublicProfilePage.tsx
Add route in routes.ts: { path: '/user/:username', Component: PublicProfilePage }
Page layout (no sidebar, full width, max-w-4xl mx-auto):
SECTION 1 — Hero header:
• Large avatar circle with initials (80px)
• Name (2xl bold) + @username handle (muted)
• Bio text
• Skill/tech stack pills (same as settings techStack field)
• Row of platform icons linking to their profiles
SECTION 2 — Stats bar (4 columns, cards):
Total Solved | LeetCode Rating | CodeChef Stars | GitHub Repos
SECTION 3 — Platform stat cards (same design as dashboard cards)
Only show platforms where username is set.
SECTION 4 — GitHub Repos grid (2 columns):
Repo name, description, language dot+label, stars count
SECTION 5 — Footer CTA:
'Create your own CodeFolio — it's free' + Sign Up button
No auth required. Uses dark theme. Fully mobile responsive.
CodeFolio · Design Prompts + Backend Guide Complete Improvement Playbook
CodeFolio Improvement Guide · March 2026 Page 7
DESIGN
PROMPT 4 Fix Auth Forms — Validation + Error Messages
Improve Login and Signup pages with proper form validation and error UI.
LOGIN PAGE changes:
1. Add state: const [error, setError] = useState('')
2. Validate on submit: if email empty → setError('Email is required')
3. If password empty → setError('Password is required')
4. Show error as a red alert box above the submit button:
bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 text-sm
5. Add 'Forgot password?' link (right-aligned, text-primary, text-sm)
between password field and submit button
6. Add loading spinner inside Sign In button while submitting:
Replace button text with a Loader2 icon (animate-spin) during load
SIGNUP PAGE changes:
1. Validate passwords match — show error if they don't
2. Add terms checkbox before submit button
3. Disable submit if terms not checked
4. Show password strength indicator (weak/medium/strong) below password field
Use colored bar: red < 6 chars, orange 6-10 chars, green 10+ chars
Keep all existing dark styling. Just add the validation logic and error UI.
DESIGN
PROMPT 5 Settings — Add Username + Public URL Display
CodeFolio · Design Prompts + Backend Guide Complete Improvement Playbook
CodeFolio Improvement Guide · March 2026 Page 8
Add a username field and public profile URL display to the Settings page.
In SettingsPage.tsx, add to the form state:
username: 'johndoe' (new field)
Add this new field AFTER the Full Name field:
Label: 'Your Username'
Input with @ prefix: show '@' symbol inside the left side of the input
Below input: 'Only letters, numbers, and underscores'
Add a new section at the BOTTOM of the settings page (before Save button):
Card with title: 'Your Public Profile URL'
Shows: codefolio.vercel.app/user/{username} (or placeholder if no username)
Right side: Copy button (Copy icon from lucide-react)
On copy click: show 'Copied!' tooltip for 2 seconds using useState
Card has a subtle indigo border: border-primary/30
Also add: 'View public profile →' link above the Save button
that opens /user/{username} in a new tab.
Keep dark theme. Add to existing SettingsPage.tsx.
DESIGN
PROMPT 6 Dashboard — Dynamic User Name
Replace all hardcoded 'John Doe' and 'JD' references with dynamic data.
Create a user context or pass user data as props.
In DashboardLayout.tsx:
Replace hardcoded 'John Doe' in the topbar with {user?.name || 'Developer'}
Replace 'JD' avatar initials with first 2 letters of user name:
const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
In DashboardHome.tsx:
Replace 'Welcome back, John ■' with 'Welcome back, {firstName} ■'
For now, create a simple mock user object at the top of DashboardLayout:
const mockUser = { name: 'Rupesh Kumar', email: 'rupesh@example.com' }
Pass it as props to child pages via React Router context or props.
This makes it easy to swap in real Supabase auth data later.
Do not change any styling — just make the name dynamic.
CodeFolio · Design Prompts + Backend Guide Complete Improvement Playbook
CodeFolio Improvement Guide · March 2026 Page 9
DESIGN
PROMPT 7 AI Assistant — Connect to Real OpenAI API
Wire up the AI Coding Assistant to call a real backend API route.
In AICodingAssistant.tsx, replace the fake setTimeout response with:
const handleSend = async (text?: string) => {
const msg = text || input.trim()
if (!msg) return
setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: msg }])
setInput('')
setIsTyping(true)
try {
const res = await fetch('/api/ai-suggest', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ message: msg, stats: statsSummary })
})
const data = await res.json()
setMessages(prev => [...prev, {
id: Date.now()+1, role: 'assistant',
content: data.reply,
problems: data.problems || []
}])
} catch (e) {
setMessages(prev => [...prev, { id: Date.now()+1, role: 'assistant',
content: 'Sorry, I could not connect to the AI service right now.' }])
} finally {
setIsTyping(false)
}
}
NOTE: The actual /api/ai-suggest backend is built separately (see Part 3).
For now just add this fetch call — it will work once the backend is done.
*/