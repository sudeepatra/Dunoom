
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Admin, Owner, MenuItem, Ad, Scan, OwnerStatus, AdStatus } from '../types';
import { initialAds, initialAdmin, initialItems, initialOwners, initialScans } from '../utils/mockData';

interface DataContextType {
  admins: Admin[];
  owners: Owner[];
  menuItems: MenuItem[];
  ads: Ad[];
  scans: Scan[];
  addOwner: (owner: Omit<Owner, 'id' | 'created_at' | 'status' | 'logo_path' | 'primary_color' | 'font_family'>) => void;
  updateOwnerStatus: (id: number, status: OwnerStatus) => void;
  updateOwnerSettings: (id: number, settings: Partial<Pick<Owner, 'owner_name' | 'email' | 'logo_path' | 'primary_color' | 'font_family'>>) => void;
  updateOwnerPassword: (id: number, password_hash: string) => void;
  deleteOwner: (id: number) => void;
  addItem: (item: Omit<MenuItem, 'id'>) => void;
  updateItem: (id: number, data: Partial<MenuItem>) => void;
  deleteItem: (id: number) => void;
  addAd: (ad: Omit<Ad, 'id' | 'created_at'>) => void;
  updateAd: (id: number, data: Partial<Ad>) => void;
  deleteAd: (id: number) => void;
  addScan: (owner_id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmin);
  const [owners, setOwners] = useState<Owner[]>(initialOwners);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialItems);
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [scans, setScans] = useState<Scan[]>(initialScans);

  const addOwner = (ownerData: Omit<Owner, 'id' | 'created_at' | 'status' | 'logo_path' | 'primary_color' | 'font_family'>) => {
    const newOwner: Owner = {
      id: Date.now(),
      ...ownerData,
      status: 'pending',
      created_at: new Date().toISOString(),
      logo_path: null,
      primary_color: '#10b981',
      font_family: 'sans-serif'
    };
    setOwners(prev => [...prev, newOwner]);
  };

  const updateOwnerStatus = (id: number, status: OwnerStatus) => {
    setOwners(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };
  
  const deleteOwner = (id: number) => {
    setOwners(prev => prev.filter(o => o.id !== id));
    setMenuItems(prev => prev.filter(i => i.owner_id !== id));
  }

  const updateOwnerSettings = (id: number, settings: Partial<Pick<Owner, 'owner_name' | 'email' | 'logo_path' | 'primary_color' | 'font_family'>>) => {
    setOwners(prev => prev.map(o => o.id === id ? { ...o, ...settings } : o));
  };

  const updateOwnerPassword = (id: number, password_hash: string) => {
    setOwners(prev => prev.map(o => o.id === id ? { ...o, password_hash } : o));
  };

  const addItem = (item: Omit<MenuItem, 'id'>) => {
    setMenuItems(prev => [...prev, { ...item, id: Date.now() }]);
  };

  const updateItem = (id: number, data: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  };

  const deleteItem = (id: number) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
  };
  
  const addAd = (adData: Omit<Ad, 'id' | 'created_at'>) => {
    const newAd: Ad = {
      id: Date.now(),
      ...adData,
      created_at: new Date().toISOString()
    };
    setAds(prev => [...prev, newAd]);
  };

  const updateAd = (id: number, data: Partial<Ad>) => {
    setAds(prev => prev.map(ad => ad.id === id ? { ...ad, ...data } : ad));
  };

  const deleteAd = (id: number) => {
    setAds(prev => prev.filter(ad => ad.id !== id));
  };
  
  const addScan = (owner_id: number) => {
    const newScan: Scan = {
        id: Date.now(),
        owner_id,
        scan_time: new Date().toISOString(),
        ip_address: '127.0.0.1' // Mock IP
    };
    setScans(prev => [...prev, newScan]);
  };


  return (
    <DataContext.Provider value={{
      admins, owners, menuItems, ads, scans,
      addOwner, updateOwnerStatus, deleteOwner, updateOwnerSettings, updateOwnerPassword,
      addItem, updateItem, deleteItem,
      addAd, updateAd, deleteAd,
      addScan
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};