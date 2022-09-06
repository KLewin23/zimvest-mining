import axios from 'axios';
import Head from 'next/head';
import PhoneInput from 'react-phone-number-input';
// eslint-disable-next-line import/no-named-default
import { default as NextImage } from 'next/image';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import { Controller, useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import React, { useCallback, useState } from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { FaGlobe, FaImage, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { MdFacebook } from 'react-icons/md';
import styles from '../../styles/profile.module.scss';
import {
    AccountFormValues,
    ChangePassword,
    Collapse,
    Collection,
    fetchUser,
    getCollection,
    getCollectionCount,
    getProducts,
    getUserInfo,
    MarketplacePage,
    metals,
    Modal,
    Page,
    productExtendedSidebarLayout,
    Select,
    serviceExtendedSidebarLayout,
    User,
    userApiUrl,
    UserProductPrice,
    UserProducts,
    UserProductSalary,
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

    const { push, query } = useRouter();
    const { data: user, refetch: refetchUser } = useQuery('Profile,User', async () => (await fetchUser()).data, {
        initialData: initialUser,
    });

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
    const [imageModal, setImageModal] = useState(false);
    const [imageUploadUrl, setImageUploadUrl] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [imageError, setImageError] = useState('');
    const [checkoutCompleteModal, setCheckoutCompleteModal] = useState(false);
    const [imageId, setImageId] = useState(initialUser.image_id);
    const [createProductModal, setCreateProductModal] = useState(false);
    const {
        register: registerAdd,
        control,
        watch,
        reset,
        setValue,
        handleSubmit: handleItemSubmit,
        formState: { errors: itemErrors },
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
    const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpeg'],
        },
        maxFiles: 1,
        onDrop,
    });
    const {
        register,
        setError,
        handleSubmit,
        reset: resetUser,
        control: accountControl,
    } = useForm<AccountFormValues>({
        defaultValues: {
            'First Name': initialUser.first_name,
            'Last Name': initialUser.last_name,
            Email: initialUser.email,
            'Phone number': initialUser?.phone_number,
            Location: initialUser.location,
            'Company Name': initialUser?.company_name,
            'Facebook Url': initialUser?.facebook,
            'WhatsApp Number': initialUser?.whatsapp,
            'Twitter Handle': initialUser?.twitter,
            'Website Url': initialUser?.company_website,
        },
    });

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

    const account = useMutation(
        (data: AccountFormValues) =>
            axios.put(
                `${userApiUrl}/user`,
                {
                    firstName: data['First Name'],
                    lastName: data['Last Name'],
                    email: data.Email,
                    phoneNumber: data['Phone number'],
                    location: data.Location,
                    companyName: data['Company Name'],
                    facebookUrl: data['Facebook Url'],
                    whatsAppNumber: data['WhatsApp Number'],
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
            ),
        {
            onSuccess: async () => {
                await push('/profile');
                await refetchUser().then(usr => {
                    resetUser({
                        'First Name': usr.data.first_name,
                        'Last Name': usr.data.last_name,
                        Email: usr.data.email,
                        'Phone number': usr.data?.phone_number,
                        Location: usr.data.location,
                        'Company Name': usr.data?.company_name,
                        'Facebook Url': usr.data?.facebook,
                        'WhatsApp Number': usr.data?.whatsapp,
                        'Twitter Handle': usr.data?.twitter,
                        'Website Url': usr.data?.company_website,
                    });
                });
            },
            onError: (e: { response: { status: number } }) => {
                if (e.response.status === 403 || e.response.status === 400) {
                    setError('Email', { type: 'invalid' });
                }
                setError('Email', { type: 'server_error' });
            },
        },
    );

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

    const { data: cart, refetch: refetchCart } = useQuery<Collection>(
        [`Cart`],
        async () => (await getCollection('CART')) || { products: [], mines: [] },
        {
            initialData: initialCart,
        },
    );

    const { data: wishlist, refetch: refetchWishlist } = useQuery<Collection>(
        [`Wishlist`],
        async () => (await getCollection('WISHLIST')) || { products: [], mines: [] },
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

    const createItem = (
        { title, image_id, supplier: { email }, price }: { title: string; supplier: { email: string }; price: number; image_id?: string },
        add?: { fn: () => void; test: () => boolean },
        remove?: { fn: () => void; test: () => boolean },
    ) => {
        return (
            <div key={title}>
                <NextImage
                    width={160}
                    height={90}
                    src={
                        image_id
                            ? `https://imagedelivery.net/RwHbfJFaRWbC2holDi8g-w/${image_id}/public`
                            : 'https://imagedelivery.net/RwHbfJFaRWbC2holDi8g-w/2e3a5e35-2fbe-402a-9e5c-f19a60f85900/public'
                    }
                />
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

    const getCartComponent = () => {
        if (!cart || (cart && cart.products.length === 0 && cart.mines.length === 0)) return <h3>You have no items in your cart.</h3>;
        const products = cart.products.map(product =>
            createItem(product, undefined, {
                fn: () =>
                    removeCollection.mutate(
                        { id: product.id, pageName: 'product', collectionType: 'CART' },
                        {
                            onSuccess: async () => {
                                await refetchCart();
                                await reFetchCartCount();
                            },
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
                            onSuccess: async () => {
                                await refetchCart();
                                await reFetchCartCount();
                            },
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
                                          await reFetchCartCount();
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

    const userListings = (items: UserProductPrice[] | UserProductSalary[], pageName: MarketplacePage) =>
        items.map(item => (
            <div key={item.title}>
                {item.image_id ? (
                    <NextImage src={`https://imagedelivery.net/RwHbfJFaRWbC2holDi8g-w/${item.image_id}/public`} />
                ) : (
                    <FaImage size={100} color={'#E5E5E5'} />
                )}
                <div className={styles.text}>
                    <h3>{item.title}</h3>
                    <p>
                        Views: <span>{item.views || 0}</span>
                    </p>

                    {'price' in item ? (
                        <p>
                            Price:
                            <span> ${item?.price}</span>
                        </p>
                    ) : null}
                    {'salary' in item ? (
                        <p>
                            Salary:
                            <span> ${item?.salary}</span>
                        </p>
                    ) : null}
                </div>
                <div>
                    <button
                        type={'button'}
                        className={`${styles.productsRemove} ${destroyListing.isLoading ? styles.loading : ''}`}
                        onClick={() => destroyListing.mutate({ id: item.id, pageName })}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));

    /* endregion functions */
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
                    <form className={styles.createProduct} onSubmit={handleItemSubmit(vals => createListing.mutate(vals))}>
                        <h2>Create Product</h2>
                        <label htmlFor={'title'}>
                            <p>Title</p>
                            <input
                                id={'title'}
                                type={'text'}
                                placeholder={'Title'}
                                style={{ borderColor: itemErrors.Title ? '#EC4C4C' : '#ced4da' }}
                                {...registerAdd('Title', { required: true })}
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
                                        style={{ border: `1px solid ${itemErrors.Type ? '#EC4C4C' : '#ced4da'}` }}
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
                                    style={{ borderColor: itemErrors.Price ? '#EC4C4C' : '#ced4da' }}
                                    {...registerAdd('Price', { required: true })}
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
                                                style={{ border: `1px solid ${itemErrors.Category ? '#EC4C4C' : '#ced4da'}` }}
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
                                            style={{ border: `1px solid ${itemErrors.SubCategory ? '#EC4C4C' : '#ced4da'}` }}
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
                            <form onSubmit={handleSubmit(v => account.mutate(v))} className={styles.account}>
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
                                                disabled
                                                placeholder={'Email'}
                                                {...register('Email', { required: true })}
                                            />
                                        </label>
                                        <div className={styles.firstCol}>
                                            <p>Phone number</p>
                                            <Controller
                                                name={'Phone number'}
                                                control={accountControl}
                                                render={({ field }) => (
                                                    <PhoneInput
                                                        onChange={value => field.onChange(value)}
                                                        value={field.value}
                                                        defaultCountry={'ZW'}
                                                        placeholder={'Phone number'}
                                                    />
                                                )}
                                            />
                                        </div>
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
                                <section>
                                    <h3>Social Media</h3>
                                    <div className={styles.socialMedia}>
                                        <label htmlFor={'facebook'}>
                                            <MdFacebook size={'30px'} color={'#BBBBBB'} />
                                            <input
                                                id={'facebook'}
                                                type={'text'}
                                                placeholder={'Facebook Url'}
                                                {...register('Facebook Url')}
                                            />
                                        </label>
                                        <div>
                                            <FaWhatsapp size={'30px'} color={'#BBBBBB'} />
                                            <Controller
                                                name={'WhatsApp Number'}
                                                control={accountControl}
                                                render={({ field }) => (
                                                    <PhoneInput
                                                        onChange={value => field.onChange(value)}
                                                        value={field.value}
                                                        className={styles.phoneInput}
                                                        defaultCountry={'ZW'}
                                                        placeholder={'WhatsApp number'}
                                                        smartCaret
                                                    />
                                                )}
                                            />
                                        </div>
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
                                        <button className={`${styles.firstCol} ${account.isLoading ? styles.loading : ''}`} type={'submit'}>
                                            Save
                                        </button>
                                    </div>
                                </section>
                            </form>
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

                            {(cart?.products.length || 0) + (cart?.mines.length || 0) !== 0 ? (
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
                                    {userListings(userProducts?.products || [], 'product')}
                                    {userListings(userProducts?.mines || [], 'mine')}
                                    {userListings(userProducts?.vacancies || [], 'vacancy')}
                                    {userListings(userProducts?.services || [], 'service')}
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
            initialCartCount: (cart?.products.length || 0) + (cart?.mines.length || 0),
        },
    };
};

export default Profile;
