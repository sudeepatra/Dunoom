import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-dark-bg text-gray-900 dark:text-dark-text">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 mb-16 md:mb-0">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;