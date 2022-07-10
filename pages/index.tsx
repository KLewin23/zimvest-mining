import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import type { NextPage } from 'next';
import { GetServerSidePropsContext } from 'next';
import { Carousel } from 'react-responsive-carousel';
import Page from '../components/Page';
import styles from '../styles/index.module.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { fetchUser, User } from '../components/utils';
import landscapeBanner1 from '../public/banner/zimvest_web banners_1024x500.jpg';
import landscapeBanner2 from '../public/banner/zimvest_web banners_1024x5002.jpg';
import landscapeBanner3 from '../public/banner/zimvest_web banners_1024x5004.jpg';
import landscapeBanner4 from '../public/banner/zimvest_web banners_1024x5005.jpg';
import landscapeBanner5 from '../public/banner/zimvest_web banners_1024x5006.jpg';
import landscapeBanner6 from '../public/banner/zimvest_web banners_1024x5007.jpg';
import landscapeBanner7 from '../public/banner/zimvest_web banners_1024x5008.jpg';
import landscapeBanner8 from '../public/banner/zimvest_web banners_1024x5009.jpg';
import Advert from '../components/Advert';

interface Props {
    user?: User;
}

const Home: NextPage<Props> = ({ user }: Props) => {
    return (
        <>
            <Head>
                <title>Zimvest</title>
                <meta name={'description'} content={'Zimvest Home'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={user} withCurrencyWidget withSideBar>
                <div className={styles.main}>
                    <div className={styles.banner}>
                        <Carousel showArrows showThumbs={false} showIndicators={false} showStatus={false} infiniteLoop autoPlay>
                            <div>
                                <Image src={landscapeBanner1} />
                            </div>
                            <div>
                                <Image src={landscapeBanner2} />
                            </div>
                            <div>
                                <Image src={landscapeBanner3} />
                            </div>
                            <div>
                                <Image src={landscapeBanner4} />
                            </div>
                            <div>
                                <Image src={landscapeBanner5} />
                            </div>
                            <div>
                                <Image src={landscapeBanner6} />
                            </div>
                            <div>
                                <Image src={landscapeBanner7} />
                            </div>
                            <div>
                                <Image src={landscapeBanner8} />
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
