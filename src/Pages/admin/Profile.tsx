import Activity from '@/components/admin/ui/Activity';
import ChangePassword from '@/components/admin/ui/ChangePassword';
import LoginHistory from '@/components/admin/ui/LoginHistory';
import ProfileModal from '@/components/admin/ui/ProfileModal';
import Title from '@/components/admin/ui/Title';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/format-date';
import React, { useState } from 'react';

const AdminProfile = () => {
    const { getAuth, updateProfile, getError } = useAuth();
    const [modalSate, setModalState] = useState(false);
    return (
        <div className='flex flex-wrap p-4 gap-8'>
            <Title title="Profile" links={[{ title: 'Admin', url: '/admin' }, { title: 'Profile' }]} />
            <div className="flex flex-col gap-4 max-lg:w-full">
                <div className="max-lg:w-full rounded-lg bg-white self-start dark:bg-neutral-900 p-4 max-sm:flex-col lg:max-w-xl flex gap-4 items-center">
                    <img src={getAuth().user.profile} alt={getAuth().user.email} className='rounded-full object-cover h-64 w-64' />
                    <span className="flex flex-col max-lg:w-full gap-2 font-semibold">
                        <span><span className='dark:text-white text-black font-bold'>Noms : </span>{getAuth().first_name + "  " + getAuth().last_name}</span>
                        <span><span className='dark:text-white text-black font-bold'>Email : </span>{getAuth().user.email}</span>
                        <span><span className='dark:text-white text-black font-bold'>Fonction : </span>{getAuth().position ?? "Non renseigné"}</span>
                        <span><span className='dark:text-white text-black font-bold'>Téléphone : </span>{getAuth().phone ?? "Non renseigné"}</span>
                        <span><span className='dark:text-white text-black font-bold'>Crée le : </span>{formatDate(new Date(getAuth().created_at), 'D MMMM YYYY, HH:mm:ss')}</span>
                        <span><span className='dark:text-white text-black font-bold'>Modifié le : </span>{formatDate(new Date(getAuth().updated_at), 'D MMMM YYYY, HH:mm:ss')}</span>
                        <button onClick={() => setModalState(true)} className='bg-yellow-500 w-full font-semibold p-2 rounded text-white'>Modifier</button>
                    </span>
                    <ProfileModal updateProfile={updateProfile} getError={getError} getAuth={getAuth} modalState={modalSate} setModalState={setModalState}></ProfileModal>
                </div>
                <ChangePassword />
            </div>
            <LoginHistory auth={getAuth()} />
            <Activity auth={getAuth()} />
        </div>
    )
}

export default AdminProfile