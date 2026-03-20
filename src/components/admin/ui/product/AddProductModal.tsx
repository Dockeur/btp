import { useAuth } from '@/hooks/useAuth';
import { ProductSchema, productSchema } from '@/schema/product';
import { createAccommodation } from '@/services/AccommodationService';
import { createProduct } from '@/services/ProductService';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RiCloseFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { ActionIcon, Button, Checkbox, Input, Modal, Select, Text, Textarea } from 'rizzui';

const AddProductModal = ({ data, type, setType, modalState, setModalState, refresh, setRefresh }: any) => {
    const [loading, setLoading] = useState(false);
    const { handleError, getError } = useAuth()
    const { register, control, reset, handleSubmit, formState: { errors } } = useForm<ProductSchema>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            type: type,
            status: "En attente",
        }
    })
    const types = [{ label: "Terrain", value: "land" }, { label: "Propriété", value: "property" }, { label: "Logement", value: "accommodation" }, { label: "Virtuel", value: "virtual" }, { label: "Espace commercial", value: "retail_space" }]
    const props = data.map((object: any) => ({ value: String(object.id), label: types.find((t: any) => t.value === type)?.label + " #" + object.id }));
    const states = [{ label: "En attente", value: "En attente" }, { label: "Validé", value: "Validé" }, { label: "Publié", value: "Publié" }]
    
    const onSubmit = async (data: ProductSchema) => {
        try {
            setLoading(true);
            if (data.publish) {
                data.published_at = new Date()
            }
            toast.promise(createProduct(data), {
                pending: "Création d'un produit...",
                success: {
                    render() {
                        setLoading(false);
                        setModalState({ open: false, id: 0, type: "create" });
                        setRefresh(!refresh);
                        reset();
                        return "Produit crée avec succès"
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
            <Modal isOpen={modalState.open && modalState.id === 0 && modalState.type === "create"} onClose={() => setModalState({ id: 0, open: false, type: "create" })}>
                <div className="flex flex-col gap-4 p-4 dark:bg-neutral-900 dark:text-white rounded-lg bg-white">
                    <div className="flex items-center justify-between">
                        <Text className='text-2xl font-semibold'>Créer un produit</Text>
                        <ActionIcon
                            size="sm"
                            variant="text"
                            onClick={() => setModalState({ id: 0, open: false, type: "create" })}
                        >
                            <RiCloseFill className="text-2xl" />
                        </ActionIcon>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit, (error) => console.log(error))} className="grid grid-cols-2 gap-4 &_label>span:border-none">
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
                                onChange={(option: any) => {
                                    setType(option.value)
                                    field.onChange(option.value)
                                }} />} />
                        <Controller
                            control={control} name="productable_id" render={({ field }) => <Select
                                {...field}
                                error={errors.productable_id?.message}
                                label="Bien"
                                clearable={field.value !== null}
                                onClear={() => field.onChange("")}
                                dropdownClassName='dark:bg-neutral-900 dark:border-neutral-800'
                                optionClassName='dark:[&_div]:text-slate-400 dark:[&_div]:hover:text-white dark:[&]:hover:bg-neutral-800'
                                className='col-span-2' selectClassName='ring-0 dark:disabled:!bg-neutral-800 dark:disabled:!border-slate-600 dark:border-slate-600'
                                options={props}
                                value={props.find((property: any) => property.value === field.value)}
                                onChange={(option: any) => field.onChange(option.value)} />} />
                        <Input error={errors.unit_price?.message} {...register("unit_price", { valueAsNumber: true })} label="Prix de l'unité" inputClassName='ring-0 dark:border-slate-600' />
                        <Input error={errors.total_price?.message} {...register("total_price", { valueAsNumber: true })} label="Prix total" inputClassName='ring-0 dark:border-slate-600' />
                        <Controller control={control} name="status" render={({ field }) => <Select
                            {...field}
                            error={errors.status?.message}
                            label="Status"
                            clearable={field.value !== null}
                            onClear={() => field.onChange("")}
                            dropdownClassName='dark:bg-neutral-900 dark:border-neutral-800'
                            optionClassName='dark:[&_div]:text-slate-400 dark:[&_div]:hover:text-white dark:[&]:hover:bg-neutral-800'
                            className='col-span-2' selectClassName='ring-0 dark:disabled:!bg-neutral-800 dark:disabled:!border-slate-600 dark:border-slate-600'
                            options={states}
                            value={states.find((state: any) => state.value === field.value)}
                            onChange={(option: any) => field.onChange(option.value)} />} />
                        <Textarea error={errors.description?.message} {...register("description")} className='col-span-2' label="Description" textareaClassName='ring-0 dark:border-slate-600' />
                        <Checkbox className='cursor-pointer' error={errors.for_sale?.message} {...register("for_sale")} label="À vendre" inputClassName='checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white' />
                        <Checkbox className='cursor-pointer' error={errors.for_rent?.message} {...register("for_rent")} label="À louer" inputClassName='checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white' />
                        <Checkbox className='cursor-pointer' error={errors.publish?.message} {...register("publish")} label="Publier" inputClassName='checked:!bg-yellow-500 dark:border-slate-600 checked:!border-none ring-0 focus:ring-0 text-white' />

                        <Button isLoading={loading} type='submit' className='bg-yellow-500 col-span-2 text-md font-semibold py-2 rounded-lg'>Valider</Button>
                    </form>
                </div>
            </Modal >
        </>
    )
}

export default AddProductModal