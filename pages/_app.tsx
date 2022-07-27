import React from 'react';
import '@fontsource/roboto';
import '../styles/globals.css';
import '@fontsource/montserrat';
import type { AppProps } from 'next/app';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Footer } from '../components';

const MyApp = ({ Component, pageProps }: AppProps) => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <Component {...pageProps} />
            <Footer />
        </QueryClientProvider>
    );
};

export default MyApp;

// { defaultOptions: { queries: { staleTime: 10 * 1000 } } }
