"use client";

import { useState } from "react";
import { Button } from "../../../core/components/ui/button";
import { TaxonomicRank } from "../../lib/taxonomy/types";
import { taxonomyService } from "../../services/taxonomy/taxonomyService";

interface TaxonAddModalProps {
    open: boolean;
    rank: TaxonomicRank;
    parentId?: string;
    idx: number;
    onClose: () => void;
    onSuccess: (idx: number, parentId?: string) => Promise<void>;
    onTaxonomyChange: (idx: number, node: any) => Promise<void>;
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

export function TaxonAddModal({
                                  open,
                                  rank,
                                  parentId,
                                  idx,
                                  onClose,
                                  onSuccess,
                                  onTaxonomyChange,
                                  isDark = false
                              }: TaxonAddModalProps) {
    const [newTaxonName, setNewTaxonName] = useState("");
    const [creating, setCreating] = useState(false);

    if (!open) return null;

    const handleCreate = async () => {
        if (!newTaxonName.trim()) return;

        setCreating(true);
        try {
            const newTaxon = await taxonomyService.create({
                name: newTaxonName,
                rank: rank,
                parentId: parentId,
            });

            await onSuccess(idx, parentId);
            await onTaxonomyChange(idx, newTaxon);

            setNewTaxonName("");
            onClose();
        } catch (e) {
            alert("Error al crear taxón");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
            <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                <h3 className="text-lg font-semibold mb-4">
                    Agregar {TAXONOMY_RANKS_ES[rank]?.toLowerCase() || rank.toLowerCase()}
                </h3>
                <input
                    className={`mb-4 w-full px-3 py-2 border rounded ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                    placeholder={`Nombre del nuevo ${TAXONOMY_RANKS_ES[rank]?.toLowerCase() || rank.toLowerCase()}`}
                    value={newTaxonName}
                    onChange={e => setNewTaxonName(e.target.value)}
                    disabled={creating}
                />
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={creating}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleCreate}
                        disabled={!newTaxonName.trim() || creating}
                    >
                        {creating ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
            </div>
        </div>
    );
}