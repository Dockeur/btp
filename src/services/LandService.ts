import axios from 'src/auth/axios';

export const getLands = async () => {
    return axios.get('/lands', { headers: { requiresAuth: true } }).then(r => r.data);
};

export const getLand = async (id: any) => {
    return axios.get(`/lands/${id}`, { headers: { requiresAuth: true } }).then(r => r.data);
};

export const createLand = async (data: any) => {
    return axios.post('/lands', data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};

export const updateLand = async (data: any, id: any) => {
    return axios.post(`/lands/${id}`, data, { headers: { requiresAuth: true, 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};

export const deleteLand = async (id: any) => {
    return axios.delete(`/lands/${id}`, { headers: { requiresAuth: true } }).then(r => r.data);
};

export const landInvestmentAnalysis = async (productId: number | string, data: {
    area: number;
    growth_in_market_value: number;
    number_conservation_years: number;
}) => {
    return axios.post(`/products/${productId}/land-investment-analysis`, data, { headers: { requiresAuth: true } }).then(r => r.data);
};

export const getPaymentPlan = async (data: {
    product_id: number | string;
    purchase_duration: number;
    standing: 'high' | 'medium' | 'low';
}) => {
    return axios.post('/products/payment-plan', data, { headers: { requiresAuth: true } }).then(r => r.data);
};