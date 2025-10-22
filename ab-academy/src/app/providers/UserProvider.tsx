"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Define what your user object looks like
type User = {
  id: number | string;
  name: string;
  email: string;
  role: "admin" | "instructor" | "student" | "blueprint_member";
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserState(parsed);
      } catch (err) {
        console.error("Error parsing stored user:", err);
      }
    }
    setLoading(false);
  }, []);

  // Wrap setUser so it also writes to localStorage
  const setUser = (user: User | null) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setUserState(user);
    } else {
      localStorage.removeItem("user");
      setUserState(null);
    }
  };

  // Logout function — clears both localStorage and state
  const logout = () => {
    localStorage.removeItem("user");
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

// Simple hook for consuming context
export const useUser = () => useContext(UserContext);
