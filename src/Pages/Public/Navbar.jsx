import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaXmark, FaBars } from "react-icons/fa6";

import logo from "@image/logo/logo.png";
import { SubMenu } from "../../components/SousMenu/SubMenu";
import { useAuthStore } from "src/hooks/useAuth";
import { routes } from "src/routes";
import ProfileMenu from "@/components/shadcn/ProfileMenu";
import LanguageDropdown from "@/components/LanguageDropdown";

const Navbar = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [subMenuVisible, setSubMenuVisible] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    const { auth, roles, logout } = useAuthStore();

    const isAdmin = roles?.includes("Super Admin") || roles?.includes("Admin") || roles?.includes("admin");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        document.body.style.overflow = !isMenuOpen ? "hidden" : "unset";
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = "unset";
    };

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setIsSticky(offset > 50);
            setScrolled(offset > 50);
        };
        const handleResize = () => { if (window.innerWidth > 768) closeMenu(); };
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            document.body.style.overflow = "unset";
        };
    }, []);

    const allNavItems = [
        { link: t("nav.home"),      path: "home" },
        { link: t("nav.about"),     path: "about" },
        { link: t("nav.lands"),     path: "land" },
        { link: t("nav.com"),       path: "commande", adminOnly: false },
        { link: t("nav.buildings"), subMenu: <SubMenu key="maisonDropdown" /> },
        { link: t("nav.contact"),   path: "contact" },
    ];

    const navItems = allNavItems.filter(item => {
        if (item.path === "commande" && isAdmin) return false;
        return true;
    });

    const handleLogout = async () => {
        await logout();
        navigate(routes.home.path, { replace: true });
    };

    const isActivePath = (path) => location.pathname === `/${path}`;

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isSticky ? "bg-white shadow-md py-2" : "bg-white/95 backdrop-blur-md py-3 shadow-sm"
                }`}
            >
                <div className="container mx-auto flex items-center justify-between">

                    <Link to={routes.home.path} className="flex items-center group">
                        <img
                            src={logo}
                            alt="Logo"
                            className={`transition-all duration-300 w-auto object-contain ${scrolled ? "h-8 lg:h-10" : "h-10 lg:h-12"}`}
                        />
                    </Link>

                    <ul className="hidden md:flex items-center gap-0.5 lg:gap-1">
                        {navItems.map((navItem, index) => (
                            <li
                                key={navItem.link || index}
                                className="relative"
                                onMouseEnter={() => navItem.subMenu && setOpenDropdown(index)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                {navItem.subMenu ? (
                                    <>
                                        <button
                                            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                openDropdown === index
                                                    ? "text-Cprimary bg-Cprimary/8"
                                                    : "text-texteCouleur hover:text-Cprimary hover:bg-neutralSilver"
                                            }`}
                                        >
                                            {navItem.link}
                                            <svg
                                                className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === index ? "rotate-180" : ""}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div
                                            className={`absolute left-0 top-full pt-2 min-w-[220px] transition-all duration-200 z-50 ${
                                                openDropdown === index
                                                    ? "opacity-100 visible translate-y-0"
                                                    : "opacity-0 invisible -translate-y-1"
                                            }`}
                                        >
                                            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                                                {navItem.subMenu}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to={`/${navItem.path}`}
                                        className={`block px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            isActivePath(navItem.path ?? "")
                                                ? "text-Cprimary bg-Cprimary/10"
                                                : "text-texteCouleur hover:text-Cprimary hover:bg-neutralSilver"
                                        }`}
                                    >
                                        {navItem.link}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="hidden md:flex items-center gap-2">
                        <LanguageDropdown />
                        {auth ? (
                            <ProfileMenu />
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to={routes.login.path}
                                    className="text-sm font-semibold text-texteCouleur px-4 py-2 rounded-lg hover:bg-neutralSilver transition-all duration-200"
                                >
                                    {t("nav.login")}
                                </Link>
                                <Link
                                    to={routes.register.path}
                                    className="text-sm font-semibold text-white bg-Cprimary hover:bg-Csecondary1 px-5 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    {t("nav.register")}
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex md:hidden items-center gap-2">
                        <LanguageDropdown />
                        <button
                            onClick={toggleMenu}
                            className="p-2 text-texteCouleur hover:text-Cprimary hover:bg-neutralSilver rounded-lg transition-all duration-200 focus:outline-none"
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <FaXmark className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`${scrolled ? "h-14" : "h-16"} transition-all duration-300`} />

            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
                    isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={closeMenu}
            />

            <div
                className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transition-transform duration-300 md:hidden ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <Link to={routes.home.path} onClick={closeMenu}>
                        <img src={logo} alt="Logo" className="h-8 w-auto" />
                    </Link>
                    <button onClick={closeMenu} className="p-2 text-texteCouleur hover:text-Cprimary hover:bg-neutralSilver rounded-lg transition-all duration-200">
                        <FaXmark className="h-5 w-5" />
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100%-170px)] px-4 py-4">
                    <nav className="space-y-1">
                        {navItems.map((navItem, index) => (
                            <div key={navItem.link || index}>
                                {navItem.subMenu ? (
                                    <div>
                                        <button
                                            onClick={() => setSubMenuVisible(subMenuVisible === index ? null : index)}
                                            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-texteCouleur hover:text-Cprimary hover:bg-neutralSilver rounded-lg transition-all duration-200"
                                        >
                                            {navItem.link}
                                            <svg
                                                className={`w-4 h-4 transition-transform duration-200 ${subMenuVisible === index ? "rotate-180" : ""}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ${subMenuVisible === index ? "max-h-96 mt-1" : "max-h-0"}`}>
                                            <div className="pl-3 rounded-lg bg-neutralSilver mx-1">
                                                {navItem.subMenu}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        to={`/${navItem.path}`}
                                        onClick={closeMenu}
                                        className={`block px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                            isActivePath(navItem.path ?? "")
                                                ? "text-Cprimary bg-Cprimary/10"
                                                : "text-texteCouleur hover:text-Cprimary hover:bg-neutralSilver"
                                        }`}
                                    >
                                        {navItem.link}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-gray-100 bg-white">
                    {auth ? (
                        <div className="space-y-2">
                            <ProfileMenu />
                            <button
                                onClick={() => { handleLogout(); closeMenu(); }}
                                className="w-full px-4 py-2.5 text-sm font-semibold text-texteCouleur hover:text-Cprimary hover:bg-neutralSilver rounded-lg transition-all duration-200"
                            >
                                {t("nav.logout")}
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link
                                to={routes.login.path}
                                onClick={closeMenu}
                                className="flex-1 py-2.5 text-center text-sm font-semibold text-Cprimary border-2 border-Cprimary rounded-lg hover:bg-Cprimary/5 transition-all duration-200"
                            >
                                {t("nav.login")}
                            </Link>
                            <Link
                                to={routes.register.path}
                                onClick={closeMenu}
                                className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-Cprimary hover:bg-Csecondary1 rounded-lg transition-all duration-200 shadow-sm"
                            >
                                {t("nav.register")}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;