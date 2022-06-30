import React from 'react';
import { MdMailOutline, MdPhone } from 'react-icons/md';
import styles from '../styles/components/TopBar.module.scss';

const TopBar = (): JSX.Element => {
    return (
        <div className={styles.main}>
            <div>
                <div>
                    <div>
                        <MdMailOutline size={15} />
                        <h4>Email: info@zimvestmining.com</h4>
                    </div>
                    <div>
                        <MdPhone size={15} />
                        <h4>Phone: +263 780 720 623</h4>
                    </div>
                </div>
                <div>
                    <h4>USD</h4>
                    <h4>Select Language</h4>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
