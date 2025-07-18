import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { AdminProfile, UpdateProfileDTO, ChangePasswordDTO } from "../lib/types";
import { useAuthStore } from "../../core/states/authStore";

function getToken(): string | null {
    return useAuthStore.getState().token;
}

function authHeaders() {
    const token = getToken();
    return token
        ? {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
        : { "Content-Type": "application/json" };
}

function formHeaders() {
    const token = getToken();
    return token
        ? {
            "Authorization": `Bearer ${token}`,
        }
        : {};
}

export async function fetchAdminProfile(): Promise<AdminProfile> {
    const response = await fetch(API_ENDPOINTS.PROFILE_ADMIN, {
        method: "GET",
        headers: authHeaders(),
        credentials: "include",
    });
    if (!response.ok) throw new Error(await response.text() || "Error al obtener el perfil");
    return await response.json();
}

export async function updateProfile(data: UpdateProfileDTO): Promise<AdminProfile> {
    const response = await fetch("https://artistic-victory-env2.up.railway.app/profile-management/", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
    });
    if (!response.ok) throw new Error(await response.text() || "Error al actualizar el perfil");
    return await response.json();
}

export async function changePassword(data: ChangePasswordDTO): Promise<void> {
    const response = await fetch(API_ENDPOINTS.PROFILE_CHANGE_PASSWORD, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
    });
    if (!response.ok) throw new Error(await response.text() || "Error al cambiar la contraseña");
}

export async function uploadProfilePhoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await fetch(API_ENDPOINTS.PROFILE_PHOTO, {
        method: "POST",
        headers: formHeaders(),
        body: formData,
        credentials: "include",
    });
    if (!response.ok) throw new Error(await response.text() || "Error al subir la foto");
    const res = await response.json();
    return res.url || res.photo || "";
}

export async function deleteProfilePhoto(): Promise<void> {
    const response = await fetch(API_ENDPOINTS.PROFILE_PHOTO, {
        method: "DELETE",
        headers: formHeaders(),
        credentials: "include",
    });
    if (!response.ok) throw new Error(await response.text() || "Error al eliminar la foto");
}