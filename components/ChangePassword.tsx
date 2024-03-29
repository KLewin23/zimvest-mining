import React from 'react';
import axios from 'axios';
import { MdInfoOutline } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { userApiUrl } from './utils';
import styles from '../styles/profile.module.scss';
import Notification from './Notification';
import { useNotification } from './hooks';

interface ChangePassForm {
    'Current Password': string;
    'New Password': string;
    'Confirm Password': string;
}

const ChangePassword = (): JSX.Element => {
    const { register, handleSubmit } = useForm<ChangePassForm>();
    const [status, message, setMessage] = useNotification();

    const password = useMutation(
        (vals: ChangePassForm) =>
            axios.put(
                `${userApiUrl}/user/change-password`,
                { oldPassword: vals['Current Password'], newPassword: vals['New Password'] },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                },
            ),
        {
            onSuccess: () => setMessage('Password Successfully Changed.'),
            onError: () => setMessage('Something went wrong changing your password, please try again'),
        },
    );

    return (
        <form
            className={styles.changePassword}
            onSubmit={handleSubmit(v => {
                if (v['New Password'] === v['Confirm Password']) {
                    password.mutate(v);
                }
            })}
        >
            <Notification open={status}>{message}</Notification>
            <section>
                <div className={styles.info}>
                    <h3>Security</h3>
                    <MdInfoOutline color={'#969696'} size={20} />
                    <h5>To change your password you must know and enter your current password.</h5>
                </div>
                <div>
                    <label htmlFor={'curPass'}>
                        <p>Current password</p>
                        <input id={'curPass'} type={'password'} placeholder={'Current password'} {...register('Current Password')} />
                    </label>
                    <label htmlFor={'newPass'} className={styles.firstCol}>
                        <p>New Password</p>
                        <input id={'newPass'} type={'password'} placeholder={'New password'} {...register('New Password')} />
                    </label>
                    <label htmlFor={'confPass'}>
                        <p>Confirm Password</p>
                        <input id={'confPass'} type={'password'} placeholder={'Confirm password'} {...register('Confirm Password')} />
                    </label>
                </div>
                <button className={`${styles.firstCol} ${password.isLoading ? styles.loading : ''}`} type={'submit'}>
                    Change Password
                </button>
            </section>
        </form>
    );
};

export default ChangePassword;
