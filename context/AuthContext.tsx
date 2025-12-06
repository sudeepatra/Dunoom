
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useData } from './DataContext';
import { AuthenticatedUser, UserRole } from '../types';

interface AuthContextType {
  user: AuthenticatedUser | null;
  loading: boolean;
  login: (email: string, password_raw: string) => Promise<'owner' | 'admin' | 'invalid'>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { admins, owners } = useData();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('doonum_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('doonum_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (emailOrUsername: string, password_raw: string): Promise<'owner' | 'admin' | 'invalid'> => {
    // Simulate async password verification
    const admin = admins.find(a => a.username === emailOrUsername);
    if (admin && admin.password_hash === password_raw) { // NOTE: In a real app, use password_verify()
      const authUser: AuthenticatedUser = { id: admin.id, name: admin.username, role: 'admin' };
      setUser(authUser);
      localStorage.setItem('doonum_user', JSON.stringify(authUser));
      return 'admin';
    }

    const owner = owners.find(o => o.email === emailOrUsername && o.status === 'active');
    if (owner && owner.password_hash === password_raw) { // NOTE: In a real app, use password_verify()
      const authUser: AuthenticatedUser = { id: owner.id, name: owner.owner_name, role: 'owner' };
      setUser(authUser);
      localStorage.setItem('doonum_user', JSON.stringify(authUser));
      return 'owner';
    }

    return 'invalid';
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('doonum_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
