export interface User {
    id: string;
    name: string;
    lastname: string;
    email: string;
    role: string;
    status: string;
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

export interface GetRolesResponse {
    data: Role[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}
{/*HOLA*/}
export interface UserFilters {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
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