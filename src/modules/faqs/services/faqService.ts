import { API_ENDPOINTS } from "../../core/lib/enpoints";
import { useAuthStore } from "../../core/states/authStore";
import {
    Faq,
    FaqType,
    FaqContent,
    FaqsResponse,
    CreateFaqRequest,
    UpdateFaqRequest,
    UploadImageResponse,
    DeleteImageRequest
} from "../lib/types";

const getAuthHeaders = () => {
    const token = useAuthStore.getState().token;
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

const getFormDataHeaders = () => {
    const token = useAuthStore.getState().token;
    return {
        'Authorization': `Bearer ${token}`,
    };
};

// Obtener FAQs
export async function fetchFaqs(parentId?: string): Promise<Faq[]> {
    let url = API_ENDPOINTS.FAQS;
    if (parentId) {
        url += `?parentId=${parentId}`;
    }

    console.log('Fetching FAQs from:', url);

    const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching FAQs:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data: FaqsResponse = await response.json();
    console.log('FAQs fetched:', data.data.length, 'items');
    return data.data;
}

// Crear FAQ
export async function createFaq(type: FaqType, content: FaqContent, parentId?: string): Promise<{ id: string }> {
    const body: CreateFaqRequest = { type, content };
    if (parentId) {
        body.parentId = parentId;
    }

    console.log('Creating FAQ:', body);

    const response = await fetch(API_ENDPOINTS.FAQS, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error creating FAQ:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('FAQ created with ID:', result.id);
    return result;
}

// Actualizar FAQ
export async function updateFaq(id: string, content: FaqContent): Promise<{ id: string }> {
    const body: UpdateFaqRequest = { content };

    console.log('Updating FAQ:', id, 'with content:', content);

    const response = await fetch(API_ENDPOINTS.FAQS_BY_ID(id), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error updating FAQ:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('FAQ updated:', result.id);
    return result;
}

// Eliminar FAQ
export async function deleteFaq(id: string): Promise<void> {
    console.log('Deleting FAQ:', id);

    const response = await fetch(API_ENDPOINTS.FAQS_BY_ID(id), {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error deleting FAQ:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
    }

    console.log('FAQ deleted:', id);
}

// Subir imagen
export async function uploadImage(file: File): Promise<string[]> {
    console.log('Uploading image:', file.name, file.type, file.size);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.FAQS_IMAGES_UPLOAD, {
        method: 'POST',
        headers: getFormDataHeaders(),
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error uploading image:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data: UploadImageResponse = await response.json();
    console.log('Image uploaded:', data.urls);
    return data.urls;
}

// Eliminar imagen
export async function deleteImage(url: string): Promise<void> {
    console.log('Deleting image:', url);

    const body: DeleteImageRequest = { url };

    const response = await fetch(API_ENDPOINTS.FAQS_IMAGES_DELETE, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error deleting image:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
    }

    console.log('Image deleted:', url);
}

{/*Hola hasta aqui el control z*/}