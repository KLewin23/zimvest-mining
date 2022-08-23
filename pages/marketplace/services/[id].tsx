import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { BasicItemResponse, getItem, getUserInfo, Item, User } from '../../../components';

interface Props {
    user?: User;
    service: BasicItemResponse;
    cartCount?: number;
}

const ServiceItem = ({ user, service, cartCount }: Props): JSX.Element => {
    return <Item pageName={'service'} user={user} initialCartCount={cartCount} item={service} />;
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

    const user = await getUserInfo(req, { props: {} });
    const service = await getItem(id, 'service');

    return {
        props: {
            ...(user && 'props' in user ? user.props : {}),
            service,
        },
    };
};
