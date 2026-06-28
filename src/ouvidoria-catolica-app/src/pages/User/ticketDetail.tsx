import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  LocalOfferOutlined,
  CalendarTodayOutlined,
  PersonOutlined,
  SendOutlined,
} from "@mui/icons-material";
import Header from "../../components/Header";
import {
  TicketService,
  TicketStatus,
  Sector,
  type TicketListaResponse,
  type TicketRespostaResponse,
} from "../../services/TicketService";
import { httpClient } from "../../infra/AxiosAdapter";

const formatarSetor = (sectorId: number | undefined) => {
  switch(sectorId) {
    case Sector.GeneralService: return "Serviços Gerais";
    case Sector.Financial: return "Financeiro";
    case Sector.Infrastructure: return "Infraestrutura";
    case Sector.HumanResources: return "Recursos Humanos";
    case Sector.Health: return "Saúde";
    case Sector.Education: return "Educação";
    default: return "Outros";
  }
};

const formatarStatus = (statusId: number | undefined) => {
  switch(statusId) {
    case TicketStatus.New: return "Aberta";
    case TicketStatus.InReview: return "Em Análise";
    case TicketStatus.AwaitingResponse: return "Aguardando Resposta";
    case TicketStatus.Closed: return "Concluída";
    default: return "Desconhecido";
  }
};

const ticketService = new TicketService(httpClient);

const statusStyles: Record<string, { color: string; bg: string }> = {
  "Aberta": { color: "#93c5fd", bg: "rgba(147, 197, 253, 0.15)" },
  "Em Análise": { color: "#fde047", bg: "rgba(253, 224, 71, 0.15)" },
  "Aguardando Resposta": { color: "#c7d2fe", bg: "rgba(199, 210, 254, 0.15)" },
  "Concluída": { color: "#86efac", bg: "rgba(134, 239, 172, 0.15)" },
  "Desconhecido": { color: "#cbd5e1", bg: "rgba(203, 213, 225, 0.15)" },
};

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Stack sx={{ direction: "row", spacing: 1.5, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
      <Box sx={{ color: "#6b7280", mt: 0.3, flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ ml: 1.5 }}>
        <Typography variant="caption" sx={{ color: "#6b7280", display: "block" }}>{label}</Typography>
        <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>{value}</Typography>
      </Box>
    </Stack>
  );
}

function CardSecao({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
      {children}
    </Box>
  );
}

export default function DetalheManifestacao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<TicketListaResponse | null>(null);
  const [respostas, setRespostas] = useState<TicketRespostaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      ticketService.buscarPorId(id),
      ticketService.buscarRespostas(id),
    ])
      .then(([t, r]) => {
        setTicket(t);
        setRespostas(r);
      })
      .catch(() => setErro(true))
      .finally(() => setLoading(false));
  }, [id]);

  const statusFormatado = ticket ? formatarStatus(ticket.status) : "Desconhecido";
  const protocoloGerado = ticket?.ticketID ? ticket.ticketID.substring(0, 8).toUpperCase() : "N/A";

  return (
    <div>
      <Header />
      <Box sx={{ minHeight: "90vh", bgcolor: "#0a0a0a", px: { xs: 2, sm: 4, md: 8, lg: 16 }, py: { xs: 3, sm: 5 } }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ color: "#9ca3af", textTransform: "none", mb: 3, pl: 0, "&:hover": { bgcolor: "transparent", color: "white" } }}
        >
          Voltar
        </Button>

        {loading ? (
          <Stack spacing={3}>
            <Skeleton variant="rounded" height={60} sx={{ bgcolor: "#16171d", borderRadius: 3 }} />
            <Skeleton variant="rounded" height={120} sx={{ bgcolor: "#16171d", borderRadius: 3 }} />
            <Skeleton variant="rounded" height={200} sx={{ bgcolor: "#16171d", borderRadius: 3 }} />
          </Stack>
        ) : erro || !ticket ? (
          <Typography sx={{ color: "#f87171" }}>Manifestação não encontrada.</Typography>
        ) : (
          <Stack spacing={3}>
            {/* Cabeçalho */}
            <Box>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Protocolo {protocoloGerado}
                </Typography>
                <Box
                  sx={{
                    bgcolor: statusStyles[statusFormatado]?.bg || "#333",
                    color: statusStyles[statusFormatado]?.color || "#fff",
                    px: 1.5, py: 0.25, borderRadius: "16px", fontSize: "0.75rem", fontWeight: 600,
                  }}
                >
                  {statusFormatado}
                </Box>
              </Stack>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>{ticket.title}</Typography>
            </Box>

            {/* Informações gerais */}
            <CardSecao>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2.5, sm: 2 }}
                divider={<Divider orientation="vertical" flexItem sx={{ borderColor: "#2e303a", display: { xs: "none", sm: "block" } }} />}
              >
                <InfoItem icon={<LocalOfferOutlined fontSize="small" />} label="Setor" value={formatarSetor(ticket.sector)} />
                <InfoItem icon={<CalendarTodayOutlined fontSize="small" />} label="Abertura" value={new Date(ticket.createdAt).toLocaleDateString('pt-BR')} />
                <InfoItem icon={<PersonOutlined fontSize="small" />} label="Status" value={statusFormatado} />
              </Stack>
            </CardSecao>

            {/* Descrição */}
            <CardSecao>
              <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 1.5 }}>Descrição</Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af", lineHeight: 1.7 }}>{ticket.description}</Typography>
            </CardSecao>

            {/* Respostas */}
            <CardSecao>
              <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 2.5 }}>Respostas</Typography>
              {respostas.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Nenhuma resposta ainda.</Typography>
              ) : (
                <Stack spacing={0}>
                  {respostas.map((resposta, index) => (
                    <Box key={resposta.responseID}>
                      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
                        <Box sx={{ bgcolor: "#1f2028", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: 0.3 }}>
                          <SendOutlined sx={{ fontSize: 20, color: "#9ca3af" }} />
                        </Box>
                        <Box sx={{ flex: 1, pb: index < respostas.length - 1 ? 3 : 0 }}>
                          <Typography variant="caption" sx={{ color: "#6b7280" }}>
                            {resposta.responsibleAttendant} · {new Date(resposta.respondedAt).toLocaleDateString('pt-BR')}
                          </Typography>
                          <Box sx={{ mt: 1, p: 2, bgcolor: "#1f2028", borderRadius: 2, border: "1px solid #2e303a" }}>
                            <Typography variant="body2" sx={{ color: "#9ca3af", lineHeight: 1.7 }}>{resposta.message}</Typography>
                          </Box>
                        </Box>
                      </Stack>
                      {index < respostas.length - 1 && (
                        <Divider sx={{ borderColor: "#2e303a", ml: 6.5, mb: 3, mt: -1.5 }} />
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
            </CardSecao>
          </Stack>
        )}
      </Box>
    </div>
  );
}