// src/services/TicketService.ts
import type { HttpClient } from '../infra/HttpClient';

// ─── Tipos (Adaptados para o Vite / erasableSyntaxOnly) ──────────────────────

export const Sector = {
  GeneralService: 1,
  Financial: 2,
  Infrastructure: 3,
  HumanResources: 4,
  Health: 5,
  Education: 6
} as const;

// Isso cria o tipo que o TypeScript precisa, sem gerar erro no Vite
export type SectorType = typeof Sector[keyof typeof Sector];

export const TicketStatus = {
  New: 1,
  InReview: 2,
  AwaitingResponse: 3,
  Closed: 4
} as const;

export type TicketStatusType = typeof TicketStatus[keyof typeof TicketStatus];

// Os nomes das propriedades devem bater exatamente com o DTO/Model do C#
export interface CriarTicketDTO {
  title: string;
  description: string;
  sector: SectorType; // Usamos o tipo criado acima
}

// Retorno da listagem — GET /api/tickets/my-tickets
export interface TicketListaResponse {
  ticketID: string; 
  title: string;
  description: string;
  sector: SectorType;
  status: TicketStatusType;
  createdAt: string;
}

// Retorno da criação — POST /api/tickets
export interface TicketCriadoResponse {
  ticketID: string;
  title: string;
  description: string;
  sector: SectorType;
  status: TicketStatusType;
  createdAt: string;
}

// Retorno das respostas — GET /api/tickets/{id}/responses
export interface TicketRespostaResponse {
  responseID: string;
  message: string;
  responsibleAttendant: string;
  respondedAt: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class TicketService {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async criar(dados: CriarTicketDTO): Promise<TicketCriadoResponse> {
    return this.http.post<TicketCriadoResponse>('/tickets', dados);
  }

  async listar(): Promise<TicketListaResponse[]> {
    return this.http.get<TicketListaResponse[]>('/tickets/my-tickets');
  }

  async buscarRespostas(id: string): Promise<TicketRespostaResponse[]> {
    return this.http.get<TicketRespostaResponse[]>(`/tickets/${id}/responses`);
  }
}