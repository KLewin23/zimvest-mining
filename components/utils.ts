import axios, { AxiosRequestConfig } from 'axios';
import { IncomingMessage } from 'http';
import type { BasicItemResponse, Collection, Joined, MarketplacePage, MarketplaceType, MineItemResponse, User } from './types';
import { ServerResponse, UserProducts } from './types';

export const userApiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:80' : 'https://api.zimvestmining.com';
export const fetchUser = async (cookie?: string) =>
    axios.get(`${userApiUrl}/user`, { withCredentials: true, ...(cookie && { headers: { cookie } }) });

export const getItems = async <T extends MarketplaceType>(
    item: MarketplacePage,
    page: number,
    sort: string,
    filters: string[],
): Promise<Joined<T>[]> => {
    return axios
        .get(`${userApiUrl}/listing/${item}`, { params: { sort, page, categories: filters } })
        .then(res => res.data)
        .catch(() => null);
};

export const getItem = async (id: number, item: MarketplacePage): Promise<MineItemResponse | BasicItemResponse> => {
    return axios
        .get(`${userApiUrl}/listing/${item}/${id}`)
        .then(res => res.data)
        .catch(() => null);
};

export const getUserInfo = <T>(
    req: IncomingMessage,
    errorAction: ServerResponse<{ user: User }> | T,
): Promise<ServerResponse<{ user: User }> | T> => {
    return fetchUser(req.headers.cookie || '')
        .then(async user => {
            if (!user.data) {
                return errorAction;
            }
            return { props: { user: user.data as User } };
        })
        .catch(() => {
            return errorAction;
        });
};

export const getCollection = async (
    collection: 'WISHLIST' | 'CART',
    config?: Partial<AxiosRequestConfig>,
    filterItem?: MarketplacePage,
): Promise<Collection | null> =>
    axios
        .get(`${userApiUrl}/collection/${collection}/${filterItem || ''}`, { withCredentials: true, ...config })
        .then(r => r.data)
        .catch(() => null);

export const getProducts = async (config?: Partial<AxiosRequestConfig>): Promise<UserProducts> =>
    (await axios.get(`${userApiUrl}/user/products`, { withCredentials: true, ...config })).data;

export const getCollectionCount = async (collection: 'CART' | 'WISHLIST', config?: Partial<AxiosRequestConfig>): Promise<number> =>
    (await axios.get(`${userApiUrl}/collection/count/${collection}`, { withCredentials: true, ...config })).data.count;

const normalizeSrc = (src: string) => {
    return src.startsWith('/') ? src.slice(1) : src;
};

export const cloudflareLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    const params = [`width=${width}`];
    if (quality) {
        params.push(`quality=${quality}`);
    }
    const paramsString = params.join(',');
    return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
};

export const getInCart = async (pageName: 'product' | 'mine', id: number, config?: Partial<AxiosRequestConfig>) =>
    (await axios.get(`${userApiUrl}/collection/cart/count/${pageName}/${id}`, { withCredentials: true, ...config })).data;

export const defaultCollection = { products: [], mines: [], services: [], vacancies: [] };
