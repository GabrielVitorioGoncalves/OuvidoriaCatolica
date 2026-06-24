import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  ArticleOutlined,
  PersonAddOutlined,
  SendOutlined,
} from "@mui/icons-material";
import Header from "../../components/Header";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type StatusManifestacao =
  | "Aberta"
  | "Encaminhada"
  | "Em atendimento"
  | "Concluída";

interface EventoHistorico {
  id: string;
  tipo: "registro" | "atendimento" | "resposta";
  titulo: string;
  autor: string;
  data: string;
  mensagem?: string; // só para tipo "resposta"
}

interface DetalheManifestacaoData {
  protocolo: string;
  titulo: string;
  status: StatusManifestacao;
  categoria: string;
  abertura: string;
  responsavel: string;
  descricao: string;
  historico: EventoHistorico[];
}

// ─── Mock de API ───────────────────────────────────────────────────────────────

async function fetchDetalhe(id: string): Promise<DetalheManifestacaoData> {
  await new Promise((r) => setTimeout(r, 900));
  console.log("Buscando manifestação:", id);
  return {
    protocolo: "#2025-000123",
    titulo: "Buraco na via principal do bairro Centro",
    status: "Em atendimento",
    categoria: "Reclamação",
    abertura: "28/05/2025, 11:20",
    responsavel: "Diego Martins",
    descricao:
      "Há um buraco grande na Rua das Flores que está causando risco de acidentes. Já vi dois carros danificarem os pneus na última semana.",
    historico: [
      {
        id: "1",
        tipo: "registro",
        titulo: "Manifestação registrada",
        autor: "Ana Souza",
        data: "28/05/2025, 11:20",
      },
      {
        id: "2",
        tipo: "atendimento",
        titulo: "Atendimento assumido por Diego Martins",
        autor: "Diego Martins",
        data: "30/05/2025, 06:10",
      },
      {
        id: "3",
        tipo: "resposta",
        titulo: "Resposta enviada ao cidadão",
        autor: "Diego Martins",
        data: "02/06/2025, 07:00",
        mensagem:
          "Olá Ana, recebemos sua solicitação e uma equipe foi designada para avaliar o local nesta semana. Agradecemos o registro.",
      },
    ],
  };
}

// ─── Mapa de cores por status ──────────────────────────────────────────────────

const statusColor: Record<
  StatusManifestacao,
  "default" | "primary" | "secondary" | "success" | "warning" | "info" | "error"
> = {
  Aberta: "info",
  Encaminhada: "secondary",
  "Em atendimento": "warning",
  Concluída: "success",
};

// ─── Ícone por tipo de evento ──────────────────────────────────────────────────

function IconeEvento({ tipo }: { tipo: EventoHistorico["tipo"] }) {
  const sx = { fontSize: 20, color: "#909090" };
  if (tipo === "registro") return <ArticleOutlined sx={sx} />;
  if (tipo === "atendimento") return <PersonAddOutlined sx={sx} />;
  return <SendOutlined sx={sx} />;
}

// ─── Subcomponentes ────────────────────────────────────────────────────────────

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

// ─── Componente principal ──────────────────────────────────────────────────────

export default function DetalheManifestacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState<DetalheManifestacaoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchDetalhe(id)
      .then(setDados)
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
    </div>
  );
}