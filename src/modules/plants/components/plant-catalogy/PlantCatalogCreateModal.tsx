"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../core/components/ui/button";
import { Input } from "../../../core/components/ui/input";
import { ImageUploadSection } from "./ImageUploadSection";
import { usePlantCatalog } from "../../hooks/plant-catalogy/usePlantCatalog";

interface PlantCatalogCreateModalProps {
    open: boolean;
    onClose: () => void;
    isDark?: boolean;
}

export function PlantCatalogCreateModal({
                                            open,
                                            onClose,
                                            isDark = false
                                        }: PlantCatalogCreateModalProps) {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [plantType, setPlantType] = useState("Ornamental");
    const [minTemp, setMinTemp] = useState(20);
    const [maxTemp, setMaxTemp] = useState(30);
    const [humidityLevel, setHumidityLevel] = useState("MEDIUM");
    const [warnings, setWarnings] = useState("");
    const [familyId, setFamilyId] = useState("");
    const [genusId, setGenusId] = useState("");
    const [speciesId, setSpeciesId] = useState("");

    const {
        plantFamilies,
        plantGenera,
        plantSpecies,
        uploadedImageUrls,
        uploadImages,
        creating,
        uploading,
        createPlant,
        resetUploadedImages,
        loadFamilies,
        loadGenera,
        loadSpecies
    } = usePlantCatalog();

    useEffect(() => {
        if (open) {
            loadFamilies();
            loadGenera();
            loadSpecies();
            resetUploadedImages();
        }
    }, [open, loadFamilies, loadGenera, loadSpecies, resetUploadedImages]);

    useEffect(() => {
        return () => {
            resetUploadedImages();
        };
    }, [resetUploadedImages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (uploadedImageUrls.length === 0) {
            alert("Debe cargar al menos una imagen");
            return;
        }

        setShowSubmitConfirm(true);
    };

    const handleCancel = () => {
        setShowCancelConfirm(true);
    };

    const confirmCancel = () => {
        setShowCancelConfirm(false);
        resetForm();
        onClose();
    };

    const confirmSubmit = async () => {
        setShowSubmitConfirm(false);

        try {
            await createPlant({
                name,
                description,
                planttype: plantType,
                mintemp: minTemp,
                maxtemp: maxTemp,
                humiditylevel: humidityLevel,
                WARNINGS: warnings,
                familyId,
                genusId,
                speciesId,
                imageUrls: uploadedImageUrls
            });

            resetForm();
            onClose();
        } catch (error) {
            console.error("Error al crear planta:", error);
        }
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setPlantType("Ornamental");
        setMinTemp(20);
        setMaxTemp(30);
        setHumidityLevel("MEDIUM");
        setWarnings("");
        setFamilyId("");
        setGenusId("");
        setSpeciesId("");
        resetUploadedImages();
    };

    const PLANT_TYPES = [
        "Ornamental",
        "Hortalizas y leguminosas",
        "Árboles frutales",
        "Hierbas aromáticas",
        "Suculentas",
        "Acuáticas",
        "Trepadoras"
    ];

    const HUMIDITY_LEVELS = [
        { value: "LOW", label: "Nivel bajo (20% - 30%)" },
        { value: "LOW_MEDIUM", label: "Nivel bajo-medio (30% - 40%)" },
        { value: "MEDIUM", label: "Nivel medio (40% - 50%)" },
        { value: "MEDIUM_HIGH", label: "Nivel medio-alto (50% - 60%)" },
        { value: "HIGH", label: "Nivel alto (60% - 70%)" }
    ];

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                {/* Modal */}
                <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}>
                    <div className="border-b p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Agregar Planta</h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                                disabled={creating || uploading}
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <ImageUploadSection
                            uploadedUrls={uploadedImageUrls}
                            onUpload={uploadImages}
                            isUploading={uploading}
                            maxImages={5}
                            isDark={isDark}
                        />

                        <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                🌱 Nombre de la planta
                            </h3>
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Nombre de la planta
                            </p>
                            <Input
                                placeholder="Ejemplo: Rosa"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                    value={plantType}
                                    onChange={(e) => setPlantType(e.target.value)}
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

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Temperatura mínima</label>
                                    <div className="flex">
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            className="rounded-r-none"
                                            value={minTemp}
                                            onChange={(e) => setMinTemp(Number(e.target.value))}
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
                                            type="number"
                                            placeholder="0"
                                            className="rounded-r-none"
                                            value={maxTemp}
                                            onChange={(e) => setMaxTemp(Number(e.target.value))}
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
                                    <label className="block text-sm font-medium mb-1">Nivel de humedad</label>
                                    <select
                                        value={humidityLevel}
                                        onChange={(e) => setHumidityLevel(e.target.value)}
                                        className={`w-full h-9 px-3 rounded-md border ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                        }`}
                                        required
                                    >
                                        {HUMIDITY_LEVELS.map(level => (
                                            <option key={level.value} value={level.value}>{level.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                🧬 Taxonomía
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Familia</label>
                                    <select
                                        value={familyId}
                                        onChange={(e) => setFamilyId(e.target.value)}
                                        className={`w-full h-9 px-3 rounded-md border ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        {plantFamilies.map(family => (
                                            <option key={family.id} value={family.id}>{family.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Género</label>
                                    <select
                                        value={genusId}
                                        onChange={(e) => setGenusId(e.target.value)}
                                        className={`w-full h-9 px-3 rounded-md border ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        {plantGenera.map(genus => (
                                            <option key={genus.id} value={genus.id}>{genus.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Especie</label>
                                    <select
                                        value={speciesId}
                                        onChange={(e) => setSpeciesId(e.target.value)}
                                        className={`w-full h-9 px-3 rounded-md border ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        {plantSpecies.map(species => (
                                            <option key={species.id} value={species.id}>{species.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                📝 Descripción
                            </h3>
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Descripción
                            </p>
                            <textarea
                                placeholder="Ejemplo: Esta rosa es una variedad..."
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
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
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Advertencia (opcional)
                            </p>
                            <textarea
                                placeholder="Ejemplo: No es tóxica para mascotas..."
                                rows={3}
                                value={warnings}
                                onChange={(e) => setWarnings(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md resize-none ${
                                    isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                                }`}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={creating || uploading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={creating || uploading || uploadedImageUrls.length === 0}
                            >
                                {creating ? "Guardando..." : "Aceptar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                    <div className={`max-w-md w-full rounded-lg p-6 ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                    }`}>
                        <h3 className="text-lg font-semibold mb-4">¿Seguro que desea cancelar?</h3>
                        <p className="text-sm mb-6">¿Seguro que desea cancelar el agregar la planta?</p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowCancelConfirm(false)}
                            >
                                No
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmCancel}
                            >
                                Sí, cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showSubmitConfirm && (
                <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                    <div className={`max-w-md w-full rounded-lg p-6 ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                    }`}>
                        <h3 className="text-lg font-semibold mb-4">¿Confirmar agregar planta?</h3>
                        <p className="text-sm mb-6">¿Desea añadir los datos de la planta a la base de datos para que sea visible para los usuarios de la aplicación móvil?</p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowSubmitConfirm(false)}
                                disabled={creating}
                            >
                                No
                            </Button>
                            <Button
                                onClick={confirmSubmit}
                                disabled={creating}
                            >
                                {creating ? "Guardando..." : "Sí, agregar"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}