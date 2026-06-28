import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/system";
import {
  PeopleAltOutlined,
  DescriptionOutlined,
  Timeline,
  CheckCircle,
} from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { TicketService, TicketStatus, type TicketListaResponse } from "../../services/TicketService";
import { UserService, type UsuarioResponse } from "../../services/UsersService";
import { httpClient } from "../../infra/AxiosAdapter";

const ticketService = new TicketService(httpClient);
const userService = new UserService(httpClient);

const SECTOR_LABEL: Record<number, string> = {
  1: "Serviços Gerais",
  2: "Financeiro",
  3: "Infraestrutura",
  4: "Recursos Humanos",
  5: "Saúde",
  6: "Educação",
};

const STATUS_CONFIG: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Aberta", color: "#93c5fd", bg: "rgba(147, 197, 253, 0.15)" },
  2: { label: "Em análise", color: "#fde047", bg: "rgba(253, 224, 71, 0.15)" },
  3: { label: "Aguardando informações", color: "#d8b4fe", bg: "rgba(216, 180, 254, 0.15)" },
  4: { label: "Concluída", color: "#86efac", bg: "rgba(134, 239, 172, 0.15)" },
};

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

function IndicadorCard({ icone: Icone, label, valor, loading }: { icone: SvgIconComponent; label: string; valor: number; loading: boolean }) {
  return (
    <Box
      sx={{
        width: "100%", bgcolor: "#16171d", borderRadius: 3, p: 3,
        display: "flex", alignItems: "center", gap: 2,
        border: "1px solid transparent", transition: "all 0.3s ease-in-out",
        "&:hover": { borderColor: "#2e303a", transform: "translateY(-4px)", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, bgcolor: "#2e303a", borderRadius: 2, color: "white", flexShrink: 0 }}>
        <Icone />
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: "#9ca3af", mb: 0.5, fontWeight: 500 }}>{label}</Typography>
        {loading ? (
          <Skeleton variant="text" width={40} height={40} sx={{ bgcolor: "#2e303a" }} />
        ) : (
          <Typography variant="h4" sx={{ color: "white", fontWeight: 700, lineHeight: 1 }}>{valor}</Typography>
        )}
      </Box>
    </Box>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketListaResponse[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ticketService.listarTodos(),
      userService.listar(),
    ])
      .then(([t, u]) => {
        setTickets(t);
        setUsuarios(u);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalManifestacoes = tickets.length;
  const emAndamento = tickets.filter((t) => t.status !== TicketStatus.Closed).length;
  const concluidas = tickets.filter((t) => t.status === TicketStatus.Closed).length;
  const totalUsuarios = usuarios.length;

  const porSetor = useMemo(() => {
    const map: Record<number, number> = {};
    tickets.forEach((t) => {
      map[t.sector] = (map[t.sector] ?? 0) + 1;
    });
    return Object.entries(SECTOR_LABEL).map(([key, label]) => ({
      label,
      valor: map[Number(key)] ?? 0,
    }));
  }, [tickets]);

  const porStatus = useMemo(() => {
    const map: Record<number, number> = {};
    tickets.forEach((t) => {
      map[t.status] = (map[t.status] ?? 0) + 1;
    });
    return Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
      ...cfg,
      valor: map[Number(key)] ?? 0,
    }));
  }, [tickets]);

  const maxSetor = useMemo(() => {
    const max = Math.max(...porSetor.map((s) => s.valor));
    return max > 0 ? max : 1;
  }, [porSetor]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0a" }}>
      <Header />
      <Box sx={{ maxWidth: 1200, mx: "auto", width: "100%", px: { xs: 2, sm: 4, md: 6 }, py: { xs: 4, sm: 6 } }}>

        <Box
          sx={{
            display: "flex", alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" },
            gap: 2, mb: 5, animation: `${fadeUp} 0.5s ease-out both`,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>Visão Geral</Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>Indicadores gerais do sistema de ouvidoria.</Typography>
          </Box>
          <Button
            startIcon={<PeopleAltOutlined />}
            onClick={() => navigate("/admin/manageuser")}
            sx={{ color: "white", px: 2, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2 } }}
          >
            Gerenciar usuários
          </Button>
        </Box>

        {/* Cards indicadores */}
        <Grid container spacing={3} sx={{ justifyContent: "center", alignItems: "stretch", mb: 3 }}>
          {[
            { icone: DescriptionOutlined, label: "Total de manifestações", valor: totalManifestacoes, delay: "0.1s" },
            { icone: Timeline, label: "Em andamento", valor: emAndamento, delay: "0.2s" },
            { icone: CheckCircle, label: "Concluídas", valor: concluidas, delay: "0.3s" },
            { icone: PeopleAltOutlined, label: "Usuários cadastrados", valor: totalUsuarios, delay: "0.4s" },
          ].map((card) => (
            <Grid key={card.label} size={{ xs: 12, sm: 6, lg: 3 }} sx={{ display: "flex", animation: `${fadeUp} 0.5s ease-out ${card.delay} both` }}>
              <IndicadorCard icone={card.icone} label={card.label} valor={card.valor} loading={loading} />
            </Grid>
          ))}
        </Grid>

        {/* Gráficos */}
        <Grid container spacing={3} sx={{ justifyContent: "center", alignItems: "stretch" }}>
          {/* Por setor */}
          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: "flex", animation: `${fadeUp} 0.5s ease-out 0.5s both` }}>
            <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: 4, width: "100%" }}>
              <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 4 }}>
                Manifestações por setor
              </Typography>
              {loading ? (
                <Stack spacing={3}>
                  {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} variant="rounded" height={32} sx={{ bgcolor: "#2e303a" }} />)}
                </Stack>
              ) : (
                <Stack spacing={3}>
                  {porSetor.map((s, index) => (
                    <Box key={s.label}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" sx={{ color: "#d1d5db", fontWeight: 500 }}>{s.label}</Typography>
                        <Typography variant="body2" sx={{ color: "white", fontWeight: 700 }}>{s.valor}</Typography>
                      </Box>
                      <Box sx={{ height: 6, bgcolor: "#2e303a", borderRadius: 4, overflow: "hidden" }}>
                        <Box sx={{
                          height: "100%", bgcolor: "white", borderRadius: 4,
                          width: `${(s.valor / maxSetor) * 100}%`,
                          transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                          animationDelay: `${0.5 + index * 0.1}s`
                        }} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>

          {/* Por status */}
          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: "flex", animation: `${fadeUp} 0.5s ease-out 0.6s both` }}>
            <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: 4, width: "100%" }}>
              <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 4 }}>
                Distribuição por status
              </Typography>
              {loading ? (
                <Stack spacing={2.5}>
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" height={52} sx={{ bgcolor: "#2e303a", borderRadius: 2 }} />)}
                </Stack>
              ) : (
                <Stack spacing={2.5}>
                  {porStatus.map((s) => (
                    <Box
                      key={s.label}
                      sx={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        border: "1px solid #2e303a", bgcolor: "#0a0a0a", borderRadius: 2,
                        px: 2.5, py: 1.5, transition: "all 0.2s ease-in-out",
                        "&:hover": { borderColor: "#4b5563", transform: "translateX(4px)" },
                      }}
                    >
                      <Box sx={{ bgcolor: s.bg, color: s.color, px: 1.5, py: 0.5, borderRadius: "16px", fontSize: "0.75rem", fontWeight: 600 }}>
                        {s.label}
                      </Box>
                      <Typography variant="body2" sx={{ color: "white", fontWeight: 700 }}>{s.valor}</Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}