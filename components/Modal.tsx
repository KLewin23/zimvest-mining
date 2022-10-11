import React, { ReactNode } from 'react';
import styles from '../styles/components/Modal.module.scss';

interface Props {
    open: boolean;
    children: ReactNode;
    className?: string;
}

const Modal = ({ open, children, className }: Props): JSX.Element => {
    return (
        <div className={`${styles.main} ${className}`} style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none' }}>
            <div className={styles.backdrop} />
            <div className={styles.container}>{children}</div>
        </div>
    );
};

export default Modal;
