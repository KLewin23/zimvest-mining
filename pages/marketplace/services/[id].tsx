import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { BasicItemResponse, Collection, getCollection, getInCart, getItem, getUserInfo, Item, User } from '../../../components';

interface Props {
    user?: User;
    service: BasicItemResponse;
    wishlist?: Collection;
    servicesInCart?: Collection;
}

const ServiceItem = ({ user, service, servicesInCart, wishlist }: Props): JSX.Element => {
    return (
        <Item pageName={'service'} user={user} initialItemsInCart={servicesInCart?.length || 0} item={service} initialWishlist={wishlist} />
    );
};

export default ServiceItem;

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
    if (!query.id)
        return {
            redirect: {
                destination: '/marketplace/services',
                permanent: true,
            },
        };

    const id = parseInt(query.id as string, 10);

    const user = await getUserInfo(req, null);
    const service = await getItem(id, 'service');
    if (!user)
        return {
            props: {
                service,
            },
        };
    const wishlist = await getCollection('WISHLIST', { headers: { cookie: req.headers.cookie || '' } }, 'service');
    const servicesInCart = await getInCart('service', id, { headers: { cookie: req.headers.cookie || '' } });

    return {
        props: {
            ...(user && 'props' in user ? user.props : {}),
            service,
            wishlist,
            servicesInCart,
        },
    };
};
