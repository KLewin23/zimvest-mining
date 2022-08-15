import axios from 'axios';
import Head from 'next/head';
// eslint-disable-next-line import/no-named-default
import { default as NextImage } from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import { Controller, useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import React, { useCallback, useState } from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { FaGlobe, FaImage, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { MdFacebook, MdInfoOutline, MdOutlineFileDownload } from 'react-icons/md';
import styles from '../../styles/profile.module.scss';
import { Collapse, getUserInfo, Modal, Page, User, userApiUrl } from '../../components';
import { getCart, getProducts, getWishlist } from '../../components/utils';
import type { AccountFormValues, Collection, MarketplacePage, UserProducts } from '../../components/types';
import Select from '../../components/Select';

interface Props {
    user: User;
    wishlist?: Collection;
    cart?: Collection;
    userProducts?: UserProducts;
    cartCount?: number;
}

interface ItemForm {
    Title: string;
    Price: number;
    Type: MarketplacePage;
    Category: string;
    SubCategory: string;
}

const Section = ({ user, cart: initialCart, wishlist: initialWishlist, cartCount, userProducts }: Props): JSX.Element => {
    const { push, query } = useRouter();
    const [openedTab, setOpenedTab] = useState(
        query.section === 'account'
            ? 'Account'
            : query.section === 'products'
            ? 'Products'
            : query.section === 'cart'
            ? 'Cart'
            : query.section === 'wishlist'
            ? 'Wishlist'
            : '',
    );
    const [apiRequestSent, setApiRequestSent] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [imageUploadUrl, setImageUploadUrl] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [imageError, setImageError] = useState('');
    const [imageId, setImageId] = useState(user.image_id);
    const [createProductModal, setCreateProductModal] = useState(false);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();

            reader.onabort = () => null;
            reader.onerror = () => null;

            // reader.onabort = () => console.log('file reading was aborted');
            // reader.onerror = () => console.log('file reading has failed');
            reader.onload = () => {
                // Do whatever you want with the file contents
                const image = new Image();
                image.src = reader.result?.toString() || '';
                image.onload = () => {
                    if (image.width !== image.height) {
                        setImageError('Image must be square');
                        return setProfileImage('');
                    }
                    const binaryStr = reader.result;
                    setImageError('');
                    return setProfileImage((binaryStr as string) || '');
                };
            };
            reader.readAsDataURL(file);
        });
    }, []);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg'],
        },
        maxFiles: 1,
        onDrop,
    });

    const { register, setError, handleSubmit } = useForm<AccountFormValues>({
        defaultValues: {
            'First Name': user.first_name,
            'Last Name': user.last_name,
            Email: user.email,
            'Phone number': user?.phone_number,
            Location: user.location,
            'Company Name': user?.company_name,
            'Facebook Url': user?.facebook,
            'WhatsApp Url': user?.whatsapp,
            'Twitter Handle': user?.twitter,
            'Website Url': user?.company_website,
        },
    });
    const { register: registerAdd, control, watch } = useForm<ItemForm>();
    const type = watch('Type');

    const uploadImage = useMutation(
        () => {
            const form = new FormData();
            form.append('file', acceptedFiles[0]);
            Array.isArray(imageUploadUrl);
            return axios
                .post(imageUploadUrl, form, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res =>
                    axios
                        .post(`${userApiUrl}/image/link/USER/${res.data.result.id}`, {}, { withCredentials: true })
                        .then(() => setImageId(res.data.result.id)),
                );
        },
        { onSuccess: () => setImageModal(false) },
    );

    const save = (data: AccountFormValues) => {
        setApiRequestSent(true);
        axios
            .put(
                `${userApiUrl}/user`,
                {
                    firstName: data['First Name'],
                    lastName: data['Last Name'],
                    email: data.Email,
                    phoneNumber: data['Phone number'],
                    location: data.Location,
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

    const addToCart = useMutation((vars: { id: number; pageName: string }) =>
        axios.post(`${userApiUrl}/collection/CART/${vars.pageName.toUpperCase()}?id=${vars.id}`, {}, { withCredentials: true }),
    );

    const removeCollection = useMutation(
        (vars: { id: number; collectionType: 'WISHLIST' | 'CART' | 'RESERVED'; pageName: MarketplacePage }) =>
            axios.put(
                `${userApiUrl}/collection/remove/${vars.collectionType}/${vars.pageName}?id=${vars.id}`,
                {},
                { withCredentials: true },
            ),
    );

    const { data: cart, refetch: refetchCart } = useQuery<Collection>([`Cart`], async () => getCart(), {
        initialData: initialCart,
    });

    const { data: wishlist, refetch: refetchWishlist } = useQuery<Collection>(
        [`Wishlist`],
        async () => (await getWishlist()) || { products: [], mines: [] },
        {
            initialData: initialWishlist,
        },
    );

    const createItem = (
        { title, image_id, supplier: { email }, price }: { title: string; supplier: { email: string }; price: number; image_id?: string },
        add?: { fn: () => void; test: () => boolean },
        remove?: { fn: () => void; test: () => boolean },
    ) => {
        return (
            <div key={title}>
                {image_id ? (
                    <NextImage src={`https://imagedelivery.net/RwHbfJFaRWbC2holDi8g-w/${image_id}/public`} />
                ) : (
                    <FaImage size={100} color={'#E5E5E5'} />
                )}
                <div className={styles.text}>
                    <h3>{title}</h3>
                    <p>{email}</p>
                    <p>
                        <span>${price}</span>
                    </p>
                </div>
                <div className={styles.buttons}>
                    {add ? (
                        <button
                            type={'button'}
                            className={`${styles.addToCart} ${add.test() ? styles.loading : ''}`}
                            onClick={() => add.fn()}
                        >
                            Add to cart
                        </button>
                    ) : null}
                    {remove ? (
                        <button
                            type={'button'}
                            className={`${styles.productsRemove} ${remove.test() ? styles.loading : ''}`}
                            onClick={() => remove.fn()}
                        >
                            Remove
                        </button>
                    ) : null}
                </div>
            </div>
        );
    };

    // TODO add quantity
    const getCartComponent = () => {
        if (!cart || (cart && cart.products.length === 0 && cart.mines.length === 0)) return <h3>You have no items in your cart.</h3>;
        const products = cart.products.map(product =>
            createItem(product, undefined, {
                fn: () =>
                    removeCollection.mutate(
                        { id: product.id, pageName: 'product', collectionType: 'CART' },
                        {
                            onSuccess: () => refetchCart(),
                        },
                    ),
                test: () =>
                    removeCollection.variables?.id === product.id &&
                    removeCollection.isLoading &&
                    removeCollection.variables.pageName === 'product',
            }),
        );
        const mines = cart.mines.map(mine =>
            createItem(mine, undefined, {
                fn: () =>
                    removeCollection.mutate(
                        { id: mine.id, pageName: 'mine', collectionType: 'CART' },
                        {
                            onSuccess: () => refetchCart(),
                        },
                    ),
                test: () =>
                    removeCollection.variables?.id === mine.id &&
                    removeCollection.isLoading &&
                    removeCollection.variables.pageName === 'mine' &&
                    removeCollection.variables.collectionType === 'CART',
            }),
        );
        return (
            <>
                {products}
                {mines}
            </>
        );
    };

    const getWishlistComponent = () => {
        if (!wishlist || (wishlist && wishlist.products.length === 0 && wishlist.mines.length === 0))
            return <h3>You have no items in your wishlist.</h3>;
        const products = wishlist.products.map(product =>
            createItem(
                product,
                cart && cart.products && cart.products.every(p => p.id !== product.id)
                    ? {
                          fn: () =>
                              addToCart.mutate(
                                  { id: product.id, pageName: 'product' },
                                  {
                                      onSuccess: async () => {
                                          await refetchCart();
                                          setOpenedTab('Cart');
                                      },
                                  },
                              ),
                          test: () =>
                              addToCart.variables?.id === product.id && addToCart.variables?.pageName === 'product' && addToCart.isLoading,
                      }
                    : undefined,
                {
                    fn: () =>
                        removeCollection.mutate(
                            { id: product.id, collectionType: 'WISHLIST', pageName: 'product' },
                            { onSuccess: () => refetchWishlist() },
                        ),
                    test: () =>
                        removeCollection.variables?.id === product.id &&
                        removeCollection.variables?.pageName === 'product' &&
                        removeCollection.variables?.collectionType === 'WISHLIST' &&
                        removeCollection.isLoading,
                },
            ),
        );
        const mines = wishlist.mines.map(mine =>
            createItem(
                mine,
                cart && cart.mines && cart.mines.every(m => m.id !== mine.id)
                    ? {
                          fn: () => addToCart.mutate({ id: mine.id, pageName: 'mine' }),
                          test: () =>
                              addToCart.variables?.id === mine.id && addToCart.variables?.pageName === 'mine' && addToCart.isLoading,
                      }
                    : undefined,
                {
                    fn: () => removeCollection.mutate({ id: mine.id, collectionType: 'WISHLIST', pageName: 'mine' }),
                    test: () =>
                        removeCollection.variables?.id === mine.id &&
                        removeCollection.variables?.pageName === 'mine' &&
                        removeCollection.variables?.collectionType === 'WISHLIST' &&
                        removeCollection.isLoading,
                },
            ),
        );
        return (
            <>
                {products}
                {mines}
            </>
        );
    };

    return (
        <>
            <Head>
                <title>Zimvest - Profile</title>
                <meta name={'description'} content={'Zimvest Profile'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>
            <Page user={user} cartCount={cartCount}>
                <Modal open={imageModal}>
                    <div className={styles.changeImageBox}>
                        <div
                            {...getRootProps()}
                            className={styles.dragBox}
                            style={{ border: imageError === '' ? '3px dashed #a6a6a6' : '3px dashed #EC4C4CFF' }}
                        >
                            <input type={'file'} {...getInputProps()} id={'myFile'} name={'file'} />
                            {profileImage === '' ? (
                                <div className={styles.center}>
                                    <button type={'button'}>
                                        <FaImage size={100} color={'white'} />
                                        <p>Add Image</p>
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.imageFrame}>
                                    <NextImage src={profileImage} layout={'fill'} />
                                </div>
                            )}
                        </div>
                        <p>{imageError}</p>
                        <div className={styles.controls}>
                            <button type={'button'} onClick={() => setImageModal(false)}>
                                Cancel
                            </button>
                            <button
                                type={'button'}
                                className={uploadImage.isLoading ? styles.loading : ''}
                                onClick={() => uploadImage.mutate()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </Modal>
                <Modal open={createProductModal}>
                    <div className={styles.createProduct}>
                        <h2>Create Product</h2>
                        <label htmlFor={'title'}>
                            <p>Title</p>
                            <input
                                id={'title'}
                                type={'text'}
                                placeholder={'Title'}
                                // style={{ borderColor: false ? '#EC4C4C' : '#ced4da' }}
                                {...registerAdd('Title', { required: true })}
                            />
                        </label>
                        <label htmlFor={'price'}>
                            <p>Price</p>
                            <input
                                id={'price'}
                                type={'text'}
                                placeholder={'Price'}
                                // style={{ borderColor: false ? '#EC4C4C' : '#ced4da' }}
                                {...registerAdd('Price', { required: true })}
                            />
                        </label>
                        <div className={styles.label}>
                            <p>Type</p>
                            <Controller
                                name={'Type'}
                                control={control}
                                rules={{ validate: { isTrue: value => value } }}
                                render={({ field }) => (
                                    <Select title={'Type'} selectedOption={field.value} onClick={el => field.onChange(el)}>
                                        <option>mine</option>
                                        <option>product</option>
                                        <option>service</option>
                                        <option>vacancy</option>
                                    </Select>
                                )}
                            />
                        </div>
                        {type === 'product' || type === 'mine' ? (
                            <>
                                <div className={styles.label}>
                                    <p>Category</p>
                                    <Select title={'Category'} onClick={() => null}>
                                        <option>idk</option>
                                    </Select>
                                </div>
                                <div className={styles.label}>
                                    <p>Sub-Category</p>
                                    <Select title={'Sub-Category'} onClick={() => null}>
                                        <option>idk</option>
                                    </Select>
                                </div>
                            </>
                        ) : null}
                        <div className={styles.controls}>
                            <button type={'button'} onClick={() => setCreateProductModal(false)}>
                                Cancel
                            </button>
                            <button
                                type={'button'}
                                className={uploadImage.isLoading ? styles.loading : ''}
                                onClick={() => uploadImage.mutate()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </Modal>
                <div className={styles.main}>
                    <Collapse
                        title={'Account'}
                        open={openedTab === 'Account'}
                        onClick={() => setOpenedTab(openedTab === 'Account' ? '' : 'Account')}
                    >
                        <form onSubmit={handleSubmit(save)} className={styles.account}>
                            <div className={styles.layer1}>
                                <NextImage
                                    src={
                                        user.image_id
                                            ? user.image_id.includes('https://lh3.googleusercontent.com')
                                                ? user.image_id
                                                : `https://imagedelivery.net/RwHbfJFaRWbC2holDi8g-w/${imageId}/public`
                                            : 'https://imagedelivery.net/RwHbfJFaRWbC2holDi8g-w/3cdfe47c-d030-4451-4024-d60667f84800/public'
                                    }
                                    layout={'fixed'}
                                    height={88}
                                    width={88}
                                    className={styles.profilePic}
                                />
                                <div>
                                    <h2>
                                        {user?.first_name} {user?.last_name}
                                    </h2>
                                    <h4>{user?.email}</h4>
                                    <button
                                        type={'button'}
                                        onClick={async () => {
                                            setImageUploadUrl('');
                                            setProfileImage('');
                                            setImageModal(true);
                                            setImageUploadUrl((await axios.post(`${userApiUrl}/image/upload`)).data.uploadURL);
                                        }}
                                        className={styles.changePhoto}
                                    >
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
                                    <label htmlFor={'location'} className={styles.firstCol}>
                                        <p>Location</p>
                                        <input id={'location'} type={'text'} placeholder={'Location'} {...register('Location')} />
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
                            {user.image_id?.includes('https://lh3.googleusercontent.com') ? null : (
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
                            )}

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
                        title={'Shopping Cart'}
                        open={openedTab === 'Cart'}
                        onClick={() => setOpenedTab(openedTab === 'Cart' ? '' : 'Cart')}
                    >
                        <div className={styles.wishlist}>
                            <h2>Cart</h2>
                            {getCartComponent()}
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
                            <button type={'button'} className={styles.createButton} onClick={() => setCreateProductModal(true)}>
                                Create
                            </button>
                            {userProducts && userProducts.length !== 0 ? (
                                userProducts.map(item => (
                                    <div key={item.title}>
                                        {item.image_id ? (
                                            <NextImage src={`https://imagedelivery.net/RwHbfJFaRWbC2holDi8g-w/${item.image_id}/public`} />
                                        ) : (
                                            <FaImage size={100} color={'#E5E5E5'} />
                                        )}
                                        <div className={styles.text}>
                                            <h3>{item.title}</h3>
                                            <p>Views: {item.views}</p>
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
                                ))
                            ) : (
                                <h3>You have no products currently</h3>
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

    const cart = await getCart({ headers: { cookie: req.headers.cookie || '' } });
    const wishlist = await getWishlist({ headers: { cookie: req.headers.cookie || '' } });
    const products = await getProducts({ headers: { cookie: req.headers.cookie || '' } });
    const user = await getUserInfo(req, { redirect: { destination: '/login', permanent: true } });

    if ('redirect' in user) {
        return user;
    }

    return { props: { cart, userProducts: products, ...user.props, wishlist: wishlist || undefined } };
};

export default Section;
