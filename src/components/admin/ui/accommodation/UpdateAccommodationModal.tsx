import { useAuth } from '@/hooks/useAuth';
import { AddAccommodationSchema, addAccommodationSchema } from '@/schema/add-accommodation';
import { updateAccommodation } from '@/services/AccommodationService';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RiCloseFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { ActionIcon, Button, FileInput, Input, Modal, Select, Text, Textarea } from 'rizzui';

const UpdateAccommodationModal = ({ properties, accommodation, modalState, setModalState, refresh, setRefresh }: any) => {
    const [loading, setLoading] = useState(false);
    const { handleError, getError } = useAuth()
    const props = properties.map((property: any) => ({ value: String(property.id) as string, label: property.title + " (" + property.location.address.city + ")" }));
    const { register, control, handleSubmit, formState: { errors } } = useForm<AddAccommodationSchema>({
        resolver: zodResolver(addAccommodationSchema),
        values: {
            property_id: String(accommodation.property_id),
            type: accommodation.type,
            reference: accommodation.reference,
            description: accommodation.description,
            living_room: accommodation.living_room,
            dining_room: accommodation.dining_room,
            bedroom: accommodation.bedroom,
            bath_room: accommodation.bath_room,
            kitchen: accommodation.kitchen,
            // images: [],
        },
    })
    const types = [{ label: "Appartement", value: "appartement" }, { label: "Chambre", value: "chambre" }, { label: "Studio", value: "studio" }, { label: "Niveau", value: "niveau" }]
    const onSubmit = async (data: AddAccommodationSchema, e: any) => {
        try {
            setLoading(true);
            const formData = new FormData(e.target);
            if (data.images && data.images.length > 0) {
                Array.from(data.images).map((p: any) => formData.append('images[]', p));
            }
            formData.append('property_id', data.property_id);
            formData.append('type', data.type);
            formData.append('_method', "PUT");
            toast.promise(updateAccommodation(formData, accommodation.id), {
                pending: "Modification d'un logement...",
                success: {
                    render() {
                        setLoading(false);
                        setModalState({ open: false, id: accommodation.id, type: "edit" });
                        setRefresh(!refresh);
                        return "Logement modifié avec succès"
                    }
                },
                error: {
                    render(error: any) {
                        handleError(error)
                        setLoading(false);
                        return getError()
                    }
                },
            })

        } catch (error) {
            handleError(error)
            setLoading(false);
        }
    }

    return (
        <>
            <Modal isOpen={modalState.open && modalState.id === accommodation.id && modalState.type === "edit"} onClose={() => setModalState({ id: accommodation.id, open: false, type: "edit" })}>
                <div className="flex flex-col gap-4 p-4 dark:bg-neutral-900 dark:text-white rounded-lg bg-white">
                    <div className="flex items-center justify-between">
                        <Text className='text-2xl font-semibold'>Modifier un logement ({accommodation.id + " - " + accommodation.reference})</Text>
                        <ActionIcon
                            size="sm"
                            variant="text"
                            onClick={() => setModalState({ id: accommodation.id, open: false, type: "edit" })}
                        >
                            <RiCloseFill className="text-2xl" />
                        </ActionIcon>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 &_label>span:border-none">
                        <Input error={errors.reference?.message} {...register("reference")} label="Référence" inputClassName='ring-0 dark:border-slate-600' />
                        <Input error={errors.living_room?.message} {...register("living_room", { valueAsNumber: true })} label="Nombre de séjours" inputClassName='ring-0 dark:border-slate-600' />
                        <Input error={errors.dining_room?.message} {...register("dining_room", { valueAsNumber: true })} label="Nombre de salles à manger" inputClassName='ring-0 dark:border-slate-600' />
                        <Input error={errors.kitchen?.message} {...register("kitchen", { valueAsNumber: true })} label="Nombre de cuisines" inputClassName='ring-0 dark:border-slate-600' />
                        <Input error={errors.bedroom?.message} {...register("bedroom", { valueAsNumber: true })} label="Nombre de chambres" inputClassName='ring-0 dark:border-slate-600' />
                        <Input error={errors.bath_room?.message} {...register("bath_room", { valueAsNumber: true })} label="Nombre de salle de bains" inputClassName='ring-0 dark:border-slate-600' />
                        <Textarea error={errors.description?.message} {...register("description")} className='col-span-2' label="Description" textareaClassName='ring-0 dark:border-slate-600' />
                        <Controller
                            control={control} name="type" render={({ field }) => <Select
                                {...field}
                                error={errors.type?.message}
                                label="Type"
                                clearable={field.value !== null}
                                onClear={() => field.onChange("")}
                                dropdownClassName='dark:bg-neutral-900 dark:border-neutral-800'
                                optionClassName='dark:[&_div]:text-slate-400 dark:[&_div]:hover:text-white dark:[&]:hover:bg-neutral-800'
                                className='col-span-2' selectClassName='ring-0 dark:border-slate-600'
                                options={types}
                                value={types.find((type: any) => type.value === field.value)}
                                onChange={(option: any) => field.onChange(option.value)} />} />
                        <Controller
                            control={control} name="property_id" render={({ field }) => <Select
                                {...field}
                                error={errors.property_id?.message}
                                label="Propriété"
                                clearable={field.value !== null}
                                onClear={() => field.onChange("")}
                                dropdownClassName='dark:bg-neutral-900 dark:border-neutral-800'
                                optionClassName='dark:[&_div]:text-slate-400 dark:[&_div]:hover:text-white dark:[&]:hover:bg-neutral-800'
                                className='col-span-2' selectClassName='ring-0 dark:border-slate-600'
                                options={props}
                                value={props.find((property: any) => property.value === field.value)}
                                onChange={(option: any) => field.onChange(option.value)} />} />
                        <FileInput multiple error={errors.images?.message as string} label="Images" {...register("images")} className='col-span-2' inputClassName='ring-0 dark:border-slate-600' />

                        <Button isLoading={loading} type='submit' className='bg-yellow-500 col-span-2 text-md font-semibold py-2 rounded-lg'>Valider</Button>
                    </form>
                </div>
            </Modal >
        </>
    )
}

export default UpdateAccommodationModal