import React from "react";
import { FaHouse, FaUsers } from "react-icons/fa6";

import { RiAppStoreLine, RiDashboardFill, RiProfileLine, RiShoppingCartFill } from "react-icons/ri";

export const navItems = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: <RiDashboardFill className="text-2xl text-violet-400 group-hover:text-violet-500" />,
    },
    {
        title: "Profile",
        url: "/admin/profile",
        icon: <RiProfileLine className="text-2xl text-yellow-400 group-hover:text-yellow-500" />,
    },
 
    {
        title: "Utilisateurs",
        icon: <FaUsers className="text-2xl text-blue-400 group-hover:text-blue-500" />,
        subs: [
            {
                title: "Employés",
                url: "/admin/employees",
            },
            {
                title: "Clients",
                url: "/admin/customers",
            },
            {
                title: "Roles",
                url: "/admin/roles",
            },
        ]
    },
    {
        title: "Biens",
        icon: <FaHouse className="text-2xl text-green-400 group-hover:text-green-500" />,
        subs: [
            {
                title: "Logements",
                url: "/admin/accommodations",
            },
            {
                title: "Propriétés",
                url: "/admin/properties",
            },
            {
                title: "Terrains",
                url: "/admin/lands",
            },
        ]
    },
    {
        title: "Ventes",
        icon: <RiShoppingCartFill className="text-2xl text-pink-400 group-hover:text-pink-500" />,
        subs: [
            {
                title: "Produits",
                url: "/admin/products",
            },
            {
                title: "Commandes",
                url: "/admin/orders",
            },
            {
                title: "Produits Client",
                url: "/Admin/LandCustomerSale",
            }
        ]
    },

       {
        title: "Appointment",
        url: "/admin/appointment",
        icon: <RiAppStoreLine className="text-2xl text-yellow-400 group-hover:text-yellow-500" />,
    },
       {
        title: "Contrats",
        url: "/admin/Contracts",
        icon: <RiAppStoreLine className="text-2xl text-yellow-400 group-hover:text-yellow-500" />,
    }
]