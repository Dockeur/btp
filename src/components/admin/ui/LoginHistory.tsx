import { formatDate } from '@/utils/format-date'
import React from 'react'

const LoginHistory = ({ auth }: { auth: any }) => {
    return (
        <div className="rounded-lg max-lg:w-full lg:min-w-96 self-start flex flex-col bg-white dark:bg-neutral-900 divide-y divide-dashed dark:divide-slate-500 divide-slate-400">
            <div className='py-4 px-4'>
                <span className='text-lg px-4 dark:text-white text-black font-semibold border-l-4 border-yellow-500'>Historiques de connexion</span>
            </div>
            <div className='p-4 flex max-h-[39rem] overflow-auto flex-col gap-4 divide-y dark:divide-slate-500 divide-slate-400'>
                {auth.user?.authentications.map((auth: any, index: number) => (
                    <div key={index} className='flex first-of-type:p-0 pt-4 flex-col'>
                        <span className='text-sm'><span className='dark:text-white text-black font-bold'>IP : </span>{auth.ip_address}</span>
                        <span className='text-sm'><span className='dark:text-white text-black font-bold'>Date : </span>{formatDate(new Date(auth.login_at), 'D MMMM YYYY, HH:mm:ss')}</span>
                        <span className='text-sm'><span className='dark:text-white text-black font-bold'>Lieu : </span>{auth.location.city + ", " + auth.location.country}</span>
                        <span className='text-sm lg:w-96'><span className='dark:text-white text-black font-bold'>Agent : </span>{auth.user_agent}</span>
                        {
                            auth.login_successful
                                ? <span className='text-sm mt-1 px-2 py-1 rounded-lg text-green-500 font-semibold bg-green-100 self-start'>Succès</span>
                                : <span className='text-sm mt-1 px-2 py-1 rounded-lg text-red-500 font-semibold bg-red-100 self-start'>Échec</span>
                        }
                    </div>
                ))}
                {auth.user?.authentications.length === 0 && <span className='w-full text-center py-14'>Aucun historique de connexion</span>}
            </div>
        </div>
    )
}

export default LoginHistory