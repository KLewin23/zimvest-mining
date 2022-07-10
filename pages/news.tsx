import React from 'react';
import Head from 'next/head';
import Page from '../components/Page';

const News = (): JSX.Element => {
    return (
        <>
            <Head>
                <title>Zimvest</title>
                <meta name={'description'} content={'Zimvest Home'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page withCurrencyWidget withSideBar>
                <div>main</div>
            </Page>
        </>
    );
};

export default News;
