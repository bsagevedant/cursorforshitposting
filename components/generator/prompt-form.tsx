"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ShitpostPrompt, GenerationStatus } from "@/types";
import { Sparkles, Loader2, CreditCard } from "lucide-react";

interface PromptFormProps {
  onGenerate: (prompt: ShitpostPrompt) => Promise<void>;
  status: GenerationStatus;
  disableButton?: boolean;
}

export function PromptForm({ onGenerate, status, disableButton = false }: PromptFormProps) {
  const [prompt, setPrompt] = useState<ShitpostPrompt>({
    topic: "",
    tone: "funny",
    length: "medium",
    includeHashtags: true,
    includeEmojis: true,
  });

  const handleChange = (name: keyof ShitpostPrompt, value: string | boolean) => {
    setPrompt(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };

  const isLoading = status === "loading";
  const isDisabled = isLoading || disableButton;

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle>Generate Your Shitpost</CardTitle>
        <CardDescription>
          Customize your settings and let AI create viral-worthy content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic (optional)</Label>
            <Input
              id="topic"
              placeholder="Enter a topic or leave blank for random"
              value={prompt.topic}
              onChange={(e) => handleChange("topic", e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select
              value={prompt.tone}
              onValueChange={(value) => handleChange("tone", value)}
            >
              <SelectTrigger id="tone" className="w-full">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="funny">Funny</SelectItem>
                <SelectItem value="sarcastic">Sarcastic</SelectItem>
                <SelectItem value="absurd">Absurd</SelectItem>
                <SelectItem value="controversial">Controversial</SelectItem>
                <SelectItem value="relatable">Relatable</SelectItem>
                <SelectItem value="dramatic">Dramatic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Length</Label>
            <Select
              value={prompt.length}
              onValueChange={(value) => handleChange("length", value)}
            >
              <SelectTrigger id="length" className="w-full">
                <SelectValue placeholder="Select length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="hashtags" className="cursor-pointer">Include hashtags</Label>
            <Switch
              id="hashtags"
              checked={prompt.includeHashtags}
              onCheckedChange={(checked) => handleChange("includeHashtags", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="emojis" className="cursor-pointer">Include emojis</Label>
            <Switch
              id="emojis"
              checked={prompt.includeEmojis}
              onCheckedChange={(checked) => handleChange("includeEmojis", checked)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6 transition-all"
            disabled={isDisabled}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : disableButton ? (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Out of Credits
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Shitpost
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}