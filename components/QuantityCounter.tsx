import React from 'react';
import styles from '../styles/components/QuantityCounter.module.scss';

interface Props {
    quantity: number;
    decreaseQuantity: () => void;
    increaseQuantity: () => void;
}

const QuantityCounter = ({ quantity, increaseQuantity, decreaseQuantity }: Props): JSX.Element => {
    return (
        <div className={styles.main}>
            <p>Quantity:</p>
            <div>
                <button type={'button'} onClick={decreaseQuantity}>
                    -
                </button>
                <p>{quantity}</p>
                <button type={'button'} onClick={increaseQuantity}>
                    +
                </button>
            </div>
        </div>
    );
};

export default QuantityCounter;
