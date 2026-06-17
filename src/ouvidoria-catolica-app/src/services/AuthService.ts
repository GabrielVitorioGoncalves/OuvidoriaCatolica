// src/services/AuthService.ts
import type { HttpClient } from '../infra/HttpClient';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export class AuthService {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async login(dados: LoginDTO): Promise<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/login', dados);
  }
}