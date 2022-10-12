import React, { useCallback, useState } from 'react';
import NextImage from 'next/image';
import { useMutation, useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import { MdFacebook } from 'react-icons/md';
import { FaGlobe, FaImage, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import Modal from './Modal';
import { fetchUser, userApiUrl } from './utils';
import { AccountFormValues, User } from './types';
import styles from '../styles/profile.module.scss';

interface Props {
    initialUser: User;
}

const ManageAccount = ({ initialUser }: Props): JSX.Element => {
    const router = useRouter();
    const [imageModal, setImageModal] = useState(false);
    const [imageId, setImageId] = useState(initialUser.image_id);
    const [profileImage, setProfileImage] = useState('');
    const [imageError, setImageError] = useState('');
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
                        if (imageModal) {
                            if (image.width !== image.height) {
                                setImageError('Image must be square');
                                return setProfileImage('');
                            }
                            setImageError('');
                            return setProfileImage((reader.result as string) || '');
                        }
                        return setImageError('Unknown error has occurred');
                    };
                };
                reader.readAsDataURL(file);
            });
        },
        [imageModal],
    );
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
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

    const { data: user, refetch: refetchUser } = useQuery('Profile,User', async () => (await fetchUser()).data, {
        initialData: initialUser,
    });

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
                await router.push('/profile');
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

    const uploadImage = useMutation(
        async () => {
            const imageUploadUrl = (await axios.post(`${userApiUrl}/image/upload`)).data.uploadURL;
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

    return (
        <>
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
                                setProfileImage('');
                                setImageModal(true);
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
                            <input id={'lastName'} type={'text'} placeholder={'Last name'} {...register('Last Name', { required: true })} />
                        </label>
                        <label htmlFor={'email'} className={styles.firstCol}>
                            <p>Email</p>
                            <input id={'email'} type={'email'} disabled placeholder={'Email'} {...register('Email', { required: true })} />
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
                            <input id={'facebook'} type={'text'} placeholder={'Facebook Url'} {...register('Facebook Url')} />
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
                            <input id={'twitter'} type={'text'} placeholder={'Twitter handle'} {...register('Twitter Handle')} />
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
        </>
    );
};

// const Test = ({ initialUser }: Props) => {
//     return <div>{initialUser.role}</div>;
// };

export default ManageAccount;
