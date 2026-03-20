import axios from 'src/auth/axios';
export const getRoles = async () => {
    return axios.get("/roles", { headers: { requiresAuth: true } }).then((response) => {
        return response.data;
    });
}

export const getRole = async (id: any) => {
    return axios.get(`/roles/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const createRole = async (data: any) => {
    return axios.post(`/roles`, data, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const updateRole = async (data: any, id: any) => {
    return axios.put(`/roles/${id}`, data, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const deleteRole = async (id: any) => {
    return axios.delete(`/roles/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const getPermissions = async () => {
    return axios.get("/permissions", { headers: { requiresAuth: true } }).then((response) => {
        return response.data;
    });
}