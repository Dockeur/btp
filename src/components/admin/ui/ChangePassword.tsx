import { useAuth } from '@/hooks/useAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button, Password } from 'rizzui'
import { z } from 'zod'
import { changePassword } from '../../../services/AuthService';

const ChangePassword = () => {
    const schema = z.object({
        current_password: z
            .string()
            .min(1, 'Le mot de passe actuel est requis')
            .min(6, 'Le mot de passe actuel doit avoir au moins 6 caractères'),
        password: z
            .string()
            .min(1, 'Le nouveau mot de passe est requis')
            .min(6, 'Le nouveau mot de passe doit avoir au moins 6 caractères'),
        password_confirmation: z.string()
            .min(1, 'La confirmation du mot de passe est requise')
            .min(6, 'La confirmation du mot de passe doit avoir au moins 6 caractères'),
    }).superRefine(({ password, password_confirmation }, ctx) => {
        if (password !== password_confirmation) {
            ctx.addIssue({
                code: 'custom',
                message: 'Les mots de passe ne correspondent pas',
                path: ['password_confirmation'],
            })
        }
    })
    const { getError, changePassword } = useAuth()

    const [loading, setLoading] = useState<boolean>(false);

    type PasswordType = z.infer<typeof schema>

    const { register, reset, handleSubmit, formState: { errors } } = useForm<PasswordType>({
        resolver: zodResolver(schema),
    })
    const onSubmit = async (data: PasswordType) => {
        try {
            setLoading(true);
            toast.promise(changePassword(data), {
                pending: "Chargement...",
                success: {
                    render() {
                        setLoading(false);
                        reset();
                        return "Mot de passe mis à jour avec succès"
                    }
                },
                error: {
                    render() {
                        setLoading(false);
                        return getError()
                    }
                },
            })
        } catch (error) {
        }
    }
    return (
        <div className="rounded-lg max-lg:w-full flex flex-col bg-white dark:bg-neutral-900 divide-y divide-dashed dark:divide-slate-500 divide-slate-400">
            <div className='py-4 px-4'>
                <span className='text-lg px-4 dark:text-white text-black font-semibold border-l-4 border-yellow-500'>Changer de mot de passe</span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='p-4 flex flex-col gap-4'>
                    <Password {...register('current_password')} error={errors.current_password?.message} inputClassName='ring-0 dark:border-slate-600' label="Ancien mot de passe" />
                    <Password {...register('password')} error={errors.password?.message} inputClassName='ring-0 dark:border-slate-600' label="Nouveau mot de passe" />
                    <Password {...register('password_confirmation')} error={errors.password_confirmation?.message} inputClassName='ring-0 dark:border-slate-600' label="Confirmez le mot de passe" />
                    <Button isLoading={loading} type='submit' className='bg-yellow-500 text-md font-semibold py-2 col-span-2 rounded-lg'>Valider</Button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword