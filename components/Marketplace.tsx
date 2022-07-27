import React, { useState } from 'react';
import Head from 'next/head';
import { Controller, FieldValues, FormProvider, useForm } from 'react-hook-form';
import { FaSortAmountDown } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import type { ItemSelectorTab, Product, ProductSideBarValues, User, MarketplacePage, Request, MarketplaceType } from './types';
import styles from '../styles/products.module.scss';
import TestProduct from '../public/testProduct.png';
import { getItems } from './utils';
import Page from './Page';
import PageButtons from './PageButtons';
import ItemSelector from './ItemSelector';
import Select from './Select';

interface FormValues extends ProductSideBarValues {
    'Sort By': string;
}

interface Props {
    user?: User;
    items?: Request<Product>[];
    sideBarLayout: ItemSelectorTab[];
    pageName: MarketplacePage;
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

const Marketplace = ({ user, items, sideBarLayout, pageName }: Props): JSX.Element => {
    const { query } = useRouter();
    const formMethods = useForm<FormValues>({
        defaultValues: { 'Sort By': 'Popularity', ...defaultFilters(query.type as string) },
    });
    const [page, setPage] = useState(1);
    const { watch, getValues } = formMethods;

    const { data } = useQuery<Request<MarketplaceType>[]>(
        [`${pageName}List`, page, watch()],
        () => {
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
            return getItems(pageName, page, values['Sort By'], filters);
        },
        {
            initialData: items,
        },
    );

    const idk = (res: FieldValues) => {
        Array.isArray(res);
    };

    return (
        <>
            <Head>
                <title>Zimvest</title>
                <meta name={'description'} content={'Zimvest Home'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={user} withCurrencyWidget withSideBar>
                <FormProvider {...formMethods}>
                    <div className={styles.main}>
                        <ItemSelector itemSelectorLayout={sideBarLayout} onChange={idk} />
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
                                {data ? (
                                    data.map(product => (
                                        <div>
                                            <Image src={TestProduct} />
                                            <div className={styles.text}>
                                                <p>{product.name}</p>
                                                <h4>{product.supplier.email}</h4>
                                                <p>
                                                    <span>${product.price}</span>
                                                </p>
                                            </div>
                                            <div className={styles.buttons}>
                                                <button type={'button'}>Add to cart</button>
                                                <button type={'button'}>Add to wishlist</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.message}>
                                        <h2>No products with the selected filters found.</h2>
                                    </div>
                                )}
                            </div>
                            <div className={styles.pageButtons}>
                                <PageButtons
                                    totalPages={3}
                                    currentPage={page}
                                    onPageChange={p => {
                                        window.scrollTo(0, 0);
                                        setPage(p);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </FormProvider>
            </Page>
        </>
    );
};

export default Marketplace;
