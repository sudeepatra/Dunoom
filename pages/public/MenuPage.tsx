import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Owner, MenuItem, Ad } from '../../types';
import { useTheme } from '../../context/ThemeContext';

const MenuPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { owners, menuItems, ads, addScan } = useData();
    const { theme } = useTheme(); // Use theme for base styling
    const [owner, setOwner] = useState<Owner | null>(null);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [showBackToTop, setShowBackToTop] = useState(false);
    
    useEffect(() => {
        if (id) {
            const ownerId = parseInt(id, 10);
            const foundOwner = owners.find(o => o.id === ownerId && o.status === 'active');
            if (foundOwner) {
                setOwner(foundOwner);
                setItems(menuItems.filter(i => i.owner_id === ownerId));
                addScan(ownerId);
            }
        }
    }, [id, owners, menuItems, addScan]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const randomAd = useMemo(() => {
        const activeAds = ads.filter(ad => ad.status === 'active');
        if (activeAds.length === 0) return null;
        return activeAds[Math.floor(Math.random() * activeAds.length)];
    }, [ads]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!owner) {
        return (
            <div className={`flex items-center justify-center min-h-screen p-4 text-center ${theme === 'dark' ? 'bg-dark-bg text-white' : 'bg-gray-100 text-gray-800'}`}>
                <div>
                    <h1 className="text-4xl font-bold text-red-500 mb-2">Menu Not Found</h1>
                    <p className={`text-lg ${theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-600'}`}>The requested menu is unavailable or does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${theme === 'dark' ? 'dark bg-dark-bg' : 'bg-gray-50'} min-h-screen`} style={{ colorScheme: theme }}>
            <style>
                {`
                :root {
                    --custom-primary-color: ${owner.primary_color};
                    --custom-font-family: ${owner.font_family};
                }
                .text-custom-primary { color: var(--custom-primary-color); }
                body { font-family: var(--custom-font-family); }
                .menu-header-bg { background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'}; }
                .menu-card-bg { background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'}; }
                .menu-text-primary { color: ${theme === 'dark' ? '#f9fafb' : '#111827'};}
                .menu-text-secondary { color: ${theme === 'dark' ? '#9ca3af' : '#6b7280'};}
                .menu-border { border-color: ${theme === 'dark' ? '#374151' : '#e5e7eb'};}
                `}
            </style>
            <header className="p-6 text-center menu-header-bg shadow-lg">
                {owner.logo_path && <img src={owner.logo_path} alt={`${owner.restaurant_name} Logo`} className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-2 menu-border" />}
                <h1 className="text-4xl font-bold text-custom-primary">{owner.restaurant_name}</h1>
            </header>
            
            <main className="container mx-auto p-4 md:p-6">
                <div className="mb-10">
                    <h2 className="text-3xl font-semibold text-custom-primary border-b-2 menu-border pb-2 mb-6">Our Menu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {items.map(item => (
                            <div key={item.id} className={`menu-card-bg rounded-lg shadow-md overflow-hidden flex ${!item.is_available ? 'opacity-50' : ''}`}>
                                {item.image_path && (
                                    <img src={item.image_path} alt={item.name} className="w-24 h-full object-cover hidden sm:block" />
                                )}
                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold menu-text-primary">{item.name}</h3>
                                        <p className="text-lg font-semibold text-custom-primary ml-4 whitespace-nowrap">₹{item.price.toFixed(2)}</p>
                                    </div>
                                    <p className="menu-text-secondary mt-2">{item.description}</p>
                                    {!item.is_available && <p className="text-red-400 font-semibold mt-2 text-sm">Currently Unavailable</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {randomAd && (
                    <div className="mt-12 text-center">
                         <p className="text-xs menu-text-secondary mb-2">Advertisement</p>
                        <a href={randomAd.target_url} target="_blank" rel="noopener noreferrer">
                            <img src={randomAd.image_path} alt={randomAd.name} className="rounded-lg shadow-md mx-auto" />
                        </a>
                    </div>
                )}
            </main>

             <footer className="text-center py-6 mt-8 menu-text-secondary text-sm">
                Powered by <span className="font-bold text-primary">doonum</span>
            </footer>

            {showBackToTop && (
                <button 
                    onClick={scrollToTop} 
                    className="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center text-xl hover:bg-primary/90 transition-opacity"
                    aria-label="Back to top"
                >
                    <i className="fas fa-arrow-up"></i>
                </button>
            )}
        </div>
    );
};

export default MenuPage;