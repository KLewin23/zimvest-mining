import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { Collection, getCollection, getItems, getUserInfo, Joined, Marketplace, MarketplaceVacancy, User } from '../../../components';

interface Props {
    user?: User;
    vacancies?: Joined<MarketplaceVacancy>[];
    cart?: Collection;
    wishlist?: Collection;
}

const Index = ({ user, vacancies, cart, wishlist }: Props): JSX.Element => (
    <Marketplace pageName={'vacancy'} user={user} items={vacancies} initialCart={cart} initialWishlist={wishlist} />
);
export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const user = await getUserInfo(req, null);
    const vacancies = await getItems<MarketplaceVacancy>('vacancy', 1, 'Popularity', []);
    const wishlist = await getCollection('WISHLIST', { headers: { cookie: req.headers.cookie || '' } }, 'vacancy');
    const cart = await getCollection('CART', { headers: { cookie: req.headers.cookie || '' } });

    return {
        props: {
            vacancies,
            ...(user && 'props' in user ? user.props : {}),
            wishlist: wishlist || [],
            cart: cart || [],
        },
    };
};

export default Index;
