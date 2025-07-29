import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/Store'; // Using @ alias for src directory

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRole: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { role, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role?.toLowerCase() !== allowedRole.toLowerCase()) {
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
