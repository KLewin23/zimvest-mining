import React from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useMutation } from 'react-query';
import axios from 'axios';
import { BannerPage, getCollectionCount, getUserInfo, Page, User, userApiUrl } from '../components';
import styles from '../styles/contact.module.scss';
import Notification from '../components/Notification';
import { useNotification } from '../components/hooks';

interface Props {
    user?: User;
    cartCount?: number;
}

interface FormValues {
    email: string;
    title: string;
    message: string;
}

const Contact = ({ user, cartCount }: Props): JSX.Element => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        setError,
    } = useForm<FormValues>({
        defaultValues: {
            email: user ? user.email : '',
        },
    });

    const [notifStatus, message, setMessage] = useNotification();

    const errorMessage = () => {
        const firstError = (['email', 'title', 'message'] as (keyof FormValues)[]).find(err => errors[err]);
        if (!firstError) return '';
        switch (errors[firstError]?.type) {
            case 'required':
                return `${firstError} is a required field.`;
            case 'server_error':
            default:
                return 'Something is wrong in the form.';
        }
    };

    const sendMessage = useMutation(
        (data: FormValues) =>
            axios.post(
                `${userApiUrl}/message`,
                {
                    ...data,
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
            onSuccess: () => {
                reset();
                setMessage('Your message has been successfully sent');
            },
            onError: () => {
                return setError('email', { type: 'server_error' });
            },
        },
    );

    return (
        <>
            <Head>
                <title>Zimvest</title>
                <meta name={'description'} content={'Zimvest Home'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>
            <Page user={user} withCurrencyWidget cartCount={cartCount}>
                <BannerPage heading={'Contact Us'} subHeading={'Ask us any questions you may have.'}>
                    <Notification open={notifStatus} highlightColor={'green'}>
                        {message}
                    </Notification>
                    <form onSubmit={handleSubmit(v => sendMessage.mutate(v))} className={styles.form}>
                        <label htmlFor={'email'}>
                            <p>Email</p>
                            <input
                                id={'email'}
                                type={'email'}
                                placeholder={'Enter Your Email'}
                                style={{ borderColor: errors.email ? '#EC4C4C' : '#ced4da' }}
                                {...register('email', { required: true })}
                            />
                        </label>
                        <label htmlFor={'title'}>
                            <p>Title</p>
                            <input
                                id={'title'}
                                type={'text'}
                                placeholder={'Enter Title'}
                                style={{ borderColor: errors.title ? '#EC4C4C' : '#ced4da' }}
                                {...register('title', { required: true, maxLength: 32 })}
                            />
                        </label>
                        <label htmlFor={'message'}>
                            <p>Message</p>
                            <textarea
                                id={'message'}
                                placeholder={'Enter Your Message'}
                                style={{ borderColor: errors.message ? '#EC4C4C' : '#ced4da' }}
                                {...register('message', { required: true, maxLength: 256 })}
                            />
                        </label>

                        <h4>We will contact you via email once we have received your query and had time to respond</h4>

                        <h4 className={styles.errorMessage} style={{ marginBottom: errorMessage() ? '0.75rem' : 0 }}>
                            {errorMessage() || ''}
                        </h4>

                        <button type={'submit'} className={`${styles.zim_button} ${sendMessage.isLoading ? styles.loading : null}`}>
                            Send
                        </button>
                    </form>
                </BannerPage>
                .
            </Page>
        </>
    );
};

export default Contact;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const user = await getUserInfo(req, {});
    if ('props' in user) {
        const cartCount = await getCollectionCount('CART', { headers: { cookie: req.headers.cookie || '' } });
        return {
            props: {
                ...user.props,
                cartCount,
            },
        };
    }
    return {
        props: {},
    };
};
