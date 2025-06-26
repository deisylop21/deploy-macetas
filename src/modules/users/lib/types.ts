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