// src/infra/http/AxiosAdapter.ts
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { HttpClient, RequestConfig } from './HttpClient';

export class AxiosAdapter implements HttpClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // ─── Interceptor de REQUEST ───────────────────────────────────────────────
    // Injeta o token JWT em todas as requisições automaticamente
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('@Ouvidoria:token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // ─── Interceptor de RESPONSE ──────────────────────────────────────────────
    // Trata erros globais de autenticação e autorização
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;

        // 401 — token expirado ou inválido: limpa sessão e redireciona para login
        if (status === 401) {
          localStorage.removeItem('@Ouvidoria:token');
          localStorage.removeItem('@Ouvidoria:role');
          window.location.href = '/';
        }

        // 403 — usuário autenticado mas sem permissão
        if (status === 403) {
          // O redirecionamento forçado foi REMOVIDO daqui para acabar com o loop infinito.
          // O Axios agora apenas avisa no console e deixa o componente da tela exibir o erro no Snackbar.
          console.warn("Acesso negado pela API (Erro 403). Verifique as permissões da rota no backend.");
        }

        // Repassa o erro para o catch do service tratar normalmente
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config as AxiosRequestConfig);
    return response.data;
  }

  async post<T>(url: string, body: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, body, config as AxiosRequestConfig);
    return response.data;
  }

  async put<T>(url: string, body: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, body, config as AxiosRequestConfig);
    return response.data;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config as AxiosRequestConfig);
    return response.data;
  }
}

export const httpClient = new AxiosAdapter();