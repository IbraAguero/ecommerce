"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createMercadoPagoLink } from "./payment-action";
import { OrderStatus } from "@prisma/client";

interface ProductToOrder {
  variantId: string;
  productId: string;
  quantity: number;
}

export const getAllOrders = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const isAdmin = session?.user.role === "ADMIN";

    if (!userId || !isAdmin) {
      return {
        success: false,
        error: "No hay sesión de usuario o no tiene permisos",
      };
    }

    const orders = await db.order.findMany({
      include: { user: { select: { name: true, email: true } }, payment: true },
      orderBy: { createdAt: "asc" },
    });

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error,
    };
  }
};

export const getOrders = async () => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "No hay sesión de usuario",
      };
    }

    const orders = await db.order.findMany({
      where: { userId },
      include: {
        items: { include: { variant: { include: { product: true } } } },
        payment: true,
        address: true,
      },
    });

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error,
    };
  }
};

export const createOrder = async (
  products: ProductToOrder[],
  addressId: string,
  paymentMethod: "MERCADO_PAGO" | "BANK_TRANSFER"
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "No hay sesión de usuario",
      };
    }

    const prismaTx = await db.$transaction(async (tx) => {
      const address = await db.address.findUnique({
        where: { id: addressId, userId },
      });
      if (!address) {
        throw new Error("Dirección no válida o no pertenece al usuario.");
      }

      let totalAmount = 0;
      const orderItems = [];
      const mercadoPagoItems = [];

      for (const product of products) {
        const productVariant = await db.productVariant.findUnique({
          where: { id: product.variantId },
          include: { product: true },
        });

        if (!productVariant) {
          throw new Error("No se encontró el producto.");
        }
        console.log(productVariant?.product.name, productVariant?.stock);

        if (product.quantity > productVariant.stock) {
          throw new Error(
            `No hay suficiente stock para el producto ${productVariant.id}.`
          );
        }

        const price = productVariant.discountedPrice ?? productVariant.price;
        totalAmount += price * product.quantity;

        // DESNCOTAR EL STOCK - SE TENDRIA QUE HACER EN EL WEBHOOK DE MERCADOPAGO O AL CONFIRMAR LA TRANSFERENCIA
        /* await tx.productVariant.update({
          where: { id: product.variantId },
          data: { stock: productVariant.stock - product.quantity },
        }); */

        if (paymentMethod === "MERCADO_PAGO") {
          mercadoPagoItems.push({
            id: productVariant.id,
            title: productVariant.product.name,
            description: productVariant.product.description,
            quantity: product.quantity,
            unit_price: price,
            picture_url: productVariant.product.images[0],
          });
        }
        orderItems.push({
          variantId: productVariant.id,
          quantity: product.quantity,
          price,
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          totalAmount,
          status: "PENDING",
          items: { create: orderItems },
        },
        include: { items: true },
      });

      if (paymentMethod === "MERCADO_PAGO") {
        const paymentLink = await createMercadoPagoLink(
          order.id,
          mercadoPagoItems
        );

        await tx.payment.create({
          data: {
            orderId: order.id,
            method: "MERCADOPAGO",
            amount: totalAmount,
            status: "PENDING",
          },
        });

        return { order: order, paymentLink };
      }

      await db.payment.create({
        data: {
          orderId: order.id,
          method: "BANK_TRANSFER",
          amount: totalAmount,
          status: "PENDING",
        },
      });

      return { order: order };
    });
    return {
      success: true,
      data: prismaTx.order,
      paymentLink: prismaTx.paymentLink,
    };
  } catch (error) {
    console.error(error);
  }
};

export const changeStatusOrder = async (
  orderId: string,
  status: OrderStatus
) => {
  try {
    await db.order.update({ where: { id: orderId }, data: { status: status } });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error,
    };
  }
};
