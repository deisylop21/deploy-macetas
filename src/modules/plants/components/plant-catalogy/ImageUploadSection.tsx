"use client";

import { useState, useRef } from "react";
import { Button } from "../../../core/components/ui/button";
import { isFileTooLarge } from "../../utils/plant-catalogy/ImageCompressor";

interface ImageUploadSectionProps {
    uploadedUrls: string[];
    onUpload: (files: File[]) => void;
    isUploading: boolean;
    maxImages?: number;
    isDark?: boolean;
}

export function ImageUploadSection({
                                       uploadedUrls,
                                       onUpload,
                                       isUploading,
                                       maxImages = 5,
                                       isDark = false
                                   }: ImageUploadSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [sizeWarning, setSizeWarning] = useState<string | null>(null);

    const MAX_FILE_SIZE_MB = 2;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const remainingSlots = maxImages - uploadedUrls.length;
            const filesToUpload = Array.from(e.target.files).slice(0, remainingSlots);

            const oversizedFiles = filesToUpload.filter(file => isFileTooLarge(file, MAX_FILE_SIZE_MB));

            if (oversizedFiles.length > 0) {
                setSizeWarning(`${oversizedFiles.length} ${oversizedFiles.length === 1 ? 'imagen excede' : 'imágenes exceden'} el límite de ${MAX_FILE_SIZE_MB}MB. Se intentará comprimir automáticamente.`);
                setTimeout(() => setSizeWarning(null), 5000);
            } else {
                setSizeWarning(null);
            }

            onUpload(filesToUpload);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const remainingSlots = maxImages - uploadedUrls.length;
            const filesToUpload = Array.from(e.dataTransfer.files).slice(0, remainingSlots);

            const oversizedFiles = filesToUpload.filter(file => isFileTooLarge(file, MAX_FILE_SIZE_MB));

            if (oversizedFiles.length > 0) {
                setSizeWarning(`${oversizedFiles.length} ${oversizedFiles.length === 1 ? 'imagen excede' : 'imágenes exceden'} el límite de ${MAX_FILE_SIZE_MB}MB. Se intentará comprimir automáticamente.`);
                setTimeout(() => setSizeWarning(null), 5000); // Limpiar advertencia después de 5 segundos
            } else {
                setSizeWarning(null);
            }

            onUpload(filesToUpload);
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Carrusel de imágenes de la planta</h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Cada imagen debe ser menor a {MAX_FILE_SIZE_MB}MB. Imágenes más grandes serán comprimidas automáticamente.
            </p>

            {sizeWarning && (
                <div className={`p-3 mb-4 rounded-md ${isDark ? 'bg-yellow-800/30 text-yellow-200' : 'bg-yellow-50 text-yellow-700'}`}>
                    ⚠️ {sizeWarning}
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
            />

            {uploadedUrls.length > 0 && (
                <div className="mb-4">
                    <p className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {uploadedUrls.length} de {maxImages} imágenes cargadas
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {uploadedUrls.map((url, index) => (
                            <div
                                key={index}
                                className="relative h-24 rounded-md overflow-hidden border"
                            >
                                <img
                                    src={url}
                                    alt={`Imagen ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {uploadedUrls.length < maxImages && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragging
                            ? (isDark ? 'border-green-500 bg-green-900/10' : 'border-green-500 bg-green-50')
                            : (isDark ? 'border-gray-600' : 'border-gray-300')
                    }`}
                >
                    <div className="text-6xl mb-4">📷</div>
                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {uploadedUrls.length === 0
                            ? `Selecciona o arrastra ${maxImages} fotografías para añadir al carrusel de imágenes`
                            : `Puedes agregar ${maxImages - uploadedUrls.length} imágenes más`}
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClickUpload}
                        disabled={isUploading}
                    >
                        {isUploading ? "Procesando..." : "Seleccionar imágenes"}
                    </Button>
                </div>
            )}
        </div>
    );
}