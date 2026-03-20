import axios from 'src/auth/axios';

export const getAppointments = async () => {
    return axios.get('/appointments', { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const getAppointment = async (id: number) => {
    return axios.get(`/appointments/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const createAppointment = async (data: any) => {
    return axios.post('/appointments', data, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const updateAppointmentStatus = async (id: number, status: string) => {
    return axios.patch(`/appointments/${id}/status`, { status }, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}

export const deleteAppointment = async (id: number) => {
    return axios.delete(`/appointments/${id}`, { headers: { requiresAuth: true } }).then((response) => {
        return response.data
    })
}