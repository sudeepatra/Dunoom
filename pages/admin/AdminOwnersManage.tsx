import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Owner, OwnerStatus } from '../../types';

const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl">
                <i className="fas fa-times"></i>
            </button>
            {children}
        </div>
    </div>
);


const AdminOwnersManage: React.FC = () => {
    const { owners, updateOwnerStatus, deleteOwner } = useData();
    const [filter, setFilter] = useState<OwnerStatus | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmModal, setConfirmModal] = useState<{ action: () => void; title: string; message: React.ReactNode, confirmText: string, confirmClass: string } | null>(null);


    const filteredOwners = useMemo(() => {
        return owners
            .filter(owner => filter === 'all' || owner.status === filter)
            .filter(owner => {
                const term = searchTerm.toLowerCase();
                return (
                    owner.restaurant_name.toLowerCase().includes(term) ||
                    owner.owner_name.toLowerCase().includes(term) ||
                    owner.email.toLowerCase().includes(term)
                );
            });
    }, [owners, filter, searchTerm]);

    const getStatusChip = (status: OwnerStatus) => {
        switch (status) {
            case 'active': return 'bg-green-500/20 text-green-400';
            case 'pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'suspended': return 'bg-red-500/20 text-red-400';
        }
    };
    
    const openConfirmation = (owner: Owner, action: 'approve' | 'suspend' | 'reactivate' | 'delete') => {
        const actions = {
            approve: {
                title: 'Approve Owner',
                message: <>Are you sure you want to approve <strong>{owner.restaurant_name}</strong>? Their account will become active.</>,
                confirmText: 'Approve',
                confirmClass: 'bg-green-600 hover:bg-green-700',
                action: () => updateOwnerStatus(owner.id, 'active')
            },
            suspend: {
                title: 'Suspend Owner',
                message: <>Are you sure you want to suspend <strong>{owner.restaurant_name}</strong>? They will lose access to their dashboard.</>,
                confirmText: 'Suspend',
                confirmClass: 'bg-yellow-600 hover:bg-yellow-700',
                action: () => updateOwnerStatus(owner.id, 'suspended')
            },
            reactivate: {
                title: 'Reactivate Owner',
                message: <>Are you sure you want to reactivate <strong>{owner.restaurant_name}</strong>? They will regain access to their dashboard.</>,
                confirmText: 'Reactivate',
                confirmClass: 'bg-green-600 hover:bg-green-700',
                action: () => updateOwnerStatus(owner.id, 'active')
            },
            delete: {
                title: 'Delete Owner',
                message: <>Are you sure you want to permanently delete <strong>{owner.restaurant_name}</strong>? This action cannot be undone.</>,
                confirmText: 'Delete',
                confirmClass: 'bg-red-600 hover:bg-red-700',
                action: () => deleteOwner(owner.id)
            }
        };
        setConfirmModal(actions[action]);
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Owners</h1>
            
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-4">
                <div className="flex space-x-2">
                    {(['all', 'pending', 'active', 'suspended'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 md:px-4 md:py-2 text-sm font-semibold rounded-full capitalize transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-white dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <input 
                        type="text"
                        placeholder="Search owners..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-full py-2 pl-10 pr-4 focus:ring-primary focus:border-primary"
                    />
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-text-secondary"></i>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-lg overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="border-b border-gray-200 dark:border-dark-border">
                        <tr>
                            <th className="p-3">Restaurant</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOwners.length > 0 ? filteredOwners.map(owner => (
                            <tr key={owner.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="p-3">
                                    <div className="font-semibold">{owner.restaurant_name}</div>
                                    <div className="text-sm text-gray-500 dark:text-dark-text-secondary">{owner.owner_name}</div>
                                </td>
                                <td className="p-3">{owner.email}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusChip(owner.status)}`}>
                                        {owner.status}
                                    </span>
                                </td>
                                <td className="p-3 text-center">
                                    <div className="flex justify-center space-x-3 text-lg">
                                        {owner.status === 'pending' && <button onClick={() => openConfirmation(owner, 'approve')} className="text-green-400 hover:text-green-500" title="Approve"><i className="fas fa-check-circle"></i></button>}
                                        {owner.status === 'active' && <button onClick={() => openConfirmation(owner, 'suspend')} className="text-yellow-400 hover:text-yellow-500" title="Suspend"><i className="fas fa-ban"></i></button>}
                                        {owner.status === 'suspended' && <button onClick={() => openConfirmation(owner, 'reactivate')} className="text-green-400 hover:text-green-500" title="Reactivate"><i className="fas fa-check-circle"></i></button>}
                                        <button onClick={() => openConfirmation(owner, 'delete')} className="text-red-500 hover:text-red-600" title="Delete"><i className="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                           <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-dark-text-secondary">
                                    No owners match your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {confirmModal && (
                <Modal onClose={() => setConfirmModal(null)} title={confirmModal.title}>
                    <div className="text-gray-600 dark:text-dark-text-secondary">
                        {confirmModal.message}
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button onClick={() => setConfirmModal(null)} className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button 
                            onClick={() => {
                                confirmModal.action();
                                setConfirmModal(null);
                            }} 
                            className={`${confirmModal.confirmClass} text-white font-bold py-2 px-4 rounded-lg`}
                        >
                            {confirmModal.confirmText}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AdminOwnersManage;