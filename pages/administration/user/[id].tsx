import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Link from 'next/link';
import axios from 'axios';
import React, { useState } from 'react';
import { format } from 'date-fns';
import Head from 'next/head';
import { getCollectionCount, getUserInfo, Page, Role, Select, User, userApiUrl } from '../../../components';
import styles from '../../../styles/user.module.scss';

interface Props {
    myUser?: User;
    cartCount?: number;
    user?: User;
}

const User = ({ myUser, user, cartCount }: Props): JSX.Element => {
    const [role, setRole] = useState<Role>(user?.role);

    return (
        <>
            <Head>
                <title>Zimvest</title>
                <meta name={'description'} content={'Zimvest Administration'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={myUser} withCurrencyWidget cartCount={cartCount}>
                <div className={styles.background}>
                    <div className={styles.container}>
                        <div className={styles.titleBar}>
                            <h3>
                                {user?.first_name === '$BLANK' && user?.last_name === '$BLANK'
                                    ? 'Name not set'
                                    : `${user?.first_name?.replace('$BLANK', '')} ${user?.last_name?.replace('$BLANK', '')}`}
                            </h3>
                            {role && myUser?.role === 'SUPER' ? (
                                <Select
                                    onClick={curRole => setRole(curRole as Role)}
                                    selectedOption={role}
                                    title={'Users Role'}
                                    style={{ maxWidth: '200px', minWidth: 0 }}
                                >
                                    <option>USER</option>
                                    <option>ADMIN</option>
                                </Select>
                            ) : null}
                        </div>
                        <h4>Email: {user?.email}</h4>
                        <h4>Facebook: {user?.facebook || 'Not set'}</h4>
                        <h4>Twitter: {user?.twitter || 'Not set'}</h4>
                        <h4>Whatsapp: {user?.whatsapp || 'Not set'}</h4>
                        <h4>Phone Number: {user?.phone_number || 'Not set'}</h4>
                        <h4>User created: {format(new Date(user?.created_at || ''), 'do MMMM y').toString()}</h4>
                        <Link href={'/administration'}>
                            <button type={'button'}>Back</button>
                        </Link>
                    </div>
                </div>
            </Page>
        </>
    );
};

export default User;

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const config = { headers: { cookie: req.headers.cookie || '' } };
    const userInfo = await getUserInfo(req, {});
    if ('props' in userInfo && (userInfo.props.user.role === 'ADMIN' || userInfo.props.user.role === 'SUPER')) {
        const cartCount = await getCollectionCount('CART', config);
        const user = (await axios.get(`${userApiUrl}/user/${query.id}`, { withCredentials: true, ...config })).data;
        return {
            props: {
                myUser: userInfo.props?.user,
                cartCount,
                user,
            },
        };
    }
    return {
        props: {},
    };
};
