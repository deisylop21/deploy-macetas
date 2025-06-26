import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../core/components/ui/button";
import { useThemeStore } from "../../core/states/themeStore";
import { ROUTES } from "../../core/router/path";

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
                                      resetPassword
                                  }: ResetPasswordFormProps) => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        // Validar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            setLocalError("Las contraseñas no coinciden");
            return;
        }

        // Validar longitud mínima de contraseña
        if (newPassword.length < 6) {
            setLocalError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        try {
            await resetPassword(email, code, newPassword);
            onResetSuccess();
        } catch (_) {}
    };

    if (success) {
        return (
            <div className="text-center">
                <div className={`${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'} rounded px-4 py-3 mb-4`}>
                    <p className="font-semibold">¡Contraseña restablecida!</p>
                    <p className="text-sm mt-1">Tu contraseña ha sido actualizada exitosamente.</p>
                </div>
                <Link
                    to={ROUTES.LOGIN}
                    className={`${isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'} underline`}
                >
                    Iniciar sesión
                </Link>
            </div>
        );
    }

    const currentError = localError || error;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
            autoComplete="off"
            id="reset-password-form"
        >
            <div>
                <label htmlFor="email" className={`block ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Correo electrónico
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="correo@ejemplo.com"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 
                    ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                    aria-label="Correo electrónico"
                />
            </div>

            <div>
                <label htmlFor="code" className={`block ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Código de verificación
                </label>
                <input
                    id="code"
                    name="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="123456"
                    maxLength={6}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 
                    ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                    aria-label="Código de verificación"
                />
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ingresa el código que recibiste en tu correo.
                </p>
            </div>

            <div>
                <label htmlFor="newPassword" className={`block ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Nueva contraseña
                </label>
                <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    autoComplete="new-password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400
                    ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                    aria-label="Nueva contraseña"
                />
            </div>

            <div>
                <label htmlFor="confirmPassword" className={`block ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Confirmar contraseña
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    autoComplete="new-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={6}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400
                    ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                    aria-label="Confirmar contraseña"
                />
            </div>

            {currentError && (
                <div className={`text-red-600 ${isDark ? 'bg-red-900/30' : 'bg-red-100'} rounded px-3 py-2 text-sm`}>
                    {currentError}
                </div>
            )}

            <Button
                type="submit"
                className={`w-full ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
                disabled={loading}
                id="reset-password-submit"
            >
                {loading ? "Restableciendo..." : "Restablecer contraseña"}
            </Button>

            <div className="text-center space-y-2">
                <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className={`block text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-500'} underline`}
                >
                    Enviar nuevo código
                </Link>
                <Link
                    to={ROUTES.LOGIN}
                    className={`block text-sm ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-500'} underline`}
                >
                    Volver al inicio de sesión
                </Link>
            </div>
        </form>
    );
};