import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email("Correo inválido"),
});

export const ResetPasswordSchema = z.object({
    email: z.string().email("Correo inválido"),
    code: z.string().length(6, "El código debe tener 6 caracteres"),
    newPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});