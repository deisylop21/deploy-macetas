import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "../lib/schemas";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Button } from "../../core/components/ui/button";
import { ROUTES } from "../../core/router/path";
import { useThemeStore } from "../../core/states/themeStore";

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

interface ForgotPasswordFormProps {
    onSubmitSuccess: () => void;
    loading: boolean;
    error: string | null;
    success: boolean;
    forgotPassword: (email: string) => Promise<void>;
}

export const ForgotPasswordForm = ({
                                       onSubmitSuccess,
                                       loading,
                                       error,
                                       success,
                                       forgotPassword,
                                   }: ForgotPasswordFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(ForgotPasswordSchema),
    });
    const { mode } = useThemeStore();
    const isDark = mode === "dark";

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        await forgotPassword(data.email);
        onSubmitSuccess();
    };

    if (success) {
        return (
            <div className="text-center">
                <div className={`${isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"} rounded px-4 py-3 mb-4`}>
                    <p className="font-semibold">¡Código enviado!</p>
                    <p className="text-sm mt-1">Revisa tu correo electrónico para obtener el código de recuperación.</p>
                </div>
                <Link
                    to={ROUTES.RESET_PASSWORD}
                    className={`${isDark ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-500"} underline`}
                >
                    Ir a restablecer contraseña
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off" id="forgot-password-form">
            <div>
                <label htmlFor="email" className={`block ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Correo electrónico
                </label>
                <input
                    id="email"
                    {...register("email")}
                    type="email"
                    autoComplete="email"
                    placeholder="correo@ejemplo.com"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
                    }`}
                />
                {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
                <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Te enviaremos un código de verificación a este correo.
                </p>
            </div>
            {error && (
                <div className={`text-red-600 ${isDark ? "bg-red-900/30" : "bg-red-100"} rounded px-3 py-2 text-sm`}>
                    {error}
                </div>
            )}
            <Button
                type="submit"
                className={`w-full ${isDark ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"}`}
                disabled={loading}
                id="forgot-password-submit"
            >
                {loading ? "Enviando..." : "Enviar código"}
            </Button>
            <div className="text-center">
                <Link
                    to={ROUTES.LOGIN}
                    className={`text-sm ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-500"} underline`}
                >
                    Volver al inicio de sesión
                </Link>
            </div>
        </form>
    );
};