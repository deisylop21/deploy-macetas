import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";
import AuthGreenPanel from "../../core/components/background/AuthGreenPanel";
import { useAuth } from "../hooks/useAuth";
import { useThemeStore } from "../../core/states/themeStore";
import { ROUTES } from "../../core/router/path";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, loginLoading, loginError, resetLoginError } = useAuth();
    const { mode } = useThemeStore();
    const isDark = mode === 'dark';

    const handleLoginSuccess = () => {
        navigate(ROUTES.CATALOG_PLANTS);
    };

    return (
        <div className={`min-h-screen flex ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <AuthGreenPanel />
            <div className={`flex flex-1 items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-white'} px-4`}>
                <div className="w-full max-w-md">
                    <h2 className={`text-3xl font-bold ${isDark ? 'text-green-500' : 'text-green-700'} mb-8 text-center`}>
                        Iniciar Sesión
                    </h2>
                    <LoginForm
                        onLoginSuccess={handleLoginSuccess}
                        loading={loginLoading}
                        error={loginError}
                        login={login}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;