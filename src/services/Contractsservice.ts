import axios from "src/auth/axios";


export type ContractType = "inscription" | "request_for_sales";

export interface Contract {
    id: number;
    title: string;
    type: ContractType;
    file_url: string;
    created_at: string;
    updated_at: string;
}


export const listContracts = async (): Promise<{ success: boolean; data: Contract[] }> => {
    return axios
        .get("admin/contracts", { headers: { requiresAuth: true } })
        .then((res) => res.data);
};


export const getContract = async (id: number): Promise<{ success: boolean; data: Contract }> => {
    return axios
        .get(`/contracts/${id}`, { headers: { requiresAuth: true } })
        .then((res) => res.data);
};


export const downloadContract = async (id: number): Promise<Blob> => {
    return axios
        .get(`/contracts/${id}/download`, {
            headers: { requiresAuth: true },
            responseType: "blob",
        })
        .then((res) => res.data);
};


export const adminCreateContract = async (
    title: string,
    file: File,
    type: ContractType = "request_for_sales"
): Promise<{ success: boolean; data: Contract }> => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("contract_file", file);
    formData.append("type", type);
    return axios
        .post("/admin/contracts", formData, {
            headers: { requiresAuth: true, "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
};


export const adminDeleteContract = async (id: number): Promise<{ success: boolean }> => {
    return axios
        .delete(`/admin/contracts/${id}`, { headers: { requiresAuth: true } })
        .then((res) => res.data);
};