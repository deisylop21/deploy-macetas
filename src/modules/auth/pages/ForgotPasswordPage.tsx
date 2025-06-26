import { ForgotPasswordForm } from "../components/ForgotPasswordForm";
import AuthGreenPanel from "../../core/components/background/AuthGreenPanel";
import { useAuth } from "../hooks/useAuth";
import { useThemeStore } from "../../core/states/themeStore";

const ForgotPasswordPage = () => {
    const {
        forgotPassword,
        forgotPasswordLoading,
        forgotPasswordError,
        forgotPasswordSuccess,
        resetForgotPasswordError
    } = useAuth();
    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const handleSubmitSuccess = () => {
        console.log('Código enviado exitosamente');
    };

    return (
        <div className={`min-h-screen flex ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <AuthGreenPanel
                title="Recuperar"
                subtitle="Contraseña"
            />
            <div className={`flex flex-1 items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-white'} px-4`}>
                <div className="w-full max-w-md">
                    <h2 className={`text-3xl font-bold ${isDark ? 'text-green-500' : 'text-green-700'} mb-4 text-center`}>
                        Recuperar Contraseña
                    </h2>
                    <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                        Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
                    </p>
                    <ForgotPasswordForm
                        onSubmitSuccess={handleSubmitSuccess}
                        loading={forgotPasswordLoading}
                        error={forgotPasswordError}
                        success={forgotPasswordSuccess}
                        forgotPassword={forgotPassword}
                    />
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;