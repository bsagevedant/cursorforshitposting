// This is a custom hook that wraps the sonner toast functionality
// Re-export the toast function from sonner directly

import { toast } from "sonner";

export function useToast() {
  return { toast };
}