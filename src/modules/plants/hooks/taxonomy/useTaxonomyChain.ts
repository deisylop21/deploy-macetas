import { useState, useEffect } from "react";
import { taxonomyService } from "../../services/taxonomy/taxonomyService";
import { TaxonomicNode, TaxonomicRank } from "../../lib/taxonomy/types";

const RANK_ORDER: TaxonomicRank[] = [
    TaxonomicRank.DOMAIN,
    TaxonomicRank.KINGDOM,
    TaxonomicRank.SUBKINGDOM,
    TaxonomicRank.DIVISION,
    TaxonomicRank.SUBDIVISION,
    TaxonomicRank.SUPERCLASS,
    TaxonomicRank.CLASS,
    TaxonomicRank.SUBCLASS,
    TaxonomicRank.ORDER,
    TaxonomicRank.SUBORDER,
    TaxonomicRank.FAMILY,
    TaxonomicRank.SUBFAMILY,
    TaxonomicRank.TRIBE,
    TaxonomicRank.SUBTRIBE,
    TaxonomicRank.GENUS,
    TaxonomicRank.SUBGENUS,
    TaxonomicRank.SECTION,
    TaxonomicRank.SPECIES,
];


export function useTaxonomyChain(initialChain?: TaxonomicNode[]) {
    const [chain, setChain] = useState<(TaxonomicNode | null)[]>(() => {
        if (initialChain && initialChain.length > 0) {
            const arr = RANK_ORDER.map(rank =>
                initialChain.find(node => node.rank === rank) || null
            );
            return arr;
        }
        return Array(RANK_ORDER.length).fill(null);
    });

    const [options, setOptions] = useState<TaxonomicNode[][]>(Array(RANK_ORDER.length).fill([]));
    const [loading, setLoading] = useState<boolean[]>(Array(RANK_ORDER.length).fill(false));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeTaxonomy = async () => {
            try {
                setLoading(prev => prev.map((_, i) => i === 0 ? true : false));

                const domains = await taxonomyService.getByRank(TaxonomicRank.DOMAIN);

                setOptions(prev => {
                    const newOptions = [...prev];
                    newOptions[0] = domains;
                    return newOptions;
                });
                setLoading(prev => prev.map((_, i) => i === 0 ? false : prev[i]));

                if (initialChain && initialChain.length > 0) {

                    for (let i = 1; i < RANK_ORDER.length; i++) {
                        const currentNode = chain[i];
                        const parentNode = chain[i - 1];

                        if (currentNode && parentNode) {

                            setLoading(prev => prev.map((_, idx) => idx === i ? true : prev[idx]));
                            try {
                                const children = await taxonomyService.getByParent(parentNode.id);

                                setOptions(prev => {
                                    const newOptions = [...prev];
                                    newOptions[i] = children;
                                    return newOptions;
                                });
                            } catch (err) {
                                console.error(`❌ Error cargando opciones para nivel ${i}:`, err);
                                setError(`Error cargando ${RANK_ORDER[i]}`);
                            } finally {
                                setLoading(prev => prev.map((_, idx) => idx === i ? false : prev[idx]));
                            }
                        } else {
                            break;
                        }
                    }
                }
            } catch (err) {
                console.error("❌ Error en inicialización:", err);
                setError("Error al cargar taxonomía inicial");
            }
        };

        initializeTaxonomy();
    }, [initialChain]);

    const handleChange = async (rankIndex: number, node: TaxonomicNode | null) => {

        const newChain = [...chain];
        newChain[rankIndex] = node;

        for (let i = rankIndex + 1; i < newChain.length; i++) {
            newChain[i] = null;
        }

        setChain(newChain);

        if (!node) {
            setOptions(opts => opts.map((o, i) => i > rankIndex ? [] : o));
            return;
        }

        if (rankIndex < RANK_ORDER.length - 1) {

            setLoading(l => l.map((v, i) => i === rankIndex + 1 ? true : false));
            try {
                const children = await taxonomyService.getByParent(node.id);

                setOptions(opts => opts.map((o, i) => {
                    if (i === rankIndex + 1) return children;
                    if (i > rankIndex + 1) return [];
                    return o;
                }));
            } catch (err) {
                console.error("❌ Error al cargar hijos:", err);
                setError("Error al cargar taxonomía");
            } finally {
                setLoading(l => l.map((v, i) => false));
            }
        }
    };

    const reloadOptions = async (rankIndex: number, parentId?: string) => {

        setLoading(l => l.map((v, i) => i === rankIndex ? true : false));
        try {
            let list: TaxonomicNode[];
            if (rankIndex === 0) {
                list = await taxonomyService.getByRank(RANK_ORDER[0]);
            } else if (parentId) {
                list = await taxonomyService.getByParent(parentId);
            } else {
                list = [];
            }

            setOptions(opts => opts.map((o, i) => i === rankIndex ? list : o));
        } catch (err) {
            console.error("❌ Error al recargar:", err);
            setError("Error al recargar taxonomía");
        } finally {
            setLoading(l => l.map((v, i) => false));
        }
    };

    return {
        RANK_ORDER,
        chain,
        setChain,
        options,
        loading,
        error,
        handleChange,
        reloadOptions,
    };
}