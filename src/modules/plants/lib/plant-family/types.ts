export interface PlantFamily {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

export interface CreatePlantFamilyDTO {
    name: string;
    description: string;
}

export interface UpdatePlantFamilyDTO {
    name?: string;
    description?: string;
}

export interface PlantFamilyResponse {
    data: PlantFamily[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface PlantFamilyFilters {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}