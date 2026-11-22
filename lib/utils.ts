import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNpr(amount: number): string {
  return `NPR ${new Intl.NumberFormat("en-NP", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}
