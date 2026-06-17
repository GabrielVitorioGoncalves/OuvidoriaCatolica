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

    // Interceptor para injetar o token em rotas protegidas futuramente
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('@Ouvidoria:token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
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