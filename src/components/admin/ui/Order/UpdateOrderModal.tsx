import { useAuth } from '@/hooks/useAuth';
import { OrderSchema, orderSchema } from '@/schema/order';
import { createOrder, updateOrder } from '@/services/OrderService';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RiCloseFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { ActionIcon, Button, Input, Modal, Select, Text } from 'rizzui';

const UpdateOrderModal = ({ modalState, order, customers, products, setModalState, refresh, setRefresh }: any) => {
    const [loading, setLoading] = useState(false);
    const { handleError, getError } = useAuth()
    const { register, setValue, control, reset, handleSubmit, formState: { errors } } = useForm<OrderSchema>({
        resolver: zodResolver(orderSchema),
        values: {
            status: order.status,
            total_price: order.total_price,
            unit_price: order.unit_price,
            product_id: String(order.product_id),
            customer_id: String(order.customer_id),
        }
    })
    const setProduct = (id: string) => {
        const p = products.find((product: any) => product.id == id)
        if (p) {
            setValue("unit_price", p.unit_price)
            setValue("total_price", p.total_price)
        }
    }

    const custs = customers.map((object: any) => ({ value: String(object.id), label: object.first_name + " " + object.last_name }));
    const prods = products.map((object: any) => ({ value: String(object.id), label: object.reference }));
    const states = [{ label: "En attente", value: "En attente" }, { label: "Validé", value: "Validé" }, { label: "Terminé", value: "Terminé" }]
    const onSubmit = async (data: OrderSchema) => {
        try {
            setLoading(true);
            toast.promise(updateOrder(data, order.id), {
                pending: "Modification d'une commande...",
                success: {
                    render() {
                        setLoading(false);
                        setModalState({ open: false, id: order.id, type: "edit" });
                        setRefresh(!refresh);
                        reset();
                        return "Commande modifiée avec succès"
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
            <Modal isOpen={modalState.open && modalState.id === order.id && modalState.type === "edit"} onClose={() => setModalState({ id: order.id, open: false, type: "edit" })}>
                <div className="flex flex-col gap-4 p-4 dark:bg-neutral-900 dark:text-white rounded-lg bg-white">
                    <div className="flex items-center justify-between">
                        <Text className='text-2xl font-semibold'>Créer une commande</Text>
                        <ActionIcon
                            size="sm"
                            variant="text"
                            onClick={() => setModalState({ id: order.id, open: false, type: "edit" })}
                        >
                            <RiCloseFill className="text-2xl" />
                        </ActionIcon>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit, (error) => console.log(error))} className="grid grid-cols-2 gap-4 &_label>span:border-none">
                        <Controller
                            control={control} name="product_id" render={({ field }) => <Select
                                {...field}
                                error={errors.product_id?.message}
                                label="Produit"
                                clearable={field.value !== null}
                                onClear={() => field.onChange("")}
                                dropdownClassName='dark:bg-neutral-900 dark:border-neutral-800'
                                optionClassName='dark:[&_div]:text-slate-400 dark:[&_div]:hover:text-white dark:[&]:hover:bg-neutral-800'
                                className='col-span-2' selectClassName='ring-0 dark:border-slate-600'
                                options={prods}
                                value={prods.find((product: any) => product.value === field.value)}
                                onChange={(option: any) => {
                                    field.onChange(option.value)
                                    setProduct(option.value)
                                }} />} />
                        <Controller
                            control={control} name="customer_id" render={({ field }) => <Select
                                {...field}
                                error={errors.customer_id?.message}
                                label="Client"
                                clearable={field.value !== null}
                                onClear={() => field.onChange("")}
                                dropdownClassName='dark:bg-neutral-900 dark:border-neutral-800'
                                optionClassName='dark:[&_div]:text-slate-400 dark:[&_div]:hover:text-white dark:[&]:hover:bg-neutral-800'
                                className='col-span-2' selectClassName='ring-0 dark:disabled:!bg-neutral-800 dark:disabled:!border-slate-600 dark:border-slate-600'
                                options={custs}
                                value={custs.find((customer: any) => customer.value === field.value)}
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

                        <Button isLoading={loading} type='submit' className='bg-yellow-500 col-span-2 text-md font-semibold py-2 rounded-lg'>Valider</Button>
                    </form>
                </div>
            </Modal >
        </>
    )
}

export default UpdateOrderModal