import React, { ReactNode } from 'react';
import styles from '../styles/components/Modal.module.scss';

interface Props {
    open: boolean;
    children: ReactNode;
}

const Modal = ({ open, children }: Props): JSX.Element => {
    return (
        <div className={styles.main} style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none' }}>
            <div className={styles.backdrop} />
            <div className={styles.container}>{children}</div>
        </div>
    );
};

export default Modal;
