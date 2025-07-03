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
export interface ModuleFilters {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export interface ModuleResponse {
    data: Module[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}