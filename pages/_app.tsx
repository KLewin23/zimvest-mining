import React from 'react';
import '@fontsource/roboto';
import '../styles/globals.scss';
import '@fontsource/montserrat';
import 'react-phone-number-input/style.css';
import type { AppProps } from 'next/app';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Footer } from '../components';

const MyApp = ({ Component, pageProps }: AppProps) => {
    const queryClient = new QueryClient();

    return (
        <GoogleOAuthProvider clientId={'45427185746-5u3psdpvpecdcdbpll3dthgnhtnu1lrv.apps.googleusercontent.com'}>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <Component {...pageProps} />
                <Footer />
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
};

export default MyApp;

// { defaultOptions: { queries: { staleTime: 10 * 1000 } } }
