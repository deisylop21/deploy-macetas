export interface Profile {
    birthdate?: string;
    phone?: string;
}

export interface User {
    id: string;
    name: string;
    lastname: string;
    email: string;
    status: string;
    role?: string;
    roles?: { id: string; name: string }[];
    status_account?: string;
    profile?: Profile;
}

export interface Role {
    id: string;
    name: string;
    description?: string;
    is_active: boolean;
}

export interface CreateUserDTO {
    name: string;
    lastname: string;
    email: string;
    birthdate: string;
    phone: string;
    roleId: string;
}

export interface EditUserDTO {
    name: string;
    lastname: string;
    email: string;
    birthdate: string;
    phone: string;
    status_account: string;
    role_id: string;
}

export interface GetRolesResponse {
    data: Role[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface UserFilters {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    roleId?: string;
}
export interface UserResponse {
    data: User[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    }
}