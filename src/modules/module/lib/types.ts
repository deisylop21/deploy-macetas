export interface Module {
    id: string;
    name: string;
    description: string;
    is_active: boolean;
    created_date: string;
}

export interface CreateModuleDTO {
    name: string;
    description: string;
}