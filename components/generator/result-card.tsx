"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShitpostResponse } from "@/types";
import { Copy, Share2, Star, StarOff, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ResultCardProps {
  post: ShitpostResponse;
  onFavorite: () => void;
  isFavorite: boolean;
}

export function ResultCard({ post, onFavorite, isFavorite }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(post.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content)}`;
    window.open(twitterUrl, "_blank");
  };

  const formatContent = (content: string) => {
    return content
      .split(/(\#[^\s]+)/g)
      .map((part, i) => 
        part.startsWith('#') 
          ? <span key={i} className="text-primary font-medium">{part}</span> 
          : part
      );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardContent className="pt-6">
          <p className="text-lg whitespace-pre-line leading-relaxed">
            {formatContent(post.content)}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/20 py-3 px-6">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="h-8">
              {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="h-8">
              <Share2 className="h-4 w-4 mr-1" />
              Share to X
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onFavorite} 
            className={`h-8 w-8 ${isFavorite ? 'text-amber-500' : ''}`}
          >
            {isFavorite ? (
              <StarOff className="h-4 w-4" />
            ) : (
              <Star className="h-4 w-4" />
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}