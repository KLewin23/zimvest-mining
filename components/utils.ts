import axios from 'axios';
import { IncomingMessage } from 'http';
import { GetServerSidePropsResult } from 'next/types';
import type { MarketplacePage } from './types';

export const userApiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:80' : 'https://api.zimvestmining.com';
export const fetchUser = async (cookie: string) => axios.get(`${userApiUrl}/user`, { withCredentials: true, headers: { cookie } });

export const getItems = async (item: MarketplacePage, page: number, sort: string, filters: string[]) => {
    return axios
        .get(`${userApiUrl}/${item}`, { params: { sort, page, categories: filters } })
        .then(res => res.data)
        .catch(() => null);
};

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
