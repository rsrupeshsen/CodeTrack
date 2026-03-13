import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getUser, signOut } from "../../lib/auth";
import { getProfileByUserId } from "../../lib/database";

export interface UserData {
  name: string;
  email: string;
  username: string;
  bio: string;
  techStack: string;
  leetcode: string;
  gfg: string;
  github: string;
  website: string;
  linkedin: string;
  twitter: string;
}

interface UserContextType {
  user: UserData;
  setUser: (user: UserData) => void;
  userId: string | null;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const defaultUser: UserData = {
  name: "Developer",
  email: "",
  username: "",
  bio: "",
  techStack: "",
  leetcode: "",
  gfg: "",
  github: "",
  website: "",
  linkedin: "",
  twitter: "",
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
  userId: null,
  logout: async () => {},
  reloadUser: async () => {},
});

export function userStorageKey(userId: string, key: string) {
  return `codefolio:${userId}:${key}`;
}

// Store last-known userId so we can pre-fill from cache before any async call
const LAST_USER_KEY = "codefolio:lastUserId";

function getInstantProfile(): { uid: string; profile: UserData } | null {
  try {
    const uid = localStorage.getItem(LAST_USER_KEY);
    if (!uid) return null;
    const saved = localStorage.getItem(userStorageKey(uid, "profile"));
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return { uid, profile: { ...defaultUser, ...parsed } };
  } catch {
    return null;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  // Pre-fill from cache immediately — no waiting for async
  const instant = getInstantProfile();
  const [userId, setUserId] = useState<string | null>(instant?.uid ?? null);
  const [user, setUserState] = useState<UserData>(
    instant?.profile ?? defaultUser,
  );
  const [hydrated, setHydrated] = useState(false);

  const loadUser = async () => {
    try {
      // Reset to prevent stale previous-user data bleeding into new session
      setUserState(defaultUser);
      setUserId(null);

      const appwriteUser = await getUser();

      if (!appwriteUser) {
        try {
          localStorage.removeItem(LAST_USER_KEY);
        } catch {}
        setHydrated(true);
        return;
      }

      const uid = appwriteUser.$id;
      setUserId(uid);
      try {
        localStorage.setItem(LAST_USER_KEY, uid);
      } catch {}

      // 1: Appwrite DB — source of truth
      try {
        const dbProfile = await getProfileByUserId(uid);
        if (dbProfile) {
          const merged: UserData = {
            ...defaultUser,
            name: dbProfile.name || appwriteUser.name || "Developer",
            email: appwriteUser.email || "",
            username: dbProfile.username || "",
            bio: dbProfile.bio || "",
            techStack: dbProfile.techStack || "",
            leetcode: dbProfile.leetcode || "",
            gfg: dbProfile.gfg || "",
            github: dbProfile.github || "",
            website: dbProfile.website || "",
            linkedin: dbProfile.linkedin || "",
            twitter: dbProfile.twitter || "",
          };
          setUserState(merged);
          try {
            localStorage.setItem(
              userStorageKey(uid, "profile"),
              JSON.stringify(merged),
            );
          } catch {}
          setHydrated(true);
          return;
        }
      } catch (dbErr) {
        console.warn(
          "Appwrite DB fetch failed, falling back to localStorage:",
          dbErr,
        );
      }

      // 2: Fallback — localStorage cache
      try {
        const saved = localStorage.getItem(userStorageKey(uid, "profile"));
        if (saved) {
          const parsed = JSON.parse(saved);
          setUserState({
            ...defaultUser,
            ...parsed,
            name: parsed.name || appwriteUser.name || "Developer",
            email: appwriteUser.email || "",
          });
        } else {
          setUserState({
            ...defaultUser,
            name: appwriteUser.name || "Developer",
            email: appwriteUser.email || "",
          });
        }
      } catch {
        setUserState({
          ...defaultUser,
          name: appwriteUser.name || "Developer",
          email: appwriteUser.email || "",
        });
      }
    } catch (err) {
      console.error("Failed to load user:", err);
    } finally {
      setHydrated(true);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const setUser = (newUser: UserData) => {
    setUserState(newUser);
    if (userId) {
      try {
        localStorage.setItem(
          userStorageKey(userId, "profile"),
          JSON.stringify(newUser),
        );
      } catch {}
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      if (userId) {
        try {
          localStorage.removeItem(userStorageKey(userId, "profile"));
        } catch {}
      }
      try {
        localStorage.removeItem(LAST_USER_KEY);
      } catch {}
      setUserState(defaultUser);
      setUserId(null);
      window.location.href = "/login";
    }
  };

  const reloadUser = async () => {
    await loadUser();
  };

  // Only show spinner if we have zero cached data AND haven't confirmed session yet
  if (!hydrated && !instant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser, userId, logout, reloadUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
