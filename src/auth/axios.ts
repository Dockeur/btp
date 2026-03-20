import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Interface pour la configuration personnalisée
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Créer l'instance Axios
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 30000, // 30 secondes
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // withCredentials: true,
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Récupérer le token depuis le store
 */
const getAuthToken = (): string | null => {
    try {
        const store = JSON.parse(localStorage.getItem("auth-store") as string);
        return store?.state?.token || null;
    } catch (error) {
        return null;
    }
};

/**
 * Récupérer la langue actuelle
 */
const getCurrentLanguage = (): string => {
    try {
        // Priorité 1: localStorage direct
        const language = localStorage.getItem('language');
        if (language) return language;

        // Priorité 2: Store Zustand
        const languageStore = localStorage.getItem("language-store");
        if (languageStore) {
            const parsed = JSON.parse(languageStore);
            return parsed?.state?.language || 'fr';
        }

        // Défaut
        return 'fr';
    } catch (error) {
        return 'fr';
    }
};

// ==================== INTERCEPTEUR DE REQUÊTE ====================
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 1. AJOUTER LE TOKEN (AUTOMATIQUE)
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 2. AJOUTER LA LANGUE UNIQUEMENT POUR LES REQUÊTES GET
        const isGetRequest = config.method?.toUpperCase() === 'GET';
        
        if (isGetRequest) {
            const language = getCurrentLanguage();
            
            // Ajouter le header Accept-Language
            config.headers['Accept-Language'] = language;

            // Ajouter comme paramètre
            config.params = {
                ...config.params,
                lang: language,
            };
        }

        // 3. LOGGER EN MODE DÉVELOPPEMENT
        if (import.meta.env.DEV) {
            console.log('🚀 API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                headers: {
                    Authorization: config.headers.Authorization ? '✓ Token présent' : '✗ Pas de token',
                    'Accept-Language': config.headers['Accept-Language'] || '✗ Non défini',
                },
                params: config.params,
            });
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// ==================== INTERCEPTEUR DE RÉPONSE ====================
axiosInstance.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log('✅ API Response:', {
                status: response.status,
                url: response.config.url,
            });
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // GESTION DES ERREURS 401 (Non autorisé)
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            // Tentative de refresh du token ou redirection
            console.error('🚫 Non autorisé - Redirection vers login');
            localStorage.removeItem("auth-store");
            window.location.href = '/login';
            
            return Promise.reject(error);
        }

        // Logger les erreurs
        if (import.meta.env.DEV) {
            console.error('❌ API Error:', {
                status: error.response?.status,
                url: error.config?.url,
                message: error.message,
            });
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;