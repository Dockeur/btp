import axios from 'src/auth/axios';


export const getOrders = async () => {
    return axios.get('/orders', { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}


export const getOrder = async (id: any) => {
    return axios.get(`/orders/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}


export const createOrder = async (data: any) => {
    return axios.post('/orders', data, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}


export const updateOrder = async (data: any, id: any) => {
    return axios.put(`/orders/${id}`, data, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}


export const deleteOrder = async (id: any) => {
    return axios.delete(`/orders/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}