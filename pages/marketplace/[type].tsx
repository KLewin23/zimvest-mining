import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { Controller, FieldValues, FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { FaBolt, FaCogs, FaEnvira, FaHive, FaMapMarkerAlt, FaSnowplow, FaSortAmountDown } from 'react-icons/fa';
import Page from '../../components/Page';
import styles from '../../styles/products.module.scss';
import Select from '../../components/Select';
import { SideBarFormValues, ItemSelectorTab, getUser, User, getProducts } from '../../components/utils';
import ItemSelector from '../../components/ItemSelector';
import TestProduct from '../../public/testProduct.png';

interface FormValues extends SideBarFormValues {
    'Sort By': string;
    District: string;
    Province: string;
}

interface Props {
    user?: User;
    products?: unknown[];
}

const Products = ({ user, products }: Props): JSX.Element => {
    const defaultFilters = (param: string): SideBarFormValues | object => {
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
    const { query } = useRouter();
    const formMethods = useForm<FormValues>({ defaultValues: { ...defaultFilters(query.type as string) } });
    const extendedSidebarLayout: ItemSelectorTab[] = [
        {
            title: 'Machinery',
            icon: FaSnowplow,
            subList: ['Mining Drills', 'Blasting Tools', 'Earth Movers', 'Crushing Equipment', 'Screening Equipment'],
            tabDefaultState: (query.type as string) !== 'services',
        },
        {
            title: 'Consumables',
            icon: FaCogs,
            subList: [
                'Bearings',
                'Idler Rollers',
                'Conveyors',
                'Drill bits',
                'Mining Horse',
                'Valves',
                'PPE',
                'Spare Parts',
                'Cable Hooks',
                'Other Service Providers',
            ],
            tabDefaultState: (query.type as string) !== 'services',
        },
        {
            title: 'Services',
            icon: FaBolt,
            subList: [
                'Mining Contractors',
                'Chemical Providers',
                'Logistics',
                'Lab Testing Services',
                'Telecommunications',
                'Banking and Insurance',
                'Screening Equipment',
                'Mining Equipment',
            ],
            tabDefaultState: (query.type as string) === 'services',
        },
        {
            title: 'Metals',
            icon: FaHive,
            subList: [
                'Base Metals',
                'Precious Metals',
                'Minor Metals',
                'Bulk Metals',
                'Semi Precious Stones',
                'Ferro Alloys',
                'Rare Earth',
            ],
            tabDefaultState: false,
        },
        {
            title: 'Fertilizers',
            icon: FaEnvira,
            subList: ['Phosphate', 'Potash', 'Nitrogen', 'DAP', 'Map', 'SSP', 'TSP', 'Urea'],
            tabDefaultState: false,
        },
    ];

    const { data } = useQuery('productList', getProducts, { initialData: products });

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
                        <ItemSelector itemSelectorLayout={extendedSidebarLayout} onChange={idk} />
                        <div className={styles.content}>
                            <div className={styles.filters}>
                                <Controller
                                    name={'Sort By'}
                                    control={formMethods.control}
                                    rules={{ validate: { isTrue: value => value } }}
                                    render={({ field }) => (
                                        <Select
                                            title={'Province'}
                                            icon={<FaMapMarkerAlt />}
                                            selectedOption={field.value}
                                            onClick={val => field.onChange(val)}
                                        >
                                            <option>Mash West</option>
                                            <option>Mash Central</option>
                                            <option>Mash East</option>
                                            <option>Harare </option>
                                            <option>Matebeleland North</option>
                                            <option>Matebeleland South</option>
                                            <option>Bulawayo</option>
                                            <option>Midlands</option>
                                            <option>Manicaland</option>
                                            <option>Masvingo</option>
                                        </Select>
                                    )}
                                />
                                <Controller
                                    name={'District'}
                                    control={formMethods.control}
                                    rules={{ validate: { isTrue: value => value } }}
                                    render={({ field }) => (
                                        <Select
                                            title={'District'}
                                            icon={<FaMapMarkerAlt />}
                                            selectedOption={field.value}
                                            onClick={val => field.onChange(val)}
                                        >
                                            <option>All</option>
                                            <option>Bikita</option>
                                            <option>Chiredzi</option>
                                            <option>Chivi</option>
                                            <option>Gutu</option>
                                            <option>Masvingo</option>
                                            <option>Mwenezi</option>
                                            <option>Zaka</option>
                                        </Select>
                                    )}
                                />
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
                                {data.map((product: { name: string; updatedAt: string; price: number }) => (
                                    <div>
                                        <Image src={TestProduct} />
                                        <div className={styles.text}>
                                            <p>{product.name}</p>
                                            <h4>{product.updatedAt}</h4>
                                            <p>
                                                <span>${product.price}</span>
                                            </p>
                                        </div>
                                        <div className={styles.buttons}>
                                            <button type={'button'}>Add to cart</button>
                                            <button type={'button'}>Add to wishlist</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </FormProvider>
            </Page>
        </>
    );
};

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
    if (query.type !== 'base' && query.type !== 'mines' && query.type !== 'services')
        return {
            redirect: {
                destination: '/marketplace',
                permanent: true,
            },
        };
    const user = await getUser<Props>(req, { props: {} });
    const products = getProducts();
    return {
        props: {
            ...user.props,
            products,
        },
    };
};

export default Products;
//                 <select
//                                 {...register('sortBy', { required: true })}
//                                 style={{ borderColor: errors.sortBy ? '#EC4C4C' : '#ced4da' }}
//                             >
//                                 <option>
//                                     <FaMapMarkerAlt />
//                                     Popularity
//                                 </option>
//                                 <option>Alphabetical</option>
//                                 <option>Price: High-Low</option>
//                                 <option>Price: Low-High</option>
//                             </select>
