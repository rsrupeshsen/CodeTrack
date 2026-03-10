import React from "react";
import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { PublicLayout } from "./components/PublicLayout";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { OnboardingPage } from "./components/OnboardingPage";
import { AuthCallback } from "./components/AuthCallback";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardHome } from "./components/DashboardHome";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { ContestTracker } from "./components/ContestTracker";
import { QuestionTracker } from "./components/QuestionTracker";
import { AICodingAssistant } from "./components/AICodingAssistant";
import { SettingsPage } from "./components/SettingsPage";
import { PublicProfilePage } from "./components/PublicProfilePage";
// ✅ New auth pages
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { VerifyEmailPage } from "./components/VerifyEmailPage";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        Component: PublicLayout,
        children: [
          { path: "/",       Component: LandingPage  },
          { path: "/login",  Component: LoginPage    },
          { path: "/signup", Component: SignupPage   },
        ],
      },
      { path: "/onboarding",       Component: OnboardingPage      },
      { path: "/auth/callback",    Component: AuthCallback        },
      { path: "/forgot-password",  Component: ForgotPasswordPage  },
      { path: "/reset-password",   Component: ResetPasswordPage   },
      { path: "/verify-email",     Component: VerifyEmailPage     },
      { path: "/user/:username",   Component: PublicProfilePage   },
      {
        path: "/dashboard",
        Component: DashboardLayout,
        children: [
          { index: true,           Component: DashboardHome    },
          { path: "analytics",     Component: AnalyticsPage    },
          { path: "contests",      Component: ContestTracker   },
          { path: "questions",     Component: QuestionTracker  },
          { path: "ai",            Component: AICodingAssistant},
          { path: "profile",       Component: PublicProfilePage},
          { path: "settings",      Component: SettingsPage     },
        ],
      },
    ],
  },
]);