import { useMutation } from "@tanstack/react-query";
import { loginAdminService } from "../../services/loginAdminService";
import { useAuthStore } from "../../../core/states/authStore";
import type { LoginResponse } from "../../lib/types";

interface LoginMutationParams {
    email: string;
    password: string;
}

export const useLoginMutation = () => {
    const { setAuthState } = useAuthStore();

    return useMutation<LoginResponse, Error, LoginMutationParams>({
        mutationFn: async ({ email, password }) => {
            const data = await loginAdminService(email, password);
            setAuthState(data);
            return data;
        },
        onError: (error) => {
            console.error('Error en login:', error.message);
        }
    });
};