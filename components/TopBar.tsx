import React from 'react';
import { MdMailOutline, MdPhone } from 'react-icons/md';
import styles from '../styles/components/TopBar.module.scss';
import { useWindowWidth } from './hooks';

const TopBar = (): JSX.Element => {
    const windowWidth = useWindowWidth();

    return (
        <div className={styles.main}>
            <div>
                {windowWidth > 1000 ? (
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
                ) : null}

                <div>
                    <div id={'google_translate_element'} className={styles.translate} />
                </div>
            </div>
        </div>
    );
};

export default TopBar;
