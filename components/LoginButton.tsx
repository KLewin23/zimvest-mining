import React, { useRef, useState } from 'react';
import { MdPerson } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import axios from 'axios';
import { User } from './types';
import { userApiUrl } from './utils';
import { useWindowWidth } from './hooks';
import styles from '../styles/components/NavBar.module.scss';

interface Props {
    user?: User;
}

const LoginButton = ({ user }: Props): JSX.Element => {
    const [profileMenu, setProfileMenu] = useState(false);
    const menuRef = useRef<HTMLButtonElement>(null);
    const windowWidth = useWindowWidth();
    const router = useRouter();

    const logout = useMutation(() => axios.delete(`${userApiUrl}/session`, { withCredentials: true }), {
        onSuccess: async () => {
            setProfileMenu(false);
            await router.push('/');
        },
    });

    return (
        <div className={styles.endContent}>
            <button
                ref={menuRef}
                type={'button'}
                className={styles.profile}
                onClick={async () => {
                    if (!user) {
                        return router.push('/login');
                    }
                    return setProfileMenu(true);
                }}
            >
                <MdPerson size={25} />
                <h4>{user ? `${user.first_name} ${user.last_name}` : 'Login / Sign Up'}</h4>
                <div
                    id={'menu'}
                    className={styles.menu}
                    style={
                        profileMenu ? { top: '110%', opacity: 1, pointerEvents: 'all' } : { top: '90%', opacity: 0, pointerEvents: 'none' }
                    }
                >
                    <Link href={'/profile'}>
                        <h4>Profile</h4>
                    </Link>
                    <Link href={'/profile/products'}>
                        <h4>My Products</h4>
                    </Link>
                    <Link href={'/profile/wishlist'}>
                        <h4>Wishlist</h4>
                    </Link>
                    {user?.role === 'ADMIN' || user?.role === 'SUPER' ? (
                        <Link href={'/administration'}>
                            <h4>Administration</h4>
                        </Link>
                    ) : null}
                    {windowWidth <= 600 ? (
                        <Link href={'/profile/cart'}>
                            <h4>Cart</h4>
                        </Link>
                    ) : null}

                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <div onClick={() => logout.mutate()}>
                        <h4>Log out</h4>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default LoginButton;
