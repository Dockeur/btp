// src/services/publicProjectsService.ts
import axios from 'src/auth/axios';

export const getPublicProjects = async () => {
    const response = await axios.get("/public/projects", { 
        headers: { requiresAuth: false }
    });
    // Extraire les données selon la structure de l'API
    return response.data.data || response.data;
};

export const getPublicProject = async (id: number | string) => {
    const response = await axios.get(`/public/projects/${id}`, { 
        headers: { requiresAuth: false }
    });
    // Extraire les données selon la structure de l'API
    return response.data.data || response.data;
};

export default {
    getPublicProjects,
    getPublicProject
};