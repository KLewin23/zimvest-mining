import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import styles from '../styles/auth.module.scss';
import { GoogleIcon, Logo } from '../public';
import { Checkbox, getUserInfo, Page, userApiUrl } from '../components';

interface FormValues {
    'First Name': string;
    'Last Name': string;
    Email: string;
    Password: string;
    'Confirm Password': string;
    'Company Name': string;
    Declaration: boolean;
}

const SignUp = (): JSX.Element => {
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors },
        control,
        setError,
    } = useForm<FormValues>();
    const [signUpComplete, setSignUpComplete] = useState(false);
    const [apiRequestSent, setApiRequestSent] = useState(false);

    const signup: SubmitHandler<FormValues> = data => {
        setApiRequestSent(true);
        axios
            .post(
                `${userApiUrl}/user`,
                {
                    firstName: data['First Name'],
                    lastName: data['Last Name'],
                    email: data.Email,
                    password: data.Password,
                    companyName: data['Company Name'],
                },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then(async res => {
                if (res.status === 200) {
                    setSignUpComplete(true); // TODO change to a message telling them to verify
                }
            })
            .catch(e => {
                setApiRequestSent(false);
                if (e.response.status === 409) {
                    return setError('First Name', { type: 'user_exists' });
                }
                return setError('First Name', { type: 'server_error' });
            });
    };

    const errorMessage = () => {
        const firstError = (
            ['First Name', 'Last Name', 'Company Name', 'Email', 'Password', 'Confirm Password', 'Declaration'] as (keyof FormValues)[]
        ).find(err => errors[err]);
        if (!firstError) return '';
        switch (errors[firstError]?.type) {
            case 'required':
                return `${firstError} is a required field.`;
            case 'minLength':
                return `${firstError} must be 8 characters or longer.`;
            case 'maxLength':
                return `${firstError} must be 8 characters or longer.`;
            case 'matchesReType':
                return `Passwords must match.`;
            case 'isTrue':
                return 'You must accept the declaration.';
            case 'user_exists':
                return 'A user already exists with the email you provided';
            case 'server_error':
            default:
                return 'Something is wrong in the form.';
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
                        {signUpComplete ? (
                            <p>Thank you for creating an account, we have sent you a verification email.</p>
                        ) : (
                            <form onSubmit={handleSubmit(signup)}>
                                <div className={styles.inputs}>
                                    <div className={styles.group}>
                                        <label htmlFor={'firstName'}>
                                            <p>First name</p>
                                            <input
                                                id={'firstName'}
                                                type={'text'}
                                                placeholder={'First name'}
                                                style={{ borderColor: errors['First Name'] ? '#EC4C4C' : '#ced4da' }}
                                                {...register('First Name', { required: true })}
                                            />
                                        </label>
                                        <label htmlFor={'lastName'}>
                                            <p>Last name</p>
                                            <input
                                                id={'lastName'}
                                                type={'text'}
                                                placeholder={'Last name'}
                                                style={{ borderColor: errors['Last Name'] ? '#EC4C4C' : '#ced4da' }}
                                                {...register('Last Name', { required: true })}
                                            />
                                        </label>
                                    </div>
                                    <label htmlFor={'companyName'}>
                                        <p>Company</p>
                                        <input
                                            id={'companyName'}
                                            type={'text'}
                                            placeholder={'Company name'}
                                            style={{ borderColor: errors['Company Name'] ? '#EC4C4C' : '#ced4da' }}
                                            {...register('Company Name', { required: true })}
                                        />
                                    </label>
                                    <label htmlFor={'email'}>
                                        <p>Email</p>
                                        <input
                                            id={'email'}
                                            type={'email'}
                                            placeholder={'Email'}
                                            style={{ borderColor: errors.Email ? '#EC4C4C' : '#ced4da' }}
                                            {...register('Email', { required: true })}
                                        />
                                    </label>
                                    <label htmlFor={'password'}>
                                        <p>Password</p>
                                        <input
                                            id={'password'}
                                            style={{ borderColor: errors.Password ? '#EC4C4C' : '#ced4da' }}
                                            type={'password'}
                                            placeholder={'Password'}
                                            {...register('Password', {
                                                validate: { matchesReType: value => value === getValues('Confirm Password') },
                                                required: true,
                                                minLength: 8,
                                                maxLength: 24,
                                            })}
                                        />
                                    </label>
                                    <label htmlFor={'rePassword'}>
                                        <p>Confirm Password</p>
                                        <input
                                            id={'rePassword'}
                                            style={{ borderColor: errors['Confirm Password'] ? '#EC4C4C' : '#ced4da' }}
                                            type={'password'}
                                            placeholder={'Confirm Password'}
                                            {...register('Confirm Password', {
                                                validate: { matchesReType: value => value === getValues('Password') },
                                                required: true,
                                                minLength: 8,
                                                maxLength: 24,
                                            })}
                                        />
                                    </label>
                                </div>
                                <h4 className={styles.errorMessage} style={{ marginBottom: errorMessage() ? '0.75rem' : 0 }}>
                                    {errorMessage() || ''}
                                </h4>
                                <Controller
                                    name={'Declaration'}
                                    control={control}
                                    defaultValue={false}
                                    rules={{ validate: { isTrue: value => value } }}
                                    render={({ field }) => (
                                        <Checkbox
                                            error={errors.Declaration !== undefined}
                                            checked={field.value}
                                            onClick={() => field.onChange(!field.value)}
                                        >
                                            <h5>
                                                I accept the <Link href={'/tos'}>Terms of Service</Link> as well as
                                                <Link href={'/privacy-policy'}>Privacy Policy.</Link>
                                            </h5>
                                        </Checkbox>
                                    )}
                                />

                                <button type={'submit'} className={`${styles.zim_button} ${apiRequestSent ? styles.loading : ''}`}>
                                    Create account
                                </button>
                                <button type={'button'} className={styles.googleButton}>
                                    <Image src={GoogleIcon} />
                                    Register with Google
                                </button>
                                <h4 className={styles.signup}>
                                    Already have an account?
                                    <Link href={'/login'}>Login</Link>
                                </h4>
                            </form>
                        )}
                    </div>
                </div>
            </Page>
        </>
    );
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    const userInfo = await getUserInfo(req, null);
    return userInfo !== null
        ? {
              redirect: {
                  destination: '/',
                  permanent: true,
              },
          }
        : { props: {} };
};

export default SignUp;
