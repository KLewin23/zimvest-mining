import axios from 'axios';
import { useEffect, useState } from 'react';
import { IncomingMessage } from 'http';
import { GetServerSidePropsResult } from 'next/types';
import { IconType } from 'react-icons';

export const userApiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'http://zimvestmining.com:4000';
export const fetchUser = async (cookie: string) => axios.get(`${userApiUrl}/user`, { withCredentials: true, headers: { cookie } });

export const getProducts = async () => axios.get(`${userApiUrl}/product`, { params: { sort: 'Popularity' } }).then(res => res.data);

export const useEventListener = <K extends keyof WindowEventMap>(eventName: K, callback: (event: WindowEventMap[K]) => void): void => {
    useEffect(() => {
        window.addEventListener(eventName, callback);
        return () => {
            window.removeEventListener(eventName, callback);
        };
    }, [callback, eventName]);
};

export const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(0);
    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowWidth;
};

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

export const getUser = <T>(req: IncomingMessage, errorAction: GetServerSidePropsResult<T>) => {
    return fetchUser(req.headers.cookie || '')
        .then(user => {
            if (!user.data) {
                return {
                    ...errorAction,
                };
            }
            return {
                props: { user: user.data },
            };
        })
        .catch(e => {
            if (e.response.status === 403) {
                return {
                    ...errorAction,
                };
            }
            return {
                props: {},
            };
        });
};

export interface SideBarFormValues {
    'Mining Drills': boolean;
    'Blasting Tools': boolean;
    'Earth Movers': boolean;
    'Crushing Equipment': boolean;
    'Screening Equipment': boolean;
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
    'Mining Contractors': boolean;
    'Chemical Providers': boolean;
    Logistics: boolean;
    'Lab Testing Services': boolean;
    Telecommunications: boolean;
    'Banking and Insurance': boolean;
    'Screening Equipment Service': boolean;
    'Mining Equipment': boolean;
    'Base Metals': boolean;
    'Precious Metals': boolean;
    'Minor Metals': boolean;
    'Bulk Metals': boolean;
    'Semi Precious Stones': boolean;
    'Ferro Alloys': boolean;
    'Rare Earth': boolean;
    Phosphate: boolean;
    Potash: boolean;
    Nitrogen: boolean;
    DAP: boolean;
    Map: boolean;
    SSP: boolean;
    TSP: boolean;
    Urea: boolean;
}

export interface ItemSelectorTab {
    title: string;
    icon: IconType;
    subList: Array<string>;
    tabDefaultState?: boolean;
}
