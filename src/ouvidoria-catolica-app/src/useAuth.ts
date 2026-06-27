// src/hooks/useAuth.ts
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: 'Common' | 'Attendant' | 'Admin';
  exp: number;
}

// Lê e decodifica o token do localStorage com segurança
function getTokenPayload(): JwtPayload | null {
  try {
    const token = localStorage.getItem('@Ouvidoria:token');
    if (!token) return null;
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

// Verifica se o token existe e ainda não expirou
export function isAuthenticated(): boolean {
  const payload = getTokenPayload();
  if (!payload) return false;
  const agora = Math.floor(Date.now() / 1000);
  return payload.exp > agora;
}

// Retorna o role do usuário logado
export function getUserRole(): JwtPayload['role'] | null {
  const payload = getTokenPayload();
  return payload?.role ?? null;
}

// Limpa a sessão completamente
export function clearSession(): void {
  localStorage.removeItem('@Ouvidoria:token');
  localStorage.removeItem('@Ouvidoria:role');
}