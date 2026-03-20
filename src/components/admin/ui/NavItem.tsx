import { useNavigation } from '@/hooks/useNavigation';
import React from 'react';
import { MdOutlineChevronRight } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { Accordion, cn } from 'rizzui';


function NavLink(props: any) {
    return (
        <Link
            onClick={() => props.setOpenDrawer(false)}
            to={props.url}
            className={cn(
                "flex w-full group cursor-pointer justify-between p-2 items-center gap-3 hover:bg-slate-100 hover:text-black dark:hover:bg-neutral-700 dark:hover:text-white rounded",
                props.activeClass && "bg-slate-100 text-black dark:bg-neutral-700 dark:text-white",
                props.getContract() && !props.getHoverContract() ? "justify-center" : ""
            )}
        >
            <span className='inline-flex items-center gap-2'>
                {props.icon}
                <span className={cn(props.getContract() && !props.getHoverContract() ? "hidden" : "")}>
                    {props.title}
                </span>
            </span>
            <MdOutlineChevronRight className={cn(
                "h-5 w-5 -rotate-0 transform transition-transform duration-300",
                props.open && "rotate-90",
                props.subs.length > 0 ? "" : "hidden",
                props.getContract() && !props.getHoverContract() ? "hidden" : ""
            )} />
        </Link>
    );
}

// ⚠️ div au lieu de button — Accordion.Header rend déjà un <button> en interne
function NavButton(props: any) {
    return (
        <div
            onClick={props.onClick}
            className={cn(
                "flex w-full group cursor-pointer justify-between p-2 items-center gap-3 hover:bg-slate-100 hover:text-black dark:hover:bg-neutral-700 dark:hover:text-white rounded",
                props.activeClass && "bg-slate-100 text-black dark:bg-neutral-700 dark:text-white",
                props.getContract() && !props.getHoverContract() ? "justify-center" : ""
            )}
        >
            <span className='inline-flex items-center gap-2'>
                {props.icon}
                <span className={cn(props.getContract() && !props.getHoverContract() ? "hidden" : "")}>
                    {props.title}
                </span>
            </span>
            <MdOutlineChevronRight className={cn(
                "h-5 w-5 -rotate-0 transform transition-transform duration-300",
                props.open && "rotate-90",
                props.subs.length > 0 ? "" : "hidden",
                props.getContract() && !props.getHoverContract() ? "hidden" : ""
            )} />
        </div>
    );
}


const NavItem = ({ title, url, icon, subs = [], onClick }: any) => {
    const location = useLocation();
    const activeClass = location.pathname === url || subs.some((sub: any) => sub.url === location.pathname);
    const activeSubClass = (subUrl: string) => location.pathname === subUrl;
    const { getContract, getHoverContract, setOpenDrawer }: any = useNavigation();

    return (
        <Accordion as='li'>
            <Accordion.Header>
                {({ open }: { open: boolean }) => (
                    subs.length > 0 || title === "Logout"
                        ? <NavButton
                            subs={subs}
                            setOpenDrawer={setOpenDrawer}
                            activeClass={activeClass}
                            getContract={getContract}
                            getHoverContract={getHoverContract}
                            open={open}
                            title={title}
                            url={url}
                            icon={icon}
                            onClick={onClick}
                          />
                        : <NavLink
                            subs={subs}
                            setOpenDrawer={setOpenDrawer}
                            activeClass={activeClass}
                            getContract={getContract}
                            getHoverContract={getHoverContract}
                            open={open}
                            title={title}
                            url={url}
                            icon={icon}
                          />
                )}
            </Accordion.Header>

            <Accordion.Body className={cn("p-0", subs.length > 0 ? "" : "hidden")}>
                <ul className={cn(
                    "flex flex-col pl-8 gap-1 py-2 list-disc list-inside",
                    subs.length > 0 ? "" : "hidden",
                    getContract() && !getHoverContract() ? "hidden" : ""
                )}>
                    {subs.map((sub: any) => (
                        <Link
                            key={sub.url}
                            to={sub.url}
                            onClick={() => setOpenDrawer(false)}
                        >
                            <li className={cn(
                                "px-2 py-1 hover:bg-slate-100 hover:text-black dark:hover:bg-neutral-700 dark:hover:text-white rounded",
                                activeSubClass(sub.url) && "bg-slate-100 text-black dark:bg-neutral-700 dark:text-white"
                            )}>
                                {sub.title}
                            </li>
                        </Link>
                    ))}
                </ul>
            </Accordion.Body>
        </Accordion>
    );
};

export default NavItem;