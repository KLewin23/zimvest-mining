import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { getUserInfo, User } from '../../../components';
import Item from '../../../components/Item';
import { getItem } from '../../../components/utils';
import { BasicItemResponse } from '../../../components/types';

interface Props {
    user?: User;
    product: BasicItemResponse;
    cartCount?: number;
}

const MarketplaceMain = ({ user, product, cartCount }: Props): JSX.Element => {
    return <Item pageName={'product'} user={user} initialCartCount={cartCount} item={product} />;
};

export default MarketplaceMain;

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
    if (!query.id)
        return {
            redirect: {
                destination: '/marketplace/products',
                permanent: true,
            },
        };

    const id = parseInt(query.id as string, 10);

    const user = await getUserInfo(req, { props: {} });
    const product = await getItem(id, 'product');

    return {
        props: {
            ...(user && 'props' in user ? user.props : {}),
            product,
        },
    };
};
