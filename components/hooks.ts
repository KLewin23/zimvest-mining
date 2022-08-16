import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { getCollection, userApiUrl } from './utils';
import { Collection, MarketplacePage } from './types';

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

// export const useCartCount = (pageName: string, initialCartCount: number) =>
//     useQuery<number>(
//         [`${pageName}-CartCount`],
//         async () => (await axios.get(`${userApiUrl}/collection/count/CART`, { withCredentials: true })).data.count,
//         {
//             initialData: initialCartCount,
//         },
//     );

export const useGetWishlist = (pageName: MarketplacePage, initialWishlist?: Collection) =>
    useQuery<Collection | null>(
        [`${pageName}-Wishlist`],
        async () => (await getCollection('WISHLIST', {}, pageName)) || { products: [], mines: [] },
        {
            ...(initialWishlist && { initialData: initialWishlist }),
        },
    );

export const useWishlist = (pageName: MarketplacePage, initialWishlist?: Collection) => {
    const wishlist = useGetWishlist('product', initialWishlist);

    const addToWishlist = useMutation(
        (id: number) => axios.post(`${userApiUrl}/collection/WISHLIST/${pageName}?id=${id}`, {}, { withCredentials: true }),
        { onSuccess: () => wishlist.refetch() },
    );

    const removeFromWishlist = useMutation(
        (id: number) => axios.put(`${userApiUrl}/collection/remove/WISHLIST/${pageName}?id=${id}`, {}, { withCredentials: true }),
        { onSuccess: () => wishlist.refetch() },
    );

    return { wishlist: wishlist.data, addToWishlist, removeFromWishlist };
};

export const useCartCount = (pageName: MarketplacePage, initialCartCount: number, onAction?: () => void) => {
    const { data: cartCount, refetch: reFetchCartCount } = useQuery<number>(
        [`${pageName}-CartCount`],
        async () => {
            return (await axios.get(`${userApiUrl}/collection/count/CART`, { withCredentials: true })).data.count;
        },
        {
            initialData: initialCartCount,
        },
    );

    const addToCart = useMutation(
        (id: number) => axios.post(`${userApiUrl}/collection/CART/${pageName}?id=${id}`, {}, { withCredentials: true }),
        {
            onSuccess: async () => {
                await reFetchCartCount();
                if (!onAction) return;
                onAction();
            },
        },
    );
    const removeFromCart = useMutation(
        (id: number) => axios.put(`${userApiUrl}/collection/remove/CART/${pageName}?id=${id}`, {}, { withCredentials: true }),
        {
            onSuccess: async () => {
                await reFetchCartCount();
                if (!onAction) return;
                onAction();
            },
        },
    );
    return { cartCount, addToCart, removeFromCart };
};

export const useCart = (pageName: MarketplacePage, initialCart?: Collection) => {
    const { data: cart, refetch } = useQuery<Collection>(
        [`${pageName}-Cart`],
        async () => (await getCollection('CART', {}, pageName)) || { products: [], mines: [] },
        { initialData: initialCart },
    );
    const { cartCount, addToCart, removeFromCart } = useCartCount(
        pageName,
        (initialCart?.products.length || 0) + (initialCart?.mines.length || 0),
        () => refetch(),
    );

    return { cart, addToCart, removeFromCart, cartCount };
};

// : { mutate: (id: number, {onSuccess}) => addToCart.mutate(id, { onSuccess: () => refetch() }) }
