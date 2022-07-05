import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import Page from '../components/Page';
import styles from '../styles/auth.module.scss';
import { GoogleIcon, Logo } from '../public';
import Checkbox from '../components/Checkbox';
import { fetchUser, userApiUrl } from '../components/utils';

// TODO maybe make this a sort of client side rendered component to make switching between login and signup smoother

interface FormValues {
    email: string;
    password: string;
}

const Login = (): JSX.Element => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        setError,
    } = useForm<FormValues>();
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const login: SubmitHandler<FormValues> = data => {
        axios
            .post(
                `${userApiUrl}/session`,
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
            )
            .then(async () => {
                await router.push('/');
            })
            .catch(e => {
                if (e.response.status === 403 || e.response.status === 400) {
                    setError('email', { type: 'invalid' });
                }
                console.log(e);
            });
    };

    const errorMessage = () => {
        const firstError = (['email', 'password'] as (keyof FormValues)[]).find(err => errors[err]);
        if (!firstError) return '';
        switch (errors[firstError]?.type) {
            case 'required': {
                return `${firstError} is a required field.`;
            }
            case 'invalid': {
                return 'Incorrect email or password';
            }
            default:
                return 'Something is wrong in the form.';
        }
    };

    return (
        <>
            <Head>
                <title>Zimvest - login</title>
                <meta name={'description'} content={'Zimvest Login'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>
            <Page>
                <div className={styles.main}>
                    <div className={styles.authBox}>
                        <form onSubmit={handleSubmit(login)}>
                            <Image src={Logo} width={150} height={60} />
                            <div className={styles.inputs}>
                                <label htmlFor={'email'} className={styles.email}>
                                    <p>Email</p>
                                    <input
                                        id={'email'}
                                        type={'text'}
                                        placeholder={'Enter Email'}
                                        style={{ borderColor: errors.email ? '#EC4C4C' : '#ced4da' }}
                                        {...register('email', { required: true })}
                                    />
                                </label>
                                <label htmlFor={'password'} className={styles.password}>
                                    <p>Password</p>
                                    <input
                                        id={'password'}
                                        type={'password'}
                                        placeholder={'Enter Password'}
                                        style={{ borderColor: errors.password ? '#EC4C4C' : '#ced4da' }}
                                        {...register('password', { required: true })}
                                    />
                                </label>
                            </div>
                            <h4 className={styles.errorMessage} style={{ marginBottom: errorMessage() ? '0.75rem' : 0 }}>
                                {errorMessage() || ''}
                            </h4>
                            <div className={styles.actions}>
                                <Checkbox label={'Remember me'} checked={rememberMe} onClick={() => setRememberMe(!rememberMe)} />
                                <Link className={styles.forgot} href={'/forgotten-password'}>
                                    Forgotten password?
                                </Link>
                            </div>
                            <button type={'submit'} className={styles.zim_button}>
                                Login
                            </button>
                            <button type={'button'} className={styles.googleButton}>
                                <Image src={GoogleIcon} />
                                Log in with Google
                            </button>
                            <h4 className={styles.signup}>
                                Don&apos;t have an account?
                                <Link href={'/signup'}>Sign Up</Link>
                            </h4>
                        </form>
                    </div>
                </div>
            </Page>
        </>
    );
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    return fetchUser(req.headers.cookie || '')
        .then(user => {
            if (user.data) {
                return {
                    redirect: '/',
                };
            }
            return {
                props: {},
            };
        })
        .catch(() => {
            return {
                props: {},
            };
        });
};

export default Login;
