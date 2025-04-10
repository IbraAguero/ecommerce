"use client";
import { loginAction } from "@/actions/auth-action";
import ButtonLoader from "@/components/ui/button-loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password-input";
import { loginSchema } from "@/schemas/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function Page() {
  const [isPending, startTransaction] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmmit = form.handleSubmit((values) => {
    startTransaction(async () => {
      console.log(values);

      const response = await loginAction(values);

      console.log(response);

      if (response.success) {
        router.push("/");
      } else {
        toast.error("Algo salio mal", {
          description: response.error,
          duration: 3000,
        });
      }
    });
  });

  return (
    <section className="grid place-items-center h-[calc(100vh-10rem)] ">
      <Form {...form}>
        <form
          onSubmit={onSubmmit}
          className="flex flex-col items-center w-[400px] space-y-6"
        >
          <h1 className="text-3xl font-semibold mb-10">Iniciar sesión</h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
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
              <FormItem className="w-full">
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
          <ButtonLoader isPending={isPending} className="w-full" type="submit">
            Iniciar sesión
          </ButtonLoader>
          <span className="text-xs text-center">
            ¿No tenés cuenta aún?{" "}
            <Link
              href="/cuenta/registro"
              className="font-medium hover:underline"
            >
              Crear cuenta
            </Link>
          </span>
        </form>
      </Form>
    </section>
  );
}
export default Page;
