import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { MdFacebook } from 'react-icons/md';
import Page from './Page';
import { BasicItemResponse, Collection, MarketplacePage, MineItemResponse, User } from './types';
import styles from '../styles/components/Item.module.scss';
import { useCartCount, useWishlist } from './hooks';
import QuantityCounter from './QuantityCounter';
import { getInCart } from './utils';

interface Props {
    user?: User;
    pageName: MarketplacePage;
    initialCartCount?: number;
    item: BasicItemResponse | MineItemResponse;
    initialWishlist?: Collection;
    initialItemsInCart?: number;
}

const Item = ({ user, initialCartCount, item, pageName, initialWishlist, initialItemsInCart }: Props): JSX.Element => {
    const { cartCount, addToCart, removeFromCart } = useCartCount(pageName, initialCartCount || 0);

    const { data: itemsInCart, refetch: refetchCart } = useQuery<number>(
        [`Cart`],
        async () => {
            if (pageName !== 'product' && pageName !== 'mine') return null;
            return (await getInCart(pageName, item.id)).count;
        },
        {
            initialData: initialItemsInCart || 0,
            enabled: !(pageName !== 'mine' && pageName !== 'product'),
        },
    );

    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist(
        'product',
        initialWishlist,
        !(pageName !== 'mine' && pageName !== 'product'),
    );

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
                                <Image
                                    priority
                                    layout={'fill'}
                                    objectFit={'contain'}
                                    objectPosition={'top'}
                                    src={
                                        item.image_id
                                            ? `https://imagedelivery.net/RwHbfJFaRWbC2holDi8g-w/${item.image_id}/public`
                                            : 'https://imagedelivery.net/RwHbfJFaRWbC2holDi8g-w/2e3a5e35-2fbe-402a-9e5c-f19a60f85900/public'
                                    }
                                />
                            </div>
                            <div className={styles.middle}>
                                <h2>{item?.title}</h2>
                                <h4>{item?.created_date}Created on Mon, 28 March 2022 08:38</h4>
                                {item.supplier.phone_number ? <h4>+{item?.supplier.phone_number}</h4> : null}
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
                                <Link href={pageName !== 'vacancy' ? `/marketplace/${pageName}s` : '/marketplace/vacancies'}>Back</Link>
                                <div>
                                    {pageName === 'mine' || pageName === 'product' ? (
                                        <>
                                            {itemsInCart !== 0 && pageName === 'product' ? (
                                                <QuantityCounter
                                                    quantity={itemsInCart || 0}
                                                    decreaseQuantity={() =>
                                                        removeFromCart.mutate(item.id, { onSuccess: () => refetchCart() })
                                                    }
                                                    increaseQuantity={() => addToCart.mutate(item.id, { onSuccess: () => refetchCart() })}
                                                />
                                            ) : null}

                                            <button
                                                type={'button'}
                                                className={`${styles.addToCart} ${addToCart.isLoading ? styles.loading : ''}`}
                                                onClick={() => {
                                                    if (pageName === 'mine' && itemsInCart === 1) {
                                                        return removeFromCart.mutate(item.id, { onSuccess: () => refetchCart() });
                                                    }
                                                    return addToCart.mutate(item.id, { onSuccess: () => refetchCart() });
                                                }}
                                            >
                                                {pageName === 'mine' && itemsInCart === 1 ? 'Remove from cart' : 'Add to cart'}
                                            </button>
                                            <button
                                                type={'button'}
                                                className={`${styles.wishlistButton} ${
                                                    addToWishlist.isLoading || removeFromWishlist.isLoading ? styles.loading : ''
                                                }`}
                                                onClick={async () => {
                                                    if (!wishlist) return undefined;
                                                    if (
                                                        wishlist?.products.some(i => i.id === item.id) ||
                                                        wishlist?.mines.some(i => i.id === item.id)
                                                    ) {
                                                        return removeFromWishlist.mutate(item.id);
                                                    }
                                                    return addToWishlist.mutate(item.id);
                                                }}
                                            >
                                                {wishlist?.products.some(i => i.id === item.id) ||
                                                wishlist?.mines.some(i => i.id === item.id)
                                                    ? 'Remove from wishlist'
                                                    : 'Add to wishlist'}
                                            </button>
                                        </>
                                    ) : (
                                        <Link href={`mailto:${item.supplier.email}?subject=Zimvest: ${item.title}`}>
                                            <button type={'button'} className={styles.addToCart}>
                                                Contact&nbsp;
                                                {pageName === 'service' ? 'provider' : pageName === 'vacancy' ? 'employer' : 'seller'}
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={styles.section2}>
                            <h3>Description</h3>
                            <p>
                                {item.description === null
                                    ? `Theres no information on this ${pageName} but keep an eye out for updates!`
                                    : item.description}
                            </p>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    );
};

export default Item;
