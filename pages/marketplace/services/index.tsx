import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {
    getCollectionCount,
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
    cartCount?: number;
}

const Services = ({ user, services, cartCount }: Props): JSX.Element => {
    return (
        <Marketplace
            pageName={'service'}
            user={user}
            items={services}
            initialCart={cartCount}
            sideBarLayout={serviceExtendedSidebarLayout}
        />
    );
};

export default Services;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const user = await getUserInfo(req, {});
    const services = await getItems<MarketplaceService>('service', 1, 'Popularity', []);
    const cartCount = 'props' in user ? await getCollectionCount('CART', { headers: { cookie: req.headers.cookie || '' } }) : undefined;

    return {
        props: {
            services,
            ...(user && 'props' in user ? user.props : undefined),
            ...(cartCount && { cartCount }),
        },
    };
};
