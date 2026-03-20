import { useAuth } from '@/hooks/useAuth';
import { UpdateEmployeeSchema, updateEmployeeSchema } from '@/schema/update-employee';
import { updateEmployee } from '@/services/EmployeeService';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button, FileInput, Input, Text, cn } from 'rizzui';
import CustomSelect from '../Select';

const UpdateEmployee = ({ roles, employee }: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>(employee?.user?.profile);
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
    const { register, control, handleSubmit, formState: { errors } } = useForm<UpdateEmployeeSchema>({
        resolver: zodResolver(updateEmployeeSchema),
        defaultValues: {
            last_name: employee?.last_name,
            first_name: employee?.first_name,
            email: employee?.user.email,
            position: employee?.position,
            phone: employee?.phone,
            roles: employee?.user?.roles?.map((role: any) => role.name),
        }
    })

    const rols = roles?.map((role: any) => ({ label: role.name, value: role.name }));
    const { handleError, getError } = useAuth()
    const onSubmit = async (data: UpdateEmployeeSchema, e: any) => {
        try {
            setLoading(true);
            const formData = new FormData(e.target);
            if (data.profile[0]) {
                formData.append('profile', data.profile[0]);
            } else {
                formData.delete('profile');
            }
            if (!data.roles) {
                formData.delete('roles');
            }
            formData.append('_method', 'PUT');
            if (data.roles) {
                data.roles.map((r: any) => formData.append(`roles[]`, r));
            }

            toast.promise(updateEmployee(formData, employee.id), {
                pending: "Modification d'un employé...",
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
                    <Input error={errors.position?.message} {...register("position")} label="Fonction" className='' inputClassName='ring-0 dark:border-slate-600' />
                    <Input error={errors.phone?.message} {...register("phone")} label="Téléphone" className='' inputClassName='ring-0 dark:border-slate-600' />
                    <div className="flex flex-col col-span-2 gap-2">
                        <Text className='text-sm'>Rôles</Text>
                        <Controller
                            control={control} name="roles" render={({ field }) => <CustomSelect isMulti {...field}
                                options={rols}
                                value={rols.filter((role: any) => field.value?.includes(role.value))}
                                onChange={(option: any) => field.onChange(option.map((role: any) => role.value))}
                            />}
                        />
                        <span className='text-red text-sm'>{errors.roles?.message as string}</span>
                    </div>
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

export default UpdateEmployee