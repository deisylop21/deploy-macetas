import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "../lib/schemas";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Button } from "../../core/components/ui/button";
import { ROUTES } from "../../core/router/path";
import { useThemeStore } from "../../core/states/themeStore";

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordFormProps {
    onResetSuccess: () => void;
    loading: boolean;
    error: string | null;
    success: boolean;
    resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}

export const ResetPasswordForm = ({
                                      onResetSuccess,
                                      loading,
                                      error,
                                      success,
                                      resetPassword,
                                  }: ResetPasswordFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(ResetPasswordSchema),
    });
    const { mode } = useThemeStore();
    const isDark = mode === "dark";

    const onSubmit = async (data: ResetPasswordFormValues) => {
        await resetPassword(data.email, data.code, data.newPassword);
        onResetSuccess();
    };

    if (success) {
        return (
            <div className="text-center">
                <div className={`${isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"} rounded px-4 py-3 mb-4`}>
                    <p className="font-semibold">¡Contraseña restablecida!</p>
                    <p className="text-sm mt-1">Tu contraseña ha sido actualizada exitosamente.</p>
                </div>
                <Link
                    to={ROUTES.LOGIN}
                    className={`${isDark ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-500"} underline`}
                >
                    Iniciar sesión
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off" id="reset-password-form">
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
            </div>
            <div>
                <label htmlFor="code" className={`block ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Código de verificación
                </label>
                <input
                    id="code"
                    {...register("code")}
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
                    }`}
                />
                {errors.code && <span className="text-sm text-red-500">{errors.code.message}</span>}
            </div>
            <div>
                <label htmlFor="newPassword" className={`block ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Nueva contraseña
                </label>
                <input
                    id="newPassword"
                    {...register("newPassword")}
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
                    }`}
                />
                {errors.newPassword && <span className="text-sm text-red-500">{errors.newPassword.message}</span>}
            </div>
            <div>
                <label htmlFor="confirmPassword" className={`block ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Confirmar contraseña
                </label>
                <input
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
                    }`}
                />
                {errors.confirmPassword && <span className="text-sm text-red-500">{errors.confirmPassword.message}</span>}
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
                id="reset-password-submit"
            >
                {loading ? "Restableciendo..." : "Restablecer contraseña"}
            </Button>
            <div className="text-center space-y-2">
                <Link to={ROUTES.FORGOT_PASSWORD} className={`block text-sm ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-500"} underline`}>
                    Enviar nuevo código
                </Link>
                <Link to={ROUTES.LOGIN} className={`block text-sm ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-500"} underline`}>
                    Volver al inicio de sesión
                </Link>
            </div>
        </form>
    );
};