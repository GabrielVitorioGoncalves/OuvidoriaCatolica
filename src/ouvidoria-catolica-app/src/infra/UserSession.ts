// src/infra/userSession.ts

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface UserSession {
  name: string;
  role: number; // 1=Usuário, 2=Atendente, 3=Administrador
  sector?: number; // setor do atendente (quando role=2)
}

const ROLE_LABELS: Record<number, string> = {
  1: 'Usuário',
  2: 'Atendente',
  3: 'Administrador',
};

const SESSION_KEY = '@Ouvidoria:user';

// ─── Funções ──────────────────────────────────────────────────────────────────

// Salva os dados do usuário após o login
export function saveUserSession(user: UserSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// Lê os dados do usuário salvos na sessão
export function getUserSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

// Retorna o label legível do role
export function getRoleLabel(role: number): string {
  return ROLE_LABELS[role] ?? 'Usuário';
}

// Retorna a primeira letra do nome em maiúsculo para o Avatar
export function getAvatarLetter(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

// Limpa a sessão do usuário (usado no logout)
export function clearUserSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('@Ouvidoria:token');
  localStorage.removeItem('@Ouvidoria:role');
}