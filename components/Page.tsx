import React from 'react';
import TopBar from './TopBar';
import NavBar from './NavBar';

const PageLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return (
        <main>
            <TopBar />
            <NavBar />
            {children}
        </main>
    );
};

export default PageLayout;
