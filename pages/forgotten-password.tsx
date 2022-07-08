import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';
import Page from '../components/Page';
import styles from '../styles/auth.module.scss';
import { Logo } from '../public';
import { userApiUrl } from '../components/utils';

interface FormValues {
    email: string;
}

const ForgottenPassword = (): JSX.Element => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const [passwordResetComplete, setPasswordResetComplete] = useState(false);

    const passwordReset: SubmitHandler<FormValues> = async data => {
        axios
            .put(`${userApiUrl}/user/reset-password`, {
                email: data.email,
            })
            .then(() => {
                setPasswordResetComplete(true);
            })
            .catch(() => null);
    };

    const errorMessage = () => {
        if (!errors.email) return '';
        switch (errors.email?.type) {
            case 'required':
                return `Email is a required field.`;
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
                        {passwordResetComplete ? (
                            <p>Password reset complete, if an account with the specified email exists we will send you an email.</p>
                        ) : (
                            <form onSubmit={handleSubmit(passwordReset)}>
                                <div className={styles.inputs}>
                                    <p>Enter your email to reset your password.</p>
                                    <label htmlFor={'email'} className={styles.email}>
                                        <p>Email</p>
                                        <input
                                            id={'email'}
                                            type={'email'}
                                            placeholder={'Email'}
                                            style={{ borderColor: errors.email ? '#EC4C4C' : '#ced4da' }}
                                            {...register('email', { required: true })}
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

export default ForgottenPassword;
