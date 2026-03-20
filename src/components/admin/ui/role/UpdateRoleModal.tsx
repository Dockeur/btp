import { useAuth } from '@/hooks/useAuth';
import { createRole, updateRole } from '@/services/RoleService';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { RiCloseFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { ActionIcon, Button, Input, Modal, Text } from 'rizzui';
import { z } from 'zod';
import CustomSelect from '../Select';

const UpdateRoleModal = ({ role, permissions, modalState, setModalState, refresh, setRefresh }: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const schema = z.object({
        name: z.string().min(1, "Le nom est requis").min(3, "Le nom doit avoir au moins 3 caractères"),
        permissions: z.array(z.string(), { required_error: "Les permissions sont requises" }).optional(),
    })
    const { register, control, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: role.name,
            permissions: role.permissions?.map((permission: any) => permission.name)
        }
    })

    const perms = permissions?.map((permission: any) => ({ label: permission.name, value: permission.name }));
    const { handleError, getError } = useAuth()
    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            setLoading(true);

            toast.promise(updateRole(data, role.id), {
                pending: "Modification d'un role...",
                success: {
                    render() {
                        setLoading(false);
                        setModalState({ open: false, id: role.id });
                        setRefresh(!refresh);
                        return "Role modifié avec succès"
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
            <Modal isOpen={modalState.open && modalState.id === role.id} onClose={() => setModalState({ id: role.id, open: false })}>
                <div className="flex flex-col gap-4 p-4 dark:bg-neutral-900 dark:text-white rounded-lg bg-white">
                    <div className="flex items-center justify-between">
                        <Text className='text-2xl font-semibold'>Modifier un role</Text>
                        <ActionIcon
                            size="sm"
                            variant="text"
                            onClick={() => setModalState({ id: role.id, open: false })}
                        >
                            <RiCloseFill className="text-2xl" />
                        </ActionIcon>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 &_label>span:border-none">
                        <Input error={errors.name?.message} {...register("name")} label="Nom" inputClassName='ring-0 dark:border-slate-600' />
                        <div className="flex flex-col gap-2">
                            <Text className='text-sm'>Permissions</Text>
                            <Controller
                                control={control} name="permissions" render={({ field }) => <CustomSelect isMulti {...field}
                                    options={perms}
                                    value={perms.filter((perm: any) => field.value?.includes(perm.value))}
                                    onChange={(option: any) => field.onChange(option.map((perm: any) => perm.value))}
                                />}
                            />
                            <span className='text-red text-sm'>{errors.permissions?.message as string}</span>
                        </div>
                        <Button isLoading={loading} type='submit' className='bg-yellow-500 text-md font-semibold py-2 rounded-lg'>Valider</Button>
                    </form>
                </div>
            </Modal>
        </>
    )
}

export default UpdateRoleModal