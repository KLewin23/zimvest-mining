// eslint-disable-next-line import/prefer-default-export
import axios from 'axios';
import { useEffect, useState } from 'react';

export const userApiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'user-api.galacticnodes.com';
export const fetchUser = async (cookie: string) => axios.get(`${userApiUrl}/user`, { withCredentials: true, headers: { cookie } });

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
