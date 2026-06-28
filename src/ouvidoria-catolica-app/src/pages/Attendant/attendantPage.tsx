import { useEffect, useState } from "react";
import {
  Box, Button, MenuItem, Select, Stack, Typography,
  TextField, Divider, Snackbar, Alert, Skeleton,
} from "@mui/material";
import {
  ChevronRight, ArrowBack,
  Label as LabelIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";
import Header from "../../components/Header";
import {
  TicketService,
  TicketStatus,
  type TicketListaResponse,
  type TicketRespostaResponse,
  type TicketHistoricoResponse,
  type SectorType,
} from "../../services/TicketService";
import { httpClient } from "../../infra/AxiosAdapter";
import { getUserSession } from '../../infra/UserSession';

const ticketService = new TicketService(httpClient);

const STATUS_LABEL: Record<number, string> = {
  1: "Aberta",
  2: "Em análise",
  3: "Aguardando informações",
  4: "Concluída",
};

const STATUS_STYLES: Record<number, { color: string; bg: string }> = {
  1: { color: "#93c5fd", bg: "rgba(147, 197, 253, 0.15)" },
  2: { color: "#fde047", bg: "rgba(253, 224, 71, 0.15)" },
  3: { color: "#d8b4fe", bg: "rgba(216, 180, 254, 0.15)" },
  4: { color: "#86efac", bg: "rgba(134, 239, 172, 0.15)" },
};

const SECTOR_LABEL: Record<number, string> = {
  1: "Serviços Gerais",
  2: "Financeiro",
  3: "Infraestrutura",
  4: "Recursos Humanos",
  5: "Saúde",
  6: "Educação",
};

function CardResumo({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 }, flex: 1, minWidth: 0 }}>
      <Typography variant="body2" sx={{ color: "#9ca3af", mb: 1 }}>{label}</Typography>
      {loading ? (
        <Skeleton variant="text" width={40} height={48} sx={{ bgcolor: "#1f2028" }} />
      ) : (
        <Typography variant="h4" sx={{ color: "white", fontWeight: 700, lineHeight: 1 }}>{value}</Typography>
      )}
    </Box>
  );
}

function ItemManifestacao({ item, onClick }: { item: TicketListaResponse; onClick: () => void }) {
  const style = STATUS_STYLES[item.status] ?? { color: "#fff", bg: "#333" };
  return (
    <Box
      onClick={onClick}
      sx={{ bgcolor: "#16171d", borderRadius: 3, px: { xs: 2, sm: 3 }, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, cursor: "pointer", transition: "background-color 0.15s ease", "&:hover": { bgcolor: "#1f2028" } }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 0.5 }}>
          {item.ticketID} &nbsp;&nbsp;
          <span style={{ color: "#9ca3af" }}>{SECTOR_LABEL[item.sector]}</span>
        </Typography>
        <Typography variant="body1" sx={{ color: "white", fontWeight: 600, mb: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: { xs: "normal", sm: "nowrap" } }}>
          {item.title}
        </Typography>
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          Por {item.authorName} · Atualizado em {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
        </Typography>
      </Box>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexShrink: 0 }}>
        <Box sx={{ bgcolor: style.bg, color: style.color, px: 1.5, py: 0.25, borderRadius: "16px", fontSize: "0.75rem", fontWeight: 600 }}>
          {STATUS_LABEL[item.status]}
        </Box>
        <ChevronRight sx={{ color: "#6b7280" }} />
      </Stack>
    </Box>
  );
}

function InfoItem({ icone: Icon, label, valor }: { icone: SvgIconComponent; label: string; valor: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 2, bgcolor: "#2a2a2a", color: "#9ca3af", flexShrink: 0 }}>
        <Icon sx={{ fontSize: 20 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: "#9ca3af", display: "block" }}>{label}</Typography>
        <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>{valor}</Typography>
      </Box>
    </Box>
  );
}

function HistoricoTimeline({ historico }: { historico: TicketHistoricoResponse[] }) {
  return (
    <Stack spacing={3}>
      {historico.map((h, index) => (
        <Box key={h.id} sx={{ display: "flex", gap: 2, position: "relative" }}>
          {index !== historico.length - 1 && (
            <Box sx={{ position: "absolute", left: 5, top: 20, bottom: -24, width: "2px", bgcolor: "#2e303a" }} />
          )}
          <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#9ca3af", mt: 0.5, flexShrink: 0, position: "relative", zIndex: 1 }} />
          <Box>
            <Typography variant="body2" sx={{ color: "white", fontWeight: 500, mb: 0.5 }}>{h.descricao}</Typography>
            <Typography variant="caption" sx={{ color: "#6b7280" }}>{new Date(h.data).toLocaleString("pt-BR")}</Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

// ─── DetalheView ─────────────────────────────────────────────────────────────

function DetalheView({
  item,
  onBack,
  onShowMessage,
  onRefresh,
}: {
  item: TicketListaResponse;
  onBack: () => void;
  onShowMessage: (msg: string, tipo?: "success" | "error") => void;
  onRefresh: () => void;
}) {
  const [resposta, setResposta] = useState("");
  const [respostas, setRespostas] = useState<TicketRespostaResponse[]>([]);
  const [historico, setHistorico] = useState<TicketHistoricoResponse[]>([]);
  const [loadingDetalhes, setLoadingDetalhes] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [fechando, setFechando] = useState(false);
  const [solicitando, setSolicitando] = useState(false);
  const [assumindo, setAssumindo] = useState(false);

  // Verifica se o atendente logado é o responsável pelo ticket
  const isResponsavel = !!item.attendantId && item.isMyTicket;
  const semResponsavel = !item.attendantId;

  useEffect(() => {
    Promise.all([
      ticketService.buscarRespostas(item.ticketID),
      ticketService.buscarHistorico(item.ticketID),
    ])
      .then(([r, h]) => {
        setRespostas(r);
        setHistorico(h);
      })
      .catch(() => onShowMessage("Erro ao carregar detalhes.", "error"))
      .finally(() => setLoadingDetalhes(false));
  }, [item.ticketID]);

  async function handleAssumir() {
    setAssumindo(true);
    try {
      await ticketService.assumir(item.ticketID);
      onShowMessage("Ticket assumido com sucesso.");
      onRefresh();
    } catch {
      onShowMessage("Erro ao assumir ticket.", "error");
    } finally {
      setAssumindo(false);
    }
  }

  async function handleResponder() {
    if (!resposta.trim()) return;
    setEnviando(true);
    try {
      await ticketService.responder(item.ticketID, { message: resposta.trim() });
      setResposta("");
      onShowMessage("Resposta enviada com sucesso.");
      onRefresh();
    } catch {
      onShowMessage("Erro ao enviar resposta.", "error");
    } finally {
      setEnviando(false);
    }
  }

  async function handleFechar() {
    setFechando(true);
    try {
      await ticketService.fechar(item.ticketID);
      onShowMessage("Ticket encerrado com sucesso.");
      onRefresh();
      onBack();
    } catch {
      onShowMessage("Erro ao encerrar ticket.", "error");
    } finally {
      setFechando(false);
    }
  }

  async function handleSolicitarInfo() {
    setSolicitando(true);
    try {
      await ticketService.solicitarInformacoes(item.ticketID);
      onShowMessage("Solicitação de informações enviada.");
      onRefresh();
    } catch {
      onShowMessage("Erro ao solicitar informações.", "error");
    } finally {
      setSolicitando(false);
    }
  }

  const style = STATUS_STYLES[item.status] ?? { color: "#fff", bg: "#333" };
  const isClosed = item.status === TicketStatus.Closed;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Button onClick={onBack} startIcon={<ArrowBack />} disableRipple sx={{ color: "#9ca3af", textTransform: "none", width: "fit-content", px: 0, "&:hover": { color: "white", bgcolor: "transparent" } }}>
        Voltar
      </Button>

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ color: "#9ca3af", fontFamily: "monospace", mb: 0.5 }}>
            Protocolo {item.ticketID}
          </Typography>
          <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>{item.title}</Typography>
        </Box>
        <Box sx={{ bgcolor: style.bg, color: style.color, px: 2, py: 0.5, borderRadius: "16px", fontSize: "0.875rem", fontWeight: 600, mt: 1 }}>
          {STATUS_LABEL[item.status]}
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 3 }}>
        <Stack spacing={3}>
          {/* Informações gerais */}
          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3 }}>
              <InfoItem icone={LabelIcon} label="Setor" valor={SECTOR_LABEL[item.sector]} />
              <InfoItem icone={PersonIcon} label="Autor" valor={item.authorName} />
              <InfoItem icone={CalendarIcon} label="Abertura" valor={new Date(item.createdAt).toLocaleDateString("pt-BR")} />
            </Box>
          </Box>

          {/* Descrição */}
          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 2 }}>Descrição</Typography>
            <Typography variant="body2" sx={{ color: "#d1d5db", lineHeight: 1.6 }}>{item.description}</Typography>
          </Box>

          {/* Respostas */}
          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 2 }}>Respostas</Typography>
            <Divider sx={{ borderColor: "#2e303a", mb: 3 }} />
            {loadingDetalhes ? (
              <Stack spacing={2}>
                {[1, 2].map((i) => <Skeleton key={i} variant="rounded" height={60} sx={{ bgcolor: "#1f2028", borderRadius: 2 }} />)}
              </Stack>
            ) : respostas.length === 0 ? (
              <Typography variant="body2" sx={{ color: "#6b7280" }}>Nenhuma resposta ainda.</Typography>
            ) : (
              <Stack spacing={2}>
                {respostas.map((r) => (
                  <Box key={r.responseID} sx={{ p: 2, bgcolor: "#1f2028", borderRadius: 2, border: "1px solid #2e303a" }}>
                    <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 0.5 }}>
                      {r.responsibleAttendant} · {new Date(r.respondedAt).toLocaleString("pt-BR")}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#d1d5db", lineHeight: 1.6 }}>{r.message}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          {/* Histórico */}
          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 2 }}>Histórico</Typography>
            <Divider sx={{ borderColor: "#2e303a", mb: 3 }} />
            {loadingDetalhes ? (
              <Stack spacing={2}>
                {[1, 2, 3].map((i) => <Skeleton key={i} variant="text" height={40} sx={{ bgcolor: "#1f2028" }} />)}
              </Stack>
            ) : (
              <HistoricoTimeline historico={historico} />
            )}
          </Box>
        </Stack>

        {/* Ações */}
        <Stack spacing={3}>
          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 3 }}>Ações</Typography>

            {/* Responsável */}
            <Box sx={{ border: "1px solid #2e303a", bgcolor: "#1f2028", borderRadius: 2, p: 2, mb: 3 }}>
              <Typography variant="caption" sx={{ color: "#9ca3af", display: "block" }}>Responsável</Typography>
              <Typography variant="body2" sx={{ color: item.attendantName ? "white" : "#6b7280", fontWeight: 500 }}>
                {item.attendantName ?? "Sem responsável"}
              </Typography>
            </Box>

            <Stack spacing={2}>
              {/* Botão assumir — só aparece se não tiver responsável */}
              {semResponsavel && (
                <Button
                  fullWidth
                  onClick={handleAssumir}
                  disabled={assumindo}
                  sx={{ bgcolor: "#3b82f6", color: "white", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#2563eb" }, "&.Mui-disabled": { bgcolor: "#2a2a2a", color: "#6b7280" } }}
                >
                  {assumindo ? "Assumindo..." : "Assumir ticket"}
                </Button>
              )}

              <Button
                fullWidth
                onClick={handleSolicitarInfo}
                disabled={!isResponsavel || isClosed || solicitando}
                variant="outlined"
                sx={{ color: "white", borderColor: "#2e303a", textTransform: "none", "&:hover": { borderColor: "#9ca3af", bgcolor: "rgba(255,255,255,0.05)" }, "&.Mui-disabled": { borderColor: "#2e303a", color: "#6b7280" } }}
              >
                {solicitando ? "Solicitando..." : "Solicitar mais informações"}
              </Button>

              <Button
                fullWidth
                onClick={handleFechar}
                disabled={!isResponsavel || isClosed || fechando}
                sx={{ bgcolor: !isResponsavel || isClosed ? "#2a2a2a" : "white", color: !isResponsavel || isClosed ? "#6b7280" : "black", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#f3f4f6" }, "&.Mui-disabled": { bgcolor: "#2a2a2a", color: "#6b7280" } }}
              >
                {fechando ? "Encerrando..." : isClosed ? "Ticket encerrado" : "Encerrar ticket"}
              </Button>
            </Stack>
          </Box>

          {/* Responder — só habilitado para o responsável */}
          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 3 }}>Responder ao aluno</Typography>
            {!isResponsavel && !isClosed && (
              <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 2 }}>
                Apenas o atendente responsável pode responder.
              </Typography>
            )}
            <TextField
              multiline rows={4}
              disabled={!isResponsavel || isClosed}
              placeholder={isClosed ? "Ticket encerrado" : !isResponsavel ? "Assuma o ticket para responder" : "Escreva a resposta ao aluno"}
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              sx={{
                width: "100%", mb: 2,
                "& .MuiOutlinedInput-root": {
                  color: "white", bgcolor: "transparent", fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#2e303a", borderRadius: "8px" },
                  "&:hover fieldset": { borderColor: "#4b5563" },
                  "&.Mui-focused fieldset": { borderColor: "#93c5fd" },
                  "&.Mui-disabled": { opacity: 0.5 },
                },
              }}
            />
            <Button
              fullWidth
              onClick={handleResponder}
              disabled={!isResponsavel || isClosed || !resposta.trim() || enviando}
              sx={{ bgcolor: "white", color: "black", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#f3f4f6" }, "&.Mui-disabled": { bgcolor: "#2a2a2a", color: "#6b7280" } }}
            >
              {enviando ? "Enviando..." : "Enviar resposta"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AttendantPage() {
  const [tickets, setTickets] = useState<TicketListaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"todas" | "meus">("todas");
  const [filtroStatus, setFiltroStatus] = useState<number | "todos">("todos");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string; tipo: "success" | "error" }>({ open: false, msg: "", tipo: "success" });

  function showMessage(msg: string, tipo: "success" | "error" = "success") {
    setSnackbar({ open: true, msg, tipo });
  }

  async function carregarTickets() {
    setLoading(true);
    try {
      const session = getUserSession();
      if (!session?.sector) {
        showMessage("Setor do atendente não encontrado.", "error");
        return;
      }
      const data = await ticketService.listarPorSetor(session.sector as SectorType);
      setTickets(data);
    } catch {
      showMessage("Erro ao carregar manifestações.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      setLoading(true);
      try {
        const session = getUserSession();
        if (!session?.sector) {
          if (ativo) showMessage("Setor do atendente não encontrado.", "error");
          return;
        }
        const data = await ticketService.listarPorSetor(session.sector as SectorType);
        if (ativo) setTickets(data);
      } catch {
        if (ativo) showMessage("Erro ao carregar manifestações.", "error");
      } finally {
        if (ativo) setLoading(false);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, []);

  const filtrados = tickets.filter((t) => {
    // Aba "todas" — apenas sem responsável
    const matchTab = tab === "todas"
      ? !t.attendantId
      : t.isMyTicket;
    const matchStatus = filtroStatus === "todos" || t.status === filtroStatus;
    console.log(`Ticket ${t.ticketID.slice(0, 8)} | attendantId: ${t.attendantId} | isMyTicket: ${t.isMyTicket} | tab: ${tab} | matchTab: ${matchTab}`);
    return matchTab && matchStatus;
  });

  const totalRecebidos = tickets.length;
  const semAtendente = tickets.filter((t) => !t.attendantId).length;
  const meusAtivos = tickets.filter((t) => t.isMyTicket && t.status !== TicketStatus.Closed).length;
  const selectedItem = tickets.find((t) => t.ticketID === selectedId);

  const STATUS_FILTRO = [
    { label: "Todos os status", value: "todos" as const },
    { label: "Aberta", value: TicketStatus.New },
    { label: "Em análise", value: TicketStatus.InReview },
    { label: "Aguardando informações", value: TicketStatus.AwaitingResponse },
    { label: "Concluída", value: TicketStatus.Closed },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0a", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ px: { xs: 2, sm: 4, md: 8, lg: 16 }, py: { xs: 4, sm: 6 }, flex: 1, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 1000 }}>
          {selectedItem ? (
            <DetalheView
              item={selectedItem}
              onBack={() => setSelectedId(null)}
              onShowMessage={showMessage}
              onRefresh={carregarTickets}
            />
          ) : (
            <>
              <Box sx={{ mb: { xs: 4, sm: 5 } }}>
                <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>Atendimento Acadêmico</Typography>
                <Typography variant="body2" sx={{ color: "#9ca3af" }}>Gerencie as manifestações e requisições dos alunos.</Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: { xs: 4, sm: 5 } }}>
                <CardResumo label="Chamados recebidos" value={totalRecebidos} loading={loading} />
                <CardResumo label="Aguardando atendente" value={semAtendente} loading={loading} />
                <CardResumo label="Meus chamados ativos" value={meusAtivos} loading={loading} />
              </Stack>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 3 }}>
                <Box sx={{ display: "flex", bgcolor: "#16171d", borderRadius: "20px", p: 0.5 }}>
                  {(["todas", "meus"] as const).map((t) => (
                    <Button key={t} onClick={() => setTab(t)} sx={{ color: tab === t ? "white" : "#9ca3af", bgcolor: tab === t ? "#2a2a2a" : "transparent", borderRadius: "16px", px: 2, py: 0.5, textTransform: "none", fontWeight: tab === t ? 600 : 400, "&:hover": { bgcolor: tab === t ? "#2a2a2a" : "rgba(255,255,255,0.05)" } }}>
                      {t === "todas" ? "Todas" : "Meus atendimentos"}
                    </Button>
                  ))}
                </Box>
                <Select
                  size="small"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value as number | "todos")}
                  sx={{ color: "white", bgcolor: "transparent", borderRadius: "8px", minWidth: 200, border: "1px solid #2e303a", fontSize: "0.875rem", "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiSvgIcon-root": { color: "#9ca3af" } }}
                  MenuProps={{ slotProps: { paper: { sx: { bgcolor: "#16171d", color: "white", border: "1px solid #2e303a" } } } }}
                >
                  {STATUS_FILTRO.map((s) => (
                    <MenuItem key={s.label} value={s.value} sx={{ fontSize: "0.875rem", "&:hover": { bgcolor: "#1f2028" }, "&.Mui-selected": { bgcolor: "#2a2a2a" } }}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {loading ? (
                <Stack spacing={2}>
                  {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={90} sx={{ bgcolor: "#16171d", borderRadius: 3 }} />)}
                </Stack>
              ) : filtrados.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6, bgcolor: "#16171d", borderRadius: 3 }}>
                  <Typography sx={{ color: "#9ca3af" }}>Nenhuma manifestação encontrada.</Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {filtrados.map((item) => (
                    <ItemManifestacao key={item.ticketID} item={item} onClick={() => setSelectedId(item.ticketID)} />
                  ))}
                </Stack>
              )}
            </>
          )}
        </Box>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.tipo} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} variant="filled" sx={{ width: "100%" }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}