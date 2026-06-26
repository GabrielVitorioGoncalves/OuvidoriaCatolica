import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Box, Button, Chip, Skeleton, Stack, Typography } from "@mui/material";
import { Add, ChevronRight, InboxOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  TicketService,
  type TicketListaResponse,
} from "../../services/TicketService";
import { httpClient } from "../../infra/AxiosAdapter";

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
    emAndamento: lista.filter((t) => t.status !== "Concluída").length,
    concluidas: lista.filter((t) => t.status === "Concluída").length,
  };
}

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
        bgcolor: "#181818",
        borderRadius: 3,
        p: { xs: 2.5, sm: 3 },
        flex: 1,
        minWidth: 0,
      }}
    >
      <Typography variant="body2" sx={{ color: "#909090", mb: 1 }}>
        {label}
      </Typography>
      {loading ? (
        <Skeleton
          variant="text"
          width={40}
          height={48}
          sx={{ bgcolor: "#3a3a3a" }}
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
  return (
    <Box
      onClick={() => onClick(item.id)}
      sx={{
        bgcolor: "#181818",
        borderRadius: 3,
        px: { xs: 2, sm: 3 },
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        cursor: "pointer",
        transition: "background-color 0.15s ease",
        "&:hover": { bgcolor: "#333333" },
      }}
    >
      {/* Lado esquerdo */}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{ color: "#909090", display: "block", mb: 0.5 }}
        >
          {item.protocolo}&nbsp;&nbsp;{item.tipo}
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
          {item.titulo}
        </Typography>
        <Typography variant="caption" sx={{ color: "#909090" }}>
          Atualizada em {item.atualizadaEm}
        </Typography>
      </Box>

      {/* Lado direito */}
<<<<<<< Updated upstream
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Chip
          label={item.status}
          color={statusColor[item.status]}
          variant="outlined"
          size="small"
          sx={{ fontWeight: 500 }}
        />
        <ChevronRight sx={{ color: "#909090" }} />
=======
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexShrink: 0 }}>
        <Box
          sx={{
            bgcolor: statusStyles[item.status]?.bg || "#333",
            color: statusStyles[item.status]?.color || "#fff",
            px: 1.5,
            py: 0.25,
            borderRadius: "16px",
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          {item.status}
        </Box>
        <ChevronRight sx={{ color: "#6b7280" }} />
>>>>>>> Stashed changes
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
        bgcolor: "#2a2a2a",
        borderRadius: 3,
      }}
    >
      <InboxOutlined sx={{ fontSize: 48, color: "#555", mb: 2 }} />
      <Typography variant="body1" sx={{ color: "#909090" }}>
        Você ainda não tem manifestações registradas.
      </Typography>
      <Typography variant="body2" sx={{ color: "#555", mt: 0.5 }}>
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
    navigate("/ticket")
  }

  function handleVerDetalhe(id: string) {
<<<<<<< Updated upstream
      navigate(`/ticketDetail/${id}`); 
=======
    navigate(`/ticketDetail/${id}`, { state: manifestacoes.find((m) => m.id === id) ?? null });
>>>>>>> Stashed changes
  }

  return (
    <div>
      <Header />
      <Box
        sx={{
          minHeight: "90vh",
          bgcolor: "#0A0A0A",
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
            <Typography variant="body2" sx={{ color: "#909090" }}>
              Acompanhe o andamento das suas solicitações.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleNovaManifestacao}
            sx={{
              color: "white",
              borderColor: "white",
              borderRadius: 6,
              px: 3,
              textTransform: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
<<<<<<< Updated upstream
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
                borderColor: "white",
              },
=======
              bgcolor: "#16171d",
              "&:hover": { bgcolor: "#1f2028", borderColor: "#3a3d4a" },
>>>>>>> Stashed changes
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
                sx={{ bgcolor: "#2a2a2a", borderRadius: 3 }}
              />
            ))}
          </Stack>
        ) : manifestacoes.length === 0 ? (
          <EstadoVazio />
        ) : (
          <Stack spacing={2}>
            {manifestacoes.map((item) => (
              <ItemManifestacao key={item.id} item={item} onClick={handleVerDetalhe} />
            ))}
          </Stack>
        )}
      </Box>
    </div>
  );
}
