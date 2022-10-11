import Head from 'next/head';
import React, { useState } from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import {
    Collapse,
    getCollectionCount,
    getListings,
    getUserInfo,
    getUsers,
    ListingsResult,
    Page,
    User,
    UsersResult,
    UserManagement,
    ListingManagement,
    MessageManagement,
    getMessages,
    MessageResult,
} from '../../components';
import styles from '../../styles/administration.module.scss';

interface Props {
    initialUsers?: UsersResult;
    initialListings?: ListingsResult;
    initialMessages?: MessageResult;
    user?: User;
    cartCount?: number;
}

const Index = ({ user, cartCount, initialUsers, initialListings, initialMessages }: Props): JSX.Element => {
    const [openedTab, setOpenedTab] = useState<number | null>(null);

    return (
        <>
            <Head>
                <title>Zimvest</title>
                <meta name={'description'} content={'Zimvest Administration'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>
            <Page user={user} withCurrencyWidget cartCount={cartCount}>
                <div className={styles.main}>
                    <div className={styles.container}>
                        <Collapse title={'User Management'} open={openedTab === 0} onClick={() => setOpenedTab(openedTab === 0 ? null : 0)}>
                            <UserManagement initialUsers={initialUsers} />
                        </Collapse>
                        <Collapse
                            title={'Listing Management'}
                            open={openedTab === 1}
                            onClick={() => setOpenedTab(openedTab === 1 ? null : 1)}
                        >
                            <ListingManagement initialListings={initialListings} />
                        </Collapse>
                        <Collapse
                            title={'Message Management'}
                            open={openedTab === 2}
                            onClick={() => setOpenedTab(openedTab === 2 ? null : 2)}
                        >
                            <MessageManagement initialMessages={initialMessages} />
                        </Collapse>
                    </div>
                </div>
            </Page>
        </>
    );
};

export default Index;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const config = { headers: { cookie: req.headers.cookie || '' } };
    const user = await getUserInfo(req, {});
    if ('props' in user && ((await user.props).user.role === 'ADMIN' || (await user.props).user.role === 'SUPER')) {
        const cartCount = await getCollectionCount('CART', config);
        const initialUsers = await getUsers(1, config);
        const initialListings = await getListings('product', 1, config);
        const initialMessages = await getMessages(1, config);
        return {
            props: {
                ...user.props,
                cartCount,
                initialUsers,
                initialListings,
                initialMessages,
            },
        };
    }
    return {
        props: {},
    };
};
