import axios from "@/auth/axios"

export const getProducts = async () => {
    const response = await axios.get('/products', { headers: { requiresAuth: true } })
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


export const proposeLand = async (productId: number | string, landProductId: number | string) => {
    const response = await axios.post(
        `/products/${productId}/propose-land`,
        { land_product_id: landProductId },
        { headers: { requiresAuth: true } }
    )
    return response.data
}


export const proposeProperty = async (productId: number | string, propertyProductId: number | string) => {
    const response = await axios.post(
        `/products/${productId}/propose-property`,
        { property_product_id: propertyProductId },
        { headers: { requiresAuth: true } }
    )
    return response.data
}