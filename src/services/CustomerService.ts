import axios from 'src/auth/axios';
export const getCustomers = async () => {
    return axios.get('/customers', { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const deleteCustomer = async (id: any) => {
    return axios.delete(`/customers/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const updateCustomer = async (data: any, id: any) => {
    return axios.post(`/customers/${id}`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}

export const createCustomer = async (data: any) => {
    return axios.post(`/customers`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}


export const getCustomer = async (id: any) => {
    return axios.get(`/customers/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}