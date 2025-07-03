"use client";

import { useState } from "react";
import { Input } from "../../../core/components/ui/input";

interface PlantCatalogFiltersProps {
    onSearch: (search: string) => void;
    onSortByChange: (sortBy: string) => void;
    onSortOrderChange: (sortOrder: "asc" | "desc") => void;
    sortBy: string;
    sortOrder: "asc" | "desc";
    isDark?: boolean;
}

export function PlantCatalogFilters({
                                        onSearch,
                                        onSortByChange,
                                        onSortOrderChange,
                                        sortBy,
                                        sortOrder,
                                        isDark = false
                                    }: PlantCatalogFiltersProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortByChange(e.target.value);
    };

    const handleSortOrderClick = () => {
        onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
    };

    return (
        <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 max-w-lg relative">
                <form onSubmit={handleSearchSubmit} className="flex">
                    <Input
                        type="text"
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pr-10"
                    />
                    <button
                        type="submit"
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                            isDark
                                ? 'text-gray-400 hover:text-gray-200'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        aria-label="Buscar"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </form>
            </div>

            <div className="flex items-center gap-2">
                <label className="text-sm">Ordenar por:</label>
                <select
                    value={sortBy}
                    onChange={handleSortByChange}
                    className={`h-9 px-3 rounded-md border text-base transition-colors outline-none focus:ring-2 focus:ring-green-500 ${
                        isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-700'
                    }`}
                >
                    <option value="name">Nombre</option>
                    <option value="planttype">Tipo</option>
                    <option value="created_at">Fecha de creación</option>
                </select>
                <button
                    type="button"
                    onClick={handleSortOrderClick}
                    className={`h-9 px-2 border rounded transition-colors ${
                        isDark
                            ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                    title="Cambiar orden"
                >
                    {sortOrder === "asc" ? "↑" : "↓"}
                </button>
            </div>
        </div>
    );
}