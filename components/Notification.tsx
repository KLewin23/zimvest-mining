import React from 'react';
import styles from '../styles/components/Notification.module.scss';

interface Props {
    children: React.ReactNode;
    open: boolean;
    highlightColor?: string;
    onClick?: () => void;
}

const Notification = ({ children, open, highlightColor, onClick }: Props): JSX.Element => {
    return (
        <button
            type={'button'}
            className={`${open ? '' : styles.closed} ${styles.notification}`}
            style={{
                boxShadow: highlightColor ? `0 9px 25px -7px ${highlightColor}` : `0 9px 25px -7px #DEE0E4`,
                cursor: onClick ? 'pointer' : 'unset',
                pointerEvents: onClick ? 'all' : 'none',
            }}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Notification;
