import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white dark:bg-dark-card shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to={user?.role === 'admin' ? '/admin' : '/owner'} className="text-2xl font-bold text-primary">
                    doonum
                </Link>
                <div className="flex items-center space-x-4">
                    <span className="hidden sm:inline text-gray-500 dark:text-dark-text-secondary">Welcome, {user?.name}</span>
                     <button
                        onClick={toggleTheme}
                        className="text-gray-500 dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary text-xl"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center space-x-2"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;