export interface AdminProfile {
    id: string;
    name: string;
    lastname: string;
    email: string;
    type: string;
    role: string;
    profile: {
        profile_picture: string | null;
        birthdate: string;
        phone: string;
        country: string;
        province: string;
        city: string;
    };
    modules: any[];
}

export interface UpdateProfileDTO {
    name: string;
    lastname: string;
    profile: {
        birthdate: string;
        phone: string;
        country: string;
        province: string;
        city: string;
    };
}

export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
}