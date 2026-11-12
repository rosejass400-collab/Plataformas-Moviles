import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function UserRoutes({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/auth" replace />;
}
