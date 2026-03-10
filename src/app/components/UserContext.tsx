import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getUser, signOut } from "../../lib/auth";

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
  userId: string | null;       // Appwrite $id — used to scope localStorage keys
  logout: () => Promise<void>;
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
});

// ── Key helpers ────────────────────────────────────────────────────────────────
// All localStorage keys are scoped by Appwrite user ID so different users
// on the same browser never share data.

export function userStorageKey(userId: string, key: string) {
  return `codefolio:${userId}:${key}`;
}

// ── Provider ───────────────────────────────────────────────────────────────────

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId,   setUserId]   = useState<string | null>(null);
  const [user,     setUserState] = useState<UserData>(defaultUser);
  const [hydrated, setHydrated]  = useState(false);

  // On mount: get Appwrite session, derive the user-scoped key, load saved profile
  useEffect(() => {
    getUser().then(appwriteUser => {
      if (!appwriteUser) {
        setHydrated(true);
        return;
      }

      const uid = appwriteUser.$id;
      setUserId(uid);

      // Load this specific user's profile from localStorage
      try {
        const saved = localStorage.getItem(userStorageKey(uid, "profile"));
        if (saved) {
          const parsed = JSON.parse(saved);
          // Always use Appwrite's name/email as source of truth
          setUserState({
            ...defaultUser,
            ...parsed,
            name:  parsed.name  || appwriteUser.name  || "Developer",
            email: appwriteUser.email || "",
          });
        } else {
          // First login for this user — seed from Appwrite account
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

      setHydrated(true);
    });
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
    await signOut();
    // Clear in-memory state but do NOT delete localStorage — user data stays
    // so it's ready when they log back in
    setUserState(defaultUser);
    setUserId(null);
  };

  // Don't render children until we've attempted to load from storage
  // (prevents flash of empty/wrong data)
  if (!hydrated) return null;

  return (
    <UserContext.Provider value={{ user, setUser, userId, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}