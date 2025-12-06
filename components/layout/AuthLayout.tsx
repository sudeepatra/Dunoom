import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const AuthLayout: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-dark-bg p-4 transition-colors duration-300">
            <div className="w-full max-w-md">
                 <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">doonum</h1>
                    <p className="text-gray-600 dark:text-dark-text-secondary">Your Digital Menu Solution</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;