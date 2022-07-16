import React from 'react';
import '@fontsource/roboto';
import '../styles/globals.css';
import '@fontsource/montserrat';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import Footer from '../components/Footer';

const MyApp = ({ Component, pageProps }: AppProps) => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <Footer />
        </QueryClientProvider>
    );
};

export default MyApp;
