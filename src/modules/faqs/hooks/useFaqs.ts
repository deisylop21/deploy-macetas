import { useEffect } from "react";
import { useFaqStore } from "../states/faqStore";

export function useFaqs() {
    const { faqs, loading, error, loadFaqs } = useFaqStore();

    useEffect(() => {
        loadFaqs();
    }, []); // Solo cargar una vez al montar

    return {
        faqs,
        loading,
        error,
        refetch: loadFaqs
    };
}

// Hook para cargar FAQs hijos
export function useFaqChildren(parentId?: string) {
    const { fetchFaqs } = require('../services/faqService');
    const [children, setChildren] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const loadChildren = React.useCallback(async () => {
        if (!parentId) return;

        setLoading(true);
        setError(null);
        try {
            const data = await fetchFaqs(parentId);
            setChildren(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [parentId]);

    return { children, loading, error, loadChildren };
}