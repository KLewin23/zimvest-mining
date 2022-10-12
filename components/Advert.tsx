import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import { Advert1, Advert2 } from '../public';
import styles from '../styles/components/Advert.module.scss';

const Advert = (): JSX.Element => {
    return (
        <div className={styles.advert}>
            <Carousel showArrows={false} showThumbs={false} showIndicators={false} showStatus={false} infiniteLoop autoPlay>
                <div>
                    <Image src={Advert1} />
                </div>
                <div>
                    <Image src={Advert2} />
                </div>
            </Carousel>
            <div>
                <h2>Zimvest</h2>
                <h4>Interested in this AD space? Contact us and book this section and increase your company&apos;s visibility</h4>
            </div>
            <Link href={'mailto:info@zimvestmining.com'}>
                <button type={'button'}>Advertise with us</button>
            </Link>
        </div>
    );
};

export default Advert;
