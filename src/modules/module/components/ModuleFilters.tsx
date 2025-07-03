"use client";

import { useState } from "react";
import { Button } from "../../core/components/ui/button";
import { Input } from "../../core/components/ui/input";

interface ModuleFiltersProps {
    onSearch: (search: string) => void;
    onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
    sortBy: string;
    sortOrder: "asc" | "desc";
    isDark?: boolean;
}

export function ModuleFilters({
                                  onSearch,
                                  onSortChange,
                                  sortBy,
                                  sortOrder,
                                  isDark = false
                              }: ModuleFiltersProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChange(e.target.value, sortOrder);
    };

    const handleSortOrderChange = () => {
        onSortChange(sortBy, sortOrder === "asc" ? "desc" : "asc");
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
                    value={sortBy}
                    onChange={handleSortByChange}
                    className={`border rounded px-2 py-1.5 ${
                        isDark
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                    }`}
                >
                    <option value="name">Nombre</option>
                    <option value="created_date">Fecha de creación</option>
                </select>
                <Button
                    onClick={handleSortOrderChange}
                    variant="ghost"
                    className={`px-2 ${isDark ? "text-white" : ""}`}
                >
                    {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
            </div>
        </div>
    );
}