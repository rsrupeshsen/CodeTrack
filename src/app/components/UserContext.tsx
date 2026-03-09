import { createContext, useContext, useState, type ReactNode } from "react";

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
}

// Empty defaults — user fills these in via Settings or Onboarding
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
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(() => {
    // Restore from localStorage if previously saved
    try {
      const saved = localStorage.getItem("codefolio_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultUser, ...parsed };
      }
    } catch {
      // ignore parse errors
    }
    return defaultUser;
  });

  const updateUser = (newUser: UserData) => {
    setUser(newUser);
    try {
      localStorage.setItem("codefolio_user", JSON.stringify(newUser));
    } catch {
      // ignore storage errors
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}