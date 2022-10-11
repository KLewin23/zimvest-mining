import axios from 'axios';
import Head from 'next/head';
// eslint-disable-next-line import/no-named-default
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import { Controller, useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import React, { useCallback, useState } from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import styles from '../../styles/profile.module.scss';
import {
    ChangePassword,
    Collapse,
    Collection,
    fetchUser,
    getCollection,
    getCollectionCount,
    getProducts,
    getUserInfo,
    ManageAccount,
    MarketplacePage,
    metals,
    Modal,
    Page,
    productExtendedSidebarLayout,
    ProfileItem,
    Select,
    serviceExtendedSidebarLayout,
    User,
    userApiUrl,
    UserListing,
    UserProducts,
} from '../../components';

interface Props {
    user: User;
    wishlist?: Collection;
    cart?: Collection;
    initialUserProducts?: UserProducts;
    initialCartCount?: number;
}

interface ItemForm {
    Title: string;
    Price: number;
    Type: MarketplacePage;
    Category: string;
    SubCategory: string;
    Image: string;
    imageName: string;
}

const Profile = ({
    user: initialUser,
    cart: initialCart,
    wishlist: initialWishlist,
    initialCartCount,
    initialUserProducts = { products: [], mines: [], services: [], vacancies: [] },
}: Props): JSX.Element => {
    /* region functions */

    const { query } = useRouter();
    const { data: user } = useQuery('Profile,User', async () => (await fetchUser()).data, {
        initialData: initialUser,
    });

    const [openedTab, setOpenedTab] = useState<string>(
        query.section && typeof query.section === 'string' ? query.section.charAt(0).toUpperCase() + query.section.slice(1) && '' : '',
    );
    const [imageModal] = useState(false);
    const [imageUploadUrl, setImageUploadUrl] = useState('');
    const [, setProfileImage] = useState('');
    const [, setImageError] = useState('');
    const [checkoutCompleteModal, setCheckoutCompleteModal] = useState(false);
    const [createProductModal, setCreateProductModal] = useState(false);
    const {
        register,
        control,
        watch,
        reset,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<ItemForm>();
    const type = watch('Type');
    const category = watch('Category');
    const imageName = watch('imageName');
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            acceptedFiles.forEach(file => {
                const reader = new FileReader();
                reader.onabort = () => null;
                reader.onerror = () => null;
                reader.onload = () => {
                    const image = new Image();
                    image.src = reader.result?.toString() || '';
                    image.onload = () => {
                        if (imageModal && !createProductModal) {
                            if (image.width !== image.height) {
                                setImageError('Image must be square');
                                return setProfileImage('');
                            }
                            setImageError('');
                            return setProfileImage((reader.result as string) || '');
                        }
                        if (!imageModal && createProductModal) {
                            if ((image.width / 16) * 9 !== image.height) {
                                return setImageError('Image must have aspect ratio 16:9');
                            }
                            return setValue('imageName', file.name);
                        }
                        return setImageError('Unknown error has occurred');
                    };
                };
                reader.readAsDataURL(file);
            });
        },
        [createProductModal, imageModal, setValue],
    );
    const { acceptedFiles, open } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg'],
        },
        maxFiles: 1,
        onDrop,
    });

    const addToCart = useMutation((vars: { id: number; pageName: string }) =>
        axios.post(`${userApiUrl}/collection/CART/${vars.pageName}?id=${vars.id}`, {}, { withCredentials: true }),
    );

    const removeCollection = useMutation(
        (vars: { id: number; collectionType: 'WISHLIST' | 'CART' | 'RESERVED'; pageName: MarketplacePage }) =>
            axios.put(
                `${userApiUrl}/collection/remove/${vars.collectionType}/${vars.pageName}?id=${vars.id}`,
                {},
                { withCredentials: true },
            ),
    );

    const { data: cart, refetch: refetchCart } = useQuery<Collection>([`Cart`], async () => (await getCollection('CART')) || [], {
        initialData: initialCart,
    });

    const { data: wishlist, refetch: refetchWishlist } = useQuery<Collection>(
        [`Wishlist`],
        async () => (await getCollection('WISHLIST')) || [],
        {
            initialData: initialWishlist,
        },
    );

    const { data: userProducts, refetch: refetchUserProducts } = useQuery('UserProducts', () => getProducts(), {
        initialData: initialUserProducts,
    });

    const createListing = useMutation(
        (vars: ItemForm) => {
            if (imageName !== undefined) {
                const form = new FormData();
                form.append('file', acceptedFiles[0]);
                Array.isArray(imageUploadUrl);
                return axios.post(imageUploadUrl, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(({ data }) =>
                    axios.post(
                        `${userApiUrl}/listing/${vars.Type}`,
                        {
                            title: vars.Title,
                            category: vars.Type === 'mine' ? 'material' : vars.Type === 'service' ? 'type' : vars.Category,
                            price: vars.Price,
                            subCategory: vars.SubCategory,
                            image_id: data.result.id,
                        },
                        { withCredentials: true },
                    ),
                );
            }
            return axios.post(
                `${userApiUrl}/listing/${vars.Type}`,
                {
                    title: vars.Title,
                    category:
                        vars.Type === 'mine' ? 'material' : vars.Type === 'service' ? 'type' : vars.Type === 'vacancy' ? '' : vars.Category,
                    price: vars.Price,
                    subCategory: vars.Type === 'vacancy' ? '' : vars.SubCategory,
                },
                { withCredentials: true },
            );
        },
        {
            onSuccess: async () => {
                await refetchUserProducts();
                setCreateProductModal(false);
            },
        },
    );

    const destroyListing = useMutation(
        (vars: { id: number; pageName: MarketplacePage }) =>
            axios.delete(`${userApiUrl}/listing/${vars.pageName}/${vars.id}`, { withCredentials: true }),
        {
            onSuccess: async () => {
                await refetchUserProducts();
            },
        },
    );

    const { data: cartCount, refetch: reFetchCartCount } = useQuery<number>(
        [`Profile-CartCount`],
        async () => {
            return getCollectionCount('CART');
        },
        {
            initialData: initialCartCount,
        },
    );

    const checkout = useMutation(() => axios.post(`${userApiUrl}/user/checkout?shouldWipeCart=false`, {}, { withCredentials: true }), {
        onSuccess: async () => {
            await refetchCart();
            await reFetchCartCount();
        },
    });

    const getCartComponent = () => {
        if (!cart || (cart && cart.length === 0)) return <h3>You have no items in your cart.</h3>;
        return cart.map(item => (
            <ProfileItem
                item={item}
                remove={{
                    fn: () =>
                        removeCollection.mutate(
                            { id: item.id, pageName: item.itemType, collectionType: 'CART' },
                            {
                                onSuccess: async () => {
                                    await refetchCart();
                                    await reFetchCartCount();
                                },
                            },
                        ),
                    test: () =>
                        removeCollection.variables?.id === item.id &&
                        removeCollection.isLoading &&
                        removeCollection.variables.pageName === item.itemType,
                }}
            />
        ));
    };

    const getWishlistComponent = () => {
        if (!wishlist || (wishlist && wishlist.length === 0)) return <h3>You have no items in your wishlist.</h3>;
        return wishlist.map(item => (
            <ProfileItem
                item={item}
                add={
                    cart && cart.every(p => p.id !== item.id)
                        ? {
                              fn: () =>
                                  addToCart.mutate(
                                      { id: item.id, pageName: item.itemType },
                                      {
                                          onSuccess: async () => {
                                              await refetchCart();
                                              await reFetchCartCount();
                                              setOpenedTab('Cart');
                                          },
                                      },
                                  ),
                              test: () =>
                                  addToCart.variables?.id === item.id &&
                                  addToCart.variables?.pageName === item.itemType &&
                                  addToCart.isLoading,
                          }
                        : undefined
                }
                remove={{
                    fn: () =>
                        removeCollection.mutate(
                            { id: item.id, collectionType: 'WISHLIST', pageName: item.itemType },
                            { onSuccess: () => refetchWishlist() },
                        ),
                    test: () =>
                        removeCollection.variables?.id === item.id &&
                        removeCollection.variables?.pageName === item.itemType &&
                        removeCollection.variables?.collectionType === 'WISHLIST' &&
                        removeCollection.isLoading,
                }}
            />
        ));
    };

    /* endregion functions */
    return (
        <>
            <Head>
                <title>Zimvest - Profile</title>
                <meta name={'description'} content={'Zimvest Profile'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>

            <Page user={user} cartCount={cartCount}>
                <Modal open={createProductModal}>
                    <form className={styles.createProduct} onSubmit={handleSubmit(vals => createListing.mutate(vals))}>
                        <h2>Create Product</h2>
                        <label htmlFor={'title'}>
                            <p>Title</p>
                            <input
                                id={'title'}
                                type={'text'}
                                placeholder={'Title'}
                                style={{ borderColor: errors.Title ? '#EC4C4C' : '#ced4da' }}
                                {...register('Title', { required: true })}
                            />
                        </label>
                        <div className={styles.label}>
                            <p>Type</p>
                            <Controller
                                name={'Type'}
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Select
                                        title={'Type'}
                                        style={{ border: `1px solid ${errors.Type ? '#EC4C4C' : '#ced4da'}` }}
                                        selectedOption={field.value}
                                        onClick={el => field.onChange(el)}
                                    >
                                        <option>mine</option>
                                        <option>product</option>
                                        <option>service</option>
                                        <option>vacancy</option>
                                    </Select>
                                )}
                            />
                        </div>
                        {type !== undefined ? (
                            <label htmlFor={'price'}>
                                <p>
                                    {type === 'product' || type === 'mine' || type === 'service' ? 'Price (USD)' : 'Salary (USD Annually)'}
                                </p>
                                <input
                                    id={'price'}
                                    type={'text'}
                                    placeholder={type === 'product' || type === 'mine' || type === 'service' ? 'Price' : 'Salary'}
                                    style={{ borderColor: errors.Price ? '#EC4C4C' : '#ced4da' }}
                                    {...register('Price', { required: true })}
                                />
                            </label>
                        ) : null}
                        {type === 'product' ? (
                            <>
                                <div className={styles.label}>
                                    <p>Category</p>
                                    <Controller
                                        name={'Category'}
                                        rules={{ required: true }}
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                title={'Category'}
                                                style={{ border: `1px solid ${errors.Category ? '#EC4C4C' : '#ced4da'}` }}
                                                selectedOption={field.value}
                                                onClick={el => field.onChange(el)}
                                            >
                                                {productExtendedSidebarLayout.map(i => (
                                                    <option>{i.title}</option>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </div>
                                {category !== undefined ? (
                                    <div className={styles.label}>
                                        <p>Sub-Category</p>
                                        <Controller
                                            name={'SubCategory'}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    title={'Sub Category'}
                                                    selectedOption={field.value}
                                                    onClick={el => field.onChange(el)}
                                                >
                                                    {(
                                                        productExtendedSidebarLayout.find(i => i.title === category) || { subList: [''] }
                                                    ).subList.map(e => (
                                                        <option>{e}</option>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    </div>
                                ) : null}
                            </>
                        ) : null}
                        {type === 'mine' || type === 'service' ? (
                            <div className={styles.label}>
                                <p>{type === 'mine' ? 'Material' : 'Type'}</p>
                                <Controller
                                    name={'SubCategory'}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            title={type === 'mine' ? 'Material' : 'Type'}
                                            style={{ border: `1px solid ${errors.SubCategory ? '#EC4C4C' : '#ced4da'}` }}
                                            selectedOption={field.value}
                                            onClick={el => field.onChange(el)}
                                        >
                                            {(type === 'mine' ? metals : serviceExtendedSidebarLayout[0].subList).map(i => (
                                                <option>{i}</option>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </div>
                        ) : null}
                        {imageName !== undefined ? <h4>Image: {imageName}</h4> : null}
                        <button
                            type={'button'}
                            onClick={async () => {
                                setImageUploadUrl((await axios.post(`${userApiUrl}/image/upload`)).data.uploadURL);
                                open();
                            }}
                            className={styles.imageButton}
                        >
                            {imageName !== undefined ? 'Change Image' : 'Add Image'}
                        </button>
                        <div className={styles.controls}>
                            <button type={'button'} onClick={() => setCreateProductModal(false)}>
                                Cancel
                            </button>
                            <button type={'submit'} className={createListing.isLoading ? styles.loading : ''}>
                                Create
                            </button>
                        </div>
                    </form>
                </Modal>
                <Modal open={checkoutCompleteModal}>
                    <div className={styles.checkoutComplete}>
                        <h3>Checkout complete!</h3>
                        <h4>
                            Emails have been sent to each of the suppliers <br />
                            they should be in contact with you shortly
                        </h4>
                    </div>
                </Modal>
                <div className={styles.main}>
                    <Collapse
                        title={'Account'}
                        open={openedTab === 'Account'}
                        onClick={() => setOpenedTab(openedTab === 'Account' ? '' : 'Account')}
                    >
                        <div>
                            <ManageAccount initialUser={initialUser} />
                            {user.image_id?.includes('https://lh3.googleusercontent.com') ? null : <ChangePassword />}
                        </div>
                    </Collapse>
                    <Collapse
                        title={'Shopping Cart'}
                        open={openedTab === 'Cart'}
                        onClick={() => setOpenedTab(openedTab === 'Cart' ? '' : 'Cart')}
                    >
                        <div className={styles.wishlist}>
                            <h2>Cart</h2>
                            {checkout.isSuccess ? <h3>Emails about your inquiries successfully sent</h3> : getCartComponent()}

                            {cart && cart.length !== 0 ? (
                                <button
                                    type={'button'}
                                    onClick={() =>
                                        checkout.mutate(undefined, {
                                            onSuccess: () => {
                                                setCheckoutCompleteModal(true);
                                                setTimeout(() => setCheckoutCompleteModal(false), 1500);
                                            },
                                        })
                                    }
                                    className={`${styles.checkoutButton} ${checkout.isLoading ? styles.loading : ''}`}
                                >
                                    Checkout
                                </button>
                            ) : null}
                        </div>
                    </Collapse>
                    <Collapse
                        title={'Wishlist'}
                        open={openedTab === 'Wishlist'}
                        onClick={() => setOpenedTab(openedTab === 'Wishlist' ? '' : 'Wishlist')}
                    >
                        <div className={styles.wishlist}>
                            <h2>Wishlist</h2>
                            {getWishlistComponent()}
                        </div>
                    </Collapse>
                    <Collapse
                        title={'Products'}
                        open={openedTab === 'Products'}
                        onClick={() => setOpenedTab(openedTab === 'Products' ? '' : 'Products')}
                    >
                        <div className={styles.wishlist}>
                            <h2>Products</h2>
                            <button
                                type={'button'}
                                className={styles.createButton}
                                onClick={() => {
                                    reset({
                                        Title: '',
                                        Price: undefined,
                                        Type: undefined,
                                        Category: undefined,
                                        SubCategory: undefined,
                                    });
                                    setCreateProductModal(true);
                                }}
                            >
                                Create
                            </button>
                            {(userProducts?.mines.length || 0) +
                                (userProducts?.products.length || 0) +
                                (userProducts?.services.length || 0) +
                                (userProducts?.vacancies.length || 0) ===
                            0 ? (
                                <h3>You have no products currently</h3>
                            ) : (
                                <>
                                    <UserListing items={userProducts?.products || []} pageName={'product'} deleteListing={destroyListing} />
                                    <UserListing items={userProducts?.mines || []} pageName={'mine'} deleteListing={destroyListing} />
                                    <UserListing
                                        items={userProducts?.vacancies || []}
                                        pageName={'vacancy'}
                                        deleteListing={destroyListing}
                                    />
                                    <UserListing items={userProducts?.services || []} pageName={'service'} deleteListing={destroyListing} />
                                </>
                            )}
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
        query.section !== 'cart' &&
        query.section !== 'reservations'
    )
        return {
            redirect: {
                destination: '/profile',
                permanent: true,
            },
        };
    const user = await getUserInfo(req, { redirect: { destination: '/login', permanent: true } });
    if ('redirect' in user) {
        return user;
    }
    const cart = await getCollection('CART', { headers: { cookie: req.headers.cookie || '' } });
    const wishlist = await getCollection('WISHLIST', { headers: { cookie: req.headers.cookie || '' } });
    const products = await getProducts({ headers: { cookie: req.headers.cookie || '' } });

    return {
        props: {
            cart: cart || undefined,
            initialUserProducts: products,
            ...user.props,
            wishlist: wishlist || undefined,
            initialCartCount: cart?.length || 0,
        },
    };
};

export default Profile;
