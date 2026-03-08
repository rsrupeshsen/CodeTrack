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
  name: "Rupesh Kumar",
  email: "rupesh@example.com",
  username: "rupeshkumar",
  bio: "Full Stack Developer | Competitive Programmer",
  techStack: "React, TypeScript, Python, C++, Node.js, PostgreSQL, Docker, AWS",
  leetcode: "rupesh_lc",
  codechef: "rupesh_cc",
  github: "rupeshkumar",
  website: "https://rupeshkumar.dev",
  linkedin: "https://linkedin.com/in/rupeshkumar",
  twitter: "https://twitter.com/rupeshkumar",
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(defaultUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
