import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {
    Collection,
    getCollection,
    getItems,
    getUserInfo,
    Joined,
    Marketplace,
    MarketplaceProduct,
    productExtendedSidebarLayout,
    User,
} from '../../../components';

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
            sideBarLayout={productExtendedSidebarLayout}
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
    const cart = await getCollection('CART', { headers: { cookie: req.headers.cookie || '' } });

    return {
        props: {
            products,
            ...(user && 'props' in user ? user.props : undefined),
            wishlist: wishlist || { products: [], mines: [] },
            cart: cart || { products: [], mines: [] },
        },
    };
};
