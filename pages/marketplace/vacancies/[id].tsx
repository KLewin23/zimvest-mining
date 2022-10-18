import React from 'react';
import { GetServerSidePropsContext } from 'next';
import { BasicItemResponse, Collection, getCollection, getInCart, getItem, getUserInfo, Item, User } from '../../../components';

interface Props {
    user?: User;
    vacancy: BasicItemResponse;
    wishlist?: Collection;
    vacanciesInCart?: Collection;
}

const VacancyItem = ({ user, vacancy, wishlist, vacanciesInCart }: Props): JSX.Element => {
    return (
        <Item
            pageName={'vacancy'}
            user={user}
            item={vacancy}
            initialWishlist={wishlist}
            initialItemsInCart={vacanciesInCart?.length || 0}
        />
    );
};

export default VacancyItem;

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
    const vacancy = await getItem(id, 'vacancy');
    if (!user)
        return {
            props: {
                vacancy,
            },
        };
    const wishlist = await getCollection('WISHLIST', { headers: { cookie: req.headers.cookie || '' } }, 'vacancy');
    const vacanciesInCart = await getInCart('vacancy', id, { headers: { cookie: req.headers.cookie || '' } });

    return {
        props: {
            ...(user && 'props' in user ? user.props : {}),
            vacancy,
            wishlist,
            vacanciesInCart,
        },
    };
};
