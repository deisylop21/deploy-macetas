export interface UserGeneral {
    id: string;
    name: string;
    lastname: string;
    email: string;
    status_account: "Active" | "Inactive" | "Pending";
    created_at?: string;
    pots?: any[];
}

export interface UserGeneralFilters {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export interface UserGeneralResponse {
    data: UserGeneral[];
    meta?: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    }
}

export interface UpdateUserGeneralDTO {
    status_account: "Active" | "Inactive" | "Pending";
}