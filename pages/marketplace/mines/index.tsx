import React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { FaHive } from 'react-icons/fa';
import {
    Collection,
    getItems,
    getUserInfo,
    ItemSelectorTab,
    Joined,
    Marketplace,
    MarketplaceMine,
    metals,
    User,
} from '../../../components';
import { getCollection } from '../../../components/utils';

interface Props {
    user?: User;
    mines?: Joined<MarketplaceMine>[];
    cart?: Collection;
    wishlist?: Collection;
}

const sidebarItems: ItemSelectorTab[] = [
    {
        title: 'Materials',
        icon: FaHive,
        subList: metals,
        tabDefaultState: true,
    },
];

const Mines = ({ user, mines, cart, wishlist }: Props): JSX.Element => (
    <Marketplace
        pageName={'mine'}
        user={user}
        initialWishlist={wishlist}
        items={mines}
        sideBarLayout={sidebarItems}
        initialCart={cart}
        itemSubText={item => `[${item.material}]`}
    />
);

export default Mines;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const user = await getUserInfo(req, null);
    const mines = await getItems<MarketplaceMine>('mine', 1, 'Popularity', []);
    const wishlist = await getCollection('WISHLIST', { headers: { cookie: req.headers.cookie || '' } }, 'mine');
    const cart = await getCollection('CART', { headers: { cookie: req.headers.cookie || '' } }, 'mine');
    return {
        props: {
            ...(user && 'props' in user ? user?.props : {}),
            mines,
            wishlist: wishlist || undefined,
            cart: cart || undefined,
        },
    };
};
