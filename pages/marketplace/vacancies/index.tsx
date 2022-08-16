import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getItems, getUserInfo, Joined, Marketplace, MarketplaceVacancy, User } from '../../../components';

interface Props {
    user?: User;
    vacancies?: Joined<MarketplaceVacancy>[];
}

const Index = ({ user, vacancies }: Props): JSX.Element => (
    <Marketplace pageName={'vacancy'} user={user} items={vacancies} initialCart={{ products: [], mines: [] }} />
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
