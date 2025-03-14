"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function ConfirmationSuccessPage() {
  const router = useRouter();

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
            <h1 className="text-2xl font-bold mt-4">Email Verified!</h1>
            <p className="text-muted-foreground text-center mt-2">
              Thank you for verifying your email. Your account is now ready to use.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-vibrant-yellow text-vibrant-black hover:bg-vibrant-yellow/90"
            >
              Continue to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 