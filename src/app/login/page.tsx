"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, isConfigured } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!isConfigured) {
        throw new Error("Authentication is not properly configured. Please check your environment variables.");
      }

      if (isSignUp) {
        if (!name) {
          throw new Error("Name is required");
        }
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      router.push("/ai");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isSignUp
          ? "Failed to create account. Please try again."
          : "Failed to sign in. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-vibrant-yellow/30 hover:border-vibrant-yellow/60 shadow-[0_0_15px_rgba(245,215,66,0.15)] transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/images/Kashew.png"
              alt="Kashew Logo"
              height={48}
              width={48}
              className="object-contain"
            />
            <h1 className="text-2xl font-bold mt-4">Welcome to Kashew</h1>
            <p className="text-muted-foreground text-center mt-2">
              {isSignUp
                ? "Create an account to get started"
                : "Sign in to your account"}
            </p>
          </div>

          {!isConfigured && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Warning!</strong>
              <span className="block sm:inline"> Authentication is not properly configured. Please check your environment variables.</span>
            </div>
          )}

          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading || !isConfigured}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || !isConfigured}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || !isConfigured}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
              disabled={isLoading || !isConfigured}
            >
              {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
              disabled={isLoading || !isConfigured}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 