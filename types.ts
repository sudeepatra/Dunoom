export interface Admin {
  id: number;
  username: string;
  password_hash: string;
}

export type OwnerStatus = 'pending' | 'active' | 'suspended';

export interface Owner {
  id: number;
  restaurant_name: string;
  owner_name: string;
  email: string;
  password_hash: string;
  logo_path: string | null;
  primary_color: string;
  font_family: string;
  status: OwnerStatus;
  created_at: string;
}

export interface MenuItem {
  id: number;
  owner_id: number;
  name: string;
  description: string;
  price: number;
  image_path: string | null;
  is_available: boolean;
}

export type AdStatus = 'active' | 'inactive';

export interface Ad {
  id: number;
  name: string;
  image_path: string;
  target_url: string;
  status: AdStatus;
  created_at: string;
}

export interface Scan {
  id: number;
  owner_id: number;
  scan_time: string;
  ip_address: string;
}

export type UserRole = 'owner' | 'admin' | null;

export interface AuthenticatedUser {
    id: number;
    name: string;
    role: UserRole;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}