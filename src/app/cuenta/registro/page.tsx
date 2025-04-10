"use client";

import { registerUser } from "@/actions/auth-action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/auth-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PasswordInput from "@/components/ui/password-input";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ButtonLoader from "@/components/ui/button-loader";

function Page() {
  const [isPending, startTransaction] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", lastName: "", password: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransaction(async () => {
      const response = await registerUser(values);
      if (response.success) {
        router.push("/");
      } else {
        toast.error(response.error, {
          duration: 3000,
        });
      }
    });
  });

  return (
    <section className="grid place-items-center h-[calc(100vh-10rem)] ">
      <h1 className="text-3xl font-semibold mb-10">Crear cuenta</h1>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-2 gap-x-2 items-center w-[500px] gap-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese su nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese su apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese su correo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Ingrese la contraseña"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <div className="col-span-2 space-y-2">
          <Label>Telefono</Label>
          <Input placeholder="Ingrese su telefono..." />
        </div> */}
          <div className="w-full space-y-2">
            <Label>Contraseña</Label>
            <Input placeholder="Ingrese su contraseña..." name="password" />
          </div>
          {/* <div className="w-full space-y-2">
          <Label>Confirmar contraseña</Label>
          <Input placeholder="Ingrese su contraseña..." />
        </div> */}
          <ButtonLoader
            isPending={isPending}
            className="col-span-2"
            type="submit"
          >
            Crear cuenta
          </ButtonLoader>
          <span className="col-span-2 text-xs text-center">
            ¿Ya tenes una cuenta?{" "}
            <Link href="/cuenta/login" className="font-medium hover:underline">
              Iniciá sesión
            </Link>
          </span>
        </form>
      </Form>
    </section>
  );
}
export default Page;
