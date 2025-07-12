"use client";

import { Input } from "../../../core/components/ui/input";

interface PlantBasicInfoSectionProps {
    formData: {
        name: string;
        description: string;
        planttype: string;
        mintemp: number;
        maxtemp: number;
        minhum: number;
        maxhum: number;
        WARNINGS: string;
    };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onMinHumChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMaxHumChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isDark?: boolean;
}

const PLANT_TYPES = [
    "Ornamental",
    "Hortalizas y leguminosas",
    "Árboles frutales",
    "Hierbas aromáticas",
    "Suculentas",
    "Acuáticas",
    "Trepadoras"
];

export function PlantBasicInfoSection({
                                          formData,
                                          onInputChange,
                                          onMinHumChange,
                                          onMaxHumChange,
                                          isDark = false
                                      }: PlantBasicInfoSectionProps) {
    return (
        <>
            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    🌱 Nombre de la planta
                </h3>
                <Input
                    name="name"
                    placeholder="Ejemplo: Rosa"
                    value={formData.name}
                    onChange={onInputChange}
                    required
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    📊 Datos generales
                </h3>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select
                        name="planttype"
                        value={formData.planttype}
                        onChange={onInputChange}
                        className={`w-full h-9 px-3 rounded-md border ${
                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                        required
                    >
                        {PLANT_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Temperatura mínima</label>
                        <div className="flex">
                            <Input
                                name="mintemp"
                                type="number"
                                placeholder="0"
                                className="rounded-r-none"
                                value={formData.mintemp}
                                onChange={onInputChange}
                                required
                            />
                            <div className={`flex items-center px-3 border-l-0 border rounded-r-md ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300'
                            }`}>
                                °C
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Temperatura máxima</label>
                        <div className="flex">
                            <Input
                                name="maxtemp"
                                type="number"
                                placeholder="0"
                                className="rounded-r-none"
                                value={formData.maxtemp}
                                onChange={onInputChange}
                                required
                            />
                            <div className={`flex items-center px-3 border-l-0 border rounded-r-md ${
                                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300'
                            }`}>
                                °C
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Humedad mínima (%)</label>
                        <Input
                            name="minhum"
                            type="number"
                            value={formData.minhum}
                            min={0}
                            max={formData.maxhum}
                            onChange={onMinHumChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Humedad máxima (%)</label>
                        <Input
                            name="maxhum"
                            type="number"
                            value={formData.maxhum}
                            min={formData.minhum}
                            max={100}
                            onChange={onMaxHumChange}
                            required
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    📝 Descripción
                </h3>
                <textarea
                    name="description"
                    placeholder="Ejemplo: Esta rosa es una variedad..."
                    rows={4}
                    value={formData.description}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border rounded-md resize-none ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                    }`}
                    required
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    ⚠️ Advertencias
                </h3>
                <textarea
                    name="WARNINGS"
                    placeholder="Ejemplo: No es tóxica para mascotas..."
                    rows={3}
                    value={formData.WARNINGS}
                    onChange={onInputChange}
                    className={`w-full px-3 py-2 border rounded-md resize-none ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                    }`}
                />
            </div>
        </>
    );
}