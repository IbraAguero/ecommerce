"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await db.product.findUnique({
      where: {
        slug: slug,
        
      },
      include: { variants: true },
    });

    return product;
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async ({
  category,
  minPrice,
  maxPrice,
  color = [],
  size = [],
}: {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string[];
  size?: string[];
}) => {
  try {
    const min =
      typeof minPrice === "number" && !isNaN(minPrice) ? minPrice : undefined;
    const max =
      typeof maxPrice === "number" && !isNaN(maxPrice) ? maxPrice : undefined;

    const variantConditions: Prisma.ProductVariantWhereInput = {};

    if (color.length > 0 || size.length > 0) {
      variantConditions.OR = [
        ...(color.length > 0
          ? [{ color: { in: color, mode: "insensitive" as Prisma.QueryMode } }]
          : []),
        ...(size.length > 0
          ? [{ size: { in: size, mode: "insensitive" as Prisma.QueryMode } }]
          : []),
      ];
    }

    if (min !== undefined || max !== undefined) {
      variantConditions.price = {
        ...(min !== undefined && { gte: min }),
        ...(max !== undefined && { lte: max }),
      };
    }

    const whereCondition: Prisma.ProductWhereInput = {
      category: {
        name: { equals: category, mode: "insensitive" as Prisma.QueryMode },
      },
      ...(Object.keys(variantConditions).length > 0
        ? { variants: { some: variantConditions } }
        : {}),
    };

    const products = await db.product.findMany({
      include: { variants: true },
      where: whereCondition,
    });

    return products;
  } catch (error) {
    console.error("Error en getProducts:", error);
    return [];
  }
};

export const getProductFilters = async ({
  category,
  colorSelected = [],
  sizesSelected = [],
  minPrice,
  maxPrice,
}: {
  category: string;
  sizesSelected?: string[];
  colorSelected?: string[];
  minPrice?: number;
  maxPrice?: number;
}) => {
  try {
    const min =
      typeof minPrice === "number" && !isNaN(minPrice) ? minPrice : undefined;
    const max =
      typeof maxPrice === "number" && !isNaN(maxPrice) ? maxPrice : undefined;

    // Construir la condición base
    const baseWhereCondition: Prisma.ProductVariantWhereInput = {
      product: {
        category: { name: { equals: category, mode: "insensitive" } },
      },
    };

    // Añadir condiciones de precio si están definidas
    if (min !== undefined || max !== undefined) {
      baseWhereCondition.price = {
        ...(min !== undefined && { gte: min }),
        ...(max !== undefined && { lte: max }),
      };
    }

    // Consulta para colores
    const colorCounts = await db.productVariant.groupBy({
      by: ["color", "colorHex"],
      where: {
        ...baseWhereCondition,
        ...(sizesSelected.length > 0
          ? { size: { in: sizesSelected, mode: "insensitive" } }
          : {}),
      },
      _count: { color: true },
    });

    // Consulta para tamaños
    const sizeCounts = await db.productVariant.groupBy({
      by: ["size"],
      where: {
        ...baseWhereCondition,
        ...(colorSelected.length > 0
          ? { color: { in: colorSelected, mode: "insensitive" } }
          : {}),
      },
      _count: { size: true },
    });

    return {
      colors: colorCounts.map(({ color, colorHex, _count }) => ({
        colorName: color,
        colorHex: colorHex,
        count: _count.color,
      })),
      sizes: sizeCounts.map(({ size, _count }) => ({
        size: size,
        count: _count.size,
      })),
    };
  } catch (error) {
    console.error("Error in getProductFilters:", error);
    return {
      colors: [],
      sizes: [],
    };
  }
};

export const getFilterPrice = async ({
  category,
  colorSelected = [],
  sizesSelected = [],
}: {
  category: string;
  sizesSelected?: string[];
  colorSelected?: string[];
}) => {
  try {
    // Construir la condición base
    const baseWhereCondition: Prisma.ProductVariantWhereInput = {
      product: {
        category: { name: { equals: category, mode: "insensitive" } },
      },
    };

    // Añadir condiciones de color y tamaño si están seleccionadas
    if (colorSelected.length > 0) {
      baseWhereCondition.color = { in: colorSelected, mode: "insensitive" };
    }
    if (sizesSelected.length > 0) {
      baseWhereCondition.size = { in: sizesSelected, mode: "insensitive" };
    }

    const priceRange = await db.productVariant.aggregate({
      where: baseWhereCondition,
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    });

    return {
      minPrice: priceRange._min.price ?? 0,
      maxPrice: priceRange._max.price ?? 0,
    };
  } catch (error) {
    console.error("Error in getFilterPrice:", error);
    return {
      minPrice: 0,
      maxPrice: 0,
    };
  }
};
