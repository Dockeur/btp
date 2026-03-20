import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import React, { useEffect } from 'react';
import { Drawer, cn } from 'rizzui';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = ({ children }: React.PropsWithChildren) => {
    const { setTheme, getTheme }: any = useTheme();
    const { getOpenDrawer, setOpenDrawer, getContract, getHoverContract }: any = useNavigation();
    useEffect(() => {
        setTheme(getTheme())
    }, [getTheme, setTheme])

    return (
        <>
            <Navbar />
            <div className="flex dark:text-slate-400 text-slate-500">
                <div className="max-lg:hidden">
                    <Sidebar />
                </div>
                <Drawer placement="left" customSize='70%' isOpen={getOpenDrawer()} onClose={() => setOpenDrawer(false)}>
                    <Sidebar />
                </Drawer>
                <div className={cn("w-full min-h-[calc(100vh-4rem)] h-full lg:w-[calc(100%-14rem)] bg-slate-100 dark:bg-neutral-800 flex flex-col justify-between", getContract() || getHoverContract() ? "lg:w-full" : "")}>
                    {children}
                    <div className="inline-flex p-4 justify-center bg-white dark:bg-neutral-900 items-center text-center">Copyright © {new Date().getFullYear()} Efficace. All rights reserved. Powered by Efficace</div>
                </div>
            </div>
            <ToastContainer draggable theme={getTheme()} />
        </>
    )
}

export default AdminLayout
