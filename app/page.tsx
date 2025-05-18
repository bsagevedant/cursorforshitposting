"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect to generator if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push("/generator");
    }
  }, [user, loading, router]);

  const handleGetStarted = () => {
    router.push("/auth/signin");
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-background">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            AI Shitpost Generator
          </h1>
          <p className="text-xl mb-12 text-muted-foreground">
            Create viral-worthy content for social media with the power of AI
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="text-lg px-8 py-6 rounded-full font-semibold transition-all hover:scale-105"
          >
            Get Started
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}