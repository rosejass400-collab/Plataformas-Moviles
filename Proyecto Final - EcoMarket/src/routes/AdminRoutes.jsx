import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function AdminRoutes({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return null;
  return user && isAdmin ? children : <Navigate to="/profile" replace />;
}
