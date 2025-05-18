"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect } from "react";
import Link from "next/link";
import { TypeAnimation } from 'react-type-animation';

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
          <Link 
            href="https://x.com/sageadvik" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mb-8 hover:opacity-80 transition-opacity"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 fill-current"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </Link>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            <TypeAnimation
              sequence={[
                'AI Shitpost Generator',
                1000,
                'AI Shitpost Generator',
                1000,
              ]}
              wrapper="span"
              speed={7}
              repeat={Infinity}
              cursor={true}
            />
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