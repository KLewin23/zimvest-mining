import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdPhone, MdMailOutline } from 'react-icons/md';
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
                <h4>About Us</h4>
                <h4>Events</h4>
                <h4>News</h4>
                <h4>Vacancies</h4>
                <h4>Contact Us</h4>
            </div>
            <div className={styles.linkList}>
                <p>Useful Links</p>
                <h4>Resources</h4>
                <h4>Terms of Service</h4>
                <h4>Privacy Policy</h4>
                <h4>Mining Guidelines</h4>
                <h4>Gallery</h4>
            </div>
            <div className={styles.badges}>
                <Link href={'https://apps.apple.com/zw/app/zimvest-mobile/id1591476024'}>
                    <Image src={AppleBadge} layout={'fixed'} width={160} height={54} />
                </Link>
                <Link href={'https://play.google.com/store/apps/details?id=zw.co.iamngoni.zimvest'}>
                    <Image src={GoogleBadge} layout={'fixed'} width={160} height={48} />
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
