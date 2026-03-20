import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { MdOutlineDarkMode, MdOutlineLightMode, MdSearch } from 'react-icons/md';
import { RiCloseFill, RiMenu2Fill } from 'react-icons/ri';
import { Avatar, cn } from 'rizzui';

const Navbar = () => {
    const { getTheme, setTheme }: any = useTheme();
    const { auth } = useAuth();
    const { setOpenDrawer, getContract, setContract, getHoverContract }: any = useNavigation();
    
    const handleTheme = () => {
        if (getTheme() === "dark") {
            setTheme('light')
        } else {
            setTheme('dark')
        }
    }

    // Vérification si auth et auth.user existent
    if (!auth || !auth.user) {
        return (
            <nav className="bg-white dark:bg-neutral-900 sticky dark:border-neutral-700 top-0 z-50 inline-flex w-full border-gray-200 border-b">
                <div className="w-full flex justify-center items-center py-5">
                    <span className="text-slate-500">Chargement...</span>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white dark:bg-neutral-900 sticky dark:border-neutral-700 top-0 z-50 inline-flex w-full border-gray-200 border-b">
            <div className={cn('lg:w-56 px-4 text-center py-5 lg:border-r dark:border-neutral-700 text-slate-500 dark:text-slate-400', getContract() && !getHoverContract() ? "lg:w-16" : "lg:w-56")}>
                <h1 className={cn('max-lg:hidden', getContract() && !getHoverContract() ? "hidden" : "")}>Admin</h1>
                <h1 className={cn('text-xl lg:hidden', getContract() && !getHoverContract() ? "lg:block" : "")}>A</h1>
            </div>
            <div className={cn('w-[calc(100%-4rem)] lg:w-[calc(100%-14rem)] flex justify-between dark:text-slate-400 text-slate-500 lg:pl-4 lg:pr-10 items-center', getContract() && !getHoverContract() ? "lg:w-[calc(100%-5rem)]" : "lg:w-[calc(100%-14rem)]")}>
                <span className='inline-flex gap-4 items-center'>
                    <button className='lg:hidden' onClick={() => setOpenDrawer(true)}>
                        <RiMenu2Fill className='text-2xl' />
                    </button>
                    <button className='max-lg:hidden' onClick={() => setContract(!getContract())}>
                        <RiMenu2Fill className={cn('text-2xl', getContract() ? "hidden" : "")} />
                        <RiCloseFill className={cn('text-2xl', getHoverContract() || getContract() == false ? "hidden" : "")} />
                    </button>
                    <span className='hidden lg:inline-flex gap-2'>
                        <MdSearch className='text-2xl' />
                        <span>Search ...</span>
                    </span>
                </span>
                <div className='flex items-center max-lg:gap-4 gap-8'>
                    <MdSearch className='text-2xl lg:hidden' />
                    <button onClick={handleTheme}>
                        {getTheme() == "dark"
                            ?
                            <MdOutlineLightMode className='text-2xl' />
                            :
                            <MdOutlineDarkMode className='text-2xl' />
                        }
                    </button>
                    <div className='flex gap-2'>
                        <Avatar 
                            name={auth.first_name + " " + auth.last_name} 
                            src={auth.user?.profile} 
                            className='text-slate-700 dark:text-slate-300' 
                        />
                        <span className='max-md:hidden flex flex-col text-sm'>
                            <span className='font-semibold text-slate-700 dark:text-slate-300'>{auth.first_name + " " + auth.last_name}</span>
                            <span className='text-slate-600 font-medium dark:text-slate-400'>{auth.user?.roles?.[0]?.name ?? "Non renseigné"}</span>
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar