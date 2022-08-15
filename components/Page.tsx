import React, { useEffect, useRef } from 'react';
import { TickerTape } from 'react-ts-tradingview-widgets';
import TopBar from './TopBar';
import NavBar from './NavBar';
import type { User } from './types';
import Sidebar from './Sidebar';
import styles from '../styles/components/Page.module.scss';

type Props = {
    children: React.ReactNode;
    user?: User;
    cartCount?: number;
    withSideBar?: boolean;
    withCurrencyWidget?: boolean;
};

const PageLayout = ({ children, user, withSideBar, withCurrencyWidget, cartCount }: Props): JSX.Element => {
    const scriptRef = useRef<HTMLScriptElement>(null);

    useEffect(() => {
        if (!scriptRef.current) return;
        scriptRef.current.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
        window.googleTranslateElementInit = () =>
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
                },
                'google_translate_element',
            );
    }, [scriptRef]);

    return (
        <main>
            <TopBar />
            <script ref={scriptRef} />
            <NavBar user={user} cartCount={cartCount} />
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
