import { useEffect, useState } from "react";
import Header from "./components/Header";
import {
  Box,
  Button,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Add, ChevronRight, InboxOutlined } from "@mui/icons-material";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type StatusManifestacao =
  | "Aberta"
  | "Encaminhada"
  | "Em atendimento"
  | "Concluída";

interface Manifestacao {
  id: string;
  protocolo: string;
  tipo: string;
  titulo: string;
  atualizadaEm: string;
  status: StatusManifestacao;
}

interface Resumo {
  total: number;
  emAndamento: number;
  concluidas: number;
}

// ─── Mock de API (substitua por chamadas reais) ────────────────────────────────

async function fetchResumo(): Promise<Resumo> {
  await new Promise((r) => setTimeout(r, 800)); // simula latência
  return { total: 3, emAndamento: 3, concluidas: 0 };
}

async function fetchManifestacoes(): Promise<Manifestacao[]> {
  await new Promise((r) => setTimeout(r, 1000));
  return [
    {
      id: "1",
      protocolo: "#2025-000124",
      tipo: "Sugestão",
      titulo: "Sugestão de horário estendido na biblioteca",
      atualizadaEm: "05/06/2025",
      status: "Concluída",
    },
    {
      id: "2",
      protocolo: "#2025-000127",
      tipo: "Solicitação",
      titulo: "Solicitação de poda de árvore",
      atualizadaEm: "04/06/2025",
      status: "Encaminhada",
    },
    {
      id: "3",
      protocolo: "#2025-000123",
      tipo: "Reclamação",
      titulo: "Buraco na via principal do bairro Centro",
      atualizadaEm: "02/06/2025",
      status: "Em atendimento",
    },
        {
      id: "4",
      protocolo: "#2025-000123",
      tipo: "Reclamação",
      titulo: "Buraco na via principal do bairro Centro",
      atualizadaEm: "02/06/2025",
      status: "Concluída",
    },
  ];
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

// ─── Subcomponentes ────────────────────────────────────────────────────────────

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
        <Skeleton variant="text" width={40} height={48} sx={{ bgcolor: "#3a3a3a" }} />
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
  item: Manifestacao;
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
      <Stack direction="row" alignItems="center" spacing={1} flexShrink={0}>
        <Chip
          label={item.status}
          color={statusColor[item.status]}
          variant="outlined"
          size="small"
          sx={{ fontWeight: 500 }}
        />
        <ChevronRight sx={{ color: "#909090" }} />
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

// ─── Componente principal ──────────────────────────────────────────────────────

export default function MinhasManifestacoes() {
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [manifestacoes, setManifestacoes] = useState<Manifestacao[]>([]);
  const [loadingResumo, setLoadingResumo] = useState(true);
  const [loadingLista, setLoadingLista] = useState(true);

  useEffect(() => {
    fetchResumo()
      .then(setResumo)
      .finally(() => setLoadingResumo(false));

    fetchManifestacoes()
      .then(setManifestacoes)
      .finally(() => setLoadingLista(false));
  }, []);

  function handleNovaManifestacao() {
    // Navegue para a rota desejada, ex: navigate("/nova-manifestacao")
    alert("Navegar para Nova Manifestação");
  }

  function handleVerDetalhe(id: string) {
    // Navegue para detalhe, ex: navigate(`/manifestacoes/${id}`)
    alert(`Ver detalhe da manifestação ${id}`);
  }

  return (
    <div>
    <Header/>
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
          <Typography
            variant="h5"
            sx={{ color: "white", fontWeight: 700, mb: 0.5 }}
          >
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
            "&:hover": { bgcolor: "rgba(255,255,255,0.08)", borderColor: "white" },
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
        <CardResumo
          label="Total"
          value={resumo?.total ?? 0}
          loading={loadingResumo}
        />
        <CardResumo
          label="Em andamento"
          value={resumo?.emAndamento ?? 0}
          loading={loadingResumo}
        />
        <CardResumo
          label="Concluídas"
          value={resumo?.concluidas ?? 0}
          loading={loadingResumo}
        />
      </Stack>

      {/* Lista de manifestações */}
      {loadingLista ? (
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
            <ItemManifestacao
              key={item.id}
              item={item}
              onClick={handleVerDetalhe}
            />
          ))}
        </Stack>
      )}
    </Box>
    </div>
  );
}