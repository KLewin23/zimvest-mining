import { useQuery } from 'react-query';
import axios, { AxiosRequestConfig } from 'axios';
import { IncomingMessage } from 'http';
import type { BasicItemResponse, Collection, Joined, MarketplacePage, MarketplaceType, MineItemResponse, User } from './types';
import { ServerResponse, UserInfo, UserProducts } from './types';

export const userApiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:80' : 'https://api.zimvestmining.com';
export const fetchUser = async (cookie: string) => axios.get(`${userApiUrl}/user`, { withCredentials: true, headers: { cookie } });

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

export const getUserInfo = <T>(req: IncomingMessage, errorAction: ServerResponse<UserInfo> | T): Promise<ServerResponse<UserInfo> | T> => {
    return fetchUser(req.headers.cookie || '')
        .then(async user => {
            if (!user.data) {
                return errorAction;
            }
            const cartCount = await axios.get(`${userApiUrl}/collection/count/CART`, {
                withCredentials: true,
                headers: { cookie: req.headers.cookie || '' },
            });
            return { props: { user: user.data as User, cartCount: cartCount.data.count as number } };
        })
        .catch(() => {
            return errorAction;
        });
};

export const getCart = async (config?: Partial<AxiosRequestConfig>): Promise<Collection> =>
    (await axios.get(`${userApiUrl}/collection/CART`, { withCredentials: true, ...config })).data;

export const getWishlist = async (config?: Partial<AxiosRequestConfig>, filterItem?: MarketplacePage): Promise<Collection | null> =>
    axios
        .get(`${userApiUrl}/collection/WISHLIST${filterItem ? `?id=${filterItem}` : ''}`, { withCredentials: true, ...config })
        .then(r => r.data)
        .catch(() => null);

export const getProducts = async (config?: Partial<AxiosRequestConfig>): Promise<UserProducts> =>
    (await axios.get(`${userApiUrl}/user/products`, { withCredentials: true, ...config })).data;

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

export const useCartCount = (pageName: string, initialCartCount: number) =>
    useQuery<number>(
        [`${pageName}-CartCount`],
        async () => (await axios.get(`${userApiUrl}/collection/count/CART`, { withCredentials: true })).data.count,
        {
            initialData: initialCartCount,
        },
    );
