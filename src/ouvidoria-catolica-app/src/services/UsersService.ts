import type { HttpClient } from '../infra/HttpClient';

// Role espelhando o AuthService (role: number)
export const Role = {
  Common: 1,
  Attendant: 2,
  Admin: 3,
} as const;
export type RoleType = typeof Role[keyof typeof Role];

export interface UsuarioResponse {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  sector?: number;
  isActive: boolean;
  createdAt: string;
}

export interface CriarUsuarioDTO {
  name: string;
  email: string;
  password: string;
  role: RoleType;
  sector?: number;
}

export interface AtualizarUsuarioDTO {
  name: string;
  email: string;
  role: RoleType;
  sector?: number;
  isActive: boolean;
}

export class UserService {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  // GET /api/users — lista todos (Role: Admin)
  async listar(): Promise<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>('/users');
  }

  // POST /api/users — cria usuário (Role: Admin)
  async criar(dados: CriarUsuarioDTO): Promise<UsuarioResponse> {
    return this.http.post<UsuarioResponse>('/users', dados);
  }

  // PUT /api/users/{id} — atualiza usuário (Role: Admin)
  async atualizar(id: string, dados: AtualizarUsuarioDTO): Promise<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`/users/${id}`, dados);
  }
}