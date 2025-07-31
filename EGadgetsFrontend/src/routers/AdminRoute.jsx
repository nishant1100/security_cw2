import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionContext } from '../context/SessionContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useSessionContext();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminRoute;