// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: Array<'Common' | 'Attendant' | 'Admin'>;
}

// Protege rotas que exigem autenticação e/ou roles específicos
export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
  // 1. Sem token ou token expirado → vai para o login
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // 2. Com token mas sem o role necessário → vai para a página correta do seu role
  if (roles) {
    const role = getUserRole();
    if (!role || !roles.includes(role)) {
      const redirectTo =
        role === 'Admin' || role === 'Attendant' ? '/attendant' : '/user';
      return <Navigate to={redirectTo} replace />;
    }
  }

  // 3. Tudo certo → renderiza a página
  return <>{children}</>;
}