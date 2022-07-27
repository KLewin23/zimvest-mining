import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';
import styles from '../styles/auth.module.scss';
import { userApiUrl, Page } from '../components';

const Verify = ({ userName, error }: { userName?: string; error: string }): JSX.Element => {
    return (
        <>
            <Head>
                <title>Zimvest - verify</title>
                <meta name={'description'} content={'Zimvest Verify'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>
            <Page>
                <div className={styles.main}>
                    {error ? (
                        <div className={styles.verify}>
                            <h3>{error}</h3>
                            <p>You can try and login here</p>
                            <Link href={'/login'}>
                                <button type={'button'} className={styles.zim_button}>
                                    Login
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.verify}>
                            <h3>
                                Thanks for verifying your account, <br /> {userName || ''}
                            </h3>
                            <p>
                                Now you can login and start using the
                                <br /> Zimvest platform
                            </p>
                            <Link href={'/login'}>
                                <button type={'button'} className={styles.zim_button}>
                                    Login
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </Page>
        </>
    );
};

export const getServerSideProps = ({ query }: GetServerSidePropsContext) => {
    return axios
        .put(
            `${userApiUrl}/user/verify`,
            { verifyCode: query.code },
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            },
        )
        .then(async res => {
            if (res.status === 200) {
                return {
                    props: {
                        userName: '',
                    },
                };
            }
            return {
                props: {
                    error: res.data,
                },
            };
        })
        .catch(() => {
            return {
                props: {
                    error: '',
                },
            };
        });
};

export default Verify;
