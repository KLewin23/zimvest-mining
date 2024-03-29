import { IconType } from 'react-icons';
import { Redirect } from 'next/types';

export interface ProductSideBarValues {
    Machinery: {
        'Mining Drills': boolean;
        'Blasting Tools': boolean;
        'Earth Movers': boolean;
        'Crushing Equipment': boolean;
        'Screening Equipment': boolean;
    };
    Consumables: {
        Bearings: boolean;
        'Idler Rollers': boolean;
        Conveyors: boolean;
        'Drill bits': boolean;
        'Mining Horse': boolean;
        Valves: boolean;
        PPE: boolean;
        'Spare Parts': boolean;
        'Cable Hooks': boolean;
        'Other Service Providers': boolean;
    };
    Services: {
        'Mining Contractors': boolean;
        'Chemical Providers': boolean;
        Logistics: boolean;
        'Lab Testing Services': boolean;
        Telecommunications: boolean;
        'Banking and Insurance': boolean;
        'Screening Equipment Service': boolean;
        'Mining Equipment': boolean;
    };
    Metals: {
        'Base Metals': boolean;
        'Precious Metals': boolean;
        'Minor Metals': boolean;
        'Bulk Metals': boolean;
        'Semi Precious Stones': boolean;
        'Ferro Alloys': boolean;
        'Rare Earth': boolean;
    };
    Fertilizers: {
        Phosphate: boolean;
        Potash: boolean;
        Nitrogen: boolean;
        DAP: boolean;
        Map: boolean;
        SSP: boolean;
        TSP: boolean;
        Urea: boolean;
    };
}

export interface ItemSelectorTab {
    title: string;
    icon: IconType;
    subList: Array<string>;
    tabDefaultState?: boolean;
}

export type Role = 'ADMIN' | 'SUPER' | 'USER' | undefined;

export interface User {
    id: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    location?: string;
    facebook?: string;
    whatsapp?: string;
    twitter?: string;
    company_type?: string;
    company_name?: string;
    company_website?: string;
    preferred_currency?: string;
    is_service_provider?: boolean;
    is_investor?: boolean;
    image_id?: string;
    role?: Role;
    created_at?: string;
}

export type MarketplacePage = 'product' | 'mine' | 'service' | 'vacancy';

export interface MarketplaceProduct {
    id: number;
    title: string;
    category: string;
    sub_category: string;
    price: number;
    image_id?: string;
    description: string;
    views: number;
    reserved: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MarketplaceMine {
    id: number;
    title: string;
    image_id?: string;
    price: number;
    material: string;
}

export interface MarketplaceVacancy {
    id: number;
    title: string;
    salary: number;
    image_id: string;
}

export interface MarketplaceService {
    id: number;
    title: string;
    price: number;
    image_id: string;
}

export type MarketplaceType = MarketplaceProduct | MarketplaceMine | MarketplaceVacancy | MarketplaceService;

export type Joined<T extends MarketplaceType> = T & {
    supplier: Partial<User>;
};

export type ServerResponse<P> = { props: P } | { redirect: Redirect };

interface CollectionItem {
    id: number;
    title: string;
    price: number;
    image_id: string;
    supplier: {
        email: string;
    };
    Collection: {
        quantity: number;
    };
    itemType: MarketplacePage;
}

export type Collection = CollectionItem[];

export interface AccountFormValues {
    'First Name': string;
    'Last Name': string;
    Email: string;
    'Phone number': string;
    'Company Name': string;
    Location: string;
    'Facebook Url': string;
    'WhatsApp Number': string;
    'Twitter Handle': string;
    'Website Url': string;
}

export interface UserProductBasic {
    id: number;
    title: string;
    image_id: string;
    views: number;
}

export type UserProductPrice = UserProductBasic & {
    price: number;
};

export type UserProductSalary = UserProductBasic & {
    salary: number;
};

export type UserProducts = {
    products: UserProductPrice[];
    services: UserProductPrice[];
    mines: UserProductPrice[];
    vacancies: UserProductSalary[];
};

interface MineItem {
    material: string;
    address: string;
    location: string;
    country: string;
    hectares: number;
    registration_up_to_date: boolean;
    seeking_buyer: boolean;
    seeking_investor: boolean;
    image_id: string;
}

export type BasicItemResponse = {
    id: number;
    title: string;
    created_date: string;
    description: string;
    image_id: string;
    supplier: {
        phone_number: string;
        email: string;
        twitter?: string;
        facebook?: string;
        whatsapp?: string;
    };
} & ({ salary: number } | { price: number });

export type MineItemResponse = BasicItemResponse & MineItem;

export interface StrippedUser {
    id: number;
    name: string;
    email: string;
    role: 'SUPER' | 'ADMIN' | 'USER';
}

export interface UsersResult {
    users: StrippedUser[];
    pages: number;
}

export type ItemStripped = {
    id: number;
    title: string;
    views: number;
    value: number;
};

export interface ListingsResult {
    listings: ItemStripped[];
    pages: number;
}

export interface DbMessage {
    id: number;
    email: string;
    message: string;
    title: string;
    read: boolean;
    createdAt: string;
    modifiedAt: string;
}

export interface StrippedMessage {
    id: number;
    title: string;
    email: string;
    read: boolean;
}

export interface MessageResult {
    messages: StrippedMessage[];
    pages: number;
}
