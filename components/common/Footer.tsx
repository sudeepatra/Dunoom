import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Footer: React.FC = () => {
    const { user } = useAuth();

    const getNavLinks = () => {
        if (user?.role === 'admin') {
            return [
                { path: '/admin/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
                { path: '/admin/owners', icon: 'fa-users-cog', label: 'Owners' },
                { path: '/admin/ads', icon: 'fa-ad', label: 'Ads' },
            ];
        }
        if (user?.role === 'owner') {
            return [
                { path: '/owner/dashboard', icon: 'fa-home', label: 'Home' },
                { path: '/owner/menu', icon: 'fa-utensils', label: 'Menu' },
                { path: '/owner/qr-code', icon: 'fa-qrcode', label: 'QR Code' },
                { path: '/owner/settings', icon: 'fa-cog', label: 'Settings' },
            ];
        }
        return [];
    };

    const navLinks = getNavLinks();

    const activeLinkClass = 'text-primary';
    const inactiveLinkClass = 'text-gray-500 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-white';

    return (
        <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border shadow-lg z-10">
            <nav className="flex justify-around items-center h-16">
                {navLinks.map(({ path, icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-full transition duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
                        }
                    >
                        <i className={`fas ${icon} text-xl`}></i>
                        <span className="text-xs mt-1">{label}</span>
                    </NavLink>
                ))}
            </nav>
        </footer>
    );
};

export default Footer;