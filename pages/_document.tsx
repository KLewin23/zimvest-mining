import { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export const Document = () => {
    return (
        <Html>
            <Head lang={'en'} />
            <body>
                <Main />
                <NextScript />
                <script src={'//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'} async />
            </body>
        </Html>
    );
};

export default Document;
