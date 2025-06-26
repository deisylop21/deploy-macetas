import { useMutation } from "@tanstack/react-query";
import { forgotPasswordService } from "../../services/forgotPasswordService";
import type { ForgotPasswordResponse } from "../../lib/types";

interface ForgotPasswordMutationParams {
    email: string;
}

export const useForgotPasswordMutation = () => {
    return useMutation<ForgotPasswordResponse, Error, ForgotPasswordMutationParams>({
        mutationFn: async ({ email }) => {
            return await forgotPasswordService(email);
        },
        onSuccess: (data) => {
            console.log('Código enviado exitosamente:', data.message);
        },
        onError: (error) => {
            console.error('Error al enviar código:', error.message);
        }
    });
};