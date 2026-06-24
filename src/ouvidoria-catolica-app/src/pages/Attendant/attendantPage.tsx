import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import Header from "../../components/Header";

type StatusManifestacao =
  | "Aberta"
  | "Em análise"
  | "Em atendimento"
  | "Encaminhada"
  | "Respondida"
  | "Concluída";

interface Manifestacao {
  id: string;
  protocolo: string;
  tipo: string;
  titulo: string;
  autor: string;
  atualizadaEm: string;
  status: StatusManifestacao;
  isMeuAtendimento: boolean;
}

const mockManifestacoes: Manifestacao[] = [
  {
    id: "1",
    protocolo: "#2025-000126",
    tipo: "Denúncia",
    titulo: "Denúncia de descarte irregular de lixo",
    autor: "Carlos Pereira",
    atualizadaEm: "09/06/2025",
    status: "Em análise",
    isMeuAtendimento: true,
  },
  {
    id: "2",
    protocolo: "#2025-000124",
    tipo: "Sugestão",
    titulo: "Sugestão de horário estendido na biblioteca",
    autor: "Ana Souza",
    atualizadaEm: "05/06/2025",
    status: "Aberta",
    isMeuAtendimento: false,
  },
  {
    id: "3",
    protocolo: "#2025-000127",
    tipo: "Solicitação",
    titulo: "Solicitação de poda de árvore",
    autor: "Ana Souza",
    atualizadaEm: "04/06/2025",
    status: "Encaminhada",
    isMeuAtendimento: false,
  },
  {
    id: "4",
    protocolo: "#2025-000123",
    tipo: "Reclamação",
    titulo: "Buraco na via principal do bairro Centro",
    autor: "Ana Souza",
    atualizadaEm: "02/06/2025",
    status: "Em atendimento",
    isMeuAtendimento: true,
  },
  {
    id: "5",
    protocolo: "#2025-000125",
    tipo: "Elogio",
    titulo: "Excelente atendimento na unidade de saúde",
    autor: "Carlos Pereira",
    atualizadaEm: "18/05/2025",
    status: "Concluída",
    isMeuAtendimento: false,
  },
  {
    id: "6",
    protocolo: "#2025-000128",
    tipo: "Solicitação",
    titulo: "Manutenção de iluminação pública na praça",
    autor: "Roberto Alves",
    atualizadaEm: "10/06/2025",
    status: "Respondida",
    isMeuAtendimento: true,
  },
];

const statusStyles: Record<StatusManifestacao, { color: string; bg: string }> = {
  Aberta: { color: "#93c5fd", bg: "rgba(147, 197, 253, 0.15)" },
  "Em análise": { color: "#fde047", bg: "rgba(253, 224, 71, 0.15)" },
  "Em atendimento": { color: "#c7d2fe", bg: "rgba(199, 210, 254, 0.15)" },
  Encaminhada: { color: "#d8b4fe", bg: "rgba(216, 180, 254, 0.15)" },
  Respondida: { color: "#cbd5e1", bg: "rgba(203, 213, 225, 0.15)" },
  Concluída: { color: "#86efac", bg: "rgba(134, 239, 172, 0.15)" },
};

function CardResumo({ label, value }: { label: string; value: number }) {
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
      <Typography variant="h4" sx={{ color: "white", fontWeight: 700, lineHeight: 1 }}>
        {value}
      </Typography>
    </Box>
  );
}

function ItemManifestacao({ item }: { item: Manifestacao }) {
  return (
    <Box
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
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 0.5 }}>
          {item.protocolo} &nbsp;&nbsp;
          <span style={{ color: "#9ca3af" }}>{item.tipo}</span>
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
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          Por {item.autor} · Atualizada em {item.atualizadaEm}
        </Typography>
      </Box>

      <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexShrink: 0 }}>
        <Box
          sx={{
            bgcolor: statusStyles[item.status].bg,
            color: statusStyles[item.status].color,
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
      </Stack>
    </Box>
  );
}

export default function AttendantPage() {
  const [tab, setTab] = useState<"todas" | "meus">("todas");
  const [filtroStatus, setFiltroStatus] = useState("Todos os status");

  const manifestacoesRecebidas = mockManifestacoes.length;
  const semAtendente = mockManifestacoes.filter((m) => !m.isMeuAtendimento).length;
  const meusAtendimentosAtivos = mockManifestacoes.filter(
    (m) => m.isMeuAtendimento && m.status !== "Concluída"
  ).length;

  const filteredManifestacoes = mockManifestacoes.filter((item) => {
    const matchTab = tab === "todas" || (tab === "meus" && item.isMeuAtendimento);
    const matchStatus = filtroStatus === "Todos os status" || item.status === filtroStatus;
    return matchTab && matchStatus;
  });

  const opcoesFiltro = [
    "Todos os status",
    "Aberta",
    "Em análise",
    "Em atendimento",
    "Encaminhada",
    "Respondida",
    "Concluída",
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0a", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box
        sx={{
          px: { xs: 2, sm: 4, md: 8, lg: 16 },
          py: { xs: 4, sm: 6 },
          flex: 1,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1000 }}>
          <Box sx={{ mb: { xs: 4, sm: 5 } }}>
            <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
              Atendimento
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
              Gerencie as manifestações recebidas pela ouvidoria.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: { xs: 4, sm: 5 } }}>
            <CardResumo label="Manifestações recebidas" value={manifestacoesRecebidas} />
            <CardResumo label="Sem atendente" value={semAtendente} />
            <CardResumo label="Meus atendimentos ativos" value={meusAtendimentosAtivos} />
          </Stack>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                bgcolor: "#16171d",
                borderRadius: "20px",
                p: 0.5,
              }}
            >
              <Button
                onClick={() => setTab("todas")}
                sx={{
                  color: tab === "todas" ? "white" : "#9ca3af",
                  bgcolor: tab === "todas" ? "#2a2a2a" : "transparent",
                  borderRadius: "16px",
                  px: 2,
                  py: 0.5,
                  textTransform: "none",
                  fontWeight: tab === "todas" ? 600 : 400,
                  "&:hover": {
                    bgcolor: tab === "todas" ? "#2a2a2a" : "rgba(255,255,255,0.05)",
                  },
                }}
              >
                Todas
              </Button>
              <Button
                onClick={() => setTab("meus")}
                sx={{
                  color: tab === "meus" ? "white" : "#9ca3af",
                  bgcolor: tab === "meus" ? "#2a2a2a" : "transparent",
                  borderRadius: "16px",
                  px: 2,
                  py: 0.5,
                  textTransform: "none",
                  fontWeight: tab === "meus" ? 600 : 400,
                  "&:hover": {
                    bgcolor: tab === "meus" ? "#2a2a2a" : "rgba(255,255,255,0.05)",
                  },
                }}
              >
                Meus atendimentos
              </Button>
            </Box>

            <Select
              size="small"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              sx={{
                color: "white",
                bgcolor: "transparent",
                borderRadius: "8px",
                minWidth: 180,
                border: "1px solid #2e303a",
                fontSize: "0.875rem",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiSvgIcon-root": { color: "#9ca3af" },
              }}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: { bgcolor: "#16171d", color: "white", border: "1px solid #2e303a" },
                  },
                },
              }}
            >
              {opcoesFiltro.map((opcao) => (
                <MenuItem 
                  key={opcao} 
                  value={opcao} 
                  sx={{ 
                    fontSize: "0.875rem",
                    "&:hover": { bgcolor: "#1f2028" },
                    "&.Mui-selected": { bgcolor: "#2a2a2a", "&:hover": { bgcolor: "#2a2a2a" } }
                  }}
                >
                  {opcao}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Stack spacing={2}>
            {filteredManifestacoes.length > 0 ? (
              filteredManifestacoes.map((item) => (
                <ItemManifestacao key={item.id} item={item} />
              ))
            ) : (
              <Box sx={{ textAlign: "center", py: 6, bgcolor: "#16171d", borderRadius: 3 }}>
                <Typography sx={{ color: "#9ca3af" }}>Nenhuma manifestação encontrada.</Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}