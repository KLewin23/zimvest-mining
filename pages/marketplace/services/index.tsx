import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {
    Collection,
    getCollection,
    getItems,
    getUserInfo,
    Joined,
    Marketplace,
    MarketplaceService,
    serviceExtendedSidebarLayout,
    User,
} from '../../../components';

interface Props {
    user?: User;
    services: Joined<MarketplaceService>[];
    cart?: Collection;
    wishlist?: Collection;
}

const Services = ({ user, services, cart, wishlist }: Props): JSX.Element => {
    return (
        <Marketplace
            pageName={'service'}
            user={user}
            items={services}
            initialCart={cart}
            initialWishlist={wishlist}
            sideBarLayout={serviceExtendedSidebarLayout}
        />
    );
};

export default Services;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const user = await getUserInfo(req, {});
    const services = await getItems<MarketplaceService>('service', 1, 'Popularity', []);
    const wishlist = await getCollection('WISHLIST', { headers: { cookie: req.headers.cookie || '' } }, 'service');
    const cart = await getCollection('CART', { headers: { cookie: req.headers.cookie || '' } });

    return {
        props: {
            services,
            ...(user && 'props' in user ? user.props : undefined),
            wishlist: wishlist || [],
            cart: cart || [],
        },
    };
};
