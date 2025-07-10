"use client";

import { useState } from "react";
import { Button } from "../../core/components/ui/button";
import { Input } from "../../core/components/ui/input";

interface RolesFiltersProps {
    onSearch: (search: string) => void;
    onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
    sortBy: string;
    sortOrder: "asc" | "desc";
    isDark?: boolean;
}

const sortOptions = [
    { label: "Nombre (a-z)", value: "name-asc", sortBy: "name", sortOrder: "asc" },
    { label: "Nombre (z-a)", value: "name-desc", sortBy: "name", sortOrder: "desc" },
    { label: "Fecha de creación (antiguo-nuevo)", value: "created_date-asc", sortBy: "created_date", sortOrder: "asc" },
    { label: "Fecha de creación (nuevo-antiguo)", value: "created_date-desc", sortBy: "created_date", sortOrder: "desc" },
    { label: "Estado: Activos primero", value: "is_active-desc", sortBy: "is_active", sortOrder: "desc" },
    { label: "Estado: Inactivos primero", value: "is_active-asc", sortBy: "is_active", sortOrder: "asc" },
];

export function RolesFilters({
                                 onSearch,
                                 onSortChange,
                                 sortBy,
                                 sortOrder,
                                 isDark = false
                             }: RolesFiltersProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    // Calcula el valor select actual
    const currentSortValue =
        sortOptions.find(opt => opt.sortBy === sortBy && opt.sortOrder === sortOrder)?.value
        || "name-asc";

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const found = sortOptions.find(opt => opt.value === value);
        if (found) {
            onSortChange(found.sortBy, found.sortOrder as "asc" | "desc");
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
                    placeholder="Buscar por nombre..."
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