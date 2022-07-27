import React from 'react';
import { TickerTape } from 'react-ts-tradingview-widgets';
import TopBar from './TopBar';
import NavBar from './NavBar';
import type { User } from './types';
import Sidebar from './Sidebar';
import styles from '../styles/components/Page.module.scss';

type Props = {
    children: React.ReactNode;
    user?: User;
    withSideBar?: boolean;
    withCurrencyWidget?: boolean;
};

const PageLayout = ({ children, user, withSideBar, withCurrencyWidget }: Props): JSX.Element => {
    return (
        <main>
            <TopBar />
            <NavBar user={user} />
            {withCurrencyWidget ? (
                <div className={styles.widget}>
                    <TickerTape colorTheme={'dark'} copyrightStyles={{ parent: { maxHeight: '0px', overflow: 'hidden' } }} />
                </div>
            ) : null}
            <div className={styles.container}>
                {withSideBar ? <Sidebar /> : null}
                {children}
            </div>
        </main>
    );
};

export default PageLayout;
