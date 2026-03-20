import axios from 'src/auth/axios';

// URL de base pour les rendez-vous
const API_URL = "/appointments";

/**
 * Récupérer tous les rendez-vous
 */
export const getAppointments = async () => {
    return axios.get(API_URL, { headers: { requiresAuth: true } }).then((response) => {
        return response.data;
    });
}

/**
 * Récupérer un rendez-vous spécifique par son ID
 */
export const getAppointment = async (id: any) => {
    return axios.get(`${API_URL}/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data;
    });
}

/**
 * Créer un nouveau rendez-vous (Booking)
 * Utilisé pour la validation de la date et de l'heure
 */
export const createAppointment = async (data: any) => {
    return axios.post(API_URL, data, { 
        headers: { 
            requiresAuth: true, 
            'Content-Type': 'application/json' 
        } 
    }).then((response) => {
        return response.data;
    });
}

/**
 * Mettre à jour un rendez-vous existant
 */
export const updateAppointment = async (data: any, id: any) => {
    return axios.put(`${API_URL}/${id}`, data, { 
        headers: { 
            requiresAuth: true, 
            'Content-Type': 'application/json' 
        } 
    }).then((response) => {
        return response.data;
    });
}

/**
 * Supprimer ou annuler un rendez-vous
 */
export const deleteAppointment = async (id: any) => {
    return axios.delete(`${API_URL}/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data;
    });
}