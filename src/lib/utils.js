import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// checking sync with git

export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}
