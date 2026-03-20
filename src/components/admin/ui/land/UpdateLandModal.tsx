import { useAuth } from '@/hooks/useAuth';
import { LandSchema, landSchema } from '@/schema/land';
import { updateLand } from '@/services/LandService';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RiCloseFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { ActionIcon, Button, Checkbox, FileInput, Input, Modal, Select, Text, Textarea, cn } from 'rizzui';

const UpdateLandModal = ({ land, modalState, setModalState, refresh, setRefresh }: any) => {
    const [loading, setLoading] = useState(false);
    const [previewImages, setPreviewImages] = useState<any[]>([]);
    const [rawImages, setRawImages] = useState<File[]>([]);
    const [keepExistingImages, setKeepExistingImages] = useState(true);

    const { handleError, getError } = useAuth();

    const { register, control, watch, handleSubmit, formState: { errors } } = useForm<LandSchema>({
        resolver: zodResolver(landSchema),
        values: {
            land_title: land.land_title,
            area: land.area,
            relief: land.relief,
            is_fragmentable: land.is_fragmentable,
            certificat_of_ownership: land.certificat_of_ownership,
            technical_doc: land.technical_doc,
            street: land.location?.address?.street ?? "",
            city: land.location?.address?.city ?? "",
            country: land.location?.address?.country ?? "",
            coordinate_link: land.location?.coordinate_link ?? "",
            description: land.description,
            videoLink: land.videoLink ?? "",
            fragments: land.fragments && land.fragments.length > 0 ? land.fragments.map((fragment: any) => String(fragment.area)).join(";") : "",
        },
    });

    const countries = [
        { value: 'Tunisie', label: 'Tunisie' },
        { value: 'France', label: 'France' },
        { value: 'Algérie', label: 'Algérie' },
        { value: 'Maroc', label: 'Maroc' },
        { value: 'Cameroun', label: 'Cameroun' },
    ];

    // 🔥 Lorsqu'on sélectionne des images
    const handleImageChange = (e: any) => {
        const files = Array.from(e.target.files);

        const localPreview = files.map((file: any) => ({
            url: URL.createObjectURL(file),
            name: file.name,
        }));

        setPreviewImages((prev) => [...prev, ...localPreview]);
        setRawImages((prev) => [...prev, ...files]);
        setKeepExistingImages(false); // Si on ajoute de nouvelles images, on remplace les anciennes
    };

    // ❌ Supprimer une image avant upload
    const removeImage = (index: number) => {
        const newPreview = [...previewImages];
        const newRaw = [...rawImages];

        newPreview.splice(index, 1);
        newRaw.splice(index, 1);

        setPreviewImages(newPreview);
        setRawImages(newRaw);

        // Si toutes les nouvelles images sont supprimées, on garde les anciennes
        if (newPreview.length === 0) {
            setKeepExistingImages(true);
        }
    };

    const onSubmit = async (data: LandSchema) => {
        try {
            setLoading(true);
            const formData = new FormData();

            // 🟡 Ajouter les nouvelles images si elles existent
            if (rawImages.length > 0) {
                rawImages.forEach((file) => {
                    formData.append("images[]", file);
                });
            }

            // 🟡 Ajouter le fichier de coordonnées si modifié
            const coordinateFile = data.coordinate_link?.[0];
            if (coordinateFile) {
                formData.append('file', coordinateFile);
            }

            // Autres champs
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

            // Gestion des fragments
            if (data.is_fragmentable && data.fragments) {
                data.fragments.split(";").forEach((f) =>
                    formData.append("fragments[]", f.trim())
                );
            }

            formData.append('_method', "PUT");

            toast.promise(updateLand(formData, land.id), {
                pending: "Modification en cours...",
                success: {
                    render() {
                        setLoading(false);
                        setModalState({ open: false, id: land.id, type: "edit" });
                        setRefresh(!refresh);
                        setPreviewImages([]);
                        setRawImages([]);
                        return "Terrain modifié avec succès";
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
        <>
            <Modal isOpen={modalState.open && modalState.id === land.id && modalState.type === "edit"} onClose={() => setModalState({ id: land.id, open: false, type: "edit" })}>
                <div className="flex flex-col gap-4 p-4 dark:bg-neutral-900 dark:text-white rounded-lg bg-white">
                    
                    {/* HEADER */}
                    <div className="flex items-center justify-between">
                        <Text className='text-2xl font-semibold'>Modifier un terrain</Text>
                        <ActionIcon
                            size="sm"
                            variant="text"
                            onClick={() => setModalState({ id: land.id, open: false, type: "edit" })}
                        >
                            <RiCloseFill className="text-2xl" />
                        </ActionIcon>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">

                        <Input error={errors.land_title?.message} {...register("land_title")} label="Titre Foncier" inputClassName='ring-0 dark:border-slate-600' />
                        <Input error={errors.area?.message} {...register("area", { valueAsNumber: true })} label="Surface (m²)" inputClassName='ring-0 dark:border-slate-600' />
                        <Input error={errors.relief?.message} {...register("relief")} label="Relief" inputClassName='ring-0 dark:border-slate-600' />
                        
                        <FileInput
                            {...register("coordinate_link")}
                            error={errors.coordinate_link?.message as string}
                            label="Fichier de Coordonnées (KML/GeoJSON, etc.)"
                            accept=".kml, .geojson, application/geo+json, application/vnd.google-earth.kml+xml"
                            inputClassName="ring-0 dark:border-slate-600"
                        />

                        <Textarea error={errors.description?.message} {...register("description")} className='col-span-2' label="Description" textareaClassName='ring-0 dark:border-slate-600' />

                        {/* COUNTRY */}
                        <Controller
                            control={control}
                            name="country"
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    error={errors.country?.message}
                                    label="Pays"
                                    clearable={field.value !== null}
                                    onClear={() => field.onChange("")}
                                    dropdownClassName='dark:bg-neutral-900 dark:border-neutral-800'
                                    optionClassName='dark:[&_div]:text-slate-400 dark:[&_div]:hover:text-white dark:[&]:hover:bg-neutral-800'
                                    selectClassName='ring-0 dark:border-slate-600'
                                    options={countries}
                                    value={countries.find((role: any) => role.value === field.value)}
                                    onChange={(option: any) => field.onChange(option.value)}
                                />
                            )}
                        />

                        <Input error={errors.city?.message} {...register("city")} label="Ville" inputClassName='ring-0 dark:border-slate-600' />
                        <Input error={errors.street?.message} {...register("street")} label="Quartier" inputClassName='ring-0 dark:border-slate-600' />
                        <Input error={errors.videoLink?.message} {...register("videoLink")} label="Lien de vidéo" inputClassName='ring-0 dark:border-slate-600' />

                        {/* =======================
                            UPLOAD IMAGES + PREVIEW
                        ========================*/}
                        <div className="col-span-2">
                            <label className="font-semibold">Images</label>

                            {/* IMAGES EXISTANTES */}
                            {keepExistingImages && land.images?.length > 0 && (
                                <div className="flex flex-wrap gap-3 mb-3 overflow-x-auto h-40">
                                    {land.images.map((img: string, index: number) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={img}
                                                className="w-28 h-28 object-cover rounded-lg border shadow"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <FileInput
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                inputClassName="ring-0 dark:border-slate-600"
                            />

                            {/* PREVIEW NOUVELLES IMAGES */}
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

                            {previewImages.length > 0 && (
                                <p className="text-xs text-yellow-600 mt-2">
                                    ⚠️ Les nouvelles images remplaceront les anciennes
                                </p>
                            )}
                        </div>

                        {/* FRAGMENTS */}
                        <Input
                            error={errors.fragments?.message}
                            {...register("fragments")}
                            label="Fragments (séparés par ;)"
                            className={cn('col-span-2', watch('is_fragmentable') ? '' : 'hidden')}
                            inputClassName='ring-0 dark:border-slate-600'
                        />

                        {/* CHECKBOX */}
                        <Checkbox className='cursor-pointer' error={errors.is_fragmentable?.message} {...register("is_fragmentable")} label="Fragmentable" />
                        <Checkbox className='cursor-pointer' error={errors.certificat_of_ownership?.message} {...register("certificat_of_ownership")} label="Certificat de propriété" />
                        <Checkbox className='cursor-pointer' error={errors.technical_doc?.message} {...register("technical_doc")} label="Document technique" />

                        {/* SUBMIT */}
                        <Button isLoading={loading} type='submit' className='bg-yellow-500 col-span-2 text-md font-semibold py-2 rounded-lg'>
                            Valider
                        </Button>

                    </form>
                </div>
            </Modal>
        </>
    );
};

export default UpdateLandModal;