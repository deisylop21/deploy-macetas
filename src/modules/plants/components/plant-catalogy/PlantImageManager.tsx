"use client";

import { Button } from "../../../core/components/ui/button";
import { PlantImage } from "../../lib/plant-catalogy/types";
import { useImageManager } from "../../hooks/plant-catalogy/useImageManager";
import { ImageUploadSection } from "./ImageUploadSection";
import { usePlantCatalogStore } from "../../states/plant-catalogy/plantCatalogStore";

interface PlantImageManagerProps {
    isEdit: boolean;
    existingImages: PlantImage[];
    setExistingImages: (images: PlantImage[] | ((prev: PlantImage[]) => PlantImage[])) => void;
    plantId?: string;
    uploadedUrls: string[];
    uploadImages: (files: File[]) => Promise<void>;
    isUploading: boolean;
    isDark?: boolean;
}

export function PlantImageManager({
                                      isEdit,
                                      existingImages,
                                      setExistingImages,
                                      plantId,
                                      uploadedUrls,
                                      uploadImages,
                                      isUploading,
                                      isDark = false
                                  }: PlantImageManagerProps) {

    const fetchPlants = usePlantCatalogStore(state => state.fetchPlants);

    const {
        selectedImage,
        imageToAddToPlant,
        processingImageAction,
        showImageDeleteConfirm,
        showImageUpdateConfirm,
        showImageAddConfirm,
        handleImageFileChange,
        prepareUpdateImage,
        handleUpdateImage,
        confirmAddImageToPlant,
        handleAddImageToPlant,
        handleDeleteImage,
        setShowImageDeleteConfirm,
        setShowImageUpdateConfirm,
        setShowImageAddConfirm,
    } = useImageManager({
        existingImages,
        setExistingImages,
        plantId,
        fetchPlants
    });

    if (isEdit) {
        return (
            <>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Gestión de Imágenes</h3>

                    <div className={`mb-4 p-2 rounded text-xs ${
                        isDark ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-50 text-blue-800'
                    }`}>
                        Debug: {existingImages.length} imágenes | Seleccionada: {selectedImage?.name || 'ninguna'} | Para añadir: {imageToAddToPlant?.name || 'ninguna'}
                    </div>

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
                                1. Selecciona una nueva imagen, luego 2. Haz clic en el botón 📝 sobre la imagen que deseas reemplazar
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
                                            onError={(e) => {
                                                console.error("Error cargando imagen:", img.image_url);
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => setShowImageDeleteConfirm(img.id)}
                                                    disabled={!!processingImageAction}
                                                    className="w-10 h-8 text-xs"
                                                >
                                                    🗑️
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => prepareUpdateImage(img.id)}
                                                    disabled={!!processingImageAction || !selectedImage}
                                                    className={`w-10 h-8 text-xs ${
                                                        isDark ? 'bg-blue-700 hover:bg-blue-600 text-white border-blue-600' : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500'
                                                    } ${!selectedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    📝
                                                </Button>
                                            </div>
                                            <span className="text-xs text-white opacity-90">
                                                {img.id ? img.id.substring(0, 8) + '...' : 'Sin ID'}
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

                {showImageDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                        <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <h3 className="text-lg font-semibold mb-4">¿Eliminar imagen?</h3>
                            <p className="text-sm mb-6">
                                ¿Está seguro que desea eliminar esta imagen? Esta acción no se puede deshacer.
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowImageDeleteConfirm(null)}>No</Button>
                                <Button variant="destructive" onClick={() => handleDeleteImage(showImageDeleteConfirm!)}>Sí, eliminar</Button>
                            </div>
                        </div>
                    </div>
                )}

                {showImageAddConfirm && (
                    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                        <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <h3 className="text-lg font-semibold mb-4">¿Añadir imagen?</h3>
                            <p className="text-sm mb-6">
                                ¿Confirma que desea añadir esta imagen a la planta?
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowImageAddConfirm(false)}>No</Button>
                                <Button variant="default" onClick={handleAddImageToPlant}>Sí, añadir</Button>
                            </div>
                        </div>
                    </div>
                )}

                {showImageUpdateConfirm && (
                    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
                        <div className={`max-w-md w-full rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                            <h3 className="text-lg font-semibold mb-4">¿Actualizar imagen?</h3>
                            <p className="text-sm mb-6">
                                ¿Confirma que desea reemplazar la imagen actual con la nueva imagen seleccionada?
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setShowImageUpdateConfirm(null)}>No</Button>
                                <Button variant="default" onClick={handleUpdateImage}>Sí, actualizar</Button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <ImageUploadSection
            uploadedUrls={uploadedUrls}
            onUpload={uploadImages}
            isUploading={isUploading}
            maxImages={5}
            isDark={isDark}
        />
    );
}