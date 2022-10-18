import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { Collection, getCollection, getInCart, getItem, getUserInfo, Item, MineItemResponse, User } from '../../../components';

interface Props {
    user?: User;
    mine: MineItemResponse;
    cartCount?: number;
    wishlist?: Collection;
    minesInCart?: number;
}

const MineItem = ({ user, mine, cartCount, wishlist, minesInCart }: Props): JSX.Element => {
    return (
        <Item
            pageName={'mine'}
            initialItemsInCart={minesInCart}
            user={user}
            initialCartCount={cartCount}
            initialWishlist={wishlist}
            item={mine}
        />
    );
};

export default MineItem;

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
    if (!query.id)
        return {
            redirect: {
                destination: '/marketplace/mines',
                permanent: true,
            },
        };

    const id = parseInt(query.id as string, 10);

    const user = await getUserInfo(req, null);
    const mine = await getItem(id, 'mine');
    if (!user)
        return {
            props: {
                mine,
            },
        };
    const wishlist = await getCollection('WISHLIST', { headers: { cookie: req.headers.cookie || '' } }, 'mine');
    const minesInCart = await getInCart('mine', id, { headers: { cookie: req.headers.cookie || '' } });

    return {
        props: {
            ...(user && 'props' in user ? user.props : {}),
            mine,
            wishlist,
            minesInCart: minesInCart.count,
        },
    };
};
