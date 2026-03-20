import React from 'react'
import NavItem from '../ui/NavItem'
import { useNavigation } from '@/hooks/useNavigation'
import { cn } from 'rizzui'
import { navItems } from '@/data/nav-items'
import { MdLogout } from 'react-icons/md'
import { routes } from '@/routes'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const Sidebar = () => {
    const { getContract, setHoverContract, getHoverContract }: any = useNavigation()
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate(routes.home.path, { replace: true });
    }
    return (
        <aside onMouseOver={() => setHoverContract(true)} onMouseOut={() => setHoverContract(false)} className={cn("lg:w-56 self-start lg:sticky top-[calc(4rem)] border-r dark:border-neutral-700 h-full lg:h-[calc(100vh-4rem)] bg-white dark:text-slate-400 text-slate-500 dark:bg-neutral-900", getContract() && !getHoverContract() ? "lg:w-16" : "lg:w-56")}>
            <ul className="flex flex-col gap-1 px-2 py-6 justify-between h-full">
                <div className="flex flex-col gap-1">
                    {navItems.map((item: any, key) => (
                        <NavItem key={key} {...item} />
                    ))}
                </div>
                <NavItem key="Logout" title="Logout" onClick={handleLogout} icon={<MdLogout className="text-2xl text-red-500" />} />
            </ul>
        </aside>
    )
}

export default Sidebar
