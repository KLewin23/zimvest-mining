import React from 'react';
import { AxiosResponse } from 'axios';
import { UseMutationResult } from 'react-query';
import Image from 'next/image';
import { FaImage } from 'react-icons/fa';
import styles from '../styles/profile.module.scss';
import { MarketplacePage, UserProductPrice, UserProductSalary } from './types';

interface Props {
    items: UserProductPrice[] | UserProductSalary[];
    pageName: MarketplacePage;
    deleteListing: UseMutationResult<AxiosResponse<any, any>, unknown, { id: number; pageName: MarketplacePage }, unknown>;
}

const UserListing = ({ items, pageName, deleteListing }: Props): JSX.Element => {
    return (
        <>
            {items.map(item => (
                <div key={item.title}>
                    {item.image_id ? (
                        <Image src={`https://imagedelivery.net/RwHbfJFaRWbC2holDi8g-w/${item.image_id}/public`} />
                    ) : (
                        <FaImage size={100} color={'#E5E5E5'} />
                    )}
                    <div className={styles.text}>
                        <h3>{item.title}</h3>
                        <p>
                            Views: <span>{item.views || 0}</span>
                        </p>

                        {'price' in item ? (
                            <p>
                                Price:
                                <span> ${item?.price}</span>
                            </p>
                        ) : null}
                        {'salary' in item ? (
                            <p>
                                Salary:
                                <span> ${item?.salary}</span>
                            </p>
                        ) : null}
                    </div>
                    <div>
                        <button
                            type={'button'}
                            className={`${styles.productsRemove} ${deleteListing.isLoading ? styles.loading : ''}`}
                            onClick={() => deleteListing.mutate({ id: item.id, pageName })}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
};

export default UserListing;
