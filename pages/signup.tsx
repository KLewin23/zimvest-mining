import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import Page from '../components/Page';
import styles from '../styles/auth.module.scss';
import { GoogleIcon, Logo } from '../public';
import { userApiUrl } from '../components/utils';

interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    rePassword: string;
    companyName: string;
}

const SignUp = (): JSX.Element => {
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const [onNextState, setOnNextState] = useState(false);
    const router = useRouter();

    const signup: SubmitHandler<FormValues> = data => {
        if (!onNextState) {
            return setOnNextState(true);
        }

        return fetch(`${userApiUrl}/user`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data }),
        })
            .then(async res => {
                if (res.status === 200) {
                    await router.push('/verify');
                }
            })
            .catch(() => null);
    };

    const errorMessage = () => {
        const firstError = (['email', 'password', 'rePassword', 'firstName', 'lastName', 'companyName'] as (keyof FormValues)[]).find(
            err => errors[err],
        );
        if (!firstError) return '';
        switch (errors[firstError]?.type) {
            case 'required': {
                return `${firstError} is a required field`;
            }
            case 'minLength': {
                return `${firstError} must be 8 characters or longer`;
            }
            case 'maxLength': {
                return `${firstError} must be 8 characters or longer`;
            }
            case 'matchesReType': {
                return `Passwords must match`;
            }
            default:
                return 'Something is wrong in the form';
        }
    };

    return (
        <>
            <Head>
                <title>Zimvest - Sign up</title>
                <meta name={'description'} content={'Zimvest Sign up'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>
            <Page>
                <div className={styles.main}>
                    <div className={styles.authBox}>
                        <Image src={Logo} width={150} height={60} />
                        <form onSubmit={handleSubmit(signup)}>
                            <div className={styles.slideBox} style={{ marginLeft: onNextState ? 'calc(-100% - 5rem)' : '0' }}>
                                <div className={styles.inputs} style={{ opacity: onNextState ? 0 : 1 }}>
                                    <label htmlFor={'email'} className={styles.email}>
                                        <p>Email</p>
                                        <input
                                            id={'email'}
                                            type={'text'}
                                            placeholder={'Email'}
                                            style={{ borderColor: errors.email ? '#EC4C4C' : '#ced4da' }}
                                            {...register('email', { required: true })}
                                        />
                                    </label>
                                    <label htmlFor={'password'} className={styles.password}>
                                        <p>Password</p>
                                        <input
                                            id={'password'}
                                            style={{ borderColor: errors.password ? '#EC4C4C' : '#ced4da' }}
                                            type={'password'}
                                            placeholder={'Password'}
                                            {...register('password', {
                                                validate: { matchesReType: value => value === getValues('rePassword') },
                                                required: true,
                                                minLength: 8,
                                                maxLength: 24,
                                            })}
                                        />
                                    </label>
                                    <label htmlFor={'rePassword'} className={styles.password}>
                                        <p>Re-type Password</p>
                                        <input
                                            id={'rePassword'}
                                            style={{ borderColor: errors.password ? '#EC4C4C' : '#ced4da' }}
                                            type={'password'}
                                            placeholder={'Re-type Password'}
                                            {...register('rePassword', {
                                                validate: { matchesReType: value => value === getValues('password') },
                                                required: true,
                                                minLength: 8,
                                                maxLength: 24,
                                            })}
                                        />
                                    </label>
                                </div>
                                <div className={styles.inputs} style={{ opacity: onNextState ? 1 : 0 }}>
                                    <label htmlFor={'firstName'} className={styles.email}>
                                        <p>First name</p>
                                        <input
                                            id={'firstName'}
                                            type={'text'}
                                            placeholder={'First name'}
                                            style={{ borderColor: errors.firstName ? '#EC4C4C' : '#ced4da' }}
                                            {...register('firstName', { required: onNextState })}
                                        />
                                    </label>
                                    <label htmlFor={'lastName'} className={styles.password}>
                                        <p>Last name</p>
                                        <input
                                            id={'lastName'}
                                            type={'text'}
                                            placeholder={'Last name'}
                                            style={{ borderColor: errors.lastName ? '#EC4C4C' : '#ced4da' }}
                                            {...register('lastName', { required: onNextState })}
                                        />
                                    </label>
                                    <label htmlFor={'companyName'} className={styles.password}>
                                        <p>Company name</p>
                                        <input
                                            id={'companyName'}
                                            type={'text'}
                                            placeholder={'Company name'}
                                            style={{ borderColor: errors.companyName ? '#EC4C4C' : '#ced4da' }}
                                            {...register('companyName', { required: onNextState })}
                                        />
                                    </label>
                                </div>
                            </div>
                            <h4 className={styles.errorMessage}>{errorMessage() || ''}</h4>
                            <div>
                                <Link href={'/forgot'}>
                                    <h4>Forgotten your password?</h4>
                                </Link>
                            </div>
                            <button type={'submit'} className={styles.zim_button}>
                                {onNextState ? 'Sign Up' : 'Next'}
                            </button>
                        </form>
                        <h4 className={styles.signup}>
                            Already have an account?
                            <Link href={'/login'}>
                                <b>Login</b>
                            </Link>
                        </h4>

                        <div className={styles.divider}>
                            <span />
                            <h4>OR</h4>
                            <span />
                        </div>
                        <button type={'button'} className={styles.googleButton}>
                            <Image src={GoogleIcon} />
                            Sign up with Google
                        </button>
                    </div>
                </div>
            </Page>
        </>
    );
};

export default SignUp;
