export interface PlantGenus {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

export interface CreatePlantGenusDTO {
    name: string;
    description: string;
}

export interface UpdatePlantGenusDTO {
    name?: string;
    description?: string;
}

export interface PlantGenusResponse {
    data: PlantGenus[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface PlantGenusFilters {
    page: number;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}