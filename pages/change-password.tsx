import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import { GetServerSidePropsContext } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from '../styles/auth.module.scss';
import { Logo } from '../public';
import { userApiUrl, Page } from '../components';

interface FormValues {
    'New Password': string;
    'Confirm Password': string;
}

const ForgottenPassword = ({ code }: { code: string }): JSX.Element => {
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormValues>();
    const [passwordChanged, setPasswordChanged] = useState(false);

    const passwordReset: SubmitHandler<FormValues> = async data => {
        axios
            .put(`${userApiUrl}/user/reset-password`, {
                passwordResetToken: code,
                password: data['New Password'],
            })
            .then(() => {
                setPasswordChanged(true);
            })
            .catch(e => {
                if (e.response.status === 403 || e.response.status === 400) {
                    return setError('New Password', { type: '403' });
                }
                return setError('New Password', { type: 'unknown' });
            });
    };

    const errorMessage = () => {
        const firstError = (['New Password', 'Confirm Password'] as (keyof FormValues)[]).find(err => errors[err]);
        if (!firstError) return '';
        switch (errors[firstError]?.type) {
            case 'minLength':
                return `${firstError} must be 8 characters or longer.`;
            case 'maxLength':
                return `${firstError} must be 8 characters or longer.`;
            case 'matchesReType':
                return `Passwords must match.`;
            case 'required':
                return `${firstError} is a required field.`;
            case '400':
            case '403':
                return 'This change password request is either expired or invalid.';
            case 'unknown':
            default:
                return 'Something is wrong in the form.';
        }
    };

    return (
        <>
            <Head>
                <title>Zimvest - verify</title>
                <meta name={'description'} content={'Zimvest Verify'} />
                <link rel={'icon'} href={'/zimvestFavicon.png'} />
            </Head>
            <Page>
                <div className={styles.main}>
                    <div className={styles.forgottenPassword}>
                        <Image src={Logo} width={150} height={60} />
                        {passwordChanged ? (
                            <p>Your password has now been changed, you may now re-login</p>
                        ) : (
                            <form onSubmit={handleSubmit(passwordReset)}>
                                <div className={styles.inputs}>
                                    <label htmlFor={'newPass'}>
                                        <p>New Password</p>
                                        <input
                                            id={'newPass'}
                                            type={'password'}
                                            placeholder={'New Password'}
                                            {...register('New Password', {
                                                validate: { matchesReType: value => value === getValues('Confirm Password') },
                                                required: true,
                                                minLength: 8,
                                                maxLength: 24,
                                            })}
                                            style={{ borderColor: errors['New Password'] ? '#EC4C4C' : '#ced4da' }}
                                        />
                                    </label>
                                    <label htmlFor={'confirmPassword'}>
                                        <p>Confirm Password</p>
                                        <input
                                            id={'confirmPassword'}
                                            type={'password'}
                                            placeholder={'Confirm Password'}
                                            {...register('Confirm Password', {
                                                validate: { matchesReType: value => value === getValues('New Password') },
                                                required: true,
                                                minLength: 8,
                                                maxLength: 24,
                                            })}
                                            style={{ borderColor: errors['Confirm Password'] ? '#EC4C4C' : '#ced4da' }}
                                        />
                                    </label>
                                    <h4 className={styles.errorMessage}>{errorMessage() || ''}</h4>
                                </div>
                                <button type={'submit'} className={styles.zim_button}>
                                    Reset Password
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </Page>
        </>
    );
};

export const getServerSideProps = ({ query }: GetServerSidePropsContext) => {
    if (!query.code) {
        return {
            redirect: '/',
            props: {},
        };
    }
    return {
        props: {
            code: query.code,
        },
    };
};

export default ForgottenPassword;
