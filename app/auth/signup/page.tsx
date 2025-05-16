"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/signup-form";
import { useAuth } from "@/lib/auth-context";

export default function SignUpPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (user) {
      router.push("/generator");
    }
  }, [user, router]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Sign Up</h1>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <SignUpForm />
      </div>
    </div>
  );
} 