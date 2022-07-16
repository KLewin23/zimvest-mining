import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdPerson, MdShoppingCart } from 'react-icons/md';
import { FaCaretDown } from 'react-icons/fa';
import { Logo } from '../public';
import styles from '../styles/components/NavBar.module.scss';
import { User, useWindowWidth, useEventListener } from './utils';

interface Tab {
    title: string;
    link: string;
}

type NavTabs = Array<Tab | { title: string; subList: Array<Tab> }>;

const NavBar = ({ user }: { user?: User }): JSX.Element => {
    const windowWidth = useWindowWidth();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);
    const [tabMenu, setTabMenu] = useState('');
    const menuRef = useRef<HTMLButtonElement>(null);

    useEventListener('click', e => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setProfileMenu(false);
        }
    });

    const nav: NavTabs = [
        { title: 'Home', link: '/' },
        { title: 'About Us', link: '/about' },
        {
            title: 'Marketplace',
            subList: [
                { title: 'Products', link: '/marketplace/products' },
                { title: 'Mines', link: '/marketplace/mines' },
                { title: 'Services', link: '/marketplace/services' },
                { title: 'JV Opportunities', link: '/jv-opportunities' },
            ],
        },
        { title: 'Mining Overview', link: '/mining-overview' },
        { title: 'Market Prices', link: '/market-prices' },
        { title: 'Vacancies', link: '/vacancies' },
    ];

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
                    {nav.map(tab => {
                        if ('link' in tab) {
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
                                    {tab.subList.map(subTab => (
                                        <Link key={subTab.title} href={subTab.link}>
                                            {subTab.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
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
                        return setProfileMenu(true);
                    }}
                >
                    <MdPerson size={25} />
                    <h4>{user ? `${user.firstName} ${user.lastName}` : 'Login / Sign Up'}</h4>
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
