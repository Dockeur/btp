import axios from "src/auth/axios";

export const login = async (data: any) => {
    return axios.post("/login", JSON.stringify(data)).then((res) => res.data);
};
export const logout = async () => {
    return axios.post("/logout", null, { headers: { requiresAuth: true } }).then((res) => res.data);
};
export const register = async (data: any) => {
    return axios.post("/register", JSON.stringify(data)).then((res) => res.data);
};
export const sendCode = async (data: any) => {
    return axios.post("/resend-code", JSON.stringify(data)).then((res) => res.data);
};
export const validateUser = async (data: any) => {
    return axios.post("/activate-account", JSON.stringify(data), { headers: { requiresAuth: true } }).then((res) => res.data);
};
export const getCurrentUser = async () => {
    return axios.get("/current", { headers: { requiresAuth: true } }).then((res) => res.data);
};
export const getResetCode = async (data: any) => {
    return axios.post("/get-reset-code", JSON.stringify(data)).then((res) => res.data);
};
export const verifyResetCode = async (data: any) => {
    return axios.post("/verify-reset-code", JSON.stringify(data)).then((res) => res.data);
};
export const resetPassword = async (data: any) => {
    return axios.post("/reset-password", JSON.stringify(data)).then((res) => res.data);
};
export const updateProfile = async (data: any) => {
    return axios.post("/update-profile", data, {
        headers: { requiresAuth: true, "Content-Type": "multipart/form-data" },
    }).then((res) => res.data);
};
export const changePassword = async (data: any) => {
    return axios.post("/change-password", JSON.stringify(data), { headers: { requiresAuth: true } }).then((res) => res.data);
};

// ─── Google OAuth ─────────────────────────────────────────────────────────────

/**
 *  FIX URL : lit VITE_API_BASE_URL avec fallback explicite.
 * Dans votre .env :
 *   VITE_API_BASE_URL=http://localhost:8000
 *   VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
 */
const getApiBaseUrl = (): string => {
    const url = import.meta.env.VITE_BACKEND_URL;
    if (!url) {
        console.warn("[AuthService] VITE_BACKEND_URL non défini dans .env");
        return "http://localhost:8000";
    }
    return url.replace(/\/api\/?$/, "").replace(/\/$/, "");
};

/**
 * Redirige vers le backend Google OAuth.
 * Résultat : http://localhost:8000/api/auth/google
 */
export const redirectToGoogleAuth = () => {
    window.location.href = `${getApiBaseUrl()}/api/auth/google`;
};

/**
 * Envoie le credential Google One Tap (JWT Google) au backend /api/auth/verify.
 * Le backend doit accepter ce JWT Google et retourner { success, user }.
 */
export const verifyGoogleCredential = async (googleCredential: string) => {
    return axios.get("/auth/verify", {
        headers: { Authorization: `Bearer ${googleCredential}` },
    }).then((res) => res.data as {
        success: boolean;
        user: { id: number; email: string; role: string };
    });
};

/**
 * Vérifie un token backend reçu après le callback OAuth redirect (?token=xxx).
 */
export const verifyBackendToken = async (token: string) => {
    return axios.get("/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.data as {
        success: boolean;
        data: {
            token: string;
            user: {
                id: number;
                email: string;
                roles: { name: string }[];
                all_permissions: { name: string }[];
            };
        };
    });
};