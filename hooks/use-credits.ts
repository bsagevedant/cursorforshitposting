import { useState, useEffect } from "react";

interface UseCreditsReturn {
  credits: number;
  useCredit: () => boolean;
  hasCredits: boolean;
  resetCredits: () => void;
  addCredits: (amount: number) => void;
}

export function useCredits(initialCredits: number = 2): UseCreditsReturn {
  const [credits, setCredits] = useState<number>(initialCredits);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Load credits from localStorage on mount
  useEffect(() => {
    const storedCredits = localStorage.getItem("user-credits");
    if (storedCredits !== null) {
      setCredits(parseInt(storedCredits, 10));
    } else {
      // Initialize with default free credits if not set
      localStorage.setItem("user-credits", initialCredits.toString());
    }
    setLoaded(true);
  }, [initialCredits]);

  // Save credits to localStorage when they change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("user-credits", credits.toString());
    }
  }, [credits, loaded]);

  const useCredit = (): boolean => {
    if (credits > 0) {
      setCredits(prev => prev - 1);
      return true;
    }
    return false;
  };

  const resetCredits = () => {
    setCredits(initialCredits);
  };

  const addCredits = (amount: number) => {
    setCredits(prev => prev + amount);
  };

  return {
    credits,
    useCredit,
    hasCredits: credits > 0,
    resetCredits,
    addCredits
  };
} 