import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { FaCaretDown } from 'react-icons/fa';
import React, { useEffect, useRef, useState } from 'react';
import { MdPerson, MdShoppingCart } from 'react-icons/md';
import { Logo } from '../public';
import styles from '../styles/components/NavBar.module.scss';
import { User } from './types';
import { useEventListener, useWindowWidth } from './hooks';
import { userApiUrl } from './utils';

interface Tab {
    title: string;
    link?: string;
    action?: () => void;
    condition?: boolean;
}

type NavTabs = Array<Tab | { title: string; subList: Array<Tab>; condition?: boolean }>;

interface Props {
    user?: User;
    cartCount?: number;
}

const NavBar = ({ user, cartCount }: Props): JSX.Element => {
    const windowWidth = useWindowWidth();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const [tabMenu, setTabMenu] = useState('');
    const menuRef = useRef<HTMLButtonElement>(null);

    const logout = useMutation(() => axios.delete(`${userApiUrl}/session`, { withCredentials: true }), {
        onSuccess: async () => {
            setProfileMenu(false);
            await router.push('/');
        },
    });

    useEventListener('click', e => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setProfileMenu(false);
        }
    });

    console.log(user);

    const nav: NavTabs = [
        { title: 'Home', link: '/' },
        { title: 'About Us', link: '/about' },
        {
            title: 'Marketplace',
            subList: [
                { title: 'Products', link: '/marketplace/products' },
                { title: 'Mines', link: '/marketplace/mines' },
                { title: 'Services', link: '/marketplace/services' },
                { title: 'Vacancies', link: '/marketplace/vacancies' },
            ],
        },
        { title: 'Mining Overview', link: '/mining-overview' },
        { title: 'Contact Us', link: '/contact' },
        {
            title: 'Login / Signup',
            link: 'login',
            condition: windowWidth <= 600 && user === undefined,
        },
        {
            title: 'My Account',
            subList: [
                { title: 'Profile', link: '/profile' },
                { title: 'My Products', link: '/profile/products' },
                { title: 'Wishlist', link: '/profile/wishlist' },
                { title: 'Administration', link: '/profile/products' },
                { title: 'Logout', action: () => logout.mutate() },
            ],
            condition: windowWidth <= 600 && user !== undefined,
        },
    ];

    useEffect(() => {
        setDropdownOpen(false);
        document.body.style.height = 'unset';
        document.body.style.overflowY = 'unset';
    }, []);

    return (
        <div className={styles.main}>
            {windowWidth < 1120 ? (
                <>
                    <button
                        type={'button'}
                        className={`${styles.navIcon} ${dropdownOpen ? styles.open : ''}`}
                        onClick={() => {
                            document.body.style.overflowY = !dropdownOpen ? 'hidden' : 'unset';
                            document.body.style.height = !dropdownOpen ? '100vh' : 'unset';
                            setDropdownOpen(!dropdownOpen);
                        }}
                    >
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                    </button>
                    <div className={styles.dropdown} style={{ height: dropdownOpen ? ' calc(100vh - 110px)' : 0 }}>
                        {nav.map(tab => {
                            console.log(tab);
                            console.log('condition' in tab ? tab.condition : true);
                            if ('link' in tab && tab.link && ('condition' in tab ? tab.condition : true)) {
                                return (
                                    <Link key={tab.title} href={tab.link}>
                                        {tab.title}
                                    </Link>
                                );
                            }
                            return 'subList' in tab && tab.subList && ('condition' in tab ? tab.condition : true) ? (
                                <div key={tab.title} className={styles.smDropLink}>
                                    <button
                                        id={`${tab.title}-title-btn`}
                                        type={'button'}
                                        onClick={e => {
                                            const target: Element = e.target as Element;
                                            if (target.id !== `${tab.title}-title-btn` && target.id !== `${tab.title}-title`)
                                                return undefined;
                                            return setTabMenu(
                                                target.id === `${tabMenu}-title` || target.id === `${tabMenu}-title-btn` ? '' : tab.title,
                                            );
                                        }}
                                    >
                                        <h4 id={`${tab.title}-title`}>
                                            {tab.title} <FaCaretDown />
                                        </h4>
                                    </button>
                                    <div
                                        style={{
                                            transition: `max-height ${tab.subList.length * 50 < 500 ? 0.2 : 0.4}s linear`,
                                            maxHeight: tabMenu === tab.title ? `${tab.subList.length * 50}px` : 0,
                                        }}
                                    >
                                        {tab.subList.map(subTab => (
                                            <Link key={subTab.title} href={subTab.link || ''}>
                                                {subTab.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>
                </>
            ) : null}
            <Link href={'/'}>
                <div className={styles.logo}>
                    <Image src={Logo} height={50} width={100} />
                </div>
            </Link>
            {windowWidth >= 1120 ? (
                <nav>
                    {nav.map(tab => {
                        if ('link' in tab && tab.link) {
                            return (
                                <Link key={tab.title} href={tab.link}>
                                    {tab.title}
                                </Link>
                            );
                        }
                        return (
                            <div
                                key={tab.title}
                                className={styles.dropLink}
                                onMouseLeave={e => {
                                    const target: Element = e.target as Element;
                                    if (target.id === `${tab.title}-drop`) return;
                                    setTabMenu('');
                                }}
                            >
                                <h4
                                    id={`${tab.title}-title`}
                                    onMouseEnter={e => {
                                        const target: Element = e.target as Element;
                                        if (target.id !== `${tab.title}-title`) return;
                                        setTabMenu(tab.title);
                                    }}
                                >
                                    {tab.title} <FaCaretDown />
                                </h4>
                                <div
                                    style={{
                                        opacity: tabMenu === tab.title ? 1 : 0,
                                        pointerEvents: tabMenu === tab.title ? 'all' : 'none',
                                    }}
                                >
                                    {'subList' in tab
                                        ? tab?.subList.map(subTab =>
                                              subTab.link ? (
                                                  <Link key={subTab.title} href={subTab.link}>
                                                      {subTab.title}
                                                  </Link>
                                              ) : (
                                                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                                  <div onClick={() => logout.mutate()}>
                                                      <h4>Log out</h4>
                                                  </div>
                                              ),
                                          )
                                        : null}
                                </div>
                            </div>
                        );
                    })}
                </nav>
            ) : null}
            <div className={styles.endContent}>
                {windowWidth > 600 ? (
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
                                profileMenu
                                    ? { top: '110%', opacity: 1, pointerEvents: 'all' }
                                    : { top: '90%', opacity: 0, pointerEvents: 'none' }
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
                ) : null}
                {user && windowWidth > 600 ? (
                    <Link href={'/profile/cart'}>
                        <div className={styles.cart}>
                            <MdShoppingCart size={25} />
                            <h4>Cart</h4>
                            <div>{cartCount}</div>
                        </div>
                    </Link>
                ) : null}
            </div>
        </div>
    );
};

export default NavBar;
