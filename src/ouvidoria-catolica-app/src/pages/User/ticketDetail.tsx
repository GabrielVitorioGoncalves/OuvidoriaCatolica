import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
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
  type TicketListaResponse,
  type TicketRespostaResponse,
} from "../../services/TicketService";
import { httpClient } from "../../infra/AxiosAdapter";

// ─── Instância do service ─────────────────────────────────────────────────────

const ticketService = new TicketService(httpClient);

// ─── Mapa de cores por status ─────────────────────────────────────────────────

const statusColor: Record<
  StatusManifestacao,
  "default" | "primary" | "secondary" | "success" | "warning" | "info" | "error"
> = {
  Aberta: "info",
  Encaminhada: "secondary",
  "Em atendimento": "warning",
  Concluída: "success",
};

<<<<<<< Updated upstream
// ─── Ícone por tipo de evento ──────────────────────────────────────────────────

function IconeEvento({ tipo }: { tipo: EventoHistorico["tipo"] }) {
  const sx = { fontSize: 20, color: "#909090" };
  if (tipo === "registro") return <ArticleOutlined sx={sx} />;
  if (tipo === "atendimento") return <PersonAddOutlined sx={sx} />;
  return <SendOutlined sx={sx} />;
}

// ─── Subcomponentes ────────────────────────────────────────────────────────────
=======
// ─── Subcomponentes ───────────────────────────────────────────────────────────
>>>>>>> Stashed changes

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack sx={{direction:"row", spacing:"1.5", alignItems:"flex-start", flex:"1", minWidth:"0"}}>
      <Box sx={{ color: "#909090", mt: 0.3, flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: "#909090", display: "block" }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

function CardSecao({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ bgcolor: "#2a2a2a", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
      {children}
    </Box>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function DetalheManifestacao() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dados básicos do ticket vêm via navigation state (já carregados na UserPage)
  const location = useLocation();
  const ticketBase = location.state as TicketListaResponse | null;

  const [respostas, setRespostas] = useState<TicketRespostaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!id) return;
    ticketService
      .buscarRespostas(id)
      .then(setRespostas)
      .catch(() => setErro(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
    <Header/>
    <Box
      sx={{
        minHeight: "90vh",
        bgcolor: "#131313",
        px: { xs: 2, sm: 4, md: 8, lg: 16 },
        py: { xs: 3, sm: 5 },
      }}
    >
      {/* Voltar */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{
          color: "white",
          textTransform: "none",
          mb: 3,
          pl: 0,
          "&:hover": { bgcolor: "transparent", opacity: 0.7 },
        }}
      >
        Voltar
      </Button>

<<<<<<< Updated upstream
      {loading ? (
        <Stack spacing={2}>
          <Skeleton variant="text" width={200} height={24} sx={{ bgcolor: "#2a2a2a" }} />
          <Skeleton variant="text" width="60%" height={48} sx={{ bgcolor: "#2a2a2a" }} />
          <Skeleton variant="rounded" height={120} sx={{ bgcolor: "#2a2a2a", borderRadius: 3 }} />
          <Skeleton variant="rounded" height={120} sx={{ bgcolor: "#2a2a2a", borderRadius: 3 }} />
          <Skeleton variant="rounded" height={200} sx={{ bgcolor: "#2a2a2a", borderRadius: 3 }} />
        </Stack>
      ) : dados ? (
        <Stack spacing={3}>
          {/* Cabeçalho */}
          <Box>
            <Stack direction="row" sx={{justifyContent:"space-between", alignItems:"center", mb:0.5}} >
              <Typography variant="caption" sx={{ color: "#909090", fontFamily: "monospace" }}>
                Protocolo {dados.protocolo}
              </Typography>
              <Chip
                label={dados.status}
                color={statusColor[dados.status]}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 500 }}
              />
            </Stack>
            <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
              {dados.titulo}
            </Typography>
          </Box>

          {/* Informações gerais */}
          <CardSecao>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 2.5, sm: 2 }}
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderColor: "#3a3a3a", display: { xs: "none", sm: "block" } }}
                />
              }
            >
              <InfoItem
                icon={<LocalOfferOutlined fontSize="small" />}
                label="Categoria"
                value={dados.categoria}
              />
              <InfoItem
                icon={<CalendarTodayOutlined fontSize="small" />}
                label="Abertura"
                value={dados.abertura}
              />
              <InfoItem
                icon={<PersonOutlined fontSize="small" />}
                label="Responsável"
                value={dados.responsavel}
              />
            </Stack>
          </CardSecao>

          {/* Descrição */}
          <CardSecao>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 1.5 }}>
              Descrição
            </Typography>
            <Typography variant="body2" sx={{ color: "#ccc", lineHeight: 1.7 }}>
              {dados.descricao}
            </Typography>
          </CardSecao>

          {/* Histórico */}
          <CardSecao>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 2.5 }}>
              Histórico e respostas
            </Typography>

            <Stack spacing={0}>
              {dados.historico.map((evento, index) => (
                <Box key={evento.id}>
                  <Stack sx={{direction:"row", spacing:"2", alignItems:"flex-start"}}>
                    {/* Ícone */}
                    <Box
                      sx={{
                        bgcolor: "#1a1a1a",
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        mt: 0.3,
                      }}
                    >
                      <IconeEvento tipo={evento.tipo} />
                    </Box>

                    {/* Conteúdo */}
                    <Box sx={{ flex: "1", pb: index < dados.historico.length - 1 ? 3 : 0 }}>
                      <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
                        {evento.titulo}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#909090" }}>
                        {evento.autor} · {evento.data}
                      </Typography>

                      {/* Mensagem de resposta */}
                      {evento.mensagem && (
                        <Box
                          sx={{
                            mt: 1.5,
                            p: 2,
                            bgcolor: "#1a1a1a",
                            borderRadius: 2,
                            border: "1px solid #3a3a3a",
                          }}
                        >
                          <Typography variant="body2" sx={{ color: "#ccc", lineHeight: 1.7 }}>
                            {evento.mensagem}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Stack>

                  {/* Divisor entre eventos */}
                  {index < dados.historico.length - 1 && (
                    <Divider sx={{ borderColor: "#3a3a3a", ml: 6.5, mb: 0 }} />
                  )}
                </Box>
              ))}
            </Stack>
          </CardSecao>
        </Stack>
      ) : (
        <Typography sx={{ color: "#909090" }}>Manifestação não encontrada.</Typography>
      )}
    </Box>
=======
        {!ticketBase ? (
          <Typography sx={{ color: "#f87171" }}>
            Manifestação não encontrada.
          </Typography>
        ) : (
          <Stack spacing={3}>
            {/* Cabeçalho */}
            <Box>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Protocolo {ticketBase.protocolo}
                </Typography>
                <Box
                  sx={{
                    bgcolor: statusStyles[ticketBase.status]?.bg || "#333",
                    color: statusStyles[ticketBase.status]?.color || "#fff",
                    px: 1.5,
                    py: 0.25,
                    borderRadius: "16px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {ticketBase.status}
                </Box>
              </Stack>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                {ticketBase.titulo}
              </Typography>
            </Box>

            {/* Informações gerais */}
            <CardSecao>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2.5, sm: 2 }}
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "#2e303a", display: { xs: "none", sm: "block" } }}
                  />
                }
              >
                <InfoItem
                  icon={<LocalOfferOutlined fontSize="small" />}
                  label="Categoria"
                  value={ticketBase.tipo}
                />
                <InfoItem
                  icon={<CalendarTodayOutlined fontSize="small" />}
                  label="Última atualização"
                  value={ticketBase.atualizadaEm}
                />
                <InfoItem
                  icon={<PersonOutlined fontSize="small" />}
                  label="Status"
                  value={ticketBase.status}
                />
              </Stack>
            </CardSecao>

            {/* Respostas */}
            <CardSecao>
              <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 2.5 }}>
                Respostas
              </Typography>

              {loading ? (
                <Stack spacing={2}>
                  {[1, 2].map((i) => (
                    <Skeleton key={i} variant="rounded" height={80} sx={{ bgcolor: "#1f2028", borderRadius: 2 }} />
                  ))}
                </Stack>
              ) : erro ? (
                <Typography variant="body2" sx={{ color: "#f87171" }}>
                  Erro ao carregar respostas. Tente novamente mais tarde.
                </Typography>
              ) : respostas.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  Nenhuma resposta ainda.
                </Typography>
              ) : (
                <Stack spacing={0}>
                  {respostas.map((resposta, index) => (
                    <Box key={resposta.id}>
                      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
                        {/* Ícone */}
                        <Box
                          sx={{
                            bgcolor: "#1f2028",
                            borderRadius: "50%",
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            mt: 0.3,
                          }}
                        >
                          <SendOutlined sx={{ fontSize: 20, color: "#9ca3af" }} />
                        </Box>

                        {/* Conteúdo */}
                        <Box sx={{ flex: 1, pb: index < respostas.length - 1 ? 3 : 0 }}>
                          <Typography variant="caption" sx={{ color: "#6b7280" }}>
                            {resposta.autor} · {resposta.criadoEm}
                          </Typography>
                          <Box
                            sx={{
                              mt: 1,
                              p: 2,
                              bgcolor: "#1f2028",
                              borderRadius: 2,
                              border: "1px solid #2e303a",
                            }}
                          >
                            <Typography variant="body2" sx={{ color: "#9ca3af", lineHeight: 1.7 }}>
                              {resposta.mensagem}
                            </Typography>
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
>>>>>>> Stashed changes
    </div>
  );
}