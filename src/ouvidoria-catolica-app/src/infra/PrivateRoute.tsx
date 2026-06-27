// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../useAuth';

type Role = 'Common' | 'Attendant' | 'Admin';
/*
// Mapeia o role numérico do localStorage para o role string do backend
const ROLE_MAP: Record<string, Role> = {
  '1': 'Common',
  '2': 'Attendant',
  '3': 'Admin',
};

function getUserRoleFromStorage(): Role | null {
  const raw = localStorage.getItem('@Ouvidoria:role');
  if (!raw) return null;
  return ROLE_MAP[raw] ?? null;
}
*/
function getRedirectByRole(role: Role | null): string {
  if (role === 'Attendant' || role === 'Admin') return '/attendant';
  return '/user';
}

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: Role[];
}

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
  // 1. Sem token ou token expirado → login
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // 2. Role insuficiente → redireciona para a página correta do seu role
  if (roles) {
    const role = getUserRole();

    if (!role || !roles.includes(role)) {
      return <Navigate to={getRedirectByRole(role)} replace />;
    }
  }

  // 3. Tudo certo → renderiza
  return <>{children}</>;
}