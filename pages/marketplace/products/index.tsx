import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { Collection, Joined } from '../../../components/types';
import { getItems, getUserInfo, Marketplace, MarketplaceProduct, User } from '../../../components';
import { getWishlist } from '../../../components/utils';
import { extendedSidebarLayout } from '../../../components/data';

interface Props {
    user?: User;
    products: Joined<MarketplaceProduct>[];
    cartCount?: number;
    wishlist?: Collection;
}

const Products = ({ user, products, cartCount, wishlist }: Props): JSX.Element => {
    return (
        <Marketplace
            pageName={'product'}
            user={user}
            items={products}
            sideBarLayout={extendedSidebarLayout}
            cartCount={cartCount || 0}
            wishlist={wishlist}
        />
    );
};

export default Products;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const user = await getUserInfo(req, null);
    const products = await getItems<MarketplaceProduct>('product', 1, 'Popularity', []);
    const wishlist = await getWishlist({ headers: { cookie: req.headers.cookie || '' } }, 'product');

    return {
        props: {
            products,
            ...(user && 'props' in user ? user.props : {}),
            wishlist: wishlist || { products: [], mines: [] },
        },
    };
};
