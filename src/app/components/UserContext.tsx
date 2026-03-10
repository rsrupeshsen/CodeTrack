import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
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

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId,   setUserId]   = useState<string | null>(null);
  const [user,     setUserState] = useState<UserData>(defaultUser);
  const [hydrated, setHydrated]  = useState(false);

  const loadUser = async () => {
    try {
      const appwriteUser = await getUser();

      if (!appwriteUser) {
        // No session — make sure we show empty state
        setUserState(defaultUser);
        setUserId(null);
        setHydrated(true);
        return;
      }

      const uid = appwriteUser.$id;
      setUserId(uid);

      // 1️⃣ Always try Appwrite DB first — source of truth
      try {
        const dbProfile = await getProfileByUserId(uid);
        if (dbProfile) {
          setUserState({
            ...defaultUser,
            name:      dbProfile.name      || appwriteUser.name  || "Developer",
            email:     appwriteUser.email  || "",
            username:  dbProfile.username  || "",
            bio:       dbProfile.bio       || "",
            techStack: dbProfile.techStack || "",
            leetcode:  dbProfile.leetcode  || "",
            gfg:       dbProfile.gfg       || "",
            github:    dbProfile.github    || "",
            website:   dbProfile.website   || "",
            linkedin:  dbProfile.linkedin  || "",
            twitter:   dbProfile.twitter   || "",
          });
          // Sync localStorage cache for this specific user
          localStorage.setItem(userStorageKey(uid, "profile"), JSON.stringify(dbProfile));
          setHydrated(true);
          return;
        }
      } catch (dbErr) {
        console.warn("Appwrite DB fetch failed, falling back to localStorage:", dbErr);
      }

      // 2️⃣ Fallback: localStorage cache for THIS specific user only
      try {
        const saved = localStorage.getItem(userStorageKey(uid, "profile"));
        if (saved) {
          const parsed = JSON.parse(saved);
          setUserState({
            ...defaultUser,
            ...parsed,
            name:  parsed.name  || appwriteUser.name  || "Developer",
            email: appwriteUser.email || "",
          });
        } else {
          // 3️⃣ Brand new user — only use Appwrite account info
          setUserState({
            ...defaultUser,
            name:  appwriteUser.name  || "Developer",
            email: appwriteUser.email || "",
          });
        }
      } catch {
        setUserState({
          ...defaultUser,
          name:  appwriteUser.name  || "Developer",
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
        localStorage.setItem(userStorageKey(userId, "profile"), JSON.stringify(newUser));
      } catch {}
    }
  };

  const logout = async () => {
    // 🔑 Clear THIS user's localStorage before signing out
    if (userId) {
      try {
        localStorage.removeItem(userStorageKey(userId, "profile"));
      } catch {}
    }
    await signOut();
    // Reset to empty default — next login will load fresh from Appwrite DB
    setUserState(defaultUser);
    setUserId(null);
  };

  // Expose reloadUser so other components can trigger a fresh DB fetch
  const reloadUser = async () => {
    await loadUser();
  };

  if (!hydrated) return null;

  return (
    <UserContext.Provider value={{ user, setUser, userId, logout, reloadUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}