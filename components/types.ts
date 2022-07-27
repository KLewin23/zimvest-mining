import { IconType } from 'react-icons';

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

export interface User {
    id: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    province?: string;
    district?: string;
    facebook?: string;
    whatsapp?: string;
    twitter?: string;
    companyType?: string;
    companyName?: string;
    companyWebsite?: string;
    preferredCurrency?: string;
    isServiceProvider?: boolean;
    isInvestor?: boolean;
    image?: string; // make string and pull url
    role?: string;
}

export interface Product {
    id: number;
    supplierId: number;
    name: number;
    category: string;
    sub_category: string;
    price: number;
    imageId?: number; // TODO change to the image url
    description: string;
    views: number;
    reserved: boolean;
    createdAt: string;
    updatedAt: string;
}

export type MarketplacePage = 'product' | 'mine' | 'service';

export type MarketplaceType = Product | Mine;

export type Request<T extends MarketplaceType> = T & {
    supplier: Partial<User>;
};

export interface Mine {
    id: number;
    name: number;
    price: number;
}
