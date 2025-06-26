export interface PlantSpecies {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

export interface CreatePlantSpeciesDTO {
    name: string;
    description: string;
}

export interface UpdatePlantSpeciesDTO {
    name?: string;
    description?: string;
}

export interface PlantSpeciesResponse {
    data: PlantSpecies[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface PlantSpeciesFilters {
    page: number;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}