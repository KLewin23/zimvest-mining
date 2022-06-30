import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MdPerson, MdShoppingCart } from 'react-icons/md';
import { Logo } from '../public';
import styles from '../styles/components/NavBar.module.scss';

const NavBar = (): JSX.Element => {
    return (
        <div className={styles.main}>
            <Image src={Logo} height={50} width={100} />
            <nav>
                <Link href={'/'}>Home</Link>
                <Link href={'/about'}>About Us</Link>
                <p>Marketplace</p>
                <p>Minerals and Metals</p>
                <Link href={'/market-prices'}>Market Prices</Link>
                <p>Service Providers</p>
                <Link href={'/vacancies'}>Vacancies</Link>
            </nav>
            <div>
                <div>
                    <MdPerson size={25} />
                    <h4>Profile</h4>
                </div>
                <div>
                    <MdShoppingCart size={25} />
                    <h4>Cart</h4>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
