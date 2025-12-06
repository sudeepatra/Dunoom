import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Owner } from '../../types';

const MenuPreview: React.FC<{ color: string; font: string }> = ({ color, font }) => {
    return (
        <div>
            <h3 className="text-lg font-bold mb-2 text-gray-600 dark:text-dark-text-secondary">Live Preview</h3>
            <div className="bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg p-4">
                <style>
                    {`.preview-font { font-family: ${font}; } .preview-color { color: ${color}; }`}
                </style>
                <h4 className="text-xl font-bold preview-color preview-font">Sample Category</h4>
                <div className="mt-2 p-3 bg-white dark:bg-dark-card rounded-md preview-font">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900 dark:text-dark-text">Featured Dish</p>
                        <p className="font-semibold preview-color">₹499.00</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-1">A delicious description of the menu item goes here.</p>
                </div>
            </div>
        </div>
    )
}


const OwnerSettings: React.FC = () => {
    const { user } = useAuth();
    const { owners, updateOwnerSettings, updateOwnerPassword } = useData();
    const { showToast } = useToast();
    const [owner, setOwner] = useState<Owner | null>(null);

    // Form states
    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [primaryColor, setPrimaryColor] = useState('#10b981');
    const [fontFamily, setFontFamily] = useState('sans-serif');
    const [ownerName, setOwnerName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    useEffect(() => {
        const currentOwner = owners.find(o => o.id === user?.id);
        if (currentOwner) {
            setOwner(currentOwner);
            setPrimaryColor(currentOwner.primary_color);
            setFontFamily(currentOwner.font_family);
            setLogoPreview(currentOwner.logo_path);
            setOwnerName(currentOwner.owner_name);
            setEmail(currentOwner.email);
        }
    }, [owners, user]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleAppearanceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            // In a real app, you'd upload the logo file and get a URL
            const newLogoPath = logo ? logoPreview : owner?.logo_path;
            updateOwnerSettings(user.id, {
                logo_path: newLogoPath,
                primary_color: primaryColor,
                font_family: fontFamily
            });
            showToast('Appearance settings saved successfully!', 'success');
        }
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            updateOwnerSettings(user.id, { owner_name: ownerName, email });
            showToast('Profile information updated!', 'success');
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showToast('Passwords do not match.', 'error');
            return;
        }
        if (password.length < 6) {
             showToast('Password must be at least 6 characters long.', 'error');
            return;
        }
        if (user) {
            // In a real app, hash the password before saving
            updateOwnerPassword(user.id, password);
            showToast('Password changed successfully!', 'success');
            setPassword('');
            setConfirmPassword('');
        }
    };

    if (!owner) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Appearance Settings */}
                <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Menu Appearance</h2>
                    <form onSubmit={handleAppearanceSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Restaurant Logo</label>
                            {logoPreview && <img src={logoPreview} alt="Logo Preview" className="w-24 h-24 rounded-full object-cover my-2" />}
                            <input type="file" onChange={handleLogoChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"/>
                        </div>
                        <div>
                            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Primary Color</label>
                            <input id="primaryColor" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full h-10 p-1 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"/>
                        </div>
                         <div>
                            <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Font Family</label>
                            <select id="fontFamily" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-2 px-3">
                                <option value="sans-serif">System Default (Sans-serif)</option>
                                <option value="serif">Serif</option>
                                <option value="monospace">Monospace</option>
                                <option value="Roboto, sans-serif">Roboto</option>
                                <option value="Lato, sans-serif">Lato</option>
                            </select>
                        </div>
                        <MenuPreview color={primaryColor} font={fontFamily} />
                        <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg">Save Appearance</button>
                    </form>
                </div>
                
                {/* Profile and Password */}
                <div className="space-y-8">
                     <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Owner Name</label>
                                <input id="ownerName" type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" required/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Email Address</label>
                                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" required/>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Update Profile</button>
                        </form>
                    </div>
                     <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Change Password</h2>
                         <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">New Password</label>
                                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Confirm New Password</label>
                                <input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" />
                            </div>
                            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerSettings;