import { useAuth } from '@/hooks/useAuth';
import { LandSchema, landSchema } from '@/schema/land';
import { createLand } from '@/services/LandService';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RiCloseFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import {
    ActionIcon, Button, Checkbox, FileInput, Input, Modal, Select,
    Text, Textarea, cn
} from 'rizzui';

const AddLandModal = ({ modalState, setModalState, refresh, setRefresh }: any) => {

    const [loading, setLoading] = useState(false);
    const [previewImages, setPreviewImages] = useState<any[]>([]); 
    const [rawImages, setRawImages] = useState<File[]>([]); 

    const { handleError, getError } = useAuth();

    const { register, control, watch, handleSubmit, formState: { errors } } = useForm<LandSchema>({
        resolver: zodResolver(landSchema),
    });

    const countries = [
        { value: 'Tunisie', label: 'Tunisie' },
        { value: 'France', label: 'France' },
        { value: 'Algérie', label: 'Algérie' },
        { value: 'Maroc', label: 'Maroc' },
        { value: 'Cameroun', label: 'Cameroun' },
    ];

   
    const handleImageChange = (e: any) => {
        const files = Array.from(e.target.files);

        const localPreview = files.map((file: any) => ({
            url: URL.createObjectURL(file),
            name: file.name,
        }));

        setPreviewImages((prev) => [...prev, ...localPreview]);
        setRawImages((prev) => [...prev, ...files]);
    };

    
    const removeImage = (index: number) => {
        const newPreview = [...previewImages];
        const newRaw = [...rawImages];

        newPreview.splice(index, 1);
        newRaw.splice(index, 1);

        setPreviewImages(newPreview);
        setRawImages(newRaw);
    };

    const onSubmit = async (data: LandSchema, e: any) => {
        try {
            setLoading(true);
            const formData = new FormData();

            
            rawImages.forEach((file) => {
                formData.append("images[]", file);
            });


            const coordinateFile = data.coordinate_link?.[0];
            if (coordinateFile) {
              
                formData.append('file', coordinateFile); 
            }
        
            formData.append('country', data.country);
            formData.append('land_title', data.land_title);
            formData.append('area', String(data.area));
            formData.append('relief', data.relief);
          
            formData.append('description', data.description);
            formData.append('city', data.city);
            formData.append('street', data.street);
            formData.append('videoLink', data.videoLink);

            formData.append('is_fragmentable', data.is_fragmentable ? "1" : "0");
            formData.append('certificat_of_ownership', data.certificat_of_ownership ? "1" : "0");
            formData.append('technical_doc', data.technical_doc ? "1" : "0");

            if (data.is_fragmentable && data.fragments) {
                data.fragments.split(";").forEach((f) =>
                    formData.append("fragments[]", f.trim())
                );
            }

            toast.promise(createLand(formData), {
                pending: "Création du terrain...",
                success: {
                    render() {
                        setModalState({ open: false, id: 0, type: "create" });
                        setRefresh(!refresh);
                        setLoading(false);
                        return "Terrain enregistré avec succès";
                    }
                },
                error: {
                    render(error: any) {
                        handleError(error);
                        setLoading(false);
                        return getError();
                    }
                },
            });

        } catch (error) {
            handleError(error);
            setLoading(false);
        }
    };


    return (
        <Modal
            isOpen={modalState.open && modalState.id === 0 && modalState.type === "create"}
            onClose={() => setModalState({ id: 0, open: false, type: "create" })}
        >
            <div className="flex flex-col gap-4 p-4 rounded-lg bg-white dark:bg-neutral-900 dark:text-white">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <Text className="text-2xl font-semibold">Ajouter un terrain</Text>
                    <ActionIcon
                        size="sm"
                        variant="text"
                        onClick={() => setModalState({ id: 0, open: false, type: "create" })}
                    >
                        <RiCloseFill className="text-2xl" />
                    </ActionIcon>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">

                    {/* Champs classiques */}
                    <Input {...register("land_title")} error={errors.land_title?.message} label="Titre Foncier" />
                    <Input {...register("area", { valueAsNumber: true })} error={errors.area?.message} label="Surface (m²)" />

                    <Input {...register("relief")} error={errors.relief?.message} label="Relief" />
                    <FileInput
                        {...register("coordinate_link")}
                        error={errors.coordinate_link?.message as string}
                        label="Fichier de Coordonnées (KML/GeoJSON, etc.)"
                        accept=".kml, .geojson, application/geo+json, application/vnd.google-earth.kml+xml" // Adapter selon vos besoins
                        inputClassName="ring-0 dark:border-slate-600"
                    />

                    <Textarea label="Description" {...register("description")} className="col-span-2" error={errors.description?.message} />

                    {/* Select pays */}
                    <Controller
                        control={control}
                        name="country"
                        render={({ field }) => (
                            <Select
                                {...field}
                                label="Pays"
                                options={countries}
                                value={countries.find((x) => x.value === field.value)}
                                onChange={(opt: any) => field.onChange(opt.value)}
                            />
                        )}
                    />

                    <Input {...register("city")} label="Ville" error={errors.city?.message} />
                    <Input {...register("street")} label="Quartier" error={errors.street?.message} />
                         <Input {...register("videoLink")} error={errors.videoLink?.message} label="Lien de vidéo" />


                    {/* =======================
                        UPLOAD IMAGES + PREVIEW
                    ========================*/}
                    <div className="col-span-2">
                        <label className="font-semibold">Images</label>

                        <FileInput
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            inputClassName="ring-0 dark:border-slate-600"
                        />

                        {/* PREVIEW IMAGES */}
                        {previewImages.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-3 overflow-x-auto h-40">
                                {previewImages.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img.url}
                                            className="w-28 h-28 object-cover rounded-lg border shadow"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* FRAGMENTABLE */}
                    <Input
                        {...register("fragments")}
                        label="Fragments (séparés par ;) "
                        className={cn("col-span-2", watch("is_fragmentable") ? "" : "hidden")}
                    />

                    <Checkbox {...register("is_fragmentable")} label="Fragmentable" />
                    <Checkbox {...register("certificat_of_ownership")} label="Certificat de propriété" />
                    <Checkbox {...register("technical_doc")} label="Document technique" />


                    {/* SUBMIT */}
                    <Button
                        type="submit"
                        isLoading={loading}
                        className="bg-yellow-500 text-md col-span-2 py-2 rounded-lg"
                    >
                        Valider
                    </Button>

                </form>
            </div>
        </Modal>
    );
};

export default AddLandModal;
