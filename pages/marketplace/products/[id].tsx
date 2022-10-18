import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { BasicItemResponse, Collection, getInCart, getItem, getUserInfo, Item, User } from '../../../components';
import { getCollection } from '../../../components/utils';

interface Props {
    user?: User;
    product: BasicItemResponse;
    cartCount?: number;
    wishlist?: Collection;
    productsInCart?: number;
}

const ProductItem = ({ user, product, cartCount, wishlist, productsInCart }: Props): JSX.Element => {
    return (
        <Item
            pageName={'product'}
            user={user}
            initialCartCount={cartCount}
            initialItemsInCart={productsInCart}
            initialWishlist={wishlist}
            item={product}
        />
    );
};

export default ProductItem;

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
    if (!query.id)
        return {
            redirect: {
                destination: '/marketplace/products',
                permanent: true,
            },
        };

    const id = parseInt(query.id as string, 10);

    const user = await getUserInfo(req, null);
    const product = await getItem(id, 'product');

    if (!user)
        return {
            props: {
                product,
            },
        };

    const wishlist = await getCollection('WISHLIST', { headers: { cookie: req.headers.cookie || '' } }, 'product');
    const productsInCart = await getInCart('product', id, { headers: { cookie: req.headers.cookie || '' } });

    return {
        props: {
            ...(user && 'props' in user ? user.props : {}),
            product,
            wishlist,
            productsInCart: productsInCart.count,
        },
    };
};
