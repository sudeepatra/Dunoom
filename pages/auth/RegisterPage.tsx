import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

const RegisterPage: React.FC = () => {
    const [restaurantName, setRestaurantName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    const { addOwner, owners } = useData();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!restaurantName || !ownerName || !email || !password) {
            showToast('Please fill in all fields.', 'error');
            return;
        }

        if (owners.some(o => o.email === email)) {
            showToast('An account with this email already exists.', 'error');
            return;
        }

        addOwner({
            restaurant_name: restaurantName,
            owner_name: ownerName,
            email: email,
            password_hash: password // NOTE: In a real app, hash this before sending
        });

        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
    };

    if (success) {
        return (
            <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-2xl w-full text-center">
                <h2 className="text-2xl font-bold text-primary mb-4">Registration Successful!</h2>
                <p className="text-gray-600 dark:text-dark-text-secondary">Your account has been created and is now pending approval from an administrator. You will be redirected to the login page shortly.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-dark-card p-8 rounded-lg shadow-2xl w-full">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Owner Registration</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Restaurant Name</label>
                    <input id="restaurantName" type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Owner Name</label>
                    <input id="ownerName" type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Email Address</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/80 transition duration-200">Register</button>
                </div>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-dark-text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:text-primary/90">Login here</Link>
            </p>
        </div>
    );
};

export default RegisterPage;