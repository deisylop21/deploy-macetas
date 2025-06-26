import { LoginResponse, User } from "../lib/types";
import { API_ENDPOINTS } from "../../core/lib/enpoints.ts";

export async function loginAdminService(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(API_ENDPOINTS.LOGIN_ADMIN, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Credenciales incorrectas");
    }

    const data = await response.json();

    try {
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const user: User = {
            sub: payload.sub,
            email: payload.email,
            type: payload.type,
            name: payload.name,
            picture: payload.picture,
            exp: payload.exp
        };

        return {
            token: data.token,
            user
        };
    } catch (error) {
        console.error("Error decodificando token:", error);
        throw new Error("Error procesando la respuesta del servidor");
    }
}