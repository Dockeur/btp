import axios from "@/auth/axios"

export const getProducts = async () => {
    console.log("Fetching products");
    const response = await axios.get('/products', { headers: { requiresAuth: true } })
    console.log("Response received", response);
    return response.data
}

export const getProduct = async (id: any) => {
    const response = await axios.get(`/products/${id}`, { headers: { requiresAuth: true } })
    return response.data
}

export const createProduct = async (data: any) => {
    const response = await axios.post('/products', data, { headers: { requiresAuth: true } })
    return response.data
}

export const updateProduct = async (data: any, id: any) => {
    const response = await axios.put(`/products/${id}`, data, { headers: { requiresAuth: true } })
    return response.data
}

export const deleteProduct = async (id: any) => {
    const response = await axios.delete(`/products/${id}`, { headers: { requiresAuth: true } })
    return response.data
}