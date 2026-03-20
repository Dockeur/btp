import axios from 'src/auth/axios';

export const getProperties = async () => {
    return axios.get("/properties", { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const getProperty = async (id: any) => {
    return axios.get(`/properties/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const getBuildingParts = async (propertyId: any) => {
    return axios.get(`/properties/${propertyId}/parts`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const getBuildingFinance = async (propertyId: any) => {
    return axios.get(`/properties/${propertyId}/finance`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

// ✅ AJOUT: Récupérer l'investissement d'un immeuble
export const getBuildingInvestment = async (propertyId: any) => {
    return axios.get(`/properties/${propertyId}/building-investments`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

// ✅ NOUVEAU: Récupérer les ratios d'exploitation
export const getOperatingRatios = async (propertyId: any) => {
    return axios.get(`/properties/${propertyId}/operating-ratios`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const createBuildingPart = async (propertyId: any, data: any) => {
    return axios.post(`/properties/${propertyId}/parts`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}

// ✅ CORRECTION: Content-Type en application/json car on envoie du JSON simple
export const createBuildingInvestment = async (propertyId: any, data: any) => {
    return axios.post(`/properties/${propertyId}/building-investments`, data, { 
        headers: { 
            requiresAuth: true, 
            'Content-Type': 'application/json' 
        } 
    }).then((response) => {
        return response.data
    })
}

// ✅ NOUVEAU: Créer un ratio d'exploitation
export const createOperatingRatio = async (propertyId: any, data: any) => {
    return axios.post(`/properties/${propertyId}/operating-ratios`, data, { 
        headers: { 
            requiresAuth: true, 
            'Content-Type': 'application/json' 
        } 
    }).then((response) => {
        return response.data
    })
}

// ✅ AJOUT: Mettre à jour l'investissement d'un immeuble
export const updateBuildingInvestment = async (data: any, propertyId: any) => {
    return axios.put(`/properties/${propertyId}/building-investments`, data, { 
        headers: { 
            requiresAuth: true, 
            'Content-Type': 'application/json' 
        } 
    }).then((response) => {
        return response.data
    })
}

// ✅ NOUVEAU: Mettre à jour un ratio d'exploitation
export const updateOperatingRatio = async (propertyId: any, ratioId: any, data: any) => {
    return axios.put(`/properties/${propertyId}/operating-ratios/${ratioId}`, data, { 
        headers: { 
            requiresAuth: true, 
            'Content-Type': 'application/json' 
        } 
    }).then((response) => {
        return response.data
    })
}

export const updateBuildingPart = async (propertyId: any, partId: any, data: any) => {
    return axios.post(`/properties/${propertyId}/parts/${partId}`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}

export const deleteBuildingPart = async (propertyId: any, partId: any) => {
    return axios.delete(`/properties/${propertyId}/parts/${partId}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

// ✅ NOUVEAU: Supprimer un ratio d'exploitation
export const deleteOperatingRatio = async (propertyId: any, ratioId: any) => {
    return axios.delete(`/properties/${propertyId}/operating-ratios/${ratioId}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const updateBuildingFinance = async (data: any, id: any) => {
    return axios.post(`/properties/${id}/building-finance`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}

export const updateProperty = async (data: any, id: any) => {
    return axios.post(`/properties/${id}`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}

export const createProperty = async (data: any) => {
    return axios.post(`/properties`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}

export const deleteProperty = async (id: any) => {
    return axios.delete(`/properties/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}