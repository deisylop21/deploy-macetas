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

export interface PlantTaxonomy {
    familyId: string;
    genusId: string;
    speciesId: string;
    familyName?: string;
    genusName?: string;
    speciesName?: string;
}

export interface PlantCatalogDetail {
    id: string;
    name: string;
    description: string;
    planttype: string;
    mintemp: number;
    maxtemp: number;
    humiditylevel: string;
    WARNINGS?: string;
    created_at: string;
    images: PlantImage[];
    taxonomy?: PlantTaxonomy;
}

export interface CreatePlantCatalogDTO {
    name: string;
    description: string;
    planttype: string;
    mintemp: number;
    maxtemp: number;
    humiditylevel: string;
    WARNINGS?: string;
    familyId: string;
    genusId: string;
    speciesId: string;
    imageUrls: string[];
}

export interface UpdatePlantCatalogDTO {
    name?: string;
    description?: string;
    planttype?: string;
    mintemp?: number;
    maxtemp?: number;
    humiditylevel?: string;
    WARNINGS?: string;
    familyId?: string;
    genusId?: string;
    speciesId?: string;
    imageUrls?: string[];
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
}

export interface ImageUploadResponse {
    urls: string[];
    message: string;
}