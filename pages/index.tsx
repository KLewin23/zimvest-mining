import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { GetServerSidePropsContext } from 'next';
import Page from '../components/Page';
import { fetchUser, User } from '../components/utils';

interface Props {
    user?: User;
}

const Home: NextPage<Props> = ({ user }: Props) => {
    return (
        <>
            <Head>
                <title>Zimvest</title>
                <meta name={'description'} content={'Generated by create next app'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={user} withCurrencyWidget withSideBar>
                <h3>Welcome {user?.firstName || ''} to Zimvest, Work in progress</h3>
            </Page>
        </>
    );
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    return fetchUser(req.headers.cookie || '')
        .then(user => {
            if (user.data) {
                return {
                    props: { user: user.data },
                };
            }
            return {
                props: {},
            };
        })
        .catch(() => {
            return {
                props: {},
            };
        });
};

export default Home;
