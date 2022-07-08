import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { MdOutlineFileDownload, MdExpandLess, MdFacebook } from 'react-icons/md';
import { FaWhatsapp, FaTwitter, FaGlobe } from 'react-icons/fa';
import { Fake } from '../public';
import Page from '../components/Page';
import styles from '../styles/profile.module.scss';
import { useEventListener } from '../components/utils';

enum Tabs {
    Account,
    Wishlist,
    Products,
}

const Profile = (): JSX.Element => {
    const [openedTab, setOpenedTab] = useState<null | Tabs>(Tabs.Account);
    const accountCollapse = useRef<HTMLFormElement>(null);
    const [tabSizes, setTabSizes] = useState({ account: 0 });

    useEffect(() => {
        setTabSizes({
            account: accountCollapse?.current?.scrollHeight || 0,
        });
    }, []);

    useEventListener('resize', () => {
        setTabSizes({
            account: accountCollapse?.current?.scrollHeight || 0,
        });
    });

    return (
        <>
            <Head>
                <title>Zimvest - login</title>
                <meta name={'description'} content={'Zimvest Login'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>
            <Page>
                <div className={styles.main}>
                    <form
                        ref={accountCollapse}
                        className={styles.account}
                        style={{
                            maxHeight: openedTab === Tabs.Account ? `${tabSizes.account}px` : 90,
                        }}
                    >
                        <div className={styles.title}>
                            <h3 style={{ opacity: openedTab === Tabs.Account ? 0 : 1 }}>Account</h3>
                            <button
                                type={'button'}
                                className={styles.expandBtn}
                                onClick={() => setOpenedTab(openedTab === Tabs.Account ? null : Tabs.Account)}
                            >
                                <MdExpandLess size={25} style={{ transform: openedTab === Tabs.Account ? 'none' : 'rotate(-180deg)' }} />
                            </button>
                        </div>
                        <div className={styles.layer1} style={{ opacity: openedTab === Tabs.Account ? 1 : 0 }}>
                            <Image src={Fake} layout={'fixed'} height={88} width={88} className={styles.profilePic} />
                            <div>
                                <h2>Kieran Lewin</h2>
                                <h4>kieran.lewin2000@gmail.com</h4>
                                <button type={'button'} className={styles.changePhoto}>
                                    Change photo
                                </button>
                            </div>
                            <div className={styles.logout}>
                                Log Out
                                <MdOutlineFileDownload size={20} />
                            </div>
                        </div>
                        <section>
                            <h3>General information</h3>
                            <div>
                                <label htmlFor={'email'}>
                                    <p>First name</p>
                                    <input id={'email'} type={'text'} placeholder={'First name'} />
                                </label>
                                <label htmlFor={'email'}>
                                    <p>Last name</p>
                                    <input id={'email'} type={'text'} placeholder={'Last name'} />
                                </label>
                                <label htmlFor={'email'} className={styles.firstCol}>
                                    <p>Email</p>
                                    <input id={'email'} type={'text'} placeholder={'Email'} />
                                </label>
                                <label htmlFor={'email'} className={styles.firstCol}>
                                    <p>Phone number</p>
                                    <input id={'email'} type={'text'} placeholder={'Phone number'} />
                                </label>
                                <label htmlFor={'email'} className={styles.firstCol}>
                                    <p>Location</p>
                                    <input id={'email'} type={'text'} placeholder={'Location'} />
                                </label>
                            </div>
                        </section>
                        <section>
                            <h3>Security</h3>
                            <div>
                                <label htmlFor={'email'}>
                                    <p>Current password</p>
                                    <input id={'email'} type={'text'} placeholder={'Current password'} />
                                </label>
                                <label htmlFor={'email'} className={styles.firstCol}>
                                    <p>New Password</p>
                                    <input id={'email'} type={'text'} placeholder={'New password'} />
                                </label>
                                <label htmlFor={'email'}>
                                    <p>Confirm Password</p>
                                    <input id={'email'} type={'text'} placeholder={'Confirm password'} />
                                </label>
                            </div>
                        </section>
                        <section>
                            <h3>Social Media</h3>
                            <div className={styles.socialMedia}>
                                <label htmlFor={'email'}>
                                    <MdFacebook size={'30px'} color={'#BBBBBB'} />
                                    <input id={'email'} type={'text'} placeholder={'Facebook Url'} />
                                </label>
                                <label htmlFor={'email'}>
                                    <FaWhatsapp size={'30px'} color={'#BBBBBB'} />
                                    <input id={'email'} type={'text'} placeholder={'WhatsApp number'} />
                                </label>
                                <label htmlFor={'email'}>
                                    <FaTwitter size={'30px'} color={'#BBBBBB'} />
                                    <input id={'email'} type={'text'} placeholder={'Twitter handle'} />
                                </label>
                                <label htmlFor={'email'}>
                                    <FaGlobe size={'30px'} color={'#BBBBBB'} />
                                    <input id={'email'} type={'text'} placeholder={'Website url'} />
                                </label>
                                <button className={styles.firstCol} type={'button'}>
                                    Save
                                </button>
                            </div>
                        </section>
                    </form>
                </div>
            </Page>
        </>
    );
};

export default Profile;
