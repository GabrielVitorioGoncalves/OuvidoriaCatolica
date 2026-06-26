// src/services/TicketService.ts
import type { HttpClient } from '../infra/HttpClient';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type Categoria =
  | 'Reclamação'
  | 'Sugestão'
  | 'Elogio'
  | 'Denúncia'
  | 'Solicitação'
  | 'Outros';

export type StatusTicket =
  | 'Aberta'
  | 'Encaminhada'
  | 'Em atendimento'
  | 'Concluída';

export interface CriarTicketDTO {
  categoria: Categoria;
  titulo: string;
  descricao: string;
}

// Retorno da listagem — GET /api/tickets/my-tickets
export interface TicketListaResponse {
  id: string;
  protocolo: string;
  tipo: string;
  titulo: string;
  atualizadaEm: string;
  status: StatusTicket;
}

// Retorno da criação — POST /api/tickets
export interface TicketCriadoResponse {
  id: string;
  protocolo: string;
  categoria: Categoria;
  titulo: string;
  descricao: string;
  status: StatusTicket;
  criadoEm: string;
}

// Retorno das respostas — GET /api/tickets/{id}/responses
export interface TicketRespostaResponse {
  id: string;
  mensagem: string;
  autor: string;
  criadoEm: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class TicketService {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  // POST /api/tickets — cria uma nova manifestação (Role: Common)
  async criar(dados: CriarTicketDTO): Promise<TicketCriadoResponse> {
    return this.http.post<TicketCriadoResponse>('/api/tickets', dados);
  }

  // GET /api/tickets/my-tickets — lista tickets do usuário logado (Role: Common)
  async listar(): Promise<TicketListaResponse[]> {
    return this.http.get<TicketListaResponse[]>('/api/tickets/my-tickets');
  }

  // GET /api/tickets/{id}/responses — respostas de um ticket (Role: Authorize)
  async buscarRespostas(id: string): Promise<TicketRespostaResponse[]> {
    return this.http.get<TicketRespostaResponse[]>(`/api/tickets/${id}/responses`);
  }
}