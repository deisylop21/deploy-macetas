"use client";

import { useState } from "react";
import { Button } from "../../../core/components/ui/button";
import { TaxonomicNode, TaxonomicRank } from "../../lib/taxonomy/types";
import { TaxonomyEditModal, TaxonomyDeleteModal } from "./TaxonomyManagementModals";

interface PlantTaxonomySectionProps {
    RANK_ORDER: TaxonomicRank[];
    taxonomyChain: (TaxonomicNode | null)[];
    taxonomyOptions: TaxonomicNode[][];
    taxonomyLoading: boolean[];
    onTaxonomyChange: (idx: number, node: TaxonomicNode | null) => Promise<void>;
    onAddTaxon: (rank: TaxonomicRank, parentId: string | undefined, idx: number) => void;
    onReloadOptions: (idx: number, parentId?: string) => Promise<void>;
    isDark?: boolean;
}

const TAXONOMY_RANKS_ES: Record<TaxonomicRank, string> = {
    DOMAIN: "Dominio",
    KINGDOM: "Reino",
    SUBKINGDOM: "Subreino",
    DIVISION: "División",
    SUBDIVISION: "Subdivisión",
    SUPERCLASS: "Superclase",
    CLASS: "Clase",
    SUBCLASS: "Subclase",
    ORDER: "Orden",
    SUBORDER: "Suborden",
    FAMILY: "Familia",
    SUBFAMILY: "Subfamilia",
    TRIBE: "Tribu",
    SUBTRIBE: "Subtribu",
    GENUS: "Género",
    SUBGENUS: "Subgénero",
    SECTION: "Sección",
    SPECIES: "Especie"
};

export function PlantTaxonomySection({
                                         RANK_ORDER,
                                         taxonomyChain,
                                         taxonomyOptions,
                                         taxonomyLoading,
                                         onTaxonomyChange,
                                         onAddTaxon,
                                         onReloadOptions,
                                         isDark = false
                                     }: PlantTaxonomySectionProps) {
    const [editModal, setEditModal] = useState<{
        open: boolean;
        node: TaxonomicNode | null;
        idx: number;
    }>({ open: false, node: null, idx: -1 });

    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        node: TaxonomicNode | null;
        idx: number;
    }>({ open: false, node: null, idx: -1 });

    const handleEditSuccess = async () => {
        const { idx } = editModal;
        const parentId = idx > 0 ? taxonomyChain[idx - 1]?.id : undefined;
        await onReloadOptions(idx, parentId);
        setEditModal({ open: false, node: null, idx: -1 });
    };

    const handleDeleteSuccess = async () => {
        const { idx } = deleteModal;
        for (let i = idx; i < taxonomyChain.length; i++) {
            await onTaxonomyChange(i, null);
            await onReloadOptions(i, i > 0 ? taxonomyChain[i - 1]?.id : undefined);
        }
        setDeleteModal({ open: false, node: null, idx: -1 });
    };

    return (
        <>
            <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    🧬 Taxonomía
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {RANK_ORDER.map((rank, idx) => {
                        const prevSelected = idx === 0 || taxonomyChain[idx - 1];
                        if (!prevSelected) return null;
                        const selectedNode = taxonomyChain[idx];
                        return (
                            <div key={rank}>
                                <label className="block text-sm font-medium mb-1 capitalize">
                                    {TAXONOMY_RANKS_ES[rank] || rank}
                                </label>
                                <div className="flex gap-2 items-center">
                                    <select
                                        key={taxonomyOptions[idx]?.map(opt => opt.id).join('-')}
                                        value={selectedNode?.id ?? ""}
                                        onChange={async (e) => {
                                            const val = e.target.value;
                                            if (val === "__add__") {
                                                onAddTaxon(rank, taxonomyChain[idx - 1]?.id, idx);
                                            } else {
                                                const node = taxonomyOptions[idx]?.find(opt => opt.id === val) ?? null;
                                                await onTaxonomyChange(idx, node);
                                            }
                                        }}
                                        className={`flex-1 h-9 px-3 rounded-md border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                        disabled={taxonomyLoading[idx] || (idx > 0 && !taxonomyChain[idx - 1])}
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="__add__">+ Agregar {TAXONOMY_RANKS_ES[rank]?.toLowerCase() || rank.toLowerCase()}</option>
                                        {taxonomyOptions[idx]?.map(opt => (
                                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                                        ))}
                                    </select>
                                    {selectedNode && (
                                        <div className="flex gap-1">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setEditModal({ open: true, node: selectedNode, idx })}
                                                disabled={taxonomyLoading[idx]}
                                                className={`w-8 h-8 p-0 text-xs ${isDark ? 'bg-blue-700 hover:bg-blue-600 text-white border-blue-600' : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'}`}
                                                title="Editar"
                                            >
                                                ✏️
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => setDeleteModal({ open: true, node: selectedNode, idx })}
                                                disabled={taxonomyLoading[idx]}
                                                className="w-8 h-8 p-0 text-xs"
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </Button>
                                        </div>
                                    )}
                                    {taxonomyLoading[idx] && (
                                        <span className="text-xs">Cargando...</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <TaxonomyEditModal
                open={editModal.open}
                node={editModal.node}
                onClose={() => setEditModal({ open: false, node: null, idx: -1 })}
                onSuccess={handleEditSuccess}
                isDark={isDark}
            />
            <TaxonomyDeleteModal
                open={deleteModal.open}
                node={deleteModal.node}
                onClose={() => setDeleteModal({ open: false, node: null, idx: -1 })}
                onSuccess={handleDeleteSuccess}
                isDark={isDark}
            />
        </>
    );
}