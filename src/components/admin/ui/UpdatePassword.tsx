import { useAuth } from '@/hooks/useAuth';
import { updateEmployee } from '@/services/EmployeeService';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button, Password, Text } from 'rizzui';
import { z } from 'zod';

const UpdatePassword = ({ model }: any) => {
    const schema = z.object({
        password: z.string().min(1, 'Le mot de passe est requis').min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
        password_confirmation: z.string().min(1, 'La confirmation du mot de passe est requise').min(6, { message: 'La confirmation du mot de passe doit contenir au moins 6 caractères' }),
    }).superRefine(({ password, password_confirmation }, ctx) => {
        if (password !== password_confirmation) {
            ctx.addIssue({
                code: 'custom',
                message: 'Les mots de passe ne correspondent pas',
                path: ['password_confirmation'],
            })
        }
    })
    const [loading, setLoading] = useState<boolean>(false);
    const { register, reset, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    })
    const { handleError, getError } = useAuth()
    const onSubmit = async (data: z.infer<typeof schema>, e: any) => {
        try {
            setLoading(true);
            const formData = new FormData(e.target);
            formData.append('_method', 'PUT');

            toast.promise(updateEmployee(formData, model.id), {
                pending: "Changement du mot de passe...",
                success: {
                    render() {
                        setLoading(false);
                        reset();
                        return "Mot de passe mis à jour avec succès"
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
            <div className="rounded-lg max-lg:w-full lg:min-w-96 self-start flex flex-col bg-white dark:bg-neutral-900 divide-y divide-dashed dark:divide-slate-500 divide-slate-400">
                <div className='py-4 px-4'>
                    <span className='text-lg px-4 dark:text-white text-black font-semibold border-l-4 border-yellow-500'>Changer de mot de passe</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 p-4 &_label>span:border-none">
                    <Password error={errors.password?.message} {...register("password")} label="Mot de passe" className='col-span-2' inputClassName='ring-0 dark:border-slate-600' />
                    <Password error={errors.password_confirmation?.message} {...register("password_confirmation")} label="Confirmation de mot de passe" className='col-span-2' inputClassName='ring-0 dark:border-slate-600' />
                    <Button isLoading={loading} type='submit' className='bg-yellow-500 text-md font-semibold py-2 col-span-2 rounded-lg'>Valider</Button>
                </form>
            </div>
        </>
    )
}

export default UpdatePassword