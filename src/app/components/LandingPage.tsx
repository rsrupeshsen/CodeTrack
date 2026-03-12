import { useNavigate } from "react-router";
import {
  BarChart3,
  Code2,
  Trophy,
  Bot,
  ArrowRight,
  Zap,
  CheckCircle2,
  Star,
  Users,
  TrendingUp,
  Target,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Track your coding progress with comprehensive analytics from LeetCode, GFG, and GitHub all in one place.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Code2,
    title: "Question Tracker",
    desc: "Organize problems by sheets (Blind 75, NeetCode 150, Striver SDE) with custom notes and AI hints.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Trophy,
    title: "Contest Calendar",
    desc: "Never miss a coding contest. Track upcoming competitions across all major platforms in one dashboard.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    desc: "Get personalized problem recommendations, hints, and daily coding plans powered by AI.",
    color: "from-green-500 to-emerald-500",
  },
];

const platforms = [
  { name: "LeetCode", color: "#FFA116", icon: "🧩" },
  { name: "GeeksForGeeks", color: "#2F8D46", icon: "📗" },
  { name: "GitHub", color: "#6E5494", icon: "💻" },
  { name: "CodeChef", color: "#5B4638", icon: "👨‍🍳" },
  { name: "Codeforces", color: "#1F8ACB", icon: "🏆" },
];

const benefits = [
  "Track all coding platforms in one place",
  "Beautiful public portfolio with shareable URL",
  "AI-powered problem recommendations",
  "Contest calendar with reminders",
  "Detailed analytics and heatmaps",
  "Completely free forever",
];

export function LandingPage() {
  const navigate = useNavigate();

  // Demo route handler - goes to demo profile page
  const handleDemoClick = () => {
    navigate("/demo");
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-primary text-sm font-medium">
                Track, Analyze & Share
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
              Your All-in-One
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Coding Portfolio
              </span>
            </h1>

            <p className="text-muted-foreground text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
              <span className="text-foreground font-semibold">CodeFolio</span>{" "}
              helps you navigate and track your coding journey to success.
              Aggregate your profiles from LeetCode, GFG, and GitHub in one
              beautiful dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all inline-flex items-center justify-center gap-2 font-semibold text-lg group"
              >
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleDemoClick}
                className="border-2 border-primary/20 bg-card text-foreground px-8 py-4 rounded-xl hover:bg-primary/5 hover:border-primary/40 transition-all inline-flex items-center justify-center gap-2 font-semibold text-lg"
              >
                View Live Demo
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              ✨ No credit card required • 🚀 Setup in 2 minutes • 💯 Forever
              free
            </p>
          </div>
        </div>
      </section>

      {/* Demo Preview - Main Dashboard */}
      <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Track, Analyze & Share
            </h2>
            <p className="text-muted-foreground text-lg">
              <span className="text-primary font-semibold">CodeFolio</span>{" "}
              helps you navigate and track your coding journey to success
            </p>
          </div>

          {/* Main Screenshot - Dashboard */}
          <div className="rounded-2xl border-2 border-border/50 bg-card/50 p-3 shadow-2xl shadow-primary/5 mb-8">
            <img
              src="/Demo images/dashboard 1.jpeg"
              alt="CodeFolio Dashboard"
              className="w-full rounded-xl"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="hidden bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl p-12 text-center">
              <Code2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Integration */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Your Favourite Coding Platforms
          </h3>
          <p className="text-muted-foreground mb-12">
            Streamlined in CodeFolio to simplify your coding journey
          </p>

          <div className="flex flex-wrap justify-center items-center gap-8">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-3 bg-card border border-border rounded-2xl px-6 py-4 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <span className="text-3xl">{platform.icon}</span>
                <span className="font-semibold text-foreground">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase with Images */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-6xl mx-auto">
          {/* Analytics Feature */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span className="text-blue-500 text-sm font-medium">
                  Analytics
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Comprehensive Analytics Dashboard
              </h3>
              <p className="text-muted-foreground text-lg mb-6">
                Track your progress across all platforms with detailed
                analytics, heatmaps, and insights. See your coding patterns,
                strengths, and areas for improvement at a glance.
              </p>
              <ul className="space-y-3">
                {[
                  "Platform-wise problem breakdown",
                  "Difficulty distribution charts",
                  "GitHub contribution heatmap",
                  "Contest rating progress",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/50 p-2 shadow-xl">
              <img
                src="/Demo images/analytics1.jpeg"
                alt="Analytics Dashboard"
                className="w-full rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
              <div className="hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-12 text-center">
                <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <p className="text-muted-foreground">Analytics Preview</p>
              </div>
            </div>
          </div>

          {/* Question Tracker Feature */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1 rounded-2xl border border-border/50 bg-card/50 p-2 shadow-xl">
              <img
                src="/Demo images/question tracker 1.jpeg"
                alt="Question Tracker"
                className="w-full rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
              <div className="hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-12 text-center">
                <Code2 className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Question Tracker Preview
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-4">
                <Code2 className="w-4 h-4 text-purple-500" />
                <span className="text-purple-500 text-sm font-medium">
                  Question Tracker
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Organize Your Problem Solving
              </h3>
              <p className="text-muted-foreground text-lg mb-6">
                Track problems from popular sheets like Blind 75, NeetCode 150,
                and Striver SDE. Add custom notes, get AI hints, and never lose
                track of your progress.
              </p>
              <ul className="space-y-3">
                {[
                  "Blind 75, NeetCode 150, Striver SDE sheets",
                  "Company-wise question filtering",
                  "Custom notes and AI-powered hints",
                  "Progress tracking with status indicators",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contest Tracker Feature */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-4">
                <Trophy className="w-4 h-4 text-orange-500" />
                <span className="text-orange-500 text-sm font-medium">
                  Contests
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Never Miss a Contest
              </h3>
              <p className="text-muted-foreground text-lg mb-6">
                Stay updated with upcoming coding contests across all major
                platforms. Get calendar view with detailed contest information
                and timings.
              </p>
              <ul className="space-y-3">
                {[
                  "Multi-platform contest calendar",
                  "Upcoming and past contests",
                  "Contest details and registration links",
                  "Track your contest participation",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/50 p-2 shadow-xl">
              <img
                src="/Demo images/contesttracker1.jpeg"
                alt="Contest Tracker"
                className="w-full rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
              <div className="hidden bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-12 text-center">
                <Trophy className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <p className="text-muted-foreground">Contest Tracker Preview</p>
              </div>
            </div>
          </div>

          {/* AI Assistant Feature */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 rounded-2xl border border-border/50 bg-card/50 p-2 shadow-xl">
              <img
                src="/Demo images/ai assistant.jpeg"
                alt="AI Assistant"
                className="w-full rounded-xl"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden",
                  );
                }}
              />
              <div className="hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-12 text-center">
                <Bot className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">AI Assistant Preview</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
                <Bot className="w-4 h-4 text-green-500" />
                <span className="text-green-500 text-sm font-medium">
                  AI Powered
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Your Personal Coding Mentor
              </h3>
              <p className="text-muted-foreground text-lg mb-6">
                Get AI-powered hints, problem recommendations, and personalized
                coding plans. Let AI analyze your progress and suggest the best
                next steps.
              </p>
              <ul className="space-y-3">
                {[
                  "Smart problem recommendations",
                  "AI-generated hints and approaches",
                  "Personalized daily coding plans",
                  "Analysis of your coding patterns",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Public Profile Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-primary text-sm font-medium">Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Your All-in-One Coding Portfolio
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Generate a beautiful public profile showcasing your coding journey.
            Share your achievements with a single link.
          </p>

          <div className="rounded-2xl border-2 border-border/50 bg-card/50 p-3 shadow-2xl shadow-primary/5">
            <img
              src="/Demo images/profile 1.jpeg"
              alt="Public Profile"
              className="w-full rounded-xl"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="hidden bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl p-16 text-center">
              <Users className="w-20 h-20 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                Public Profile Preview
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Integration */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-2 border-primary/20 rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Code2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to Build Your Coding Portfolio?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are tracking their coding journey
              with CodeFolio. Start for free — no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all inline-flex items-center justify-center gap-2 font-semibold text-lg group"
              >
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleDemoClick}
                className="border-2 border-primary/20 bg-background text-foreground px-8 py-4 rounded-xl hover:bg-primary/5 hover:border-primary/40 transition-all inline-flex items-center justify-center gap-2 font-semibold text-lg"
              >
                Try Live Demo
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              {benefits.slice(0, 3).map((benefit) => (
                <span key={benefit} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-7 h-7 text-primary" />
                <span className="text-xl font-bold text-foreground">
                  Code<span className="text-primary">Folio</span>
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Your coding journey, beautifully tracked.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleDemoClick}
                    className="hover:text-foreground transition-colors"
                  >
                    Demo
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/signup")}
                    className="hover:text-foreground transition-colors"
                  >
                    Sign Up
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 CodeFolio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
