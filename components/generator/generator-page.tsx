"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/use-credits";
import { ShitpostResponse, ShitpostPrompt, GenerationStatus } from "@/types";
import { generateShitpost } from "@/lib/gemini";
import { PromptForm } from "@/components/generator/prompt-form";
import { ResultCard } from "@/components/generator/result-card";
import { Favorites } from "@/components/generator/favorites";
import { PageHeader } from "@/components/ui/page-header";
import { ModeToggle } from "@/components/mode-toggle";
import { PaymentModal } from "@/components/generator/payment-modal";
import { CreditsDisplay } from "@/components/generator/credits-display";

export default function GeneratorPage() {
  const [results, setResults] = useState<ShitpostResponse[]>([]);
  const [favorites, setFavorites] = useState<ShitpostResponse[]>([]);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { toast } = useToast();
  const { credits, useCredit, addCredits } = useCredits(2); // Start with 2 free credits

  const handleGenerate = async (prompt: ShitpostPrompt) => {
    // Check if user has credits
    if (credits <= 0) {
      setIsPaymentModalOpen(true);
      return;
    }

    setStatus("loading");
    
    try {
      // Consume a credit
      useCredit();
      
      const response = await generateShitpost(prompt);
      setResults([response, ...results.slice(0, 4)]); // Keep last 5 results
      setStatus("success");
    } catch (error) {
      console.error("Generation error:", error);
      setStatus("error");
      toast.error(
        "Generation Failed",
        {
          description: error instanceof Error ? error.message : "Failed to generate shitpost. Try again.",
        }
      );
    }
  };

  const handleFavorite = (post: ShitpostResponse) => {
    if (favorites.some(fav => fav.id === post.id)) {
      setFavorites(favorites.filter(fav => fav.id !== post.id));
      toast(
        "Removed from favorites",
        {
          description: "The post has been removed from your favorites.",
        }
      );
    } else {
      setFavorites([post, ...favorites]);
      toast(
        "Added to favorites",
        {
          description: "The post has been added to your favorites.",
        }
      );
    }
  };

  const clearResults = () => {
    setResults([]);
    toast(
      "Results cleared",
      {
        description: "All generated posts have been cleared.",
      }
    );
  };

  const handleBuyCredits = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (purchasedCredits: number) => {
    // Add purchased credits to the user's account
    addCredits(purchasedCredits);
    
    toast.success(
      "Credits Added",
      {
        description: `${purchasedCredits} credits have been added to your account!`,
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            title="Shitpost Generator"
            description="Create viral-worthy content for X/Twitter with AI"
          />
          <ModeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <CreditsDisplay 
              credits={credits} 
              onBuyCredits={handleBuyCredits} 
            />
            <PromptForm 
              onGenerate={handleGenerate} 
              status={status} 
              disableButton={credits <= 0}
            />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {results.length > 0 && (
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold">Generated Posts</h2>
                  <button 
                    onClick={clearResults}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
              
              {status === "loading" && (
                <div className="rounded-lg border p-8 text-center">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                    <div className="h-4 bg-muted rounded w-5/6 mx-auto"></div>
                  </div>
                  <p className="text-muted-foreground mt-4">Generating your shitpost...</p>
                </div>
              )}
              
              {results.length === 0 && status !== "loading" && (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">
                    Your generated posts will appear here. Fill out the form to get started.
                  </p>
                </div>
              )}
              
              {results.map((result) => (
                <ResultCard
                  key={result.id}
                  post={result}
                  onFavorite={() => handleFavorite(result)}
                  isFavorite={favorites.some(fav => fav.id === result.id)}
                />
              ))}
            </div>
            
            {favorites.length > 0 && (
              <Favorites 
                favorites={favorites} 
                onRemove={(post) => handleFavorite(post)} 
              />
            )}
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}