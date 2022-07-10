import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@fontsource/montserrat';
import '@fontsource/roboto';
import Footer from '../components/Footer';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Component {...pageProps} />
            <Footer />
        </>
    );
};

export default MyApp;
