import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaHeart, FaReceipt, FaStore, FaKey } from 'react-icons/fa';
import { GiMineWagon } from 'react-icons/gi';
import { MdScreenSearchDesktop } from 'react-icons/md';
import styles from '../styles/components/Sidebar.module.scss';
import { User } from './types';

interface Props {
    user?: User;
}

const Sidebar = ({ user }: Props): JSX.Element => {
    const router = useRouter();

    return (
        <div className={styles.main}>
            <div className={styles.iconList}>
                <Link href={'/marketplace/products'}>
                    <div style={{ color: router.pathname.includes('/marketplace/products') ? '#F49232' : '#95979C' }}>
                        <FaStore size={24} />
                        <h4>Products</h4>
                    </div>
                </Link>
                <Link href={'/marketplace/mines'}>
                    <div style={{ color: router.pathname.includes('/marketplace/mines') ? '#F49232' : '#95979C' }}>
                        <GiMineWagon size={24} />
                        <h4>Mines</h4>
                    </div>
                </Link>
                <Link href={'/marketplace/services'}>
                    <div style={{ color: router.pathname.includes('/marketplace/services') ? '#F49232' : '#95979C' }}>
                        <FaKey size={24} />
                        <h4>Services</h4>
                    </div>
                </Link>
                <Link href={'/marketplace/vacancies'}>
                    <div style={{ color: router.pathname.includes('/marketplace/vacancies') ? '#F49232' : '#95979C' }}>
                        <MdScreenSearchDesktop size={24} />
                        <h4>Vacancies</h4>
                    </div>
                </Link>
                {user ? (
                    <>
                        <Link href={'/profile/wishlist'}>
                            <div style={{ color: router.pathname.includes('/profile/wishlist') ? '#F49232' : '#95979C' }}>
                                <FaHeart size={24} />
                                <h4>Wishlist</h4>
                            </div>
                        </Link>
                        <Link href={'/profile/cart'}>
                            <div style={{ color: router.pathname.includes('/profile/cart') ? '#F49232' : '#95979C' }}>
                                <FaReceipt size={24} />
                                <h4>Reserved</h4>
                            </div>
                        </Link>
                    </>
                ) : null}

                {/* <Link href={'/news'}> */}
                {/*    <div style={{ color: router.pathname.includes('/news') ? '#F49232' : '#95979C' }}> */}
                {/*        <FaScroll size={24} /> */}
                {/*        <h4>News</h4> */}
                {/*    </div> */}
                {/* </Link> */}
            </div>
        </div>
    );
};
export default Sidebar;
