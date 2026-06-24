import React, { useState } from "react";
import { Box, Typography, Select, MenuItem, Button } from "@mui/material";

const manifestacoesData = [
  {
    id: "#2025-000126",
    type: "Denúncia",
    title: "Denúncia de descarte irregular de lixo",
    author: "Carlos Pereira",
    date: "09/06/2025",
    status: "Em análise",
    statusColor: "#fde047",
    statusBg: "rgba(253, 224, 71, 0.15)",
  },
  {
    id: "#2025-000124",
    type: "Sugestão",
    title: "Sugestão de horário estendido na biblioteca",
    author: "Ana Souza",
    date: "05/06/2025",
    status: "Aberta",
    statusColor: "#93c5fd",
    statusBg: "rgba(147, 197, 253, 0.15)",
  },
  {
    id: "#2025-000127",
    type: "Solicitação",
    title: "Solicitação de poda de árvore",
    author: "Ana Souza",
    date: "04/06/2025",
    status: "Encaminhada",
    statusColor: "#d8b4fe",
    statusBg: "rgba(216, 180, 254, 0.15)",
  },
  {
    id: "#2025-000123",
    type: "Reclamação",
    title: "Buraco na via principal do bairro Centro",
    author: "Ana Souza",
    date: "02/06/2025",
    status: "Em atendimento",
    statusColor: "#c7d2fe",
    statusBg: "rgba(199, 210, 254, 0.15)",
  },
  {
    id: "#2025-000125",
    type: "Elogio",
    title: "Excelente atendimento na unidade de saúde",
    author: "Carlos Pereira",
    date: "18/05/2025",
    status: "Concluída",
    statusColor: "#86efac",
    statusBg: "rgba(134, 239, 172, 0.15)",
  },
];

export default function AttendantPage() {
  const [tab, setTab] = useState("todas");
  const [filter, setFilter] = useState("todos");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0a", color: "#fff", p: { xs: 3, md: 6 }, display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%", maxWidth: 1000 }}>
        
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "2rem", mb: 0.5 }}>
            Atendimento
          </Typography>
          <Typography sx={{ color: "#9ca3af", fontSize: "0.9375rem" }}>
            Gerencie as manifestações recebidas pela ouvidoria.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
          <Box sx={{ flex: 1, minWidth: 200, bgcolor: "#16171d", borderRadius: "12px", p: 3, border: "1px solid #2e303a" }}>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.875rem", mb: 1 }}>Manifestações recebidas</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "2rem" }}>5</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200, bgcolor: "#16171d", borderRadius: "12px", p: 3, border: "1px solid #2e303a" }}>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.875rem", mb: 1 }}>Sem atendente</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "2rem" }}>1</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200, bgcolor: "#16171d", borderRadius: "12px", p: 3, border: "1px solid #2e303a" }}>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.875rem", mb: 1 }}>Meus atendimentos ativos</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "2rem" }}>2</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", bgcolor: "#16171d", borderRadius: "20px", p: 0.5, border: "1px solid #2e303a" }}>
            <Button
              onClick={() => setTab("todas")}
              sx={{
                bgcolor: tab === "todas" ? "#2e303a" : "transparent",
                color: tab === "todas" ? "#fff" : "#9ca3af",
                borderRadius: "16px",
                textTransform: "none",
                px: 2,
                py: 0.5,
                fontWeight: tab === "todas" ? 600 : 400,
                "&:hover": { bgcolor: tab === "todas" ? "#2e303a" : "rgba(255,255,255,0.05)" }
              }}
            >
              Todas
            </Button>
            <Button
              onClick={() => setTab("meus")}
              sx={{
                bgcolor: tab === "meus" ? "#2e303a" : "transparent",
                color: tab === "meus" ? "#fff" : "#9ca3af",
                borderRadius: "16px",
                textTransform: "none",
                px: 2,
                py: 0.5,
                fontWeight: tab === "meus" ? 600 : 400,
                "&:hover": { bgcolor: tab === "meus" ? "#2e303a" : "rgba(255,255,255,0.05)" }
              }}
            >
              Meus atendimentos
            </Button>
          </Box>

          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            sx={{
              bgcolor: "transparent",
              color: "#fff",
              borderRadius: "8px",
              border: "1px solid #2e303a",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "& .MuiSelect-icon": { color: "#9ca3af" },
              fontSize: "0.875rem"
            }}
          >
            <MenuItem value="todos">todos</MenuItem>
            <MenuItem value="analise">Em análise</MenuItem>
            <MenuItem value="aberta">Aberta</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {manifestacoesData.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#16171d",
                p: 2.5,
                borderRadius: "12px",
                border: "1px solid #2e303a",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": { borderColor: "#4b4d58", bgcolor: "#1a1b22" }
              }}
            >
              <Box>
                <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
                  <Typography sx={{ color: "#6b7280", fontSize: "0.8125rem" }}>{item.id}</Typography>
                  <Typography sx={{ color: "#9ca3af", fontSize: "0.8125rem" }}>{item.type}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: "1rem", mb: 0.5 }}>{item.title}</Typography>
                <Typography sx={{ color: "#6b7280", fontSize: "0.8125rem" }}>
                  Por {item.author} · Atualizada em {item.date}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    bgcolor: item.statusBg,
                    color: item.statusColor,
                    px: 1.5,
                    py: 0.25,
                    borderRadius: "16px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {item.status}
                </Box>
                <Box component="svg" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" sx={{ width: 16, height: 16 }}>
                  <polyline points="9 18 15 12 9 6" />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}