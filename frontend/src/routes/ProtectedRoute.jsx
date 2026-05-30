import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Loader } from '../components/common';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, token } = useAuthStore();

  if (token && !isAuthenticated) {
    return <Loader fullScreen text="Authenticating..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}

export function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
