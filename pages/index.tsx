import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import type { NextPage } from 'next';
import { GetServerSidePropsContext } from 'next';
import { Carousel } from 'react-responsive-carousel';
import styles from '../styles/index.module.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Advert, getCollectionCount, getUserInfo, Page, User } from '../components';
import {
    LandscapeBanner1,
    LandscapeBanner2,
    LandscapeBanner3,
    LandscapeBanner4,
    LandscapeBanner5,
    LandscapeBanner6,
    LandscapeBanner7,
    LandscapeBanner8,
} from '../public';

interface Props {
    user?: User;
    cartCount?: number;
}

const Home: NextPage<Props> = ({ user, cartCount }: Props) => {
    return (
        <>
            <Head>
                <title>Zimvest</title>
                <meta name={'description'} content={'Zimvest Home'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>
            <Page user={user} withCurrencyWidget withSideBar cartCount={cartCount}>
                <div className={styles.main}>
                    <div className={styles.banner}>
                        <Carousel showArrows showThumbs={false} showIndicators={false} showStatus={false} infiniteLoop autoPlay>
                            <div>
                                <Image src={LandscapeBanner1} />
                            </div>
                            <div>
                                <Image src={LandscapeBanner2} />
                            </div>
                            <div>
                                <Image src={LandscapeBanner3} />
                            </div>
                            <div>
                                <Image src={LandscapeBanner4} />
                            </div>
                            <div>
                                <Image src={LandscapeBanner5} />
                            </div>
                            <div>
                                <Image src={LandscapeBanner6} />
                            </div>
                            <div>
                                <Image src={LandscapeBanner7} />
                            </div>
                            <div>
                                <Image src={LandscapeBanner8} />
                            </div>
                        </Carousel>
                    </div>
                    <Advert />
                </div>
            </Page>
        </>
    );
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    // /count/:type
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

export default Home;
