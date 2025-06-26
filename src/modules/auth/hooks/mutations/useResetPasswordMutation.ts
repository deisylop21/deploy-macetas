import { useMutation } from "@tanstack/react-query";
import { resetPasswordService } from "../../services/resetPasswordService";
import type { ResetPasswordResponse } from "../../lib/types";

interface ResetPasswordMutationParams {
    email: string;
    code: string;
    newPassword: string;
}

export const useResetPasswordMutation = () => {
    return useMutation<ResetPasswordResponse, Error, ResetPasswordMutationParams>({
        mutationFn: async ({ email, code, newPassword }) => {
            return await resetPasswordService(email, code, newPassword);
        },
        onSuccess: (data) => {
            console.log('Contraseña restablecida exitosamente:', data.message);
        },
        onError: (error) => {
            console.error('Error al restablecer contraseña:', error.message);
        }
    });
};