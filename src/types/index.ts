export interface LandType {
    id: number;
    area: string;
    is_fragmentable: boolean;
    relief: string;
    description: string;
    location_id: number;
    created_at: Date;
    updated_at: Date;
    certificat_of_ownership: boolean;
    technical_doc: boolean;
    land_title: string;
    videoLink: string;
    images: string[];
    location: LocationType;
    fragments: FragmentType[];
}

export interface FragmentType { 
    id: number;
    area: string;
    land_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface AddressType {
    id: number;
    street: string;
    city: string;
    country: string;
    addressable_type: string;
    addressable_id: number;
    created_at: Date;
    updated_at: Date;
}
export interface PropertyType {
    id: number;
    title: string;
    build_area: string;
    field_area: string;
    type_name: string;
    levels: number;
    has_garden: boolean;
    parkings: number;
    number_of_salons: number;
    has_pool: boolean;
    basement_area: string;
    ground_floor_area: string;
    type: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    images: string[];
    accommodations: AccommodationType[];
    location: LocationType;
    retail_spaces: RetailSpaceType[];
}

export interface AccommodationType {
    id: number;
    reference: string;
    dining_room: number;
    kitchen: number;
    bath_room: number;
    bedroom: number;
    living_room: number;
    description: string;
    type: string;
    property_id: number;
    created_at: Date;
    updated_at: Date;
    images: string[];
}

export interface LocationType {
    id: number;
    coordinate_link: string;
    created_at: Date;
    updated_at: Date;
    address: AddressType;
}

export interface RetailSpaceType {
    id: number;
    area: string;
    type: string;
    created_at: Date;
    updated_at: Date;
    property_id: number;
    description: null;
    images: string[];
}

export interface ProductType {
    id: number;
    reference: string;
    for_rent: boolean;
    for_sale: boolean;
    unit_price: number;
    total_price: number;
    status: string;
    description: string | null;
    published_at: Date | null;
    productable_type: string;
    productable_id: number;
    created_at: Date;
    updated_at: Date;
    productable: any;
    proposed_products: any;
    video_lands: any;
}
