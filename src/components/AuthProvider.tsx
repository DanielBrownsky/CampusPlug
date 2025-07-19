
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  isSeller?: boolean;
  isVerified?: boolean;
  isVerifiedSeller?: boolean;
  isPremiumSeller?: boolean;
  isPremium?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  isLoggedIn: boolean;
  updateUser: (data: Partial<AuthUser>) => void; // 👈 new!
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(
    JSON.parse(localStorage.getItem("campusplug-user") || "null")
  );

  const login = (newUser: AuthUser) => {
    localStorage.setItem("campusplug-user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("campusplug-user");
    setUser(null);
  };

  // ✅ Update just part of the user (e.g., after going premium)
  const updateUser = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    localStorage.setItem("campusplug-user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoggedIn: !!user, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
