import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { FaHive } from 'react-icons/fa';
import { Collection, Joined, MarketplaceMine } from '../../../components/types';
import { getItems, getUserInfo, ItemSelectorTab, Marketplace, User } from '../../../components';
import { getWishlist } from '../../../components/utils';

interface Props {
    user?: User;
    mines?: Joined<MarketplaceMine>[];
    cartCount?: number;
    wishlist?: Collection;
}

const sidebarItems: ItemSelectorTab[] = [
    {
        title: 'Materials',
        icon: FaHive,
        subList: [
            'Gold',
            'Silver',
            'Platinum',
            'Palladium',
            'Rhodium',
            'Copper',
            'Lead',
            'Tin',
            'Nickel',
            'Zinc',
            'Iron',
            'Chromium',
            'Other',
        ],
        tabDefaultState: true,
    },
];

const Mines = ({ user, mines, cartCount, wishlist }: Props): JSX.Element => (
    <Marketplace
        pageName={'mine'}
        user={user}
        wishlist={wishlist}
        items={mines}
        sideBarLayout={sidebarItems}
        cartCount={cartCount || 0}
        itemSubText={item => `[${item.material}]`}
    />
);

export default Mines;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const user = await getUserInfo(req, null);
    const mines = await getItems<MarketplaceMine>('mine', 1, 'Popularity', []);
    const wishlist = await getWishlist({ headers: { cookie: req.headers.cookie || '' } }, 'mine');
    return {
        props: {
            ...(user && 'props' in user ? user?.props : {}),
            mines,
            wishlist: wishlist || undefined,
        },
    };
};
