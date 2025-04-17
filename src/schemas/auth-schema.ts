import { object, string } from "zod";

export const loginSchema = object({
  email: string({ required_error: "El correo es requerido" })
    .min(1, "El correo es requerido")
    .email("El correo no es valido"),
  password: string({ required_error: "La contraseña es requerida" })
    .min(1, "La contraseña es requerida")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
});

export const registerSchema = object({
  email: string({ required_error: "El correo es requerido" })
    .min(1, "El correo es requerido")
    .email("Correo invalido"),
  password: string({ required_error: "La contraseña es requerida" })
    .min(1, "La contraseña es requerida")
    .min(8, "Debe tener más de 8 caracteres")
    .max(32, "Debe tener menos de 32 caracteres"),
  name: string({ required_error: "El nombre es requerido" })
    .min(2, "Debe tener más de 2 caracteres")
    .max(16, "Debe tener menos de 16 caracteres"),
  lastName: string({ required_error: "El apellido es requerido" })
    .min(2, "Debe tener más de 2 caracteres")
    .max(16, "Debe tener menos de 16 caracteres"),
  /* phone: string({ required_error: "El teléfono es requerido" })
    .min(10, "Debe tener más de 10 caracteres")
    .max(16, "Debe tener menos de 16 caracteres"), */
});
