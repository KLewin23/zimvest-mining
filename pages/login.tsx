import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import Page from '../components/Page';
import styles from '../styles/auth.module.scss';
import { GoogleIcon, Logo } from '../public';

// TODO maybe make this a sort of client side rendered component to make switching between login and signup smoother

const Login = (): JSX.Element => {
    const { register } = useForm();
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
                        <Image src={Logo} width={150} height={60} />
                        <div className={styles.inputs}>
                            <label htmlFor={'email'} className={styles.email}>
                                <p>Email</p>
                                <input id={'email'} type={'text'} placeholder={'Email'} {...register('email')} />
                            </label>
                            <label htmlFor={'password'} className={styles.password}>
                                <p>Password</p>
                                <input id={'password'} type={'password'} placeholder={'Password'} {...register('password')} />
                            </label>
                        </div>
                        <div>
                            <Link href={'/forgot'}>
                                <h4>Forgotten your password?</h4>
                            </Link>
                        </div>
                        <button type={'submit'} className={styles.zim_button}>
                            Login
                        </button>

                        <h4 className={styles.signup}>
                            Don&apos;t have an account?
                            <Link href={'/signup'}>
                                <b>Sign Up</b>
                            </Link>
                        </h4>

                        <div className={styles.divider}>
                            <span />
                            <h4>OR</h4>
                            <span />
                        </div>
                        <button type={'button'} className={styles.googleButton}>
                            <Image src={GoogleIcon} />
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </Page>
        </>
    );
};

export default Login;
