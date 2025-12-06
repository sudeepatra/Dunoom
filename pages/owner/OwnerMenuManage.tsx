import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { MenuItem } from '../../types';

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

const AvailabilityToggle: React.FC<{ item: MenuItem }> = ({ item }) => {
    const { updateItem } = useData();
    const { showToast } = useToast();

    const handleToggle = () => {
        const newAvailability = !item.is_available;
        updateItem(item.id, { is_available: newAvailability });
        showToast(`${item.name} is now ${newAvailability ? 'available' : 'unavailable'}.`, 'info');
    };

    return (
        <button
            onClick={handleToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${item.is_available ? 'bg-primary' : 'bg-gray-400 dark:bg-gray-600'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${item.is_available ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );
};


const OwnerMenuManage: React.FC = () => {
    const { user } = useAuth();
    const { menuItems, addItem, updateItem, deleteItem } = useData();
    const { showToast } = useToast();

    const [itemModal, setItemModal] = useState<{ isOpen: boolean; item: Partial<MenuItem> | null; }>({ isOpen: false, item: null });
    const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
    const [itemImage, setItemImage] = useState<File | null>(null);
    const [itemImagePreview, setItemImagePreview] = useState<string | null>(null);
    
    const ownerItems = useMemo(() => 
        menuItems.filter(item => item.owner_id === user?.id),
        [menuItems, user?.id]
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setItemImage(file);
            setItemImagePreview(URL.createObjectURL(file));
        }
    };
    
    const openItemModal = (item: Partial<MenuItem> | null) => {
        setItemModal({ isOpen: true, item });
        setItemImage(null);
        setItemImagePreview(item?.image_path || null);
    };

    const handleItemSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string);
        const is_available = formData.has('is_available');

        let image_path = itemModal.item?.image_path || null;
        if (itemImage) {
            image_path = itemImagePreview; // In a real app, this would be an uploaded URL
        }

        if (itemModal.item?.id) {
            updateItem(itemModal.item.id, { name, description, price, is_available, image_path });
            showToast('Item updated successfully!', 'success');
        } else {
            addItem({ name, description, price, is_available, image_path, owner_id: user!.id });
            showToast('Item added successfully!', 'success');
        }
        setItemModal({ isOpen: false, item: null });
    };

    const handleDelete = () => {
        if (confirmDelete) {
            deleteItem(confirmDelete.id);
            showToast('Item deleted.', 'success');
            setConfirmDelete(null);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Menu</h1>
                <button onClick={() => openItemModal(null)} className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg">
                    <i className="fas fa-plus mr-2"></i>New Item
                </button>
            </div>
            
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
                {ownerItems.length > 0 ? (
                    <div className="space-y-4">
                        {ownerItems.map(item => (
                            <div key={item.id} className="flex items-center bg-gray-100 dark:bg-gray-700/50 p-3 rounded-md">
                                {item.image_path ? (
                                    <img src={item.image_path} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                                ) : (
                                    <div className="w-16 h-16 rounded-md bg-gray-200 dark:bg-gray-800 flex items-center justify-center mr-4 text-gray-400">
                                        <i className="fas fa-image text-2xl"></i>
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <p className="font-bold">{item.name}</p>
                                    <p className="text-sm text-gray-600 dark:text-dark-text-secondary">₹{item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <AvailabilityToggle item={item} />
                                    <button onClick={() => openItemModal(item)} className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"><i className="fas fa-edit"></i></button>
                                    <button onClick={() => setConfirmDelete({ id: item.id, name: item.name })} className="text-red-500 hover:text-red-600 dark:hover:text-red-400"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <i className="fas fa-utensils text-4xl text-gray-400 dark:text-dark-text-secondary mb-4"></i>
                        <h2 className="text-xl font-bold">Your menu is empty!</h2>
                        <p className="text-gray-500 dark:text-dark-text-secondary mt-2">Get started by adding your first menu item.</p>
                    </div>
                )}
            </div>

            {/* Item Modal */}
            {itemModal.isOpen && (
                <Modal onClose={() => setItemModal({ isOpen: false, item: null })} title={itemModal.item?.id ? 'Edit Item' : 'Add Item'}>
                    <form onSubmit={handleItemSubmit} className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Item Image</label>
                            {itemImagePreview && <img src={itemImagePreview} alt="Item Preview" className="w-full h-32 rounded-md object-cover my-2" />}
                            <input type="file" onChange={handleImageChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"/>
                        </div>
                        <div>
                            <label htmlFor="itemName" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Item Name</label>
                            <input id="itemName" name="name" type="text" defaultValue={itemModal.item?.name || ''} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" required />
                        </div>
                        <div>
                            <label htmlFor="itemDesc" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Description</label>
                            <textarea id="itemDesc" name="description" defaultValue={itemModal.item?.description || ''} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" rows={3}></textarea>
                        </div>
                        <div>
                            <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-600 dark:text-dark-text-secondary">Price</label>
                            <input id="itemPrice" name="price" type="number" step="0.01" defaultValue={itemModal.item?.price || ''} className="mt-1 block w-full bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md py-2 px-3" required />
                        </div>
                         <div className="flex items-center">
                            <input id="is_available" name="is_available" type="checkbox" defaultChecked={itemModal.item?.is_available ?? true} className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-primary focus:ring-primary" />
                            <label htmlFor="is_available" className="ml-2 block text-sm text-gray-600 dark:text-dark-text-secondary">Is Available</label>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg">Save Item</button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Confirm Delete Modal */}
            {confirmDelete && (
                <Modal onClose={() => setConfirmDelete(null)} title="Delete Menu Item">
                    <p>Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</p>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button onClick={() => setConfirmDelete(null)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Delete</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default OwnerMenuManage;