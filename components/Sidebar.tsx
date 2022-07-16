import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaStore, FaHeart, FaReceipt, FaScroll } from 'react-icons/fa';
import styles from '../styles/components/Sidebar.module.scss';

const Sidebar = (): JSX.Element => {
    const router = useRouter();

    return (
        <div className={styles.main}>
            <div className={styles.iconList}>
                <Link href={'/marketplace'}>
                    <div style={{ color: router.pathname.includes('/marketplace') ? '#F49232' : '#95979C' }}>
                        <FaStore size={24} />
                        <h4>Marketplace</h4>
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
        </div>
    );
};
export default Sidebar;
