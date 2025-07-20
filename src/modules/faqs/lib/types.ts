export type FaqType = "pregunta" | "respuesta";

export interface FaqContent {
    text: string;
    image_url?: string[];
}

export interface Faq {
    id: string;
    parentId?: string;
    type: FaqType;
    content: FaqContent;
    createdAt: string;
    withchildren: boolean;
}

export interface FaqsResponse {
    data: Faq[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface CreateFaqRequest {
    type: FaqType;
    content: FaqContent;
    parentId?: string;
}

export interface UpdateFaqRequest {
    content: FaqContent;
}

export interface UploadImageResponse {
    urls: string[];
}

export interface DeleteImageRequest {
    url: string;
}