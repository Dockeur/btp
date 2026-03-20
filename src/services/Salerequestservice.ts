import axios from "src/auth/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SaleRequestType   = "property" | "land";
export type SaleRequestStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface PropertyData {
    product_id?: number;
    area?: number;
    numberOfRoom?: number;
    numberOfToilet?: number;
}

export interface LandData {
    product_id?: number;
    area?: number;
    is_fragmentable?: boolean;
    relief?: string;
    land_title?: string;
    certificat_of_ownership?: boolean;
    technical_doc?: boolean;
}

export interface AddressData {
    country?: string;
    city?: string;
    street?: string;
}

export interface CreateSaleRequestPayload {
    description: string;
    type: SaleRequestType;
    has_validated_contrat: boolean;   // ← obligatoire, doit être true
    property_data?: PropertyData;
    land_data?: LandData;
    address?: AddressData;
    kml_file?: File | null;
    photos?: File[];
}

export interface SaleRequest {
    id: number;
    description: string;
    type: SaleRequestType;
    status: SaleRequestStatus;
    has_validated_contrat: boolean;
    property_data?: PropertyData;
    land_data?: LandData;
    address?: AddressData;
    photos?: { id: number; url: string }[];
    created_at: string;
    updated_at: string;
}

export interface AdminListPayload {
    status?: SaleRequestStatus;
    type?: SaleRequestType;
    has_validated_contrat?: boolean;
    perPage?: number;
    page?: number;
}

// ─── Client endpoints ─────────────────────────────────────────────────────────

export const createSaleRequest = async (payload: CreateSaleRequestPayload) => {
    const formData = new FormData();

    formData.append("description",          payload.description);
    formData.append("type",                 payload.type);
    formData.append("has_validated_contrat", payload.has_validated_contrat ? "1" : "0");

    // ── Property data ──────────────────────────────────────────────────────
    if (payload.type === "property" && payload.property_data) {
        const pd = payload.property_data;
        if (pd.product_id     !== undefined) formData.append("property_data[product_id]",    String(pd.product_id));
        if (pd.area           !== undefined) formData.append("property_data[area]",           String(pd.area));
        if (pd.numberOfRoom   !== undefined) formData.append("property_data[numberOfRoom]",   String(pd.numberOfRoom));
        if (pd.numberOfToilet !== undefined) formData.append("property_data[numberOfToilet]", String(pd.numberOfToilet));
    }

    // ── Land data ──────────────────────────────────────────────────────────
    if (payload.type === "land" && payload.land_data) {
        const ld = payload.land_data;
        if (ld.product_id              !== undefined) formData.append("land_data[product_id]",              String(ld.product_id));
        if (ld.area                    !== undefined) formData.append("land_data[area]",                    String(ld.area));
        if (ld.is_fragmentable         !== undefined) formData.append("land_data[is_fragmentable]",         ld.is_fragmentable ? "1" : "0");
        if (ld.relief      !== undefined && ld.relief      !== "") formData.append("land_data[relief]",     ld.relief);
        if (ld.land_title  !== undefined && ld.land_title  !== "") formData.append("land_data[land_title]", ld.land_title);
        if (ld.certificat_of_ownership !== undefined) formData.append("land_data[certificat_of_ownership]", ld.certificat_of_ownership ? "1" : "0");
        if (ld.technical_doc           !== undefined) formData.append("land_data[technical_doc]",           ld.technical_doc ? "1" : "0");
    }

    // ── Address ────────────────────────────────────────────────────────────
    if (payload.address) {
        const a = payload.address;
        if (a.country !== undefined && a.country !== "") formData.append("address[country]", a.country);
        if (a.city    !== undefined && a.city    !== "") formData.append("address[city]",    a.city);
        if (a.street  !== undefined && a.street  !== "") formData.append("address[street]",  a.street);
    }

    // ── KML file ───────────────────────────────────────────────────────────
    if (payload.kml_file) {
        formData.append("kml_file", payload.kml_file);
    }

    // ── Photos (max 10) ────────────────────────────────────────────────────
    if (payload.photos?.length) {
        payload.photos.forEach((file) => formData.append("photos[]", file));
    }

    return axios
        .post("/request-for-sales", formData, {
            headers: { requiresAuth: true, "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data);
};

export const getMySaleRequests = async (): Promise<{ success: boolean; data: SaleRequest[] }> => {
    return axios
        .get("/request-for-sales/my-requests", { headers: { requiresAuth: true } })
        .then((res) => res.data);
};

export const deleteSaleRequest = async (id: number) => {
    return axios
        .delete(`/request-for-sales/${id}`, { headers: { requiresAuth: true } })
        .then((res) => res.data);
};

export const adminListSaleRequests = async (payload: AdminListPayload = {}) => {
    return axios
        .post("/admin/request-for-sales", payload, { headers: { requiresAuth: true } })
        .then((res) => res.data);
};

export const adminUpdateSaleRequestStatus = async (id: number, status: SaleRequestStatus) => {
    return axios
        .patch(`/admin/request-for-sales/${id}/status`, { status }, { headers: { requiresAuth: true } })
        .then((res) => res.data);
};