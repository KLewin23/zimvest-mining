import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { MdFacebook } from 'react-icons/md';
import axios from 'axios';
import { useMutation } from 'react-query';
import Page from './Page';
import { BasicItemResponse, MarketplacePage, MineItemResponse, User } from './types';
import TestProduct from '../public/testProduct.png';
import styles from '../styles/components/Item.module.scss';
import { useCartCount, userApiUrl } from './utils';

interface Props {
    user?: User;
    pageName: MarketplacePage;
    initialCartCount?: number;
    item: BasicItemResponse | MineItemResponse;
}

const Item = ({ user, initialCartCount, item, pageName }: Props): JSX.Element => {
    const { data: cartCount, refetch: reFetchCartCount } = useCartCount(pageName, initialCartCount || 0);

    const addToCart = useMutation(
        () => axios.post(`${userApiUrl}/collection/CART/${pageName}?id=${item.id}`, {}, { withCredentials: true }),
        { onSuccess: () => reFetchCartCount() },
    );

    // const addToWishlist = useMutation(
    //     (id: number) => axios.post(`${userApiUrl}/collection/WISHLIST/${pageName.toUpperCase()}?id=${id}`, {}, { withCredentials: true }),
    //     // { onSuccess: () => refetchWishlist() },
    // );

    return (
        <>
            <Head>
                <title>Zimvest Marketplace</title>
                <meta name={'description'} content={'Zimvest Marketplace'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={user} withCurrencyWidget withSideBar cartCount={cartCount}>
                <div className={styles.container}>
                    <div>
                        <div className={styles.section1}>
                            <div className={styles.image}>
                                <Image src={TestProduct} layout={'responsive'} />
                            </div>
                            <div className={styles.middle}>
                                <h2>{item?.title}</h2>
                                <h4>{item?.created_date}Created on Mon, 28 March 2022 08:38</h4>
                                <h4>+{item?.supplier.phone_number}</h4>
                                <h4>{item?.supplier.email}</h4>
                                {item.supplier.twitter ? (
                                    <div>
                                        <FaTwitter />
                                        <h4>@{item?.supplier.twitter}</h4>
                                    </div>
                                ) : null}
                                {item.supplier.facebook ? (
                                    <div>
                                        <MdFacebook />
                                        <h4>{item?.supplier.facebook}</h4>
                                    </div>
                                ) : null}
                                {item.supplier.whatsapp ? (
                                    <div>
                                        <FaWhatsapp />
                                        <h4>{item?.supplier.whatsapp}</h4>
                                    </div>
                                ) : null}
                                <div className={styles.price}>
                                    <h2>${(item && 'price' in item ? item.price : item?.salary || 0).toLocaleString('en')}</h2>
                                </div>
                            </div>
                            <div className={styles.buttons}>
                                <Link href={'/marketplace/products'}>Back</Link>
                                <div>
                                    <button
                                        type={'button'}
                                        className={addToCart.isLoading ? styles.loading : ''}
                                        onClick={() => {
                                            addToCart.mutate();
                                        }}
                                    >
                                        Add to cart
                                    </button>
                                    <button type={'button'}>Add to wishlist</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    );
};

export default Item;
