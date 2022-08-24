import React from 'react';
import Head from 'next/head';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { BannerPage, getCollectionCount, getUserInfo, Page, User } from '../components';

interface Props {
    user?: User;
    cartCount?: number;
}

const About = ({ user, cartCount }: Props): JSX.Element => {
    return (
        <>
            <Head>
                <title>Zimvest - About Us</title>
                <meta name={'description'} content={'Zimvest About us'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={user} cartCount={cartCount}>
                <BannerPage
                    heading={'About Us'}
                    subHeading={'Our platform connects people within the mining industry from the ground up and from the top down.'}
                >
                    <section>
                        <h2>About Us</h2>
                        <p>
                            Zimvest Mining is the premier marketplace dedicated to unleashing the true potential of Zimbabwe’s mineral
                            wealth. With over 60 proven commercially profitable minerals in Zimbabwe, the mining sector in Zimbabwe is
                            primed for large-scale exploitation. Zimvest Mining is a full-service network that connects the mining industry
                            with real investors. Our innovative platform aims to highlight the true business value in local mining by bring
                            the latest mine listings and mining support services to the forefront on our all-in-one platform. Investors and
                            miners alike have access to tools that help facilitate transparent, safe and efficient business transactions.
                        </p>
                    </section>
                    <section>
                        <h2>Why use Zimvest</h2>
                        <p>
                            The Zimvest Mining platform was built with efficiency, transparency and value addition in mind. Although
                            Zimbabwe’s mining sector currently contributes to 16% of the country’s GDP, the potential within the mining
                            sector remains largely untapped, providing miners and investors with immense opportunities to further their
                            output goals.
                        </p>
                        <p>
                            Zimvest Mining bridges the gap between miners and serious investors by providing a platform that they can
                            connect on. Our platform connects people within the mining industry from the ground up and from the top down.
                            Finally, miners have the opportunity to develop their mining assets to their full potential while maximizing
                            profits for investors.
                        </p>
                        <p>
                            Zimvest Mining doesn’t simply allow you to connect with potential clients and business partners; it is your one
                            stop shop to access mining services, equipment providers and even the personnel to help you achieve your
                            business goals. As dynamic as the mining landscape is, Zimvest Mining understands the need for transparency and
                            comfort when navigating business opportunities. As such, our experienced team is on hand to assist you in
                            eliminating the possibility of scams and unscrupulous elements. Schedule a consultation with one of our
                            experienced advisers here
                        </p>
                    </section>
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

export default About;
