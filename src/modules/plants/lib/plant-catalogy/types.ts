import type { TaxonomicNode } from "../taxonomy/types";

export interface PlantImage {
    id: string;
    image_url: string;
}

export interface PlantCatalogBasic {
    id: string;
    name: string;
    planttype: string;
    image: PlantImage;
}

export interface PlantCatalogDetail {
    id: string;
    name: string;
    description: string;
    planttype: string;
    mintemp: number;
    maxtemp: number;
    minhum: number;
    maxhum: number;
    WARNINGS?: string;
    created_at: string;
    images: PlantImage[];
    taxonomicAncestry: TaxonomicNode[];
    taxonomicNodeId?: string;
}

export interface CreatePlantCatalogDTO {
    name: string;
    description: string;
    planttype: string;
    mintemp: number;
    maxtemp: number;
    minhum: number;
    maxhum: number;
    WARNINGS?: string;
    imageUrls: string[];
    taxonomicNodeId: string;
}

export interface UpdatePlantCatalogDTO {
    name?: string;
    description?: string;
    planttype?: string;
    mintemp?: number;
    maxtemp?: number;
    minhum?: number;
    maxhum?: number;
    WARNINGS?: string;
    imageUrls?: string[];
    taxonomicNodeId?: string;
}

export interface PlantCatalogResponse {
    data: PlantCatalogBasic[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface PlantCatalogFilters {
    page: number;
    search: string;
    planttype?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ImageUploadResponse {
    urls: string[];
    message: string;
}