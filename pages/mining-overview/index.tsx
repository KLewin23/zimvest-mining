import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Page from '../../components/Page';
import BannerPage from '../../components/BannerPage';
import { ServiceProvider1 } from '../../public';
import styles from '../../styles/mining-guidlines.module.scss';

const Index = (): JSX.Element => {
    return (
        <>
            <Head>
                <title>Zimvest - Mining Overview</title>
                <meta name={'description'} content={'Zimvest Mining Overview'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page>
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

export default Index;
