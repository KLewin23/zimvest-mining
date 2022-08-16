import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {
    Collection,
    extendedSidebarLayout,
    getItems,
    getUserInfo,
    Joined,
    Marketplace,
    MarketplaceProduct,
    User,
} from '../../../components';
import { getCollection } from '../../../components/utils';

interface Props {
    user?: User;
    products: Joined<MarketplaceProduct>[];
    cart?: Collection;
    wishlist?: Collection;
}

const Products = ({ user, products, cart, wishlist }: Props): JSX.Element => {
    return (
        <Marketplace
            pageName={'product'}
            user={user}
            items={products}
            sideBarLayout={extendedSidebarLayout}
            initialCart={cart}
            initialWishlist={wishlist}
        />
    );
};

export default Products;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const user = await getUserInfo(req, {});
    const products = await getItems<MarketplaceProduct>('product', 1, 'Popularity', []);
    const wishlist = await getCollection('WISHLIST', { headers: { cookie: req.headers.cookie || '' } }, 'product');
    const cart = await getCollection('CART', { headers: { cookie: req.headers.cookie || '' } }, 'product');

    return {
        props: {
            products,
            ...(user && 'props' in user ? user.props : undefined),
            wishlist: wishlist || { products: [], mines: [] },
            cart: cart || { products: [], mines: [] },
        },
    };
};
