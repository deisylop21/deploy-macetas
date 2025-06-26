import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../../core/states/authStore";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../core/router/path";

export const useLogoutMutation = () => {
    const { clearAuth } = useAuthStore();
    const navigate = useNavigate();

    return useMutation<void, Error, void>({
        mutationFn: async () => {
            clearAuth();
        },
        onSuccess: () => {
            console.log('Logout exitoso');
            navigate(ROUTES.LOGIN);
        },
        onError: (error) => {
            console.error('Error en logout:', error.message);
            clearAuth();
            navigate(ROUTES.LOGIN);
        }
    });
};