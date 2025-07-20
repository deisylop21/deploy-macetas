import { create } from "zustand";
import { Faq } from "../lib/types";
import { fetchFaqs } from "../services/faqService";

interface FaqState {
    faqs: Faq[];
    loading: boolean;
    error: string | null;
    loadFaqs: () => Promise<void>;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setFaqs: (faqs: Faq[]) => void;
    clearState: () => void;
}

export const useFaqStore = create<FaqState>((set, get) => ({
    faqs: [],
    loading: false,
    error: null,

    loadFaqs: async () => {
        const state = get();
        if (state.loading) return; // Evitar múltiples cargas simultáneas

        set({ loading: true, error: null });
        try {
            const faqs = await fetchFaqs();
            set({ faqs, loading: false });
        } catch (error: any) {
            console.error('Error in loadFaqs:', error);
            set({ error: error.message, loading: false, faqs: [] });
        }
    },

    setLoading: (loading: boolean) => set({ loading }),

    setError: (error: string | null) => set({ error }),

    setFaqs: (faqs: Faq[]) => set({ faqs }),

    clearState: () => set({ faqs: [], loading: false, error: null }),
}));