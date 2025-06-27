"use server";

import { uploadImage } from "@/lib/cloudinary";
import { db } from "@/lib/db";
import { productFormSchema, ProductType } from "@/schemas/product-schema";
import { Prisma, ProductVariant } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
    console.error(error);
  }
};

export const getAllProducts = async () => {
  try {
    const products = await db.product.findMany({
      include: { category: true, variants: true },
    });
    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error,
    };
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

export const getVariantStock = async (variantId: string) => {
  try {
    const data = await db.productVariant.findUnique({
      where: { id: variantId },
      select: { stock: true },
    });

    if (!data) {
      return null;
    }

    return data.stock;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addVariants = async (
  productId: string,
  variants: ProductVariant[]
) => {
  try {
    const existingVariants = await db.productVariant.findMany({
      where: { productId },
    });

    const updated = await Promise.all(
      variants.map((variant) =>
        variant.productId
          ? db.productVariant.update({
              where: { id: variant.id },
              data: {
                size: variant.size,
                price: variant.price,
                color: variant.color,
                colorHex: variant.colorHex,
                stock: variant.stock,
              },
            })
          : db.productVariant.create({
              data: {
                productId,
                size: variant.size,
                price: variant.price,
                color: variant.color,
                colorHex: variant.colorHex,
                stock: variant.stock,
              },
            })
      )
    );

    const idsFromClient = variants.map((v) => v.id);
    const variantsToDelete = existingVariants.filter(
      (v) => !idsFromClient.includes(v.id)
    );

    if (variantsToDelete.length > 0) {
      await db.productVariant.deleteMany({
        where: { productId, id: { in: variantsToDelete.map((v) => v.id) } },
      });
    }

    revalidatePath("/dashboard/productos");
    console.log(updated);
  } catch (error) {
    console.error(error);
  }
};

export const getCategories = async () => {
  try {
    return await db.category.findMany();
  } catch (error) {
    console.error(error);
  }
};

export const addProduct = async ({
  product,
  images,
}: {
  product: ProductType;
  images: File[];
}) => {
  try {
    const { data, success } = productFormSchema.safeParse(product);
    if (!success) {
      return { success: false, message: `Los datos son invalidos` };
    }
    console.log(data);

    const uploadedImages = await Promise.all(
      images.map((image) => uploadImage(image))
    );

    const validUrls = uploadedImages.filter(Boolean) as string[];

    if (validUrls.length === 0) {
      return { success: false, message: "Las imagenes son invalidas" };
    }

    const newProduct = await db.product.create({
      data: {
        ...data,
        images: validUrls,
        variants: { createMany: { data: data.variants } },
      },
    });

    revalidatePath("/dashboard/productos");
    return { success: true, data: newProduct };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocurrio un error al agregar",
      error: error,
    };
  }
};
