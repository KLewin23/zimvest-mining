import React from 'react';
import { FaStore, FaKey, FaHeart, FaReceipt, FaScroll, FaSnowplow, FaCogs, FaUserCog, FaBolt, FaHive, FaEnvira } from 'react-icons/fa';
import { MdSearch, MdOutlineExpandMore } from 'react-icons/md';
import styles from '../styles/components/Sidebar.module.scss';

const Sidebar = (): JSX.Element => {
    return (
        <div className={styles.main}>
            <div className={styles.iconList}>
                <div>
                    <FaStore size={24} />
                    <h4>Products</h4>
                </div>
                <div>
                    <FaKey size={24} />
                    <h4>Services</h4>
                </div>
                <div>
                    <FaHeart size={24} />
                    <h4>Wishlist</h4>
                </div>
                <div>
                    <FaReceipt size={24} />
                    <h4>Reserved</h4>
                </div>
                <div>
                    <FaScroll size={24} />
                    <h4>News</h4>
                </div>
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
