// src/services/AuthService.ts
import type { HttpClient } from '../infra/HttpClient';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
    role: number;
    sector?: number;
  }
}

export class AuthService {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async login(dados: LoginDTO): Promise<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/login', dados);
  }

  async createPassword(dados: LoginDTO): Promise<void> {
    return this.http.post<void>('/auth/create-password', dados)
  }
}