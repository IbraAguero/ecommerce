import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./schemas/auth-schema";
import { db } from "./lib/db";
import { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials);

        if (!success) throw new Error("Credenciales invalidas");

        const user = await db.user.findUnique({ where: { email: data.email } });

        if (!user) throw new Error("Credenciales invalidas");

        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) throw new Error("Credenciales invalidas");

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
