import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdPerson, MdShoppingCart } from 'react-icons/md';
import { Logo } from '../public';
import styles from '../styles/components/NavBar.module.scss';
import { User, useWindowWidth, useEventListener } from './utils';

const NavBar = ({ user }: { user?: User }): JSX.Element => {
    const windowWidth = useWindowWidth();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menu, setMenu] = useState(false);
    const menuRef = useRef<HTMLButtonElement>(null);

    useEventListener('click', e => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setMenu(false);
        }
    });

    // const nav = [
    //     { title: 'Home', link: '/' },
    //     { title: 'About Us', link: '/about' },
    //     {
    //         title: 'Marketplace',
    //         subList: [
    //             { title: 'Buy/Sell Minerals', link: '/buy-or-sell-minerals' },
    //             { title: 'Buy/Invest', link: '/buy-or-invest' },
    //             { title: 'Sell your mine', link: '/sell-mine' },
    //             { title: 'Seeking JV partner', link: '/seeking-jv-partner' },
    //         ],
    //     },
    //     {
    //         title: 'Minerals and Metals',
    //         subList: [
    //             { title: 'Mining Overview', link: '/mining-overview' },
    //             {
    //                 title: 'Precious Metals',
    //                 link: '/precious-metals',
    //             },
    //             {
    //                 title: 'Base Metals',
    //                 link: '/base-metals',
    //             },
    //             {
    //                 title: 'Minor Metals',
    //                 link: '/minor-metals',
    //             },
    //             {
    //                 title: 'Bulk Metals',
    //                 link: '/bulk-metals',
    //             },
    //             {
    //                 title: 'Precious Stones',
    //                 link: '/precious-stones',
    //             },
    //             {
    //                 title: 'Semi-Precious Stones',
    //                 link: '/semi-precious-stones',
    //             },
    //             {
    //                 title: 'Ferro Alloys',
    //                 link: '/ferro-alloys',
    //             },
    //             {
    //                 title: 'Rare Earth',
    //                 link: '/rare-earth',
    //             },
    //             {
    //                 title: 'Fertilisers',
    //                 link: '/fertilisers',
    //             },
    //         ],
    //     },
    //     { title: 'Market Prices', link: '/market-prices' },
    //     { title: 'Vacancies', link: '/vacancies' },
    // ];

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
                        <Link href={'/'}>Home</Link>
                        <Link href={'/about'}>About&nbsp;Us</Link>
                        <p>Marketplace</p>
                        <p>Minerals&nbsp;and&nbsp;Metals</p>
                        <Link href={'/market-prices'}>Market&nbsp;Prices</Link>
                        <Link href={'/vacancies'}>Vacancies</Link>
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
                    <Link href={'/'}>Home</Link>
                    <Link href={'/about'}>About&nbsp;Us</Link>
                    <h4>Marketplace</h4>
                    <h4>Minerals&nbsp;and&nbsp;Metals</h4>
                    <Link href={'/market-prices'}>Market&nbsp;Prices</Link>
                    <Link href={'/vacancies'}>Vacancies</Link>
                </nav>
            ) : null}
            <div className={styles.endContent}>
                <button
                    ref={menuRef}
                    type={'button'}
                    className={styles.profile}
                    onClick={async () => {
                        if (!user) {
                            return router.push('/login');
                        }
                        return setMenu(true);
                    }}
                >
                    <MdPerson size={25} />
                    <h4>{user ? `${user.firstName} ${user.lastName}` : 'Login / Sign Up'}</h4>
                    <div
                        id={'menu'}
                        className={styles.menu}
                        style={menu ? { top: '110%', opacity: 1, pointerEvents: 'all' } : { top: '90%', opacity: 0, pointerEvents: 'none' }}
                    >
                        <Link href={'/profile'}>
                            <h4>Profile</h4>
                        </Link>
                        <Link href={'/products'}>
                            <h4>My Products</h4>
                        </Link>
                        <Link href={'/wishlist'}>
                            <h4>Wishlist</h4>
                        </Link>
                        <Link href={'/logout'}>
                            <h4>Log out</h4>
                        </Link>
                    </div>
                </button>
                <div>
                    <MdShoppingCart size={25} />
                    <h4>Cart</h4>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
