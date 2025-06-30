"use client";

import { Button } from "../../../core/components/ui/button";
import { PlantCatalogBasic } from "../../lib/plant-catalogy/types";

interface PlantCardProps {
    plant: PlantCatalogBasic;
    onViewDetail: (plantId: string) => void;
    onEdit: (plantId: string) => void;
    onDelete: (plantId: string) => void;
    isDark?: boolean;
}

export function PlantCard({ plant, onViewDetail, onEdit, onDelete, isDark = false }: PlantCardProps) {
    return (
        <div className={`rounded-lg border shadow-md overflow-hidden transition-transform hover:scale-105 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={`${plant.image?.image_url}?t=${Date.now()}`}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-4 space-y-3">
                <div>
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${
                        isDark ? 'text-green-400' : 'text-green-900'
                    }`}>
                        🌱 {plant.name}
                    </h3>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-orange-500">🔸</span>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              <strong>Tipo:</strong> {plant.planttype}
            </span>
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button
                        onClick={() => onViewDetail(plant.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center gap-2"
                    >
                        <span>👁️</span>
                        Ver detalle
                    </Button>
                    <Button
                        onClick={() => onEdit(plant.id)}
                        variant="default"
                        size="sm"
                        className="flex items-center gap-1"
                    >
                        <span>✏️</span>
                    </Button>
                    <Button
                        onClick={() => onDelete(plant.id)}
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                    >
                        <span>🗑️</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}