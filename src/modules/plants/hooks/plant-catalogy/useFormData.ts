import { useState, useEffect } from "react";
import { PlantCatalogDetail } from "../../lib/plant-catalogy/types";

interface UseFormDataProps {
    plant?: PlantCatalogDetail | null;
    isEdit: boolean;
    open: boolean;
    isLoadingDetail: boolean;
}

interface FormData {
    name: string;
    description: string;
    planttype: string;
    mintemp: number;
    maxtemp: number;
    minhum: number;
    maxhum: number;
    WARNINGS: string;
}

const initialFormData: FormData = {
    name: "",
    description: "",
    planttype: "Ornamental",
    mintemp: 20,
    maxtemp: 30,
    minhum: 40,
    maxhum: 60,
    WARNINGS: ""
};

export function useFormData({ plant, isEdit, open, isLoadingDetail }: UseFormDataProps) {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [originalData, setOriginalData] = useState<FormData>(initialFormData);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        console.log("🔄 useFormData - Evaluando inicialización:", {
            open,
            isEdit,
            hasPlant: !!plant,
            plantId: plant?.id,
            isLoadingDetail,
            isDataLoaded
        });

        if (!open) {
            setFormData(initialFormData);
            setOriginalData(initialFormData);
            setIsDataLoaded(false);
            return;
        }

        if (isEdit) {
            if (isLoadingDetail) {
                setIsDataLoaded(false);
                return;
            }

            if (!plant) {
                setIsDataLoaded(false);
                return;
            }


            const plantData = {
                name: plant.name || "",
                description: plant.description || "",
                planttype: plant.planttype || "Ornamental",
                mintemp: plant.mintemp || 20,
                maxtemp: plant.maxtemp || 30,
                minhum: plant.minhum || 40,
                maxhum: plant.maxhum || 60,
                WARNINGS: plant.WARNINGS || ""
            };

            setOriginalData(plantData);
            setFormData(plantData);
            setIsDataLoaded(true);

        } else {
            setOriginalData(initialFormData);
            setFormData(initialFormData);
            setIsDataLoaded(true);
        }

    }, [open, isEdit, plant?.id, plant?.name, plant?.description, plant?.planttype, plant?.mintemp, plant?.maxtemp, plant?.minhum, plant?.maxhum, plant?.WARNINGS, isLoadingDetail]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleMinHumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = Number(e.target.value);
        if (val > formData.maxhum) val = formData.maxhum;
        setFormData(prev => ({ ...prev, minhum: val }));
    };

    const handleMaxHumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = Number(e.target.value);
        if (val < formData.minhum) val = formData.minhum;
        setFormData(prev => ({ ...prev, maxhum: val }));
    };

    const resetFormData = () => {
        setFormData(initialFormData);
        setOriginalData(initialFormData);
        setIsDataLoaded(false);
    };

    const getChangedData = () => {
        if (!isEdit) return formData;

        const changedData: Partial<FormData> = {};
        Object.keys(formData).forEach(key => {
            const formKey = key as keyof FormData;
            if (formData[formKey] !== originalData[formKey]) {
                changedData[formKey] = formData[formKey];
            }
        });
        return changedData;
    };

    const hasChanges = () => {
        if (!isEdit) return true;
        return Object.keys(getChangedData()).length > 0;
    };

    return {
        formData,
        originalData,
        isDataLoaded,
        handleInputChange,
        handleMinHumChange,
        handleMaxHumChange,
        resetFormData,
        getChangedData,
        hasChanges
    };
}