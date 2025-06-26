import { useNavigate } from "react-router-dom";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import AuthGreenPanel from "../../core/components/background/AuthGreenPanel";
import { useAuth } from "../hooks/useAuth";
import { useThemeStore } from "../../core/states/themeStore";
import { ROUTES } from "../../core/router/path";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const {
        resetPassword,
        resetPasswordLoading,
        resetPasswordError,
        resetPasswordSuccess
    } = useAuth();
    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const handleResetSuccess = () => {
        setTimeout(() => {
            navigate(ROUTES.LOGIN);
        }, 3000);
    };

    return (
        <div className={`min-h-screen flex ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <AuthGreenPanel
                title="Nueva"
                subtitle="Contraseña"
            />
            <div className={`flex flex-1 items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-white'} px-4`}>
                <div className="w-full max-w-md">
                    <h2 className={`text-3xl font-bold ${isDark ? 'text-green-500' : 'text-green-700'} mb-4 text-center`}>
                        Restablecer Contraseña
                    </h2>
                    <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                        Ingresa el código que recibiste y tu nueva contraseña.
                    </p>
                    <ResetPasswordForm
                        onResetSuccess={handleResetSuccess}
                        loading={resetPasswordLoading}
                        error={resetPasswordError}
                        success={resetPasswordSuccess}
                        resetPassword={resetPassword}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;