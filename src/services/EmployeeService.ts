import axios from "src/auth/axios";
export const getEmployees = async () => {
    return axios.get('/employees', { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const getEmployee = async (id: any) => {
    return axios.get(`/employees/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const createEmployee = async (data: any) => {
    return axios.post(`/employees`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}

export const deleteEmployee = async (id: any) => {
    return axios.delete(`/employees/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const updateEmployee = async (data: any, id: any) => {
    return axios.post(`/employees/${id}`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then((response) => {
        return response.data
    })
}