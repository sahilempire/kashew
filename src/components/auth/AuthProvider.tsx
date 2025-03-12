"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication for demo purposes
  useEffect(() => {
    // Check if user is stored in localStorage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("kashew_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const userData = {
        id: "user-123",
        email,
        name: email.split("@")[0],
        isVerified: true,
      };

      setUser(userData);
      if (typeof window !== "undefined") {
        localStorage.setItem("kashew_user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data - not verified yet
      const userData = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        email,
        name,
        isVerified: false,
      };

      setUser(userData);
      if (typeof window !== "undefined") {
        localStorage.setItem("kashew_user", JSON.stringify(userData));
      }

      // In a real app, we would send a verification email here
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("kashew_user");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock Google user data
      const userData = {
        id: "google-user-123",
        email: "user@gmail.com",
        name: "Google User",
        isVerified: true,
      };

      setUser(userData);
      if (typeof window !== "undefined") {
        localStorage.setItem("kashew_user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    if (!user) return;

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, we would send a verification email here
      console.log(`Verification email sent to ${user.email}`);

      // For demo purposes, let's just mark the user as verified
      const updatedUser = { ...user, isVerified: true };
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("kashew_user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Send verification email error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        googleSignIn,
        sendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
