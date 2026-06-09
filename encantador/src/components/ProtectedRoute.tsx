import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  requireAuth = true,
  allowedRoles,
}: ProtectedRouteProps) {
  const { currentUser } = useUser();
  const location = useLocation();

  if (requireAuth && !currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && (!currentUser || !allowedRoles.includes(currentUser.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}