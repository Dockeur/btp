import { useAuth } from '@/hooks/useAuth';
import { UpdateCustomerSchema, updateCustomerSchema } from '@/schema/update-customer';
import { updateCustomer } from '@/services/CustomerService';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button, FileInput, Input, Select, cn } from 'rizzui';

const UpdateCustomer = ({ customer }: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>(customer?.user?.profile);
    const handleImageChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                setImageUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const { register, control, handleSubmit, formState: { errors } } = useForm<UpdateCustomerSchema>({
        resolver: zodResolver(updateCustomerSchema),
        defaultValues: {
            last_name: customer?.last_name,
            first_name: customer?.first_name,
            email: customer?.user.email,
            phone: customer?.phone,
            city: customer?.address?.city,
            country: customer?.address?.country,
            street: customer?.address?.street,
        }
    })
    const { handleError, getError } = useAuth()
    const countries = [
        { value: 'Tunisie', label: 'Tunisie' },
        { value: 'France', label: 'France' },
        { value: 'Algérie', label: 'Algérie' },
        { value: 'Maroc', label: 'Maroc' },
        { value: 'Cameroun', label: 'Cameroun' },
    ]
    const onSubmit = async (data: UpdateCustomerSchema, e: any) => {
        try {
            setLoading(true);
            const formData = new FormData(e.target);
            if (data.profile[0]) {
                formData.append('profile', data.profile[0]);
            } else {
                formData.delete('profile');
            }
            formData.append('_method', 'PUT');
            if (data.country) formData.append('country', data.country);

            toast.promise(updateCustomer(formData, customer.id), {
                pending: "Modification d'un client...",
                success: {
                    render() {
                        setLoading(false);
                        return "Employé modifié avec succès"
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
        } catch (error: any) {
            setLoading(false);
        }
    }
    return (
        <>
            <div className="rounded-lg max-lg:w-full flex flex-col bg-white dark:bg-neutral-900 divide-y divide-dashed dark:divide-slate-500 divide-slate-400">
                <div className='py-4 px-4'>
                    <span className='text-lg px-4 dark:text-white text-black font-semibold border-l-4 border-yellow-500'>Modifier un employé</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 p-4 &_label>span:border-none">
                    <Input error={errors.last_name?.message} {...register("last_name")} label="Nom" inputClassName='ring-0 dark:border-slate-600' />
                    <Input error={errors.first_name?.message} {...register("first_name")} label="Prénom" inputClassName='ring-0 dark:border-slate-600' />
                    <Input error={errors.email?.message} {...register("email")} label="Email" className='col-span-2' inputClassName='ring-0 dark:border-slate-600' />
                    <Input error={errors.phone?.message} {...register("phone")} label="Téléphone" className='col-span-2' inputClassName='ring-0 dark:border-slate-600' />
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
                            onChange={(option: any) => field.onChange(option.value)}
                        />} />
                    <Input error={errors.city?.message} {...register("city")} label="Ville" className='' inputClassName='ring-0 dark:border-slate-600' />
                    <Input error={errors.street?.message} {...register("street")} label="Quartier" className='' inputClassName='ring-0 dark:border-slate-600' />
                    <FileInput error={errors.profile?.message as string} label="Photo" {...register("profile")} className='col-span-2' inputClassName='ring-0 dark:border-slate-600' onChange={(e: any) => { handleImageChange(e); register("profile").onChange(e) }} />
                    <span className={cn('w-32 rounded-lg', imageUrl ? '' : 'hidden')}>
                        <img src={imageUrl} className="w-full rounded-lg" alt="" />
                    </span>
                    <Button isLoading={loading} type='submit' className='bg-yellow-500 text-md font-semibold py-2 col-span-2 rounded-lg'>Valider</Button>
                </form>
            </div>
        </>
    )
}

export default UpdateCustomer