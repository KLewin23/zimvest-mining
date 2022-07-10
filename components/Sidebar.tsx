import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaStore, FaKey, FaHeart, FaReceipt, FaScroll, FaSnowplow, FaCogs, FaUserCog, FaBolt, FaHive, FaEnvira } from 'react-icons/fa';
import { MdSearch, MdOutlineExpandMore } from 'react-icons/md';
import styles from '../styles/components/Sidebar.module.scss';

const Sidebar = (): JSX.Element => {
    const router = useRouter();
    return (
        <div className={styles.main}>
            <div className={styles.iconList}>
                <Link href={'/products'}>
                    <div style={{ color: router.pathname.includes('/products') ? '#F49232' : '#95979C' }}>
                        <FaStore size={24} />
                        <h4>Products</h4>
                    </div>
                </Link>
                <Link href={'/services'}>
                    <div style={{ color: router.pathname.includes('/services') ? '#F49232' : '#95979C' }}>
                        <FaKey size={24} />
                        <h4>Services</h4>
                    </div>
                </Link>
                <Link href={'/profile/wishlist'}>
                    <div style={{ color: router.pathname.includes('/profile/wishlist') ? '#F49232' : '#95979C' }}>
                        <FaHeart size={24} />
                        <h4>Wishlist</h4>
                    </div>
                </Link>
                <Link href={'/profile/reservations'}>
                    <div style={{ color: router.pathname.includes('/profile/reservations') ? '#F49232' : '#95979C' }}>
                        <FaReceipt size={24} />
                        <h4>Reserved</h4>
                    </div>
                </Link>
                <Link href={'/news'}>
                    <div style={{ color: router.pathname.includes('/news') ? '#F49232' : '#95979C' }}>
                        <FaScroll size={24} />
                        <h4>News</h4>
                    </div>
                </Link>
            </div>
            <div className={styles.productSearch}>
                <div className={styles.search}>
                    <MdSearch size={24} color={'#95979C'} />
                    <input type={'text'} placeholder={'Search Products'} />
                </div>
                <div className={styles.list}>
                    <div>
                        <FaSnowplow size={24} color={'#ED7830'} />
                        <p>Machinery</p>
                        <MdOutlineExpandMore size={24} color={'#95979C'} />
                    </div>
                    <div>
                        <FaCogs size={24} color={'#ED7830'} />
                        <p>Consumables</p>
                        <MdOutlineExpandMore size={24} color={'#95979C'} />
                    </div>
                    <div>
                        <FaUserCog size={24} color={'#ED7830'} />
                        <p>Service Providers</p>
                        <MdOutlineExpandMore size={24} color={'#95979C'} />
                    </div>
                    <div>
                        <FaBolt size={24} color={'#ED7830'} />
                        <p>Energy</p>
                        <MdOutlineExpandMore size={24} color={'#95979C'} />
                    </div>
                    <div>
                        <FaHive size={24} color={'#ED7830'} />
                        <p>Metals</p>
                        <MdOutlineExpandMore size={24} color={'#95979C'} />
                    </div>
                    <div>
                        <FaEnvira size={24} color={'#ED7830'} />
                        <p>Fertilisers</p>
                        <MdOutlineExpandMore size={24} color={'#95979C'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
