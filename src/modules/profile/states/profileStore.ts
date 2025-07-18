import { create } from "zustand";
import {
    fetchAdminProfile,
    updateProfile,
    changePassword,
    uploadProfilePhoto,
    deleteProfilePhoto,
} from "../services/profileService";
import { AdminProfile, UpdateProfileDTO, ChangePasswordDTO } from "../lib/types";

interface ProfileState {
    profile: AdminProfile | null;
    isLoading: boolean;
    updating: boolean;
    uploading: boolean;
    error: string | null;
    profilePhotoUrl: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: UpdateProfileDTO) => Promise<void>;
    changePassword: (data: ChangePasswordDTO) => Promise<void>;
    uploadProfilePhoto: (file: File) => Promise<void>;
    deleteProfilePhoto: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    profile: null,
    isLoading: false,
    updating: false,
    uploading: false,
    error: null,
    profilePhotoUrl: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await fetchAdminProfile();
            set({
                profile: data,
                isLoading: false,
                profilePhotoUrl: data?.profile?.profile_picture || null,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Error al obtener el perfil",
            });
        }
    },

    updateProfile: async (data: UpdateProfileDTO) => {
        set({ updating: true, error: null });
        try {
            await updateProfile(data);
            await get().fetchProfile();
            set({ updating: false });
        } catch (error) {
            set({
                updating: false,
                error: error instanceof Error ? error.message : "Error al actualizar el perfil",
            });
        }
    },

    changePassword: async (data: ChangePasswordDTO) => {
        set({ updating: true, error: null });
        try {
            await changePassword(data);
            set({ updating: false });
        } catch (error: any) {
            let msg = "Error al cambiar la contraseña";
            if (error?.message?.includes("incorrect")) msg = "La contraseña actual es incorrecta.";
            set({
                updating: false,
                error: msg,
            });
        }
    },

    uploadProfilePhoto: async (file: File) => {
        set({ uploading: true, error: null });
        try {
            await uploadProfilePhoto(file);
            await get().fetchProfile();
            set({ uploading: false });
        } catch (error) {
            set({
                uploading: false,
                error: error instanceof Error ? error.message : "Error al subir la foto de perfil",
            });
        }
    },

    deleteProfilePhoto: async () => {
        set({ uploading: true, error: null });
        try {
            await deleteProfilePhoto();
            await get().fetchProfile();
            set({ uploading: false });
        } catch (error) {
            set({
                uploading: false,
                error: error instanceof Error ? error.message : "Error al eliminar la foto de perfil",
            });
        }
    },
}));