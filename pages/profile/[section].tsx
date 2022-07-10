import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaWhatsapp, FaTwitter, FaGlobe } from 'react-icons/fa';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { MdOutlineFileDownload, MdFacebook, MdInfoOutline } from 'react-icons/md';
import { Fake } from '../../public';
import Page from '../../components/Page';
import styles from '../../styles/profile.module.scss';
import Collapse from '../../components/Collapse';
import TestProduct from '../../public/testProduct.png';
import { fetchUser, User, userApiUrl } from '../../components/utils';

interface Props {
    user?: User;
}

interface FormValues {
    'First Name': string;
    'Last Name': string;
    Email: string;
    'Phone number': string;
    'Company Name': string;
    Province: string;
    District: string;
    'Facebook Url': string;
    'WhatsApp Url': string;
    'Twitter Handle': string;
    'Website Url': string;
}

const Section = ({ user }: Props): JSX.Element => {
    const { push, query } = useRouter();
    const [openedTab, setOpenedTab] = useState(
        query.section === 'account'
            ? 'Account'
            : query.section === 'products'
            ? 'Products'
            : query.section === 'wishlist'
            ? 'Wishlist'
            : '',
    );
    const [apiRequestSent, setApiRequestSent] = useState(false);
    const {
        register,
        //   formState: { errors },
        setError,
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            'First Name': user?.firstName,
            'Last Name': user?.lastName,
            Email: user?.email,
            'Phone number': user?.phoneNumber,
            District: user?.district,
            Province: user?.province,
            'Company Name': user?.companyName,
            'Facebook Url': user?.facebook,
            'WhatsApp Url': user?.whatsapp,
            'Twitter Handle': user?.twitter,
            'Website Url': user?.companyWebsite,
        },
    });

    const wishlistData = [
        {
            name: 'Mine crusher',
            image: TestProduct,
            seller: 'kiethhadira@yahoo.com',
            price: '$5000',
        },
    ];

    const myProducts = [
        {
            name: 'Mine crusher',
            image: TestProduct,
            seller: 'kiethhadira@yahoo.com',
            price: '$5000',
        },
    ];

    const save = (data: FormValues) => {
        setApiRequestSent(true);
        axios
            .put(
                `${userApiUrl}/user`,
                {
                    firstName: data['First Name'],
                    lastName: data['Last Name'],
                    email: data.Email,
                    phoneNumber: data['Phone number'],
                    province: data.Province,
                    district: data.District,
                    companyName: data['Company Name'],
                    // companyType: data['Company Type'],
                    facebookUrl: data['Facebook Url'],
                    whatsAppNumber: data['WhatsApp Url'],
                    twitterHandle: data['Twitter Handle'],
                    websiteUrl: data['Website Url'],
                },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                },
            )
            .then(async () => {
                await push('/profile');
                setApiRequestSent(false);
            })
            .catch(e => {
                setApiRequestSent(false);
                if (e.response.status === 403 || e.response.status === 400) {
                    setError('Email', { type: 'invalid' });
                }
                setError('Email', { type: 'server_error' });
            });
    };

    return (
        <>
            <Head>
                <title>Zimvest - Profile</title>
                <meta name={'description'} content={'Zimvest Profile'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>
            <Page user={user}>
                <div className={styles.main}>
                    <Collapse
                        title={'Account'}
                        open={openedTab === 'Account'}
                        onClick={() => setOpenedTab(openedTab === 'Account' ? '' : 'Account')}
                    >
                        <form onSubmit={handleSubmit(save)} className={styles.account}>
                            <div className={styles.layer1}>
                                <Image src={Fake} layout={'fixed'} height={88} width={88} className={styles.profilePic} />
                                <div>
                                    <h2>
                                        {user?.firstName} {user?.lastName}
                                    </h2>
                                    <h4>{user?.email}</h4>
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
                                    <label htmlFor={'firstName'}>
                                        <p>First name</p>
                                        <input
                                            id={'firstName'}
                                            type={'text'}
                                            placeholder={'First name'}
                                            {...register('First Name', { required: true })}
                                        />
                                    </label>
                                    <label htmlFor={'lastName'}>
                                        <p>Last name</p>
                                        <input
                                            id={'lastName'}
                                            type={'text'}
                                            placeholder={'Last name'}
                                            {...register('Last Name', { required: true })}
                                        />
                                    </label>
                                    <label htmlFor={'email'} className={styles.firstCol}>
                                        <p>Email</p>
                                        <input
                                            id={'email'}
                                            type={'email'}
                                            placeholder={'Email'}
                                            {...register('Email', { required: true })}
                                        />
                                    </label>
                                    <label htmlFor={'phoneNumber'} className={styles.firstCol}>
                                        <p>Phone number</p>
                                        <input
                                            id={'phoneNumber'}
                                            type={'text'}
                                            placeholder={'Phone number'}
                                            {...register('Phone number')}
                                        />
                                    </label>
                                    <label htmlFor={'province'} className={styles.firstCol}>
                                        <p>Province</p>
                                        <input id={'province'} type={'text'} placeholder={'Province'} {...register('Province')} />
                                    </label>
                                    <label htmlFor={'district'}>
                                        <p>District</p>
                                        <input id={'district'} type={'text'} placeholder={'District'} {...register('District')} />
                                    </label>
                                </div>
                            </section>
                            <section>
                                <h3>Company details</h3>
                                <div>
                                    <label htmlFor={'email'}>
                                        <p>Company name</p>
                                        <input id={'email'} type={'text'} placeholder={'Company name'} {...register('Company Name')} />
                                    </label>
                                    <label htmlFor={'email'}>
                                        <p>Company type</p>
                                        <input id={'email'} type={'text'} placeholder={'Company type'} />
                                    </label>
                                </div>
                            </section>
                            <section>
                                <div className={styles.info}>
                                    <h3>Security</h3>
                                    <MdInfoOutline color={'#969696'} size={20} />
                                    <h5>To change your password you must know and enter your current password.</h5>
                                </div>
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
                                    <label htmlFor={'facebook'}>
                                        <MdFacebook size={'30px'} color={'#BBBBBB'} />
                                        <input id={'facebook'} type={'text'} placeholder={'Facebook Url'} {...register('Facebook Url')} />
                                    </label>
                                    <label htmlFor={'whatsapp'}>
                                        <FaWhatsapp size={'30px'} color={'#BBBBBB'} />
                                        <input
                                            id={'whatsapp'}
                                            type={'text'}
                                            placeholder={'WhatsApp number'}
                                            {...register('WhatsApp Url')}
                                        />
                                    </label>
                                    <label htmlFor={'twitter'}>
                                        <FaTwitter size={'30px'} color={'#BBBBBB'} />
                                        <input
                                            id={'twitter'}
                                            type={'text'}
                                            placeholder={'Twitter handle'}
                                            {...register('Twitter Handle')}
                                        />
                                    </label>
                                    <label htmlFor={'website'}>
                                        <FaGlobe size={'30px'} color={'#BBBBBB'} />
                                        <input id={'website'} type={'text'} placeholder={'Website url'} {...register('Website Url')} />
                                    </label>
                                    <button className={`${styles.firstCol} ${apiRequestSent ? styles.loading : ''}`} type={'submit'}>
                                        Save
                                    </button>
                                </div>
                            </section>
                        </form>
                    </Collapse>
                    <Collapse
                        title={'Wishlist'}
                        open={openedTab === 'Wishlist'}
                        onClick={() => setOpenedTab(openedTab === 'Wishlist' ? '' : 'Wishlist')}
                    >
                        <div className={styles.wishlist}>
                            <h2>Wishlist</h2>
                            {wishlistData.map(item => (
                                <div key={item.name}>
                                    <Image src={item.image} />
                                    <div className={styles.text}>
                                        <h3>{item.name}</h3>
                                        <p>{item.seller}</p>
                                        <p>
                                            <span>{item.price}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <button type={'button'} className={styles.addToCart}>
                                            Add to cart
                                        </button>
                                        <button type={'button'} className={styles.remove}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Collapse>
                    <Collapse
                        title={'Products'}
                        open={openedTab === 'Products'}
                        onClick={() => setOpenedTab(openedTab === 'Products' ? '' : 'Products')}
                    >
                        <div className={styles.wishlist}>
                            <h2>Products</h2>
                            <button type={'button'} className={styles.createButton}>
                                Create
                            </button>
                            {myProducts.map(item => (
                                <div key={item.name}>
                                    <Image src={item.image} />
                                    <div className={styles.text}>
                                        <h3>{item.name}</h3>
                                        <p>{item.seller}</p>
                                        <p>
                                            <span>{item.price}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <button type={'button'} className={styles.productsRemove}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Collapse>
                </div>
            </Page>
        </>
    );
};

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    if (
        query.section !== 'account' &&
        query.section !== 'wishlist' &&
        query.section !== 'products' &&
        query.section !== 'base' &&
        query.section !== 'reservations'
    )
        return {
            redirect: {
                destination: '/profile',
                permanent: true,
            },
        };
    return fetchUser(req.headers.cookie || '')
        .then(user => {
            if (!user.data) {
                return {
                    redirect: {
                        destination: '/login',
                        permanent: true,
                    },
                };
            }
            return {
                props: { user: user.data },
            };
        })
        .catch(e => {
            if (e.response.status === 403) {
                return {
                    redirect: {
                        destination: '/login',
                        permanent: true,
                    },
                };
            }
            return {
                props: {},
            };
        });
};

export default Section;
