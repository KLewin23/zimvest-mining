import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@fontsource/montserrat';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <TopBar />
            <NavBar />
            <Component {...pageProps} />
        </>
    );
};

export default MyApp;
