import { useEffect } from "react";
import { useProfileStore } from "../states/profileStore";
import { UpdateProfileDTO, ChangePasswordDTO } from "../lib/types";

export function useProfile() {
    const {
        profile,
        isLoading,
        updating,
        uploading,
        error,
        profilePhotoUrl,
        fetchProfile,
        updateProfile,
        changePassword,
        uploadProfilePhoto,
        deleteProfilePhoto,
    } = useProfileStore();

    useEffect(() => {
        fetchProfile();
        // eslint-disable-next-line
    }, []);

    return {
        profile,
        isLoading,
        updating,
        uploading,
        error,
        profilePhotoUrl,
        fetchProfile,
        updateProfile,
        changePassword,
        uploadProfilePhoto,
        deleteProfilePhoto,
    };
}