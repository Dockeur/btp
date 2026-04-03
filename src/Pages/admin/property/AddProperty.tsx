import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, FileInput, Input, Select, Textarea } from 'rizzui';
import { toast } from 'react-toastify';
import { createProperty } from 'src/services/propertyService';

const Title = ({ title, links }) => (
    <div className="w-full mb-4">
        <h1 className="text-2xl font-bold dark:text-white">{title}</h1>
        <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
            {links.map((link, i) => (
                <span key={i}>
                    {i > 0 && ' / '}
                    {link.url ? <a href={link.url}>{link.title}</a> : link.title}
                </span>
            ))}
        </div>
    </div>
);

const AddProperty = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const types = [
        { label: "Immeuble", value: "building" },
        { label: "Duplex", value: "duplex" },
        { label: "Villa", value: "villa" },
        { label: "Maison", value: "house" },
        { label: "Centre commercial", value: "commercial_center" }
    ];

    const countries = [
        { value: 'Tunisie', label: 'Tunisie' },
        { value: 'France', label: 'France' },
        { value: 'Algérie', label: 'Algérie' },
        { value: 'Maroc', label: 'Maroc' },
        { value: 'Cameroun', label: 'Cameroun' },
    ];

    const { register, reset, control, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            type: '',
            has_pool: false,
            has_garden: false,
        }
    });

    const selectedType = watch('type');

    const onSubmit = async (data, event) => {
        if (event) event.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData();

            if (data.title) formData.append('title', data.title);
            if (data.type_name) formData.append('type_name', data.type_name);
            if (data.description) formData.append('description', data.description);
            if (data.type) formData.append('type', data.type);
            if (data.country) formData.append('country', data.country);
            if (data.city) formData.append('city', data.city);
            if (data.street) formData.append('street', data.street);
            if (data.coordinate_link) formData.append('coordinate_link', data.coordinate_link);

            formData.append('build_area', data.build_area || 0);
            formData.append('field_area', data.field_area || 0);
            formData.append('basement_area', data.basement_area || 0);
            formData.append('ground_floor_area', data.ground_floor_area || 0);
            formData.append('parkings', data.parkings || 0);
            formData.append('levels', data.levels || 0);
            formData.append('bedrooms', data.bedrooms || 0);
            formData.append('number_of_salons', data.number_of_salons || 0);
            formData.append('number_of_appartements', data.number_of_appartements || 0);
            formData.append('bathrooms', data.bathrooms || 0);
            formData.append('estimated_payment', data.estimated_payment || 0);

            formData.append('has_pool', data.has_pool ? "1" : "0");
            formData.append('has_garden', data.has_garden ? "1" : "0");

            if (data.images && data.images.length > 0) {
                Array.from(data.images).forEach((file) => {
                    formData.append('images[]', file);
                });
            }

            const response = await createProperty(formData);

            toast.success("Propriété créée avec succès ! Vous pouvez maintenant ajouter les finances et parties (pour les immeubles).");

            reset();

            setTimeout(() => {
                if (response.data?.id) {
                    navigate(`/admin/properties/edit/${response.data.id}`);
                } else {
                    navigate('/admin/properties');
                }
            }, 1000);

        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Une erreur s'est produite lors de la création de la propriété";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-wrap p-4 gap-8 min-h-screen bg-gray-50 dark:bg-neutral-950'>
            <Title
                title="Création de propriété"
                links={[
                    { title: 'Admin', url: '/admin' },
                    { title: 'Propriétés', url: '/admin/properties' },
                    { title: 'Créer' }
                ]}
            />
            <div className="rounded-lg max-lg:w-full w-full max-w-7xl flex flex-col bg-white dark:bg-neutral-900 divide-y divide-dashed dark:divide-slate-500 divide-slate-400">
                <div className='py-4 px-4'>
                    <span className='text-lg px-4 dark:text-white text-black font-semibold border-l-4 border-yellow-500'>
                        Créer une propriété
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-4">
                        Les finances et parties d'immeuble seront ajoutées après la création
                    </p>
                </div>

                <div className='p-4 grid sm:grid-cols-2 xl:grid-cols-4 gap-4'>
                    <Input
                        error={errors.title?.message}
                        {...register("title", { required: "Le titre est requis" })}
                        label="Titre *"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Controller
                        control={control}
                        name="type"
                        rules={{ required: "Le type est requis" }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                error={errors.type?.message}
                                label="Type *"
                                clearable={field.value !== null}
                                onClear={() => field.onChange("")}
                                dropdownClassName='dark:bg-neutral-900 dark:border-neutral-800'
                                optionClassName='dark:[&_div]:text-slate-400 dark:[&_div]:hover:text-white dark:[&]:hover:bg-neutral-800'
                                selectClassName='ring-0 dark:border-slate-600'
                                options={types}
                                value={types.find((type) => type.value === field.value)}
                                onChange={(option) => field.onChange(option.value)}
                            />
                        )}
                    />

                    <Input
                        error={errors.type_name?.message}
                        {...register("type_name")}
                        label="Nom du type (ex: Haut standing)"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Input
                        error={errors.build_area?.message}
                        {...register("build_area", { valueAsNumber: true })}
                        label="Surface de construction (m²)"
                        type="number"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Input
                        error={errors.field_area?.message}
                        {...register("field_area", { valueAsNumber: true })}
                        label="Surface du terrain (m²)"
                        type="number"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Input
                        error={errors.basement_area?.message}
                        {...register("basement_area", { valueAsNumber: true })}
                        label="Surface du sous-sol (m²)"
                        type="number"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Input
                        error={errors.ground_floor_area?.message}
                        {...register("ground_floor_area", { valueAsNumber: true })}
                        label="Surface du rez-de-chaussée (m²)"
                        type="number"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Input
                        error={errors.parkings?.message}
                        {...register("parkings", { valueAsNumber: true })}
                        label="Nombre de parkings"
                        type="number"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Input
                        error={errors.levels?.message}
                        {...register("levels", { valueAsNumber: true })}
                        label="Nombre de niveaux"
                        type="number"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Input
                        error={errors.bedrooms?.message}
                        {...register("bedrooms", { valueAsNumber: true })}
                        label="Nombre de chambres"
                        type="number"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Input
                        error={errors.number_of_salons?.message}
                        {...register("number_of_salons", { valueAsNumber: true })}
                        label="Nombre de salons"
                        type="number"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Input
                        error={errors.bathrooms?.message}
                        {...register("bathrooms", { valueAsNumber: true })}
                        label="Nombre de salles de bain"
                        type="number"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Input
                        error={errors.estimated_payment?.message}
                        {...register("estimated_payment", { valueAsNumber: true })}
                        label="Paiement estimé (FCFA)"
                        type="number"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    {selectedType === 'building' && (
                        <Input
                            error={errors.number_of_appartements?.message}
                            {...register("number_of_appartements", { valueAsNumber: true })}
                            label="Nombre d'appartements"
                            type="number"
                            inputClassName='ring-0 dark:border-slate-600'
                        />
                    )}

                    <Textarea
                        rows={6}
                        error={errors.description?.message}
                        {...register("description")}
                        className='sm:col-span-2 sm:row-span-2'
                        label="Description"
                        textareaClassName='ring-0 dark:border-slate-600'
                    />

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
                                className='sm:col-span-2'
                                selectClassName='ring-0 dark:border-slate-600'
                                options={countries}
                                value={countries.find((country) => country.value === field.value)}
                                onChange={(option) => field.onChange(option.value)}
                            />
                        )}
                    />

                    <Input
                        error={errors.city?.message}
                        {...register("city")}
                        label="Ville"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Input
                        error={errors.street?.message}
                        {...register("street")}
                        label="Quartier / Rue"
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <Input
                        error={errors.coordinate_link?.message}
                        {...register("coordinate_link")}
                        label="Lien de vidéo (Google Maps)"
                        className='sm:col-span-2'
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <FileInput
                        multiple
                        error={errors.images?.message}
                        label="Images"
                        {...register("images")}
                        className='sm:col-span-2'
                        inputClassName='ring-0 dark:border-slate-600'
                    />

                    <div className="flex items-center gap-6 py-4">
                        <Checkbox
                            className='cursor-pointer'
                            error={errors.has_pool?.message}
                            {...register("has_pool")}
                            label="Piscine"
                            inputClassName='checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white'
                        />
                        <Checkbox
                            className='cursor-pointer'
                            error={errors.has_garden?.message}
                            {...register("has_garden")}
                            label="Jardin"
                            inputClassName='checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white'
                        />
                    </div>

                    <Button
                        type="button"
                        isLoading={loading}
                        disabled={loading}
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit(onSubmit)(e);
                        }}
                        className='bg-yellow-500 sm:col-span-2 xl:col-span-4 text-md font-semibold py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Création en cours...' : 'Créer la propriété'}
                    </Button>

                    {selectedType === 'building' && (
                        <div className="sm:col-span-2 xl:col-span-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                ℹ️ <strong>Note:</strong> Pour les immeubles, vous pourrez ajouter les finances et les parties/unités après la création de la propriété.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddProperty;