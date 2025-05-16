export interface ShitpostPrompt {
  topic?: string;
  tone?: string;
  length?: string;
  includeHashtags?: boolean;
  includeEmojis?: boolean;
}

export interface ShitpostResponse {
  id: string;
  content: string;
  prompt: ShitpostPrompt;
  createdAt: Date;
}

export type GenerationStatus = "idle" | "loading" | "success" | "error";