import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Owner } from '../../types';

const StatCard: React.FC<{ icon: string; title: string; value: string | number; color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className={`text-3xl ${color}`}>
            <i className={`fas ${icon}`}></i>
        </div>
        <div>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">{value}</p>
        </div>
    </div>
);

const StatusChart: React.FC<{data: {label: string, value: number, color: string}[]}> = ({ data }) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    if (total === 0) return null;

    return (
        <div>
            <div className="flex w-full h-4 rounded-full overflow-hidden mb-2 bg-gray-200 dark:bg-gray-700">
                {data.map(segment => (
                    <div
                        key={segment.label}
                        className={segment.color}
                        style={{ width: `${(segment.value / total) * 100}%` }}
                        title={`${segment.label}: ${segment.value}`}
                    />
                ))}
            </div>
            <div className="flex justify-center space-x-4 text-xs">
                 {data.map(segment => (
                     <div key={segment.label} className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${segment.color}`}></span>
                        <span>{segment.label}</span>
                    </div>
                 ))}
            </div>
        </div>
    );
};


const AdminDashboard: React.FC = () => {
    const { owners, updateOwnerStatus } = useData();
    const { showToast } = useToast();

    const totalOwners = owners.length;
    const activeOwners = owners.filter(o => o.status === 'active').length;
    const pendingOwners = owners.filter(o => o.status === 'pending');
    const suspendedOwners = owners.filter(o => o.status === 'suspended').length;
    
    const chartData = [
        { label: 'Active', value: activeOwners, color: 'bg-green-500' },
        { label: 'Pending', value: pendingOwners.length, color: 'bg-yellow-500' },
        { label: 'Suspended', value: suspendedOwners, color: 'bg-red-500' },
    ];

    const handleApprove = (id: number, name: string) => {
        updateOwnerStatus(id, 'active');
        showToast(`${name}'s account has been approved.`, 'success');
    };

    const handleSuspend = (id: number, name: string) => {
        updateOwnerStatus(id, 'suspended');
        showToast(`${name}'s account has been suspended.`, 'error');
    };


    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon="fa-users" title="Total Owners" value={totalOwners} color="text-primary" />
                <StatCard icon="fa-user-check" title="Active Owners" value={activeOwners} color="text-blue-400" />
                <StatCard icon="fa-user-clock" title="Pending Approvals" value={pendingOwners.length} color="text-yellow-400" />
            </div>
            
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-xl font-bold mb-4 text-center">Owner Status Overview</h2>
                <StatusChart data={chartData} />
            </div>

            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Recent Pending Approvals</h2>
                     <Link to="/admin/owners" className="text-sm text-primary hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    {pendingOwners.length > 0 ? (
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="border-b border-gray-200 dark:border-dark-border">
                            <tr>
                                <th className="p-3">Restaurant Name</th>
                                <th className="p-3 hidden sm:table-cell">Email</th>
                                <th className="p-3 hidden sm:table-cell">Registered</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingOwners.slice(0, 5).map(owner => (
                                <tr key={owner.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3">
                                        <div className="font-semibold">{owner.restaurant_name}</div>
                                        <div className="text-sm text-gray-500 dark:text-dark-text-secondary">{owner.owner_name}</div>
                                    </td>
                                    <td className="p-3 hidden sm:table-cell">{owner.email}</td>
                                    <td className="p-3 hidden sm:table-cell text-sm text-gray-500 dark:text-dark-text-secondary">{new Date(owner.created_at).toLocaleDateString()}</td>
                                    <td className="p-3 text-center">
                                         <div className="flex justify-center space-x-2">
                                            <button onClick={() => handleApprove(owner.id, owner.owner_name)} className="bg-green-500/20 text-green-400 hover:bg-green-500/40 px-3 py-1 rounded-full text-xs font-bold" title="Approve">Approve</button>
                                            <button onClick={() => handleSuspend(owner.id, owner.owner_name)} className="bg-red-500/20 text-red-400 hover:bg-red-500/40 px-3 py-1 rounded-full text-xs font-bold" title="Suspend">Suspend</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-dark-text-secondary py-8">
                            <i className="fas fa-check-circle text-4xl mb-3"></i>
                            <p className="font-semibold">All clear!</p>
                            <p>There are no pending owner approvals.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;