import React from "react";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface UserData {
  name: string;
  email: string;
  username: string;
  bio: string;
  techStack: string;
  leetcode: string;
  codechef: string;
  github: string;
  website: string;
  linkedin: string;
  twitter: string;
}

interface UserContextType {
  user: UserData;
  setUser: (user: UserData) => void;
}

const defaultUser: UserData = {
  name: "",
  email: "",
  username: "",
  bio: "",
  techStack: "",
  leetcode: "",
  codechef: "",
  github: "",
  website: "",
  linkedin: "",
  twitter: "",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(() => {
    try {
      const saved = localStorage.getItem("codefolio_user");
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<UserData>;
        return { ...defaultUser, ...parsed };
      }
    } catch (err) {
      console.error("Failed to parse saved user:", err);
    }
    return defaultUser;
  });

  const updateUser = (newUser: UserData) => {
    setUser(newUser);
    try {
      localStorage.setItem("codefolio_user", JSON.stringify(newUser));
    } catch (err) {
      console.error("Failed to save user:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return context;
}