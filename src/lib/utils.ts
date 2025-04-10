import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toArray(value?: string | string[]): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value;
  return [];
}

export const parsedPrice = (price: number) => {
  return price.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
};
