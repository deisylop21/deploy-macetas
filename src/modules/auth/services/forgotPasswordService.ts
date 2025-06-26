import { ForgotPasswordRequest, ForgotPasswordResponse } from "../lib/types";
import { API_ENDPOINTS } from "../../core/lib/enpoints";

export async function forgotPasswordService(email: string): Promise<ForgotPasswordResponse> {
    const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al enviar el código de recuperación");
    }

    return await response.json();
}