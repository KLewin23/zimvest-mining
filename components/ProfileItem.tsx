import React from 'react';
import Image from 'next/image';
import styles from '../styles/profile.module.scss';

interface Props {
    item: { title: string; supplier: { email: string }; price: number; image_id?: string };
    add?: { fn: () => void; test: () => boolean };
    remove?: { fn: () => void; test: () => boolean };
}

const ProfileItem = ({ item, add, remove }: Props): JSX.Element => {
    return (
        <div key={item.title}>
            <Image
                width={160}
                height={90}
                src={
                    item.image_id
                        ? `https://imagedelivery.net/RwHbfJFaRWbC2holDi8g-w/${item.image_id}/public`
                        : 'https://imagedelivery.net/RwHbfJFaRWbC2holDi8g-w/2e3a5e35-2fbe-402a-9e5c-f19a60f85900/public'
                }
            />
            <div className={styles.text}>
                <h3>{item.title}</h3>
                <p>{item.supplier.email}</p>
                <p>
                    <span>${item.price}</span>
                </p>
            </div>
            <div className={styles.buttons}>
                {add ? (
                    <button type={'button'} className={`${styles.addToCart} ${add.test() ? styles.loading : ''}`} onClick={() => add.fn()}>
                        Add to cart
                    </button>
                ) : null}
                {remove ? (
                    <button
                        type={'button'}
                        className={`${styles.productsRemove} ${remove.test() ? styles.loading : ''}`}
                        onClick={() => remove.fn()}
                    >
                        Remove
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default ProfileItem;
