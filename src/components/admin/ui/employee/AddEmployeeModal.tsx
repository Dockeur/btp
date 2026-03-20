import { useAuth } from '@/hooks/useAuth';
import { AddEmployeeSchema, addEmployeeSchema } from '@/schema/add-employee';
import { createEmployee } from '@/services/EmployeeService';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RiCloseFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { ActionIcon, Button, FileInput, Input, Modal, Password, Text } from 'rizzui';
import CustomSelect from '../Select';


function SelectRole(props: any) {
    return (<div className="flex flex-col col-span-2 gap-2">
        <Text className='text-sm'>Rôles</Text>
        <Controller control={props.control} name="roles" render={({
            field
        }) => <CustomSelect {...field} isMulti options={props.rols} value={props.rols.filter((role: any) => field.value?.includes(role.value))} onChange={(option: any) => field.onChange(option.map((role: any) => role.value))} />} />
    </div>);
}


const AddEmployeeModal = ({ modalState, setModalState, roles, refresh, setRefresh }: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { register, control, reset, handleSubmit, formState: { errors } } = useForm<AddEmployeeSchema>({
        resolver: zodResolver(addEmployeeSchema),
    })
    const rols = roles.map((role: any) => ({ label: role.name, value: role.name }));
    const { handleError, getError } = useAuth()
    const onSubmit = async (data: AddEmployeeSchema, e: any) => {
        try {
            setLoading(true);
            const formData = new FormData(e.target);
            if (data.profile[0]) {
                formData.append('profile', data.profile[0]);
            } else {
                formData.delete('profile');
            }
            if (data.roles) {
                data.roles.map((r: any) => formData.append(`roles[]`, r));
            }

            toast.promise(createEmployee(formData), {
                pending: "Création d'un employé...",
                success: {
                    render() {
                        setModalState(false);
                        setLoading(false);
                        reset();
                        setRefresh(!refresh)
                        return "Employé crée avec succès"
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
        <Modal isOpen={modalState} onClose={() => setModalState(false)}>
            <div className="flex flex-col gap-4 p-4 dark:bg-neutral-900 dark:text-white rounded-lg bg-white">
                <div className="flex items-center justify-between">
                    <Text className='text-2xl font-semibold'>Créer un employé</Text>
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
                    <Input error={errors.position?.message} {...register("position")} label="Fonction" className='' inputClassName='ring-0 dark:border-slate-600' />
                    <Input error={errors.phone?.message} {...register("phone")} label="Téléphone" className='' inputClassName='ring-0 dark:border-slate-600' />
                    <Password error={errors.password?.message} {...register("password")} label="Mot de passe" className='col-span-2' inputClassName='ring-0 dark:border-slate-600' />
                    <Password error={errors.password_confirmation?.message} {...register("password_confirmation")} label="Confirmation de mot de passe" className='col-span-2' inputClassName='ring-0 dark:border-slate-600' />
                    <SelectRole control={control} rols={rols}></SelectRole>
                    <FileInput error={errors.profile?.message as string} label="Photo" {...register("profile")} className='col-span-2' inputClassName='ring-0 dark:border-slate-600' />
                    <Button isLoading={loading} type='submit' className='bg-yellow-500 text-md font-semibold py-2 col-span-2 rounded-lg'>Valider</Button>
                </form>
            </div>
        </Modal>
    )
}

export default AddEmployeeModal