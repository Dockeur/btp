import { useAuth } from '@/hooks/useAuth';
import { AddCustomerSchema, addCustomerSchema } from '@/schema/add-customer';
import { createCustomer } from '@/services/CustomerService';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RiCloseFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { ActionIcon, Button, FileInput, Input, Modal, Password, Select, Text, cn } from 'rizzui';

const AddCustomerModal = ({ modalState, setModalState, refresh, setRefresh }: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { register, control, reset, handleSubmit, formState: { errors } } = useForm<AddCustomerSchema>({
        resolver: zodResolver(addCustomerSchema),
    });
    const countries = [
        { value: 'Tunisie', label: 'Tunisie' },
        { value: 'France', label: 'France' },
        { value: 'Algérie', label: 'Algérie' },
        { value: 'Maroc', label: 'Maroc' },
        { value: 'Cameroun', label: 'Cameroun' },
    ];
    const [imageUrl, setImageUrl] = useState<string>("");
    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => setImageUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };
    const { handleError, getError } = useAuth();
    const onSubmit = async (data: AddCustomerSchema, e: any) => {
        try {
            setLoading(true);
            const formData = new FormData(e.target);
            if (data.profile[0]) {
                formData.append('profile', data.profile[0]);
            } else {
                formData.delete('profile');
            }
            if (data.country) formData.append('country', data.country);

            toast.promise(createCustomer(formData), {
                pending: "Création d'un client...",
                success: {
                    render() {
                        setModalState(false);
                        setLoading(false);
                        reset();
                        setRefresh(!refresh);
                        return "Client crée avec succès";
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
        } catch (error: any) {
            setLoading(false);
        }
    };
    return (
        <Modal isOpen={modalState} onClose={() => setModalState(false)}>
            <div className="flex flex-col gap-4 p-4 dark:bg-neutral-900 dark:text-white rounded-lg bg-white">
                <div className="flex items-center justify-between">
                    <Text className='text-2xl font-semibold'>Créer un client</Text>
                    <ActionIcon
                        size="sm"
                        variant="text"
                        onClick={() => setModalState(false)}
                    >
                        <RiCloseFill className="text-2xl" />
                    </ActionIcon>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4 &_label>span:border-none">
                    <Input error={errors.last_name?.message} {...register("last_name")} label="Nom" inputClassName='ring-0 dark:border-slate-600' />
                    <Input error={errors.first_name?.message} {...register("first_name")} label="Prénom" inputClassName='ring-0 dark:border-slate-600' />
                    <Input error={errors.email?.message} {...register("email")} label="Email" className='col-span-2' inputClassName='ring-0 dark:border-slate-600' />
                    <Input error={errors.phone?.message} {...register("phone")} label="Téléphone" className='col-span-2' inputClassName='ring-0 dark:border-slate-600' />
                    <Password error={errors.password?.message} {...register("password")} label="Mot de passe" className='col-span-2' inputClassName='ring-0 dark:border-slate-600' />
                    <Password error={errors.password_confirmation?.message} {...register("password_confirmation")} label="Confirmation de mot de passe" className='col-span-2' inputClassName='ring-0 dark:border-slate-600' />
                    <Controller
                        control={control} name="country" render={({ field }) => <Select
                            {...field}
                            error={errors.country?.message}
                            label="Pays"
                            clearable={field.value !== null}
                            onClear={() => field.onChange("")}
                            dropdownClassName='dark:bg-neutral-900 dark:border-neutral-800'
                            optionClassName='dark:[&_div]:text-slate-400 dark:[&_div]:hover:text-white dark:[&]:hover:bg-neutral-800'
                            className='col-span-2' selectClassName='ring-0 dark:border-slate-600'
                            options={countries}
                            value={countries.find((role: any) => role.value === field.value)}
                            onChange={(option: any) => field.onChange(option.value)} />} />
                    <Input error={errors.city?.message} {...register("city")} label="Ville" className='' inputClassName='ring-0 dark:border-slate-600' />
                    <Input error={errors.street?.message} {...register("street")} label="Quartier" className='' inputClassName='ring-0 dark:border-slate-600' />
                    <FileInput error={errors.profile?.message as string} label="Photo" {...register("profile")} className='col-span-2' inputClassName='ring-0 dark:border-slate-600' onChange={(e: any) => handleImageChange(e)} />
                    <span className={cn('w-32 rounded-lg', imageUrl ? '' : 'hidden')}>
                        <img src={imageUrl} className="w-full rounded-lg" alt="" />
                    </span>
                    <Button isLoading={loading} type='submit' className='bg-yellow-500 text-md font-semibold py-2 col-span-2 rounded-lg'>Valider</Button>
                </form>
            </div>
        </Modal>
    );
};

export default AddCustomerModal