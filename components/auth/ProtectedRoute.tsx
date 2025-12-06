
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  // FIX: Changed JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  children: React.ReactElement;
  role: 'owner' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-dark-bg">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== role) {
    // Redirect to the correct dashboard if wrong role, or login if no role
    const destination = user.role === 'admin' ? '/admin' : (user.role === 'owner' ? '/owner' : '/login');
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default ProtectedRoute;