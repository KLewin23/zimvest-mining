import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdMailOutline, MdPhone } from 'react-icons/md';
import { AppleBadge, GoogleBadge, WhiteLogo } from '../public';
import styles from '../styles/components/Footer.module.scss';

const Footer = (): JSX.Element => {
    return (
        <footer className={styles.footer}>
            <div className={styles.first}>
                <Image src={WhiteLogo} layout={'fixed'} width={160} height={51} />
                <div>
                    <div>
                        <MdPhone />
                        <p>+263&nbsp;780&nbsp;720&nbsp;623</p>
                    </div>
                    <div>
                        <MdMailOutline />
                        <p>info@zimvestmining.com</p>
                    </div>
                </div>
                <h5>All rights reserved Zimvest 2022</h5>
            </div>
            <div className={styles.linkList}>
                <p>Quick Links</p>
                <Link href={'/about'}>
                    <h4>About Us</h4>
                </Link>
                <Link href={'/mining-overview'}>
                    <h4>Mining Overview</h4>
                </Link>
                <Link href={'mailto:info@zimvestmining.com'}>
                    <h4>Contact Us</h4>
                </Link>
            </div>
            <div className={styles.linkList}>
                <p>Marketplace</p>
                <Link href={'/marketplace/products'}>
                    <h4>Products</h4>
                </Link>
                <Link href={'/marketplace/mines'}>
                    <h4>Mines</h4>
                </Link>
                <Link href={'/marketplace/services'}>
                    <h4>Services</h4>
                </Link>
                <Link href={'/marketplace/vacancies'}>
                    <h4>Vacancies</h4>
                </Link>
            </div>
            <div className={styles.badges}>
                <Link href={'https://apps.apple.com/zw/app/zimvest-mobile/id1591476024'}>
                    <div>
                        <Image src={AppleBadge} layout={'fixed'} width={160} height={54} />
                    </div>
                </Link>
                <Link href={'https://play.google.com/store/apps/details?id=zw.co.iamngoni.zimvest'}>
                    <div>
                        <Image src={GoogleBadge} layout={'fixed'} width={160} height={48} />
                    </div>
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
