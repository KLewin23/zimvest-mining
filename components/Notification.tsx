import React from 'react';
import styles from '../styles/components/Notification.module.scss';

interface Props {
    children: React.ReactNode;
    open: boolean;
}

const Notification = ({ children, open }: Props): JSX.Element => {
    return <div className={`${open ? '' : styles.closed} ${styles.notification}`}>{children}</div>;
};

export default Notification;
