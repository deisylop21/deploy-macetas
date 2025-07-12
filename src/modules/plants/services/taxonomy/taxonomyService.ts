import { TaxonomicNode, TaxonomicRank } from "../../lib/taxonomy/types";
import { API_ENDPOINTS } from "../../../core/lib/enpoints";
import { getHeaders } from "../../../core/utils/UtilsFuntions";

export const taxonomyService = {
    getByRank: async (rank: TaxonomicRank): Promise<TaxonomicNode[]> => {
        const url = `${API_ENDPOINTS.TAXONOMY}?rank=${rank}`;
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('Error al obtener taxonomía');
        return await response.json();
    },

    getByParent: async (parentId: string): Promise<TaxonomicNode[]> => {
        const url = `${API_ENDPOINTS.TAXONOMY}?parentId=${parentId}`;
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) throw new Error('Error al obtener taxonomía');
        return await response.json();
    },

    create: async (data: { name: string; rank: TaxonomicRank; parentId?: string }) => {
        const response = await fetch(API_ENDPOINTS.TAXONOMY, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Error al crear taxonomía');
        return await response.json();
    },

    update: async (id: string, name: string) => {
        const response = await fetch(`${API_ENDPOINTS.TAXONOMY}/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({ name }),
        });
        if (!response.ok) throw new Error('Error al actualizar taxonomía');
        return await response.json();
    },

    delete: async (id: string) => {
        const response = await fetch(`${API_ENDPOINTS.TAXONOMY}/${id}`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al eliminar taxonomía');
        return await response.json();
    }
};


{/*EST ES UNA PAUSA PARA PONER EL CONTROL Z*/}