import axios from 'axios';
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { format } from 'date-fns';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { DbMessage, getCollectionCount, getUserInfo, Page, User, userApiUrl } from '../../../components';
import styles from '../../../styles/message.module.scss';

interface Props {
    user?: User;
    cartCount?: number;
    message?: DbMessage;
}

const Message = ({ user, cartCount, message }: Props): JSX.Element => {
    return (
        <>
            <Head>
                <title>Zimvest</title>
                <meta name={'description'} content={'Zimvest Administration'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={user} withCurrencyWidget cartCount={cartCount}>
                <div className={styles.background}>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            <h3>{message?.title}</h3>
                            <h4>{format(new Date(message?.createdAt || ''), 'do MMMM y').toString()}</h4>
                        </div>
                        <h4>{message?.email}</h4>
                        <div className={styles.messageWrapper}>
                            <p>{message?.message}</p>
                        </div>
                        <div className={styles.buttons}>
                            <Link href={'/administration'}>
                                <button type={'button'}>Back</button>
                            </Link>
                            <Link
                                href={`mailto:${message?.email}?subject=Zimvest%20Mining:%20${message?.title}&body=Hi%20${message?.email},%20%0D%0AI%20am%20responding%20to%20your%20message%20to%20ZimvestMining.com%20%0D%0A%0D%0AYour%20message:%20${message?.message}%20%0D%0A`}
                            >
                                <button type={'button'}>Reply</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    );
};

export default Message;

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const config = { headers: { cookie: req.headers.cookie || '' } };
    const user = await getUserInfo(req, {});
    if ('props' in user && (user.props.user.role === 'ADMIN' || user.props.user.role === 'SUPER')) {
        const cartCount = await getCollectionCount('CART', config);
        const message = (await axios.get(`${userApiUrl}/message/${query.id}`, { withCredentials: true, ...config })).data;
        return {
            props: {
                ...user.props,
                cartCount,
                message,
            },
        };
    }
    return {
        props: {},
    };
};
