import { Button } from "@/components/ui/button";
import { CreditCard, Sparkles } from "lucide-react";

interface CreditsDisplayProps {
  credits: number;
  onBuyCredits: () => void;
}

export function CreditsDisplay({ credits, onBuyCredits }: CreditsDisplayProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">Credits Remaining</p>
          <p className={`text-xl font-bold ${credits === 0 ? 'text-destructive' : ''}`}>
            {credits}
          </p>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onBuyCredits}
        className="gap-1"
      >
        <CreditCard className="h-3.5 w-3.5" />
        <span>Buy More</span>
      </Button>
    </div>
  );
} 