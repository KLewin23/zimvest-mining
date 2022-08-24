import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ServiceProvider1 } from '../../public';
import styles from '../../styles/mining-guidlines.module.scss';
import { getUserInfo, User, BannerPage, Page, getCollectionCount } from '../../components';

interface Props {
    user?: User;
    cartCount?: number;
}

const Index = ({ user, cartCount }: Props): JSX.Element => {
    return (
        <>
            <Head>
                <title>Zimvest - Mining Overview</title>
                <meta name={'description'} content={'Zimvest Mining Overview'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={user} cartCount={cartCount}>
                <BannerPage heading={'Mining Guidelines'} subHeading={'Learn more about best practices in the mining community'}>
                    <section className={styles.boxList}>
                        <div>
                            <div>
                                <Image src={ServiceProvider1} width={172} height={129} />
                            </div>
                            <h4>Accessing mineral rights and opportunities in Zimbabwe</h4>
                            <Link href={'/mining-overview/mining-guidelines'}>
                                <p>Read More</p>
                            </Link>
                        </div>
                    </section>
                </BannerPage>
            </Page>
        </>
    );
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
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

export default Index;
