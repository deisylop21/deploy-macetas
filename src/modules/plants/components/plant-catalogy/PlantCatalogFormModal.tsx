"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../core/components/ui/button";
import { Input } from "../../../core/components/ui/input";
import { ImageUploadSection } from "./ImageUploadSection";
import { PlantCatalogDetail, CreatePlantCatalogDTO, UpdatePlantCatalogDTO, PlantImage } from "../../lib/plant-catalogy/types";
import { plantCatalogService } from "../../services/plant-catalogy/plantCatalogService";

interface PlantCatalogFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreatePlantCatalogDTO | UpdatePlantCatalogDTO) => Promise<void>;
    isSubmitting: boolean;
    uploadImages: (files: File[]) => Promise<void>;
    isUploading: boolean;
    uploadedUrls: string[];
    resetUploadedImages: () => void;
    plant?: PlantCatalogDetail | null;
    families: any[];
    genera: any[];
    species: any[];
    isEdit?: boolean;
    isDark?: boolean;
}

export function PlantFormModal({
                                   open,
                                   onClose,
                                   onSubmit,
                                   isSubmitting,
                                   uploadImages,
                                   isUploading,
                                   uploadedUrls,
                                   resetUploadedImages,
                                   plant,
                                   families = [],
                                   genera = [],
                                   species = [],
                                   isEdit = false,
                                   isDark = false
                               }: PlantCatalogFormModalProps) {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [showImageDeleteConfirm, setShowImageDeleteConfirm] = useState<string | null>(null);
    const [showImageUpdateConfirm, setShowImageUpdateConfirm] = useState<{id: string, file: File} | null>(null);
    const [processingImageAction, setProcessingImageAction] = useState<string | null>(null);

    const [originalData, setOriginalData] = useState<any>({});
    const [formData, setFormData] = useState<any>({
        name: "",
        description: "",
        planttype: "Ornamental",
        mintemp: 20,
        maxtemp: 30,
        humiditylevel: "MEDIUM",
        WARNINGS: "",
        familyId: "",
        genusId: "",
        speciesId: ""
    });

    const [existingImages, setExistingImages] = useState<PlantImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageToAddToPlant, setImageToAddToPlant] = useState<File | null>(null);
    const [showImageAddConfirm, setShowImageAddConfirm] = useState(false);

    useEffect(() => {
        if (isEdit && plant) {
            const initialData = {
                name: plant.name || "",
                description: plant.description || "",
                planttype: plant.planttype || "Ornamental",
                mintemp: plant.mintemp || 20,
                maxtemp: plant.maxtemp || 30,
                humiditylevel: plant.humiditylevel || "MEDIUM",
                WARNINGS: plant.WARNINGS || "",
                familyId: plant.taxonomy?.familyId || "",
                genusId: plant.taxonomy?.genusId || "",
                speciesId: plant.taxonomy?.speciesId || ""
            };

            setOriginalData(initialData);
            setFormData(initialData);

            if (plant.images && plant.images.length > 0) {
                setExistingImages(plant.images);
            }
        } else {
            resetUploadedImages();
        }
    }, [isEdit, plant, resetUploadedImages]);

    useEffect(() => {
        return () => {
            resetUploadedImages();
            setSelectedImage(null);
            setImageToAddToPlant(null);
        };
    }, [resetUploadedImages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.familyId ||
            !formData.genusId || !formData.speciesId) {
            alert("Por favor complete todos los campos requeridos.");
            return;
        }

        if (!isEdit && uploadedUrls.length === 0) {
            alert("Por favor agregue al menos una imagen.");
            return;
        }

        setShowSubmitConfirm(true);
    };

    const handleCancel = () => {
        if (isSubmitting || isUploading || processingImageAction) return;
        setShowCancelConfirm(true);
    };

    const confirmCancel = () => {
        setShowCancelConfirm(false);
        resetUploadedImages();
        onClose();
    };

    const confirmSubmit = async () => {
        setShowSubmitConfirm(false);

        try {
            let dataToSubmit: any;

            if (isEdit) {
                dataToSubmit = {};

                Object.keys(formData).forEach(key => {
                    if (formData[key] !== originalData[key]) {
                        dataToSubmit[key] = formData[key];
                    }
                });

                if (Object.keys(dataToSubmit).length === 0) {
                    alert("No se han realizado cambios en los datos.");
                    onClose();
                    return;
                }
            } else {
                dataToSubmit = {...formData};

                if (uploadedUrls.length > 0) {
                    dataToSubmit.imageUrls = uploadedUrls;
                }
            }

            await onSubmit(dataToSubmit);
            resetUploadedImages();
            onClose();
        } catch (error) {
            console.error("Error al guardar planta:", error);
        }
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, isForUpdate: boolean = false) => {
        if (e.target.files && e.target.files.length > 0) {
            if (isForUpdate) {
                setSelectedImage(e.target.files[0]);
            } else {
                setImageToAddToPlant(e.target.files[0]);
            }
        }
    };

    const prepareUpdateImage = (imageId: string) => {
        if (selectedImage) {
            setShowImageUpdateConfirm({id: imageId, file: selectedImage});
        } else {
            alert("Por favor selecciona una imagen primero");
        }
    };

    const handleUpdateImage = async () => {
        if (!showImageUpdateConfirm) return;

        const {id, file} = showImageUpdateConfirm;
        setShowImageUpdateConfirm(null);
        setProcessingImageAction(id);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const updatedImage = await plantCatalogService.updateImageFile(id, formData);

            const cacheBreaker = `?t=${Date.now()}`;

            setExistingImages(prev => prev.map(img =>
                img.id === id ? {
                    ...updatedImage,
                    image_url: (updatedImage.image_url || img.image_url || '') + cacheBreaker
                } : img
            ));

            setSelectedImage(null);

            const fileInput = document.getElementById('updateImageInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            if (plant?.id) {
                await plantCatalogService.getPlantById(plant.id).then(updatedPlant => {
                    setExistingImages(updatedPlant.images.map(img => ({
                        ...img,
                        image_url: img.image_url + cacheBreaker
                    })));
                });
            }
        } catch (error) {
            console.error("Error al actualizar imagen:", error);
            alert("Error al actualizar la imagen. Por favor intente nuevamente.");
        } finally {
            setProcessingImageAction(null);
        }
    };

    const confirmAddImageToPlant = () => {
        setShowImageAddConfirm(true);
    };

    const handleAddImageToPlant = async () => {
        if (!plant?.id || !imageToAddToPlant) return;

        setShowImageAddConfirm(false);
        setProcessingImageAction("add");
        try {
            const formData = new FormData();
            formData.append('image', imageToAddToPlant);

            const response = await plantCatalogService.addImageToPlant(plant.id, formData);

            const cacheBreaker = `?t=${Date.now()}`;

            setExistingImages(prev => [
                ...prev,
                {
                    ...response,
                    image_url: response.image_url + cacheBreaker
                }
            ]);

            setImageToAddToPlant(null);

            const fileInput = document.getElementById('addImageInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            if (plant?.id) {
                try {
                    const updatedPlant = await plantCatalogService.getPlantById(plant.id);
                    if (updatedPlant.images) {
                        setExistingImages(updatedPlant.images.map(img => ({
                            ...img,
                            image_url: img.image_url + cacheBreaker
                        })));
                    }
                } catch (refreshError) {
                    console.error("Error al refrescar imágenes:", refreshError);
                }
            }
        } catch (error) {
            console.error("Error al añadir imagen:", error);
            alert("Error al añadir la imagen. Por favor intente nuevamente.");
        } finally {
            setProcessingImageAction(null);
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        setShowImageDeleteConfirm(null);
        setProcessingImageAction(imageId);

        try {
            await plantCatalogService.deleteImage(imageId);
            setExistingImages(prev => prev.filter(img => img.id !== imageId));
        } catch (error) {
            console.error("Error al eliminar imagen:", error);
            alert("Error al eliminar la imagen. Por favor intente nuevamente.");
        } finally {
            setProcessingImageAction(null);
        }
    };

    const HUMIDITY_LEVELS = [
        { value: "LOW", label: "Nivel bajo (20% - 30%)" },
        { value: "LOW_MEDIUM", label: "Nivel bajo-medio (30% - 40%)" },
        { value: "MEDIUM", label: "Nivel medio (40% - 50%)" },
        { value: "MEDIUM_HIGH", label: "Nivel medio-alto (50% - 60%)" },
        { value: "HIGH", label: "Nivel alto (60% - 70%)" }
    ];

    const PLANT_TYPES = [
        "Ornamental",
        "Hortalizas y leguminosas",
        "Árboles frutales",
        "Hierbas aromáticas",
        "Suculentas",
        "Acuáticas",
        "Trepadoras"
    ];

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}>
                    <div className="border-b p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{isEdit ? "Editar" : "Agregar"} Planta</h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                                disabled={isSubmitting || isUploading || !!processingImageAction}
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitForm} className="p-6 space-y-6">
                        {isEdit ? (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Gestión de Imágenes</h3>

                                <div className={`p-4 mb-4 border rounded-md ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                                    <h4 className="font-semibold mb-2">Actualizar una imagen</h4>
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <div className="flex-1">
                                            <input
                                                id="updateImageInput"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageFileChange(e, true)}
                                                className={`w-full py-1 px-2 border rounded ${
                                                    isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                                                }`}
                                            />
                                        </div>
                                        <p className="text-sm italic">
                                            1. Selecciona una nueva imagen, luego
                                            2. Haz clic en el botón 📝 sobre la imagen que deseas reemplazar
                                        </p>
                                    </div>
                                </div>

                                {existingImages.length > 0 ? (
                                    <div className="mb-4">
                                        <h4 className="font-semibold mb-2">Imágenes Actuales ({existingImages.length}/5)</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                            {existingImages.map((img) => (
                                                <div
                                                    key={img.id}
                                                    className={`relative h-28 rounded-md overflow-hidden border group ${
                                                        isDark ? 'border-gray-600' : 'border-gray-300'
                                                    }`}
                                                >
                                                    <img
                                                        src={`${img.image_url}?t=${Date.now()}`}
                                                        alt="Imagen de planta"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                        <div className="flex gap-2">
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => setShowImageDeleteConfirm(img.id)}
                                                                disabled={!!processingImageAction}
                                                                className="w-10 h-8"
                                                            >
                                                                🗑️
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => prepareUpdateImage(img.id)}
                                                                disabled={!!processingImageAction || !selectedImage}
                                                                className={`w-10 h-8 ${
                                                                    isDark ? 'bg-blue-700 hover:bg-blue-600 text-white border-blue-600' : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                                                                } ${!selectedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                📝
                                                            </Button>
                                                        </div>
                                                        <span className="text-xs text-white opacity-90">
                              <span className="text-xs text-white opacity-90">
  {img.id ? img.id.substring(0, 8) + '...' : 'Sin ID'}
</span>
                            </span>
                                                    </div>
                                                    {processingImageAction === img.id && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                                                            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className={`mb-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'} bg-yellow-100/20 p-3 rounded`}>
                                        ⚠️ No hay imágenes disponibles para esta planta.
                                    </p>
                                )}

                                {existingImages.length < 5 && (
                                    <div className={`mt-4 p-4 border rounded-md ${isDark ? 'border-green-700 bg-green-900/20' : 'border-green-200 bg-green-50'}`}>
                                        <h4 className="font-semibold mb-2">Añadir nueva imagen</h4>
                                        <div className="flex flex-col md:flex-row gap-3">
                                            <div className="flex-1">
                                                <input
                                                    id="addImageInput"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageFileChange(e, false)}
                                                    className={`w-full py-1 px-2 border rounded ${
                                                        isDark ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                                                    }`}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="default"
                                                onClick={confirmAddImageToPlant}
                                                disabled={!imageToAddToPlant || !!processingImageAction}
                                                className={`${isDark ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-500'}`}
                                            >
                                                {processingImageAction === "add" ? (
                                                    <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></span>
                                                ) : null}
                                                Añadir Imagen
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <ImageUploadSection
                                uploadedUrls={uploadedUrls}
                                onUpload={uploadImages}
                                isUploading={isUploading}
                                maxImages={5}
                                isDark={isDark}
                            />
                        )}

                        <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                🌱 Nombre de la planta
                            </h3>
                            <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Nombre de la planta
                            </p>
                            <Input
                                name="name"
                                placeholder="Ejemplo: Rosa"
                                value={formData.name}
                                onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                            name="mintemp"
                                            type="number"
                                            placeholder="0"
                                            className="rounded-r-none"
                                            value={formData.mintemp}
                                            onChange={handleInputChange}
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
                                            onChange={handleInputChange}
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
                                        name="humiditylevel"
                                        value={formData.humiditylevel}
                                        onChange={handleInputChange}
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
                                        name="familyId"
                                        value={formData.familyId}
                                        onChange={handleInputChange}
                                        className={`w-full h-9 px-3 rounded-md border ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        {families.map(family => (
                                            <option key={family.id} value={family.id}>{family.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Género</label>
                                    <select
                                        name="genusId"
                                        value={formData.genusId}
                                        onChange={handleInputChange}
                                        className={`w-full h-9 px-3 rounded-md border ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        {genera.map(genus => (
                                            <option key={genus.id} value={genus.id}>{genus.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Especie</label>
                                    <select
                                        name="speciesId"
                                        value={formData.speciesId}
                                        onChange={handleInputChange}
                                        className={`w-full h-9 px-3 rounded-md border ${
                                            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                        }`}
                                        required
                                    >
                                        <option value="">Seleccionar</option>
                                        {species.map(specie => (
                                            <option key={specie.id} value={specie.id}>{specie.name}</option>
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
                                name="description"
                                placeholder="Ejemplo: Esta rosa es una variedad..."
                                rows={4}
                                value={formData.description}
                                onChange={handleInputChange}
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
                                name="WARNINGS"
                                placeholder="Ejemplo: No es tóxica para mascotas..."
                                rows={3}
                                value={formData.WARNINGS}
                                onChange={handleInputChange}
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
                                disabled={isSubmitting || isUploading || !!processingImageAction}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || isUploading || !!processingImageAction ||
                                    (!isEdit && uploadedUrls.length === 0)}
                            >
                                {isSubmitting ? "Guardando..." : "Aceptar"}
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
                        <p className="text-sm mb-6">¿Seguro que desea cancelar? Los cambios no guardados se perderán.</p>
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
                        <h3 className="text-lg font-semibold mb-4">¿Confirmar?</h3>
                        <p className="text-sm mb-6">
                            ¿Desea {isEdit ? "actualizar" : "añadir"} los datos de la planta a la base de datos para que sea visible para los usuarios de la aplicación móvil?
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowSubmitConfirm(false)}
                                disabled={isSubmitting}
                            >
                                No
                            </Button>
                            <Button
                                onClick={confirmSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Guardando..." : `Sí, ${isEdit ? "actualizar" : "agregar"}`}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showImageDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                    <div className={`max-w-md w-full rounded-lg p-6 ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                    }`}>
                        <h3 className="text-lg font-semibold mb-4">¿Eliminar imagen?</h3>
                        <p className="text-sm mb-6">
                            ¿Está seguro que desea eliminar esta imagen? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowImageDeleteConfirm(null)}
                            >
                                No
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleDeleteImage(showImageDeleteConfirm)}
                            >
                                Sí, eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showImageAddConfirm && (
                <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                    <div className={`max-w-md w-full rounded-lg p-6 ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                    }`}>
                        <h3 className="text-lg font-semibold mb-4">¿Añadir imagen?</h3>
                        <p className="text-sm mb-6">
                            ¿Confirma que desea añadir esta imagen a la planta?
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowImageAddConfirm(false)}
                            >
                                No
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleAddImageToPlant}
                            >
                                Sí, añadir
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showImageUpdateConfirm && (
                <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                    <div className={`max-w-md w-full rounded-lg p-6 ${
                        isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                    }`}>
                        <h3 className="text-lg font-semibold mb-4">¿Actualizar imagen?</h3>
                        <p className="text-sm mb-6">
                            ¿Confirma que desea reemplazar la imagen actual con la nueva imagen seleccionada?
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowImageUpdateConfirm(null)}
                            >
                                No
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleUpdateImage}
                            >
                                Sí, actualizar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}