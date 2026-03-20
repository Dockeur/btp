import axios from 'src/auth/axios';
export const getAccommodations = async () => {
    return axios.get("/accommodations", { headers: { requiresAuth: true } }).then((response) => {
        return response.data;
    });
}


export const getAccommodation = async (id: any) => {
    return axios.get(`/accommodations/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}


export const createAccommodation = async (data: any) => {
    return axios.post(`/accommodations`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}


export const updateAccommodation = async (data: any, id: any) => {
    return axios.post(`/accommodations/${id}`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}


export const deleteAccommodation = async (id: any) => {
    return axios.delete(`/accommodations/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}