import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { Add, ChevronRight, InboxOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  TicketService,
  TicketStatus,
  Sector,
  type TicketListaResponse,
} from "../../services/TicketService";
import { httpClient } from "../../infra/AxiosAdapter";

// ─── Formatadores (C# -> Tela) ────────────────────────────────────────────────
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

// ─── Instância do service ─────────────────────────────────────────────────────
const ticketService = new TicketService(httpClient);

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Resumo {
  total: number;
  emAndamento: number;
  concluidas: number;
}

function calcularResumo(lista: TicketListaResponse[]): Resumo {
  return {
    total: lista.length,
    // Compara diretamente com o número do Enum do C#
    emAndamento: lista.filter((t) => t.status !== TicketStatus.Closed).length,
    concluidas: lista.filter((t) => t.status === TicketStatus.Closed).length,
  };
}

// ─── Mapa de cores por status ─────────────────────────────────────────────────
// Ajustado para bater exatamente com o texto retornado pelo formatarStatus
const statusStyles: Record<string, { color: string; bg: string }> = {
  "Aberta": { color: "#93c5fd", bg: "rgba(147, 197, 253, 0.15)" },
  "Em Análise": { color: "#fde047", bg: "rgba(253, 224, 71, 0.15)" },
  "Aguardando Resposta": { color: "#c7d2fe", bg: "rgba(199, 210, 254, 0.15)" },
  "Concluída": { color: "#86efac", bg: "rgba(134, 239, 172, 0.15)" },
  "Desconhecido": { color: "#cbd5e1", bg: "rgba(203, 213, 225, 0.15)" },
};

// ─── Subcomponentes ───────────────────────────────────────────────────────────
function CardResumo({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <Box
      sx={{
        bgcolor: "#16171d",
        borderRadius: 3,
        p: { xs: 2.5, sm: 3 },
        flex: 1,
        minWidth: 0,
      }}
    >
      <Typography variant="body2" sx={{ color: "#9ca3af", mb: 1 }}>
        {label}
      </Typography>
      {loading ? (
        <Skeleton
          variant="text"
          width={40}
          height={48}
          sx={{ bgcolor: "#1f2028" }}
        />
      ) : (
        <Typography
          variant="h4"
          sx={{ color: "white", fontWeight: 700, lineHeight: 1 }}
        >
          {value}
        </Typography>
      )}
    </Box>
  );
}

function ItemManifestacao({
  item,
  onClick,
}: {
  item: TicketListaResponse;
  onClick: (id: string) => void;
}) {
  const statusFormatado = formatarStatus(item.status);
  // Simula um número de protocolo pegando os primeiros 8 caracteres do Guid
  const protocoloGerado = item.ticketID ? item.ticketID.substring(0, 8).toUpperCase() : "N/A";

  return (
    <Box
      onClick={() => onClick(item.ticketID)}
      sx={{
        bgcolor: "#16171d",
        borderRadius: 3,
        px: { xs: 2, sm: 3 },
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        cursor: "pointer",
        transition: "background-color 0.15s ease",
        "&:hover": { bgcolor: "#1f2028" },
      }}
    >
      {/* Lado esquerdo */}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{ color: "#6b7280", display: "block", mb: 0.5 }}
        >
          {protocoloGerado} &nbsp;&nbsp;
          <span style={{ color: "#9ca3af" }}>{formatarSetor(item.sector)}</span>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "white",
            fontWeight: 600,
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: { xs: "normal", sm: "nowrap" },
          }}
        >
          {item.title}
        </Typography>
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          Criado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Typography>
      </Box>

      {/* Lado direito */}
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexShrink: 0 }}>
        <Box
          sx={{
            bgcolor: statusStyles[statusFormatado]?.bg || "#333",
            color: statusStyles[statusFormatado]?.color || "#fff",
            px: 1.5,
            py: 0.25,
            borderRadius: "16px",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          {statusFormatado}
        </Box>
        <ChevronRight sx={{ color: "#6b7280" }} />
      </Stack>
    </Box>
  );
}

function EstadoVazio() {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        px: 2,
        bgcolor: "#16171d",
        borderRadius: 3,
      }}
    >
      <InboxOutlined sx={{ fontSize: 48, color: "#6b7280", mb: 2 }} />
      <Typography variant="body1" sx={{ color: "#9ca3af" }}>
        Você ainda não tem manifestações registradas.
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
        Clique em "Nova Manifestação" para começar.
      </Typography>
    </Box>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function UserPage() {
  const navigate = useNavigate();
  const [manifestacoes, setManifestacoes] = useState<TicketListaResponse[]>([]);
  const [resumo, setResumo] = useState<Resumo>({ total: 0, emAndamento: 0, concluidas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketService
      .listar()
      .then((lista) => {
        setManifestacoes(lista);
        setResumo(calcularResumo(lista));
      })
      .finally(() => setLoading(false));
  }, []);

  function handleNovaManifestacao() {
    navigate("/ticketAdd");
  }

  function handleVerDetalhe(id: string) {
    navigate(`/ticketDetail/${id}`, { state: manifestacoes.find((m) => m.ticketID === id) ?? null });
  }

  return (
    <div>
      <Header />
      <Box
        sx={{
          minHeight: "90vh",
          bgcolor: "#0a0a0a",
          px: { xs: 2, sm: 4, md: 8, lg: 16 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: { xs: 4, sm: 5 },
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
              Minhas Manifestações
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
              Acompanhe o andamento das suas solicitações.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleNovaManifestacao}
            sx={{
              color: "white",
              borderColor: "#2e303a",
              borderRadius: 6,
              px: 3,
              textTransform: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              bgcolor: "#16171d",
              "&:hover": { bgcolor: "#1f2028", borderColor: "#3a3d4a" },
            }}
          >
            Nova Manifestação
          </Button>
        </Box>

        {/* Cards de resumo */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: { xs: 4, sm: 5 } }}
        >
          <CardResumo label="Total" value={resumo.total} loading={loading} />
          <CardResumo label="Em andamento" value={resumo.emAndamento} loading={loading} />
          <CardResumo label="Concluídas" value={resumo.concluidas} loading={loading} />
        </Stack>

        {/* Lista de manifestações */}
        {loading ? (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={90}
                sx={{ bgcolor: "#16171d", borderRadius: 3 }}
              />
            ))}
          </Stack>
        ) : manifestacoes.length === 0 ? (
          <EstadoVazio />
        ) : (
          <Stack spacing={2}>
            {manifestacoes.map((item) => (
              <ItemManifestacao key={item.ticketID} item={item} onClick={handleVerDetalhe} />
            ))}
          </Stack>
        )}
      </Box>
    </div>
  );
}