import React, { useRef } from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import { BannerPage, getCollectionCount, getUserInfo, Page, User } from '../components';

interface Props {
    user?: User;
    cartCount?: number;
}

const MarketData = ({ user, cartCount }: Props): JSX.Element => {
    const iframe = useRef<HTMLIFrameElement>(null);

    return (
        <>
            <Head>
                <title>Zimvest - Mining Overview</title>
                <meta name={'description'} content={'Zimvest Mining Overview'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={user} cartCount={cartCount}>
                <BannerPage heading={'Market Data'} subHeading={'See how the markets are currently doing.'}>
                    <iframe title={'data'} height={2000} ref={iframe} src={'https://tradingeconomics.com/commodities'} />
                </BannerPage>
            </Page>
        </>
    );
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const user = await getUserInfo(req, {});
    if ('props' in user) {
        const cartCount = await getCollectionCount('CART', { headers: { cookie: req.headers.cookie || '' } });
        return {
            props: {
                ...user.props,
                cartCount,
            },
        };
    }
    return { props: {} };
};

export default MarketData;
