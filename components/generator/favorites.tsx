"use client";

import { ShitpostResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoritesProps {
  favorites: ShitpostResponse[];
  onRemove: (post: ShitpostResponse) => void;
}

export function Favorites({ favorites, onRemove }: FavoritesProps) {
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleShare = (content: string) => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 text-amber-500 mr-2" />
          Saved Favorites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {favorites.map((post) => (
            <AccordionItem key={post.id} value={post.id}>
              <AccordionTrigger className="text-left">
                {post.content.substring(0, 60)}
                {post.content.length > 60 ? "..." : ""}
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-2 space-y-4">
                  <p className="whitespace-pre-line">{post.content}</p>
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCopy(post.content)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleShare(post.content)}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemove(post)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}