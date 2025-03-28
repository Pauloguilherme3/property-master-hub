
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role restrictions if provided
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to pending approval page for users without proper permissions
    return <Navigate to="/registro-pendente" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
