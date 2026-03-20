import { AxiosError } from "axios";
import { changePassword, getCurrentUser, login, logout, updateProfile } from "src/services/AuthService";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore: any = create(persist((set, get: any) => ({
    auth: null, // Ceci contiendra l'objet "user"
    token: null,
    roles: [],
    permissions: [],
    error: null,
    
    getError: () => get().error,
    getAuth: () => get().auth,
    getToken: () => get().token,
    
    setRolesAndPermissions: (roles: any, permissions: any) => {
        set({ roles, permissions });
    },
    
    freshAuth: async () => {
        try {
            const res = await getCurrentUser();
            // ✅ Sécurisation : on vérifie que res.data et res.data.user existent
            if (res.success && res.data?.user) {
                const user = res.data.user;
                const roles = user.roles?.map((r: any) => r.name) || [];
                const permissions = user.all_permissions?.map((p: any) => p.name) || [];
                
                set({ auth: user, roles, permissions });
            }
        } catch (error) {
            console.error("Erreur freshAuth:", error);
        }
    },
    
    login: async (data: any) => {
        set({ error: null });
        try {
            const res = await login(data);
            if (res.success && res.data) {
                const token = res.data.token;
                const user = res.data.user;
                
             
                const roles = user?.roles?.map((r: any) => r.name) || [];
                const permissions = user?.all_permissions?.map((p: any) => p.name) || [];
                
                set({ 
                    token: token, 
                    auth: user,
                    roles: roles,
                    permissions: permissions,
                    error: null 
                });
                
                return true;
            } else {
                set({ error: res.message || "Identifiants invalides" });
                return false;
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Erreur de connexion";
            set({ error: msg });
            return false;
        }
    },


    loginWithToken: (token: string, user: any) => {
    const roles = user?.roles?.map((r: any) => r.name) || [];
    const permissions = user?.all_permissions?.map((p: any) => p.name) || [];
    set({ 
        token, 
        auth: user,
        roles,
        permissions,
        error: null 
    });
},
    
    handleError: (error: any) => {
        let message = "";
        let errors = {};
        
        // Extraction sécurisée des messages d'erreur Laravel/Axios
        if (error.response?.data?.errors) {
            errors = error.response.data.errors;
        } else if (error.data?.errors) {
            errors = error.data.errors;
        }

        const status = error.response?.status ?? 422;
        if (status === 422 && Object.keys(errors).length > 0) {
            for (const [key, value] of Object.entries<any>(errors)) {
                message += `${value[0]}\n`;
            }
        } else {
            message = error.response?.data?.message || error.message || "Une erreur est survenue";
        }
        set({ error: message });
    },
    
    updateProfile: async (data: any) => {
        set({ error: null });
        try {
            const res = await updateProfile(data);
            if (res.success && res.data?.user) {
                const user = res.data.user;
                const roles = user.roles?.map((r: any) => r.name) || [];
                const permissions = user.all_permissions?.map((p: any) => p.name) || [];
                set({ auth: user, roles, permissions });
            } else {
                get().handleError(res);
                throw new Error(get().error);
            }
        } catch (error: any) {
            get().handleError(error);
            throw new Error(get().error);
        }
    },
    
    changePassword: async (data: any) => {
        set({ error: null });
        try {
            const res = await changePassword(data);
            if (res.success) {
                return true;
            } else {
                get().handleError(res);
                throw new Error(get().error);
            }
        } catch (error: any) {
            get().handleError(error);
            throw new Error(get().error);
        }
    },
    
  
    hasPermission: (permissionName: string) => {
        const state = get();
        return state.roles.includes("Super Admin") || state.permissions.includes(permissionName);
    },
    
    logout: async () => {
        try {
            await logout();
        } catch (e) {
            console.error("Logout error", e);
        } finally {
           
            set({ auth: null, token: null, roles: [], permissions: [], error: null });
            localStorage.removeItem("auth-store");
        }
    }
}), {
    name: "auth-store",
    storage: createJSONStorage(() => localStorage),
}));

export const useAuth = () => {
    return useAuthStore((state: any) => state);
};