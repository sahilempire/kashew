"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to AI page if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/ai");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-t-2 border-vibrant-yellow animate-spin"></div>
          <div className="absolute inset-[4px] rounded-full border-r-2 border-vibrant-pink animate-spin animate-reverse"></div>
          <div className="absolute inset-[8px] rounded-full border-b-2 border-vibrant-green animate-spin animate-delay-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-6">
        {!user && <AuthForm />}
      </div>
    </div>
  );
}
