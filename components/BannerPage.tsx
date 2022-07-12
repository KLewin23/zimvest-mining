import React, { ReactNode } from 'react';
import Image from 'next/image';
import styles from '../styles/components/BannerPage.module.scss';
import { Background1 } from '../public';

interface Props {
    heading: string;
    subHeading: string;
    children: ReactNode;
}

const BannerPage = ({ heading, subHeading, children }: Props): JSX.Element => {
    return (
        <div className={styles.main}>
            <div className={styles.banner}>
                <div className={styles.title}>
                    <h1>{heading}</h1>
                    <p>{subHeading}</p>
                </div>
                <div className={styles.image}>
                    <Image src={Background1} layout={'responsive'} />
                </div>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
};

export default BannerPage;
