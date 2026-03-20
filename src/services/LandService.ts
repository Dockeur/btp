import axios from 'src/auth/axios';
export const getLands = async () => {
    return axios.get('/lands', { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}
export const getLand = async (id: any) => {
    return axios.get(`/lands/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}
export const createLand = async (data: any) => {
    return axios.post('/lands', data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}

export const updateLand = async (data: any, id: any) => {
    return axios.post(`/lands/${id}`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}

export const deleteLand = async (id: any) => {
    return axios.delete(`/lands/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })  
}  
