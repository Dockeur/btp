import axios from 'src/auth/axios';

export const getAllOrderCustomers = async () => {
    return axios.get('/order-customers', { headers: { requiresAuth: true } }).then(r => r.data);
};

export const getMyOrders = async () => {
    return axios.get('/order-customers/my-orders', { headers: { requiresAuth: true } }).then(r => r.data);
};

export const getOrderCustomer = async (id: number | string) => {
    return axios.get(`/order-customers/${id}`, { headers: { requiresAuth: true } }).then(r => r.data);
};

export const createOrderCustomer = async (data: {
    phone_number: string;
    budget: number;
    localization: string;
    land_area?: number;
    description: string;
    type: 'land' | 'building' | string;
    purchase_time?: string;
    building_type?: string;
    number_of_apartments?: number;
    function?: string;
}) => {
    return axios.post('/order-customers', data, { headers: { requiresAuth: true } }).then(r => r.data);
};

export const deleteOrderCustomer = async (id: number | string) => {
    return axios.delete(`/order-customers/${id}`, { headers: { requiresAuth: true } }).then(r => r.data);
};