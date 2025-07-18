"use client";

import { useState } from "react";
import { Button } from "../../core/components/ui/button";
import { Input } from "../../core/components/ui/input";

interface UserGeneralFiltersProps {
    onSearch: (search: string) => void;
    onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
    sortBy: string;
    sortOrder: "asc" | "desc";
    isDark?: boolean;
}

const sortOptions = [
    { label: "Nombre (A-Z)", value: "name-asc", sortBy: "name", sortOrder: "asc" },
    { label: "Nombre (Z-A)", value: "name-desc", sortBy: "name", sortOrder: "desc" },
    { label: "Apellido (A-Z)", value: "lastname-asc", sortBy: "lastname", sortOrder: "asc" },
    { label: "Apellido (Z-A)", value: "lastname-desc", sortBy: "lastname", sortOrder: "desc" },
    { label: "Correo (A-Z)", value: "email-asc", sortBy: "email", sortOrder: "asc" },
    { label: "Correo (Z-A)", value: "email-desc", sortBy: "email", sortOrder: "desc" },
    { label: "Estado: Activos primero", value: "status_account-asc", sortBy: "status_account", sortOrder: "asc" },
    { label: "Estado: Inactivos primero", value: "status_account-desc", sortBy: "status_account", sortOrder: "desc" },
];

export function UserGeneralFilters({
                                       onSearch,
                                       onSortChange,
                                       sortBy,
                                       sortOrder,
                                       isDark = false
                                   }: UserGeneralFiltersProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

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
            <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                <Input
                    type="text"
                    placeholder="Buscar por nombre, apellido o email..."
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