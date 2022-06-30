import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import '@fontsource/montserrat';
import '@fontsource/roboto';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return <Component {...pageProps} />;
};

export default MyApp;
