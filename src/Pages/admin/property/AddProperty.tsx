import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, FileInput, Input, Select, Textarea } from 'rizzui';
import { toast } from 'react-toastify';

// Import des services API
import { createProperty, getProperties } from 'src/services/propertyService';

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
    const [lands, setLands] = useState([]);
    const [loadingLands, setLoadingLands] = useState(true);

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
            proposed_product_ids: [],
            type: '',
            has_pool: false,
            has_garden: false,
        }
    });

    const selectedType = watch('type');

    useEffect(() => {
        const fetchLands = async () => {
            try {
                const response = await getProperties();
                const formattedLands = response.data
                    ?.filter(p => p.type === 'land')
                    .map(land => ({
                        value: land.id.toString(),
                        label: `${land.title} - ${land.field_area}m²`
                    })) || [];
                setLands(formattedLands);
            } catch (error) {
                console.error('Erreur lors du chargement des terrains:', error);
                toast.error('Impossible de charger les terrains');
            } finally {
                setLoadingLands(false);
            }
        };

        fetchLands();
    }, []);

    const onSubmit = async (data, event) => {
        if (event) {
            event.preventDefault();
        }

        console.log('🚀 onSubmit APPELÉ');
        console.log('📦 Data reçue:', data);

        try {
            setLoading(true);

            const formData = new FormData();

            // Champs texte
            if (data.title) formData.append('title', data.title);
            if (data.type_name) formData.append('type_name', data.type_name);
            if (data.description) formData.append('description', data.description);
            if (data.type) formData.append('type', data.type);
            if (data.country) formData.append('country', data.country);
            if (data.city) formData.append('city', data.city);
            if (data.street) formData.append('street', data.street);
            if (data.coordinate_link) formData.append('coordinate_link', data.coordinate_link);

            // Valeurs numériques
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

            // Booléens
            formData.append('has_pool', data.has_pool ? "1" : "0");
            formData.append('has_garden', data.has_garden ? "1" : "0");

            // Images principales
            if (data.images && data.images.length > 0) {
                console.log('📸 Ajout de', data.images.length, 'images');
                Array.from(data.images).forEach((file) => {
                    formData.append('images[]', file);
                });
            }

            // IDs des terrains proposés
            if (data.proposed_product_ids && data.proposed_product_ids.length > 0) {
                console.log('🏞️ Ajout de', data.proposed_product_ids.length, 'terrains');
                data.proposed_product_ids.forEach((landId) => {
                    formData.append('proposed_product_ids[]', landId);
                });
            }

            console.log('=== 📤 DONNÉES À ENVOYER ===');
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }

            console.log('🌐 Appel de l\'API createProperty...');

            const response = await createProperty(formData);
            console.log('✅ Réponse API:', response);

            toast.success("Propriété créée avec succès ! Vous pouvez maintenant ajouter les finances et parties (pour les immeubles).");
            
            reset();

            // Redirection vers la page de modification après 1 seconde
            setTimeout(() => {
                if (response.data?.id) {
                    navigate(`/admin/properties/edit/${response.data.id}`);
                } else {
                    navigate('/admin/properties');
                }
            }, 1000);

        } catch (error) {
            console.error('❌ Erreur lors de la soumission:', error);
            console.error('Détails de l\'erreur:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

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

                    <Controller
                        control={control}
                        name="proposed_product_ids"
                        render={({ field }) => (
                            <div className='sm:col-span-2'>
                                <label className="block text-sm font-medium mb-2 dark:text-white">
                                    Terrains proposés
                                </label>
                                {loadingLands ? (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 p-3">
                                        Chargement des terrains...
                                    </div>
                                ) : (
                                    <div className="space-y-2 p-3 border rounded-lg dark:border-slate-600 max-h-48 overflow-y-auto">
                                        {lands.length === 0 ? (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Aucun terrain disponible
                                            </div>
                                        ) : (
                                            lands.map((land) => (
                                                <label key={land.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 p-2 rounded">
                                                    <input
                                                        type="checkbox"
                                                        value={land.value}
                                                        checked={field.value?.includes(land.value) || false}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const currentValues = field.value || [];
                                                            if (e.target.checked) {
                                                                field.onChange([...currentValues, value]);
                                                            } else {
                                                                field.onChange(currentValues.filter((v) => v !== value));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-yellow-500 border-gray-300 dark:border-slate-600 rounded focus:ring-yellow-500"
                                                    />
                                                    <span className="text-sm dark:text-white">{land.label}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                )}
                                {field.value && field.value.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => field.onChange([])}
                                        className="mt-2 text-sm text-yellow-500 hover:text-yellow-600"
                                    >
                                        Tout désélectionner ({field.value.length} sélectionné{field.value.length > 1 ? 's' : ''})
                                    </button>
                                )}
                            </div>
                        )}
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