
export const routes = {
    login: {
        path: "/login",
    },
    register: {
        path: "/register",
    },
    forgotPassword: {
        path: "/forgotPassword",
    },
    unauthorized: {
        path: "/unauthorized",
    },
    home: {
        path: "/home",
    },
    validateUser: {
        path: "/validate-user",
    },
    profile: {
        path: "/profil",
    },
    contact: {
        path: "/contact",
    },
    help: {
        path: "/help",
    },
    villa: {
        path: "/villa",
    },
    duplex: {
        path: "/duplex",
    },
    building: {
        path: "/building",
    },
    land: {
        path: "/land",
    },
    detail: {
        path: (id: string) =>`/land/${id}`,
    },
    porpose: {
        path: "/proposition",
    },
    landPorpose: {
        path: "/landPorpose",
    },
    buildingPorpose: {
        path: "/buildingPorpose",
    },
    apartmentPorpose: {
        path: "/apartmentPorpose",
    },
    duplexPorpose: {
        path: "/duplexPorpose",
    },
    propertyPropose: {
        path: "/PropertyPropose",
    },
    aide: {
        path: "/aide",
    },
    about: {
        path: "/about",
        permissions: {
            show: "view-user",
            create: "create-user",
            update: "update-user",
            delete: "delete-user",
        },
    },
    admin: {
        path: "/admin",
        profile: {
            path: "/admin/profile",
        },
        employees: {
            path: "/admin/employees",
            show: (id: string) => `/admin/employees/${id}`,
            edit: (id: string) => `/admin/employees/${id}/edit`,
        },
        customers: {
            path: "/admin/customers",
            show: (id: string) => `/admin/customers/${id}`,
            edit: (id: string) => `/admin/customers/${id}/edit`,
        },
        roles: {
            path: "/admin/roles",
            show: (id: string) => `/admin/roles/${id}`,
            edit: (id: string) => `/admin/roles/${id}/edit`,
        },
        accommodations: {
            path: "/admin/accommodations",
            show: (id: string) => `/admin/accommodations/${id}`,
            edit: (id: string) => `/admin/accommodations/${id}/edit`,
        },
        properties: {
            path: "/admin/properties",
            show: (id: string) => `/admin/properties/${id}`,
            edit: (id: string) => `/admin/properties/${id}/edit`,
            create: "/admin/properties/create",
        },
        lands: {
            path: "/admin/lands",
            show: (id: string) => `/admin/lands/${id}`,
            edit: (id: string) => `/admin/lands/${id}/edit`,
            create: "/admin/lands/create",
        },
        products: {
            path: "/admin/products",
            show: (id: string) => `/admin/products/${id}`,
            edit: (id: string) => `/admin/products/${id}/edit`,
            create: "/admin/products/create",
        },
        orders: {
            path: "/admin/orders"
        }
    },


}