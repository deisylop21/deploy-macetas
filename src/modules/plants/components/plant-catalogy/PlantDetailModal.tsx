"use client";

import { useState } from "react";
import { Button } from "../../../core/components/ui/button";
import { PlantCatalogDetail } from "../../lib/plant-catalogy/types";
import { TaxonomicRank } from "../../lib/taxonomy/types";

interface PlantDetailModalProps {
    plant: PlantCatalogDetail | null;
    open: boolean;
    onClose: () => void;
    isDark?: boolean;
}

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

function getTaxonName(ancestry: PlantCatalogDetail["taxonomicAncestry"], rank: TaxonomicRank) {
    const node = ancestry?.find(t => t.rank === rank);
    return node?.name || null;
}

export function PlantDetailModal({
                                     plant,
                                     open,
                                     onClose,
                                     isDark = false
                                 }: PlantDetailModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!open || !plant) return null;

    const getHumidityRange = () =>
        `${plant.minhum ?? "-"}% - ${plant.maxhum ?? "-"}%`;

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === plant.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? plant.images.length - 1 : prevIndex - 1
        );
    };

    const taxonomyWithData = RANK_ORDER
        .map(rank => ({
            rank,
            name: getTaxonName(plant.taxonomicAncestry, rank),
            label: TAXONOMY_RANKS_ES[rank]
        }))
        .filter(item => item.name !== null);


    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
                isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}>
                <div className="border-b p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Detalle de la Planta</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                            {plant.images && plant.images.length > 0 && (
                                <div className="relative">
                                    <img
                                        src={`${plant.images[currentImageIndex].image_url}?t=${Date.now()}`}
                                        alt={plant.name}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />

                                    {plant.images.length > 1 && (
                                        <div className="absolute inset-0 flex items-center justify-between px-2">
                                            <button
                                                onClick={prevImage}
                                                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                            >
                                                ◀
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                            >
                                                ▶
                                            </button>
                                        </div>
                                    )}

                                    {plant.images.length > 1 && (
                                        <div className="flex justify-center mt-2 gap-1">
                                            {plant.images.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-2 h-2 rounded-full ${
                                                        currentImageIndex === index
                                                            ? (isDark ? 'bg-green-400' : 'bg-green-600')
                                                            : (isDark ? 'bg-gray-600' : 'bg-gray-300')
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="md:w-2/3 space-y-4">
                            <div>
                                <h3 className={`text-2xl font-bold flex items-center gap-2 ${
                                    isDark ? 'text-green-400' : 'text-green-900'
                                }`}>
                                    🌱 {plant.name}
                                </h3>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    📊 Datos generales
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500">🔸</span>
                                        <span><strong>Tipo:</strong> {plant.planttype}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-500">🌡️</span>
                                        <span><strong>Temperatura:</strong> {plant.mintemp}°C - {plant.maxtemp}°C</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-500">💧</span>
                                        <span><strong>Humedad:</strong> {getHumidityRange()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            🧬 Taxonomía
                        </h4>

                        {taxonomyWithData.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {taxonomyWithData.map((item) => (
                                    <div
                                        key={item.rank}
                                        className={`p-3 rounded-md border ${
                                            isDark
                                                ? 'border-gray-600 bg-gray-700/50'
                                                : 'border-gray-200 bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-500">🔬</span>
                                            <div>
                                                <strong className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                                    {item.label}:
                                                </strong>
                                                <div className={`font-medium ${
                                                    isDark ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                    {item.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={`text-sm italic ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                No hay información taxonómica disponible para esta planta.
                            </p>
                        )}

                        {taxonomyWithData.length > 0 && (
                            <div className={`mt-4 p-3 rounded-md text-sm ${
                                isDark
                                    ? 'bg-blue-900/20 text-blue-300 border border-blue-700'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span>ℹ️</span>
                                    <strong>Clasificación taxonómica completa</strong>
                                </div>
                                <div className="text-xs">
                                    Mostrando {taxonomyWithData.length} de {RANK_ORDER.length} niveles taxonómicos disponibles
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            📝 Descripción
                        </h4>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {plant.description}
                        </p>
                    </div>

                    {plant.WARNINGS && (
                        <div>
                            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                ⚠️ Advertencias
                            </h4>
                            <p className={`p-3 rounded-lg ${
                                isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700'
                            }`}>
                                {plant.WARNINGS}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={onClose}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}