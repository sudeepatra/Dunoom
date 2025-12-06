import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            showToast('Please fill in all fields.', 'error');
            return;
        }

        setIsLoading(true);
        // Simulate network delay
        setTimeout(async () => {
            const result = await login(email, password);

            if (result === 'admin') {
                navigate('/admin/dashboard');
            } else if (result === 'owner') {
                navigate('/owner/dashboard');
            } else {
                showToast('Invalid credentials or account not active.', 'error');
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-2xl w-full">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
                        Email or Admin Username
                    </label>
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/80 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Login'}
                    </button>
                </div>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-dark-text-secondary">
                New restaurant owner?{' '}
                <Link to="/register" className="font-medium text-primary hover:text-primary/90">
                    Register here
                </Link>
            </p>
        </div>
    );
};

export default LoginPage;