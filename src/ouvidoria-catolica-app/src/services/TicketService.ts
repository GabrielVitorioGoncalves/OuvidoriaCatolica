// src/services/TicketService.ts
import type { HttpClient } from '../infra/HttpClient';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const Sector = {
  GeneralService: 1,
  Financial: 2,
  Infrastructure: 3,
  HumanResources: 4,
  Health: 5,
  Education: 6,
} as const;
export type SectorType = typeof Sector[keyof typeof Sector];

export const TicketStatus = {
  New: 1,
  InReview: 2,
  AwaitingResponse: 3,
  Closed: 4,
} as const;
export type TicketStatusType = typeof TicketStatus[keyof typeof TicketStatus];

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface CriarTicketDTO {
  title: string;
  description: string;
  sector: SectorType;
}

export interface CriarRespostaDTO {
  message: string;
}

// ─── Responses ────────────────────────────────────────────────────────────────

export interface TicketListaResponse {
  ticketID: string;
  title: string;
  description: string;
  sector: SectorType;
  status: TicketStatusType;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  attendantId?: string;
  attendantName?: string;
  isMyTicket: boolean;
}

export interface TicketCriadoResponse {
  ticketID: string;
  title: string;
  description: string;
  sector: SectorType;
  status: TicketStatusType;
  createdAt: string;
}

export interface TicketRespostaResponse {
  responseID: string;
  message: string;
  responsibleAttendant: string;
  respondedAt: string;
}

export interface TicketHistoricoResponse {
  id: string;
  descricao: string;
  data: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class TicketService {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  // POST /api/tickets — cria manifestação (Role: Common)
  async criar(dados: CriarTicketDTO): Promise<TicketCriadoResponse> {
    return this.http.post<TicketCriadoResponse>('/tickets', dados);
  }

  // GET /api/tickets/my-tickets — lista tickets do usuário logado (Role: Common)
  async listar(): Promise<TicketListaResponse[]> {
    return this.http.get<TicketListaResponse[]>('/tickets/my-tickets');
  }

  // GET /api/tickets — lista todos os tickets (Role: Admin)
  async listarTodos(): Promise<TicketListaResponse[]> {
    return this.http.get<TicketListaResponse[]>('/tickets');
  }

  // GET /api/tickets/sector/{sector} — lista tickets do setor (Role: Attendant)
  async listarPorSetor(sector: SectorType): Promise<TicketListaResponse[]> {
    return this.http.get<TicketListaResponse[]>(`/tickets/sector/${sector}`);
  }

  // GET /api/tickets/{id}/responses — respostas do ticket (Role: Authorize)
  async buscarRespostas(id: string): Promise<TicketRespostaResponse[]> {
    return this.http.get<TicketRespostaResponse[]>(`/tickets/${id}/responses`);
  }

  // GET /api/tickets/{id}/history — histórico do ticket (Role: Attendant, Admin)
  async buscarHistorico(id: string): Promise<TicketHistoricoResponse[]> {
    return this.http.get<TicketHistoricoResponse[]>(`/tickets/${id}/history`);
  }

  // POST /api/tickets/{id}/responses — responde ao ticket (Role: Attendant, Admin)
  async responder(id: string, dados: CriarRespostaDTO): Promise<TicketRespostaResponse> {
    return this.http.post<TicketRespostaResponse>(`/tickets/${id}/responses`, dados);
  }

  // PUT /api/tickets/{id}/assign — assume o ticket (Role: Attendant, Admin)
  async assumir(id: string): Promise<TicketListaResponse> {
    return this.http.put<TicketListaResponse>(`/tickets/${id}/assign`, {});
  }

  // PUT /api/tickets/{id}/close — fecha o ticket (Role: Attendant, Admin)
  async fechar(id: string): Promise<void> {
    return this.http.put<void>(`/tickets/${id}/close`, {});
  }

  // PUT /api/tickets/{id}/request-info — solicita mais informações (Role: Attendant, Admin)
  async solicitarInformacoes(id: string): Promise<void> {
    return this.http.put<void>(`/tickets/${id}/request-info`, {});
  }

  async buscarPorId(id: string): Promise<TicketListaResponse> {
  return this.http.get<TicketListaResponse>(`/tickets/${id}`);
  }
}