"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { loginSchema, registerSchema } from "@/schemas/auth-schema";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";

export const registerUser = async (values: z.infer<typeof registerSchema>) => {
  try {
    const { data, success } = registerSchema.safeParse(values);

    if (!success) {
      return {
        success: false,
        error: "Datos invalidos",
      };
    }

    const findUser = await db.user.findFirst({ where: { email: data.email } });

    if (findUser) {
      return {
        success: false,
        error: "Ya existe un usuario con ese correo",
      };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await db.user.create({
      data: {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        password: passwordHash,
      },
    });

    /* REALIZAR EL INICIO DE SESION */

    return {
      success: true,
      data: newUser,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof AuthError) {
      return {
        sucess: false,
        error: error.cause?.err?.message,
      };
    }

    return {
      sucess: false,
      error: "error 500",
    };
  }
};

export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message, success: false };
    }
    console.log(error);

    return { error: "error 500", success: false };
  }
};
