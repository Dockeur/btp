import { formatDate } from '@/utils/format-date'
import React from 'react'

const Activity = ({ auth }: { auth: any }) => {
    return (
        <div className="rounded-lg max-lg:w-full lg:min-w-96 self-start flex flex-col bg-white dark:bg-neutral-900 divide-y divide-dashed dark:divide-slate-500 divide-slate-400">
            <div className='py-4 px-4'>
                <span className='text-lg px-4 dark:text-white text-black font-semibold border-l-4 border-yellow-500'>Activités</span>
            </div>
            <div className='p-4 flex max-h-[39rem] overflow-auto flex-col gap-4 divide-y dark:divide-slate-500 divide-slate-400'>
                {auth.user.logs.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((log: any, index: number) => (
                    <div key={index} className='flex first-of-type:p-0 pt-4 flex-col'>
                        <span className='text-sm lg:w-96'><span className='dark:text-white text-black font-bold'>Model : </span>{log.subject_type.replace("App\\Models\\", "")}</span>
                        <span className='text-sm'><span className='dark:text-white text-black font-bold'>ID : </span>{log.subject_id}</span>
                        <span className='text-sm'><span className='dark:text-white text-black font-bold'>Description : </span>{log.description}</span>
                        <span className='text-sm'><span className='dark:text-white text-black font-bold'>Date : </span>{formatDate(new Date(log.created_at), 'D MMMM YYYY, HH:mm:ss')}</span>
                    </div>
                ))}
                {auth.user.logs.length === 0 && <span className='w-full text-center py-14'>Aucun historique d'activité</span>}
            </div>
        </div>
    )
}

export default Activity