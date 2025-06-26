import { ResetPasswordRequest, ResetPasswordResponse } from "../lib/types";
import { API_ENDPOINTS } from "../../core/lib/enpoints";

export async function resetPasswordService(
    email: string,
    code: string,
    newPassword: string
): Promise<ResetPasswordResponse> {
    const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code, newPassword }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al restablecer la contraseña");
    }

    return await response.json();
}