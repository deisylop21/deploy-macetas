import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../lib/schemas";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Button } from "../../core/components/ui/button";
import { ROUTES } from "../../core/router/path";
import { useThemeStore } from "../../core/states/themeStore";

type LoginFormValues = z.infer<typeof LoginSchema>;

interface LoginFormProps {
    onLoginSuccess: () => void;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
}

export const LoginForm = ({
                              onLoginSuccess,
                              loading,
                              error,
                              login,
                          }: LoginFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
    });
    const { mode } = useThemeStore();
    const isDark = mode === "dark";

    const onSubmit = async (data: LoginFormValues) => {
        await login(data.email, data.password);
        onLoginSuccess();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off" id="login-form">
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
                <label htmlFor="password" className={`block ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Contraseña
                </label>
                <input
                    id="password"
                    {...register("password")}
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
                    }`}
                />
                {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
            </div>
            <div className="flex justify-end">
                <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className={`text-sm ${isDark ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-500"} underline`}
                >
                    ¿Olvidaste tu contraseña?
                </Link>
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
                id="login-submit"
            >
                {loading ? "Entrando..." : "Iniciar sesión"}
            </Button>
        </form>
    );
};