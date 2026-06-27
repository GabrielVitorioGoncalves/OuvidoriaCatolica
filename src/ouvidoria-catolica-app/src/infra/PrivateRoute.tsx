// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../useAuth';

type Role = 'Common' | 'Attendant' | 'Admin';

function getRedirectByRole(role: Role | null): string {
  if (role === 'Attendant' || role === 'Admin') return '/attendant';
  return '/user';
}

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: Role[];
}

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (roles) {
    const role = getUserRole();
    if (!role || !roles.includes(role)) {
      return <Navigate to={getRedirectByRole(role)} replace />;
    }
  }

  return <>{children}</>;
}