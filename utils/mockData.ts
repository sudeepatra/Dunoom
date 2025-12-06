
import { Admin, Owner, MenuItem, Ad, Scan } from '../types';

// In a real app, you would use password_hash()
export const initialAdmin: Admin[] = [
    { id: 1, username: 'admin', password_hash: 'password' }
];

export const initialOwners: Owner[] = [
    {
        id: 1,
        restaurant_name: 'The Green Leaf',
        owner_name: 'Alice Johnson',
        email: 'sudeepatra@gmail.com',
        password_hash: 'Sudeep4409r?',
        logo_path: 'https://picsum.photos/id/1060/200/200',
        primary_color: '#10b981',
        font_family: 'Roboto, sans-serif',
        status: 'active',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
        id: 2,
        restaurant_name: 'Ocean Bites',
        owner_name: 'Bob Williams',
        email: 'bob@example.com',
        password_hash: 'password',
        logo_path: 'https://picsum.photos/id/10/200/200',
        primary_color: '#3b82f6',
        font_family: 'Lato, sans-serif',
        status: 'active',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
        id: 3,
        restaurant_name: 'The Cozy Corner',
        owner_name: 'Charlie Brown',
        email: 'charlie@example.com',
        password_hash: 'password',
        logo_path: null,
        primary_color: '#ef4444',
        font_family: 'sans-serif',
        status: 'pending',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
        id: 4,
        restaurant_name: 'Suspended Cafe',
        owner_name: 'David Miller',
        email: 'david@example.com',
        password_hash: 'password',
        logo_path: null,
        primary_color: '#f97316',
        font_family: 'sans-serif',
        status: 'suspended',
        created_at: new Date(Date.now() - 86400000 * 10).toISOString()
    }
];

export const initialItems: MenuItem[] = [
    { id: 1, owner_id: 1, name: 'Bruschetta', description: 'Grilled bread topped with fresh tomatoes, garlic, basil, and olive oil.', price: 8.99, image_path: 'https://picsum.photos/seed/bruschetta/400/300', is_available: true },
    { id: 2, owner_id: 1, name: 'Stuffed Mushrooms', description: 'Mushroom caps filled with herbs, breadcrumbs, and cheese.', price: 10.50, image_path: null, is_available: true },
    { id: 3, owner_id: 1, name: 'Pasta Carbonara', description: 'Classic pasta with eggs, cheese, pancetta, and black pepper.', price: 15.00, image_path: 'https://picsum.photos/seed/pasta/400/300', is_available: true },
    { id: 4, owner_id: 1, name: 'Grilled Salmon', description: 'Fresh salmon fillet grilled to perfection, served with asparagus.', price: 22.99, image_path: 'https://picsum.photos/seed/salmon/400/300', is_available: false },
    { id: 5, owner_id: 1, name: 'Tiramisu', description: 'A coffee-flavoured Italian dessert.', price: 7.50, image_path: 'https://picsum.photos/seed/tiramisu/400/300', is_available: true },
    { id: 6, owner_id: 2, name: 'Lobster Roll', description: 'Fresh lobster meat with a touch of mayo in a buttery roll.', price: 25.00, image_path: 'https://picsum.photos/seed/lobster/400/300', is_available: true },
    { id: 7, owner_id: 2, name: 'Ocean Blue Lemonade', description: 'A refreshing blue raspberry lemonade.', price: 4.50, image_path: null, is_available: true },
];

export const initialAds: Ad[] = [
    { id: 1, name: 'Local Delivery Co.', image_path: 'https://picsum.photos/seed/ad1/800/200', target_url: '#', status: 'active', created_at: new Date().toISOString() },
    { id: 2, name: 'Farm Fresh Produce', image_path: 'https://picsum.photos/seed/ad2/800/200', target_url: '#', status: 'active', created_at: new Date().toISOString() },
    { id: 3, name: 'Old Ad', image_path: 'https://picsum.photos/seed/ad3/800/200', target_url: '#', status: 'inactive', created_at: new Date().toISOString() }
];

export const initialScans: Scan[] = [
    { id: 1, owner_id: 1, scan_time: new Date().toISOString(), ip_address: '127.0.0.1' },
    { id: 2, owner_id: 1, scan_time: new Date().toISOString(), ip_address: '127.0.0.1' },
    { id: 3, owner_id: 2, scan_time: new Date().toISOString(), ip_address: '127.0.0.1' },
];