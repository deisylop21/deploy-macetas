"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "../../../core/components/ui/button";
import { PlantCatalogDetail, CreatePlantCatalogDTO, UpdatePlantCatalogDTO, PlantImage } from "../../lib/plant-catalogy/types";
import { useTaxonomyChain } from "../../hooks/taxonomy/useTaxonomyChain";
import { useFormData } from "../../hooks/plant-catalogy/useFormData";
import { TaxonomicRank } from "../../lib/taxonomy/types";
import { PlantImageManager } from "./PlantImageManager";
import { PlantBasicInfoSection } from "./PlantBasicInfoSection";
import { PlantTaxonomySection } from "./PlantTaxonomySection";
import { TaxonAddModal } from "./TaxonAddModal";
import { ConfirmationModals } from "./ConfirmationModals";

interface PlantCatalogFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreatePlantCatalogDTO | UpdatePlantCatalogDTO) => Promise<void>;
    isSubmitting: boolean;
    isLoadingDetail: boolean;
    uploadImages: (files: File[]) => Promise<void>;
    isUploading: boolean;
    uploadedUrls: string[];
    resetUploadedImages: () => void;
    plant?: PlantCatalogDetail | null;
    isEdit?: boolean;
    isDark?: boolean;
}

const RANK_ORDER: TaxonomicRank[] = [
    TaxonomicRank.DOMAIN,
    TaxonomicRank.KINGDOM,
    TaxonomicRank.SUBKINGDOM,
    TaxonomicRank.DIVISION,
    TaxonomicRank.SUBDIVISION,
    TaxonomicRank.SUPERCLASS,
    TaxonomicRank.CLASS,
    TaxonomicRank.SUBCLASS,
    TaxonomicRank.ORDER,
    TaxonomicRank.SUBORDER,
    TaxonomicRank.FAMILY,
    TaxonomicRank.SUBFAMILY,
    TaxonomicRank.TRIBE,
    TaxonomicRank.SUBTRIBE,
    TaxonomicRank.GENUS,
    TaxonomicRank.SUBGENUS,
    TaxonomicRank.SECTION,
    TaxonomicRank.SPECIES,
];

export function PlantFormModal({
                                   open,
                                   onClose,
                                   onSubmit,
                                   isSubmitting,
                                   isLoadingDetail,
                                   uploadImages,
                                   isUploading,
                                   uploadedUrls,
                                   resetUploadedImages,
                                   plant,
                                   isEdit = false,
                                   isDark = false
                               }: PlantCatalogFormModalProps) {

    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);


    const [existingImages, setExistingImages] = useState<PlantImage[]>([]);


    const [addTaxonModal, setAddTaxonModal] = useState<{
        rank: TaxonomicRank;
        parentId?: string;
        idx: number;
    } | null>(null);


    const {
        formData,
        isDataLoaded,
        handleInputChange,
        handleMinHumChange,
        handleMaxHumChange,
        resetFormData,
        getChangedData,
        hasChanges
    } = useFormData({ plant, isEdit, open, isLoadingDetail });


    const initialTaxonomy = useMemo(() => {
        if (isEdit && plant && plant.taxonomicAncestry && plant.taxonomicAncestry.length > 0 && !isLoadingDetail) {
            return plant.taxonomicAncestry;
        }
        return undefined;
    }, [isEdit, plant?.id, plant?.taxonomicAncestry, isLoadingDetail]);

    const {
        chain: taxonomyChain,
        setChain: setTaxonomyChain,
        options: taxonomyOptions,
        loading: taxonomyLoading,
        handleChange: handleTaxonomyChange,
        reloadOptions: reloadTaxonomyOptions
    } = useTaxonomyChain(initialTaxonomy);

    useEffect(() => {
        if (open && isEdit && plant && !isLoadingDetail) {

            if (plant.images && Array.isArray(plant.images) && plant.images.length > 0) {
                const validImages = plant.images.filter(img =>
                    img &&
                    typeof img === 'object' &&
                    img.id &&
                    img.image_url
                );
                setExistingImages(validImages);
            } else {
                setExistingImages([]);
            }
        } else if (open && !isEdit) {
            setExistingImages([]);
            resetUploadedImages();
        } else if (!open) {
            setExistingImages([]);
        }
    }, [open, isEdit, plant?.id, plant?.images, isLoadingDetail, resetUploadedImages]);

    useEffect(() => {
        if (open && isEdit && plant && plant.taxonomicAncestry && plant.taxonomicAncestry.length > 0 && !isLoadingDetail) {
            setTimeout(() => {
                const taxonomyArray = RANK_ORDER.map(rank =>
                    plant.taxonomicAncestry?.find(node => node.rank === rank) || null
                );
                setTaxonomyChain(taxonomyArray);
            }, 100);
        } else if (open && !isEdit) {
            setTaxonomyChain(Array(RANK_ORDER.length).fill(null));
        }
    }, [open, isEdit, plant?.id, plant?.taxonomicAncestry, isLoadingDetail, setTaxonomyChain]);

    useEffect(() => {
        if (!open) {
            resetUploadedImages();
            setExistingImages([]);
            setTaxonomyChain(Array(RANK_ORDER.length).fill(null));
        }
    }, [open, resetUploadedImages, setTaxonomyChain]);

    const handleSubmitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const lastIndex = taxonomyChain.map((t) => !!t).lastIndexOf(true);
        const lastTaxon = taxonomyChain[lastIndex];

        if (!lastTaxon) {
            alert("Debe seleccionar al menos un nivel de taxonomía.");
            return;
        }
        if (!formData.name || !formData.description) {
            alert("Por favor complete todos los campos requeridos.");
            return;
        }
        if (!isEdit && uploadedUrls.length === 0) {
            alert("Por favor agregue al menos una imagen.");
            return;
        }
        setShowSubmitConfirm(true);
    };

    const confirmSubmit = async () => {
        setShowSubmitConfirm(false);
        try {
            let dataToSubmit: any;
            const lastIndex = taxonomyChain.map(t => !!t).lastIndexOf(true);
            const lastTaxon = taxonomyChain[lastIndex];

            if (isEdit) {
                dataToSubmit = getChangedData();
                if (lastTaxon && (!plant?.taxonomicNodeId || lastTaxon.id !== plant.taxonomicNodeId)) {
                    dataToSubmit.taxonomicNodeId = lastTaxon.id;
                }
                if (Object.keys(dataToSubmit).length === 0) {
                    alert("No se han realizado cambios en los datos.");
                    onClose();
                    return;
                }
            } else {
                dataToSubmit = { ...formData };
                dataToSubmit.taxonomicNodeId = lastTaxon.id;
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

    const handleCancel = () => {
        if (isSubmitting || isUploading) return;
        setShowCancelConfirm(true);
    };

    const confirmCancel = () => {
        setShowCancelConfirm(false);
        resetUploadedImages();
        onClose();
    };

    const handleAddTaxon = (rank: TaxonomicRank, parentId: string | undefined, idx: number) => {
        setAddTaxonModal({ rank, parentId, idx });
    };

    if (!open) return null;

    if (isEdit && isLoadingDetail) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className={`w-full max-w-md rounded-lg shadow-xl p-8 text-center ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
                        <h3 className="text-lg font-semibold">Cargando datos de la planta...</h3>
                        <p className="text-sm opacity-70">Por favor espere</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isEdit && !isDataLoaded && !isLoadingDetail) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className={`w-full max-w-md rounded-lg shadow-xl p-8 text-center ${
                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
                }`}>
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-4xl">⚠️</span>
                        <h3 className="text-lg font-semibold">No se pudieron cargar los datos</h3>
                        <p className="text-sm opacity-70">Intente cerrar y abrir nuevamente</p>
                        <Button onClick={onClose} variant="outline">
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

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
                                disabled={isSubmitting || isUploading}
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitForm} className="p-6 space-y-6">
                        <PlantImageManager
                            isEdit={isEdit}
                            existingImages={existingImages}
                            setExistingImages={setExistingImages}
                            plantId={plant?.id}
                            uploadedUrls={uploadedUrls}
                            uploadImages={uploadImages}
                            isUploading={isUploading}
                            isDark={isDark}
                        />

                        <PlantBasicInfoSection
                            formData={formData}
                            onInputChange={handleInputChange}
                            onMinHumChange={handleMinHumChange}
                            onMaxHumChange={handleMaxHumChange}
                            isDark={isDark}
                        />

                        <PlantTaxonomySection
                            RANK_ORDER={RANK_ORDER}
                            taxonomyChain={taxonomyChain}
                            taxonomyOptions={taxonomyOptions}
                            taxonomyLoading={taxonomyLoading}
                            onTaxonomyChange={handleTaxonomyChange}
                            onAddTaxon={handleAddTaxon}
                            onReloadOptions={reloadTaxonomyOptions}
                            isDark={isDark}
                        />

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSubmitting || isUploading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || isUploading ||
                                    (!isEdit && uploadedUrls.length === 0) ||
                                    (isEdit && !isDataLoaded)}
                            >
                                {isSubmitting ? "Guardando..." : "Aceptar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmationModals
                showCancelConfirm={showCancelConfirm}
                showSubmitConfirm={showSubmitConfirm}
                isEdit={isEdit}
                isSubmitting={isSubmitting}
                onCancelConfirm={confirmCancel}
                onSubmitConfirm={confirmSubmit}
                onCloseCancelModal={() => setShowCancelConfirm(false)}
                onCloseSubmitModal={() => setShowSubmitConfirm(false)}
                isDark={isDark}
            />

            {addTaxonModal && (
                <TaxonAddModal
                    open={!!addTaxonModal}
                    rank={addTaxonModal.rank}
                    parentId={addTaxonModal.parentId}
                    idx={addTaxonModal.idx}
                    onClose={() => setAddTaxonModal(null)}
                    onSuccess={reloadTaxonomyOptions}
                    onTaxonomyChange={handleTaxonomyChange}
                    isDark={isDark}
                />
            )}
        </>
    );
}