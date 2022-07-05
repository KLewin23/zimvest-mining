import React from 'react';
import Head from 'next/head';
import Page from '../components/Page';

const Profile = (): JSX.Element => {
    return (
        <>
            <Head>
                <title>Zimvest - login</title>
                <meta name={'description'} content={'Zimvest Login'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>
            <Page>
                <p>Profile</p>
            </Page>
        </>
    );
};

export default Profile;
