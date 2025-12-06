import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Ad, AdStatus } from '../../types';

const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl">
                <i className="fas fa-times"></i>
            </button>
            {children}
        </div>
    </div>
);

const AdminAdsManage: React.FC = () => {
    const { ads, addAd, updateAd, deleteAd } = useData();
    const { showToast } = useToast();
    const [adModal, setAdModal] = useState<{ isOpen: boolean; ad: Partial<Ad> | null }>({ isOpen: false, ad: null });
    const [adImage, setAdImage] = useState<File | null>(null);
    const [adImagePreview, setAdImagePreview] = useState<string | null>(null);
    const [filter, setFilter] = useState<AdStatus | 'all'>('all');

    const filteredAds = useMemo(() => {
        if (filter === 'all') return ads;
        return ads.filter(ad => ad.status === filter);
    }, [ads, filter]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAdImage(file);
            setAdImagePreview(URL.createObjectURL(file));
        }
    };
    
    const openModal = (ad: Partial<Ad> | null = null) => {
        setAdModal({ isOpen: true, ad });
        if (ad?.image_path) {
            setAdImagePreview(ad.image_path);
        } else {
            setAdImagePreview(null);
        }
        setAdImage(null);
    };
    
    const handleDeleteAd = (id: number) => {
        deleteAd(id);
        showToast('Ad deleted successfully!', 'success');
    }

    const handleAdSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const target_url = formData.get('target_url') as string;
        const status = formData.get('status') as AdStatus;
        
        let image_path = adModal.ad?.image_path || '';
        if (adImage) {
            // In a real app, this would be an uploaded URL. For mock, we use the preview URL.
            image_path = adImagePreview!;
        }

        if(!image_path) {
            showToast('Please provide an image for the ad.', 'error');
            return;
        }

        if (adModal.ad?.id) {
            updateAd(adModal.ad.id, { name, target_url, status, image_path });
            showToast('Ad updated successfully!', 'success');
        } else {
            addAd({ name, target_url, status, image_path });
            showToast('Ad created successfully!', 'success');
        }
        setAdModal({ isOpen: false, ad: null });
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">Manage Ads</h1>
                 <div className="flex items-center space-x-2">
                     <span className="text-sm font-semibold text-gray-600 dark:text-dark-text-secondary">Filter:</span>
                    {(['all', 'active', 'inactive'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-sm font-semibold rounded-full capitalize transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-white dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                            {f}
                        </button>
                    ))}
                </div>
                <button onClick={() => openModal()} className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg w-full md:w-auto">
                    <i className="fas fa-plus mr-2"></i>New Ad
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAds.length > 0 ? filteredAds.map(ad => (
                    <div key={ad.id} className="bg-white dark:bg-dark-card rounded-lg shadow-lg overflow-hidden">
                        <img src={ad.image_path} alt={ad.name} className="w-full h-32 object-cover"/>
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{ad.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-dark-text-secondary break-all">{ad.target_url}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${ad.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {ad.status}
                                </span>
                                <div className="space-x-3">
                                    <button onClick={() => openModal(ad)} className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => handleDeleteAd(ad.id)} className="text-red-500 hover:text-red-600 dark:hover:text-red-400"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                     <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-white dark:bg-dark-card rounded-lg">
                        <i className="fas fa-ad text-4xl text-gray-400 dark:text-gray-500 mb-3"></i>
                        <p className="font-semibold text-gray-600 dark:text-dark-text-secondary">No ads found for the selected filter.</p>
                    </div>
                )}
            </div>

            {adModal.isOpen && (
                <Modal onClose={() => setAdModal({isOpen: false, ad: null})} title={adModal.ad?.id ? 'Edit Ad' : 'Add Ad'}>
                    <form onSubmit={handleAdSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="adName" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Ad Name</label>
                            <input id="adName" name="name" type="text" defaultValue={adModal.ad?.name || ''} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Ad Image</label>
                            {adImagePreview && <img src={adImagePreview} alt="Ad Preview" className="h-24 object-cover my-2 rounded-md" />}
                            <input type="file" onChange={handleImageChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" required={!adModal.ad?.id} />
                        </div>
                        <div>
                            <label htmlFor="adUrl" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Target URL</label>
                            <input id="adUrl" name="target_url" type="url" defaultValue={adModal.ad?.target_url || ''} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" required />
                        </div>
                        <div>
                            <label htmlFor="adStatus" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Status</label>
                            <select id="adStatus" name="status" defaultValue={adModal.ad?.status || 'active'} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" required>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg">Save Ad</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default AdminAdsManage;