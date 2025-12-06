import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const StatCard: React.FC<{ icon: string; title: string; value: string | number; color: string; subtext?: React.ReactNode }> = ({ icon, title, value, color, subtext }) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className={`text-3xl ${color}`}>
            <i className={`fas ${icon}`}></i>
        </div>
        <div>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{title}</p>
            <div className="flex items-baseline space-x-2">
                 <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{value}</p>
                 {subtext}
            </div>
        </div>
    </div>
);

const OwnerDashboard: React.FC = () => {
    const { user } = useAuth();
    const { owners, menuItems, scans } = useData();
    
    const owner = owners.find(o => o.id === user?.id);
    const ownerItemsCount = menuItems.filter(item => item.owner_id === user?.id).length;
    
    // Scan Analytics
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const ownerScans = scans.filter(s => s.owner_id === user?.id);
    const scansThisWeek = ownerScans.filter(s => new Date(s.scan_time) >= oneWeekAgo).length;
    const scansLastWeek = ownerScans.filter(s => new Date(s.scan_time) < oneWeekAgo && new Date(s.scan_time) >= twoWeeksAgo).length;

    let scanTrend = 0;
    if (scansLastWeek > 0) {
        scanTrend = ((scansThisWeek - scansLastWeek) / scansLastWeek) * 100;
    } else if (scansThisWeek > 0) {
        scanTrend = 100; // If last week was 0 and this week has scans, it's a 100% increase from 0
    }
    
    const trendColor = scanTrend >= 0 ? 'text-green-400' : 'text-red-400';
    const trendIcon = scanTrend >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';

    if (!owner) {
        return <div className="text-center text-red-500">Could not find owner data.</div>;
    }

    const menuUrl = `${window.location.origin}${window.location.pathname}#/menu/${user?.id}`;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>
            
            {owner.status === 'pending' && (
                 <div className="bg-yellow-500/20 text-yellow-400 p-4 rounded-lg mb-6 text-center">
                    <h3 className="font-bold text-lg"><i className="fas fa-clock mr-2"></i>Account Pending Approval</h3>
                    <p>Your account is currently under review by an administrator. You will have full access once approved.</p>
                </div>
            )}
            
             {owner.status === 'suspended' && (
                 <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-center">
                    <h3 className="font-bold text-lg"><i className="fas fa-ban mr-2"></i>Account Suspended</h3>
                    <p>Your account has been suspended. Please contact support for more information.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard icon="fa-utensils" title="Total Menu Items" value={ownerItemsCount} color="text-primary" />
                <StatCard 
                    icon="fa-qrcode" 
                    title="Scans This Week" 
                    value={scansThisWeek} 
                    color="text-purple-400"
                    subtext={
                        <span className={`text-sm font-bold ${trendColor} flex items-center`}>
                           <i className={`fas ${trendIcon} mr-1`}></i> 
                           {scanTrend.toFixed(0)}%
                        </span>
                    }
                />
            </div>

            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                    <Link to="/owner/menu" className="w-full sm:w-auto text-center bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                        <i className="fas fa-edit mr-2"></i> Manage Menu
                    </Link>
                    <a href={menuUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                        <i className="fas fa-eye mr-2"></i> View Live Menu
                    </a>
                    <Link to="/owner/qr-code" className="w-full sm:w-auto text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                        <i className="fas fa-qrcode mr-2"></i> View QR Code
                    </Link>
                     <Link to="/owner/settings" className="w-full sm:w-auto text-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                        <i className="fas fa-cog mr-2"></i> Menu Settings
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;