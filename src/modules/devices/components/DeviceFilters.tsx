"use client";

import { useState } from "react";
import { Button } from "../../core/components/ui/button";
import { Input } from "../../core/components/ui/input";

interface DeviceFiltersProps {
    onSearch: (search: string) => void;
    onSortChange: (sortBy: string, sortOrder: "asc" | "desc" | "linked") => void;
    sortBy: string;
    sortOrder: "asc" | "desc" | "linked";
    isDark?: boolean;
}

// Opciones de ordenamiento
const sortOptions = [
    { label: "Identificador (a-z)", value: "identifier-asc", sortBy: "identifier", sortOrder: "asc" },
    { label: "Identificador (z-a)", value: "identifier-desc", sortBy: "identifier", sortOrder: "desc" },
    { label: "Fecha de registro (antiguo-nuevo)", value: "registered_at-asc", sortBy: "registered_at", sortOrder: "asc" },
    { label: "Fecha de registro (nuevo-antiguo)", value: "registered_at-desc", sortBy: "registered_at", sortOrder: "desc" },
    { label: "Estado: Inactivos primero", value: "status-desc", sortBy: "status", sortOrder: "desc" },
    { label: "Estado: Activos primero", value: "status-asc", sortBy: "status", sortOrder: "asc" }
];

export function DeviceFilters({
                                  onSearch,
                                  onSortChange,
                                  sortBy,
                                  sortOrder,
                                  isDark = false
                              }: DeviceFiltersProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    // Detecta la opción seleccionada correctamente
    const currentSortValue =
        sortOptions.find(opt => opt.sortBy === sortBy && opt.sortOrder === sortOrder)?.value
        || "identifier-asc";

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const found = sortOptions.find(opt => opt.value === value);
        if (found) {
            onSortChange(found.sortBy, found.sortOrder as "asc" | "desc" | "linked");
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form
                onSubmit={handleSearchSubmit}
                className="flex-1 flex gap-2"
            >
                <Input
                    type="text"
                    placeholder="Buscar por identificador..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={isDark ? "bg-gray-700 border-gray-600 text-white" : ""}
                />
                <Button
                    type="submit"
                    variant={isDark ? "outline" : "default"}
                    className={isDark ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : ""}
                >
                    Buscar
                </Button>
            </form>
            <div className="flex items-center gap-2">
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>Ordenar por:</span>
                <select
                    value={currentSortValue}
                    onChange={handleSortByChange}
                    className={`border rounded px-2 py-1.5 ${
                        isDark
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                    }`}
                >
                    {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}