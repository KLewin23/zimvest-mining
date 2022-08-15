import React, { useEffect } from 'react';
import Head from 'next/head';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { FaSortAmountDown } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import type { Collection, ItemSelectorTab, Joined, MarketplacePage, MarketplaceType, ProductSideBarValues, User } from './types';
import styles from '../styles/components/Marketplace.module.scss';
import TestProduct from '../public/testProduct.png';
import { getItems, getWishlist, useCartCount, userApiUrl } from './utils';
import Page from './Page';
import Select from './Select';
import ItemSelector from './ItemSelector';

interface FormValues extends ProductSideBarValues {
    'Sort By': string;
}

interface Props<T extends MarketplaceType> {
    user?: User;
    items?: Joined<T>[];
    sideBarLayout?: ItemSelectorTab[];
    pageName: MarketplacePage;
    itemSubText?: (item: T) => string;
    cartCount: number;
    wishlist?: Collection;
}

export const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[];

const defaultFilters = (param: string): ProductSideBarValues | object => {
    switch (param) {
        case 'services':
            return {
                'Mining Contractors': true,
                'Chemical Providers': true,
                Logistics: true,
                'Lab Testing Services': true,
                Telecommunications: true,
                'Banking and Insurance': true,
                'Screening Equipment Service': true,
                'Screening Equipment': false,
                'Mining Equipment': true,
            };
        case 'base':
        default:
            return {};
    }
};

const Marketplace = <T extends MarketplaceType>({
    user,
    items: initialItems,
    sideBarLayout,
    pageName,
    itemSubText,
    cartCount,
    wishlist: initialWishlist,
}: Props<T>): JSX.Element => {
    const { ref, inView } = useInView();
    const { query } = useRouter();
    const formMethods = useForm<FormValues>({
        defaultValues: { 'Sort By': 'Popularity', ...defaultFilters(query.type as string) },
    });
    const { watch, getValues } = formMethods;

    const {
        data: items,
        isLoading,
        fetchNextPage,
        refetch: refetchItems,
    } = useInfiniteQuery<Joined<T>[]>(
        [`${pageName}-List`, watch()],
        async ({ pageParam }) => {
            const values = getValues();
            const filters = keys(values).reduce<string[]>((acc, section) => {
                if (section === 'Sort By') return [...acc];
                return [
                    ...acc,
                    ...keys(values[section])
                        .filter(item => {
                            return values[section][item] === true;
                        })
                        .map((filtered: string): string => `${section},${filtered}`),
                ];
            }, []);
            return getItems<T>(pageName, pageParam || 0, values['Sort By'], filters);
        },
        {
            ...(initialItems && {
                initialData: {
                    pages: [initialItems],
                    pageParams: [1],
                },
            }),
            keepPreviousData: true,
            getPreviousPageParam: (_, allPages) => allPages.length + 1,
            getNextPageParam: (_, allPages) => allPages.length - 1,
        },
    );

    useEffect(() => {
        (async () => {
            if (inView && items) {
                return items?.pages && items.pages[items.pages.length - 1].length === 10
                    ? fetchNextPage()
                    : refetchItems({ refetchPage: (_, index) => index === items.pages.length - 1 });
            }
            return undefined;
        })();
    }, [fetchNextPage, inView, items, refetchItems]);

    const addToCart = useMutation((id: number) =>
        axios.post(`${userApiUrl}/collection/CART/${pageName}?id=${id}`, {}, { withCredentials: true }),
    );

    const { data: wishlist, refetch: refetchWishlist } = useQuery<Collection | null>(
        [`${pageName}-Wishlist`],
        async () => getWishlist({}, pageName),
        {
            ...(initialWishlist && { initialData: initialWishlist }),
        },
    );

    const addToWishlist = useMutation(
        (id: number) => axios.post(`${userApiUrl}/collection/WISHLIST/${pageName}?id=${id}`, {}, { withCredentials: true }),
        { onSuccess: () => refetchWishlist() },
    );

    const removeFromWishlist = useMutation(
        (id: number) => axios.put(`${userApiUrl}/collection/remove/WISHLIST/${pageName}?id=${id}`, {}, { withCredentials: true }),
        { onSuccess: () => refetchWishlist() },
    );

    const { data: cart, refetch: reFetchCartCount } = useCartCount(pageName, cartCount);

    return (
        <>
            <Head>
                <title>Zimvest Marketplace</title>
                <meta name={'description'} content={'Zimvest Marketplace'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={user} withCurrencyWidget withSideBar cartCount={cart}>
                <FormProvider {...formMethods}>
                    <div className={styles.main}>
                        {sideBarLayout ? <ItemSelector itemSelectorLayout={sideBarLayout} /> : null}
                        <div className={styles.content}>
                            <div className={styles.filters}>
                                <Controller
                                    name={'Sort By'}
                                    control={formMethods.control}
                                    rules={{ validate: { isTrue: value => value } }}
                                    render={({ field }) => (
                                        <Select
                                            title={'Sort by'}
                                            icon={<FaSortAmountDown />}
                                            selectedOption={field.value}
                                            onClick={val => field.onChange(val)}
                                        >
                                            <option>Popularity</option>
                                            <option>Alphabetical</option>
                                            <option>Price: High-Low</option>
                                            <option>Price: Low-High</option>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className={styles.products}>
                                {items && items.pages.length !== 0 && items.pages[0].length !== 0 ? (
                                    items.pages.map(page => {
                                        return page.map((item: Joined<T>) => (
                                            <div key={`Marketplace-Product-${item.id}`}>
                                                <Image width={200} height={100} layout={'fixed'} src={TestProduct} />
                                                <div className={styles.text}>
                                                    <div>
                                                        <Link href={`/marketplace/${pageName}s/${item.id}`}>
                                                            <p className={styles.title}>{item.title}</p>
                                                        </Link>
                                                        <p className={styles.subText}>{itemSubText ? itemSubText(item) : null}</p>
                                                    </div>
                                                    <h4>{item.supplier.email}</h4>
                                                    <p>
                                                        <span>
                                                            $
                                                            {('price' in item
                                                                ? /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                                                                  /* @ts-ignore  */
                                                                  item.price
                                                                : 'salary' in item
                                                                ? /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                                                                  /* @ts-ignore  */
                                                                  item.salary
                                                                : ''
                                                            ).toLocaleString('en')}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className={styles.buttons}>
                                                    <button
                                                        type={'button'}
                                                        className={
                                                            addToCart.variables === item.id && addToCart.isLoading ? styles.loading : ''
                                                        }
                                                        onClick={async () => {
                                                            addToCart.mutate(item.id, { onSuccess: () => reFetchCartCount() });
                                                        }}
                                                    >
                                                        Add to cart
                                                    </button>
                                                    <button
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
                                                        className={
                                                            (addToWishlist.variables === item.id && addToWishlist.isLoading) ||
                                                            (removeFromWishlist.variables === item.id && removeFromWishlist.isLoading)
                                                                ? styles.loading
                                                                : ''
                                                        }
                                                        type={'button'}
                                                    >
                                                        {wishlist?.products.some(i => i.id === item.id) ||
                                                        wishlist?.mines.some(i => i.id === item.id)
                                                            ? 'Remove from wishlist'
                                                            : 'Add to wishlist'}
                                                    </button>
                                                </div>
                                            </div>
                                        ));
                                    })
                                ) : (
                                    <div className={styles.message}>
                                        <h2>
                                            No
                                            {(() => {
                                                switch (pageName) {
                                                    case 'vacancy':
                                                        return 'vacancies';
                                                    case 'mine':
                                                        return 'mines';
                                                    case 'service':
                                                        return 'services';
                                                    case 'product':
                                                    default:
                                                        return 'products';
                                                }
                                            })()}
                                            with the selected filters found.
                                        </h2>
                                    </div>
                                )}
                            </div>
                            <div ref={ref}>{isLoading ? <div /> : null}</div>
                        </div>
                    </div>
                </FormProvider>
            </Page>
        </>
    );
};

export default Marketplace;
