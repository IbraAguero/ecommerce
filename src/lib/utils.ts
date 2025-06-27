import { ProductVariant } from "@prisma/client";
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

export const getPriceRange = (variants: ProductVariant[]) => {
  if (variants.length === 0) return "N/A";

  const prices = variants.map((variant) => variant.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    return `$${minPrice.toFixed(2)}`;
  }

  return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
};

export function generateTempId(): string {
  return "temp-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
}

export const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
