import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getItems, getUserInfo, Marketplace, User } from '../../../components';
import { Joined, MarketplaceVacancy } from '../../../components/types';

interface Props {
    user?: User;
    cartCount?: number;
    vacancies?: Joined<MarketplaceVacancy>[];
}

const Index = ({ user, vacancies, cartCount }: Props): JSX.Element => (
    <Marketplace pageName={'vacancy'} user={user} items={vacancies} cartCount={cartCount || 0} />
);
export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const user = await getUserInfo(req, null);
    const vacancies = await getItems<MarketplaceVacancy>('vacancy', 1, 'Popularity', []);

    return {
        props: {
            vacancies,
            ...(user && 'props' in user ? user.props : {}),
        },
    };
};

export default Index;
