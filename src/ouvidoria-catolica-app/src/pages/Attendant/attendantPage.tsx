import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  Typography,
  TextField,
  Divider,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ChevronRight,
  ArrowBack,
  Label as LabelIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

type StatusManifestacao =
  | "Aberta"
  | "Em análise"
  | "Em atendimento"
  | "Encaminhada"
  | "Respondida"
  | "Concluída";

interface HistoricoItem {
  id: string;
  data: string;
  descricao: string;
}

interface Manifestacao {
  id: string;
  protocolo: string;
  tipo: string;
  categoria: string;
  titulo: string;
  descricao: string;
  autor: string;
  criadaEm: string;
  atualizadaEm: string;
  status: StatusManifestacao;
  isMeuAtendimento: boolean;
  atendenteNome?: string;
  setor?: string;
  historico: HistoricoItem[];
}

const STATUS_LIST: StatusManifestacao[] = [
  "Aberta",
  "Em análise",
  "Em atendimento",
  "Encaminhada",
  "Respondida",
  "Concluída",
];

const SETORES = [
  "Secretaria Acadêmica",
  "Coordenação de Cursos",
  "TI e Suporte",
  "Biblioteca",
  "Financeiro",
  "Infraestrutura e Manutenção",
];

const statusStyles: Record<StatusManifestacao, { color: string; bg: string }> = {
  Aberta: { color: "#93c5fd", bg: "rgba(147, 197, 253, 0.15)" },
  "Em análise": { color: "#fde047", bg: "rgba(253, 224, 71, 0.15)" },
  "Em atendimento": { color: "#c7d2fe", bg: "rgba(199, 210, 254, 0.15)" },
  Encaminhada: { color: "#d8b4fe", bg: "rgba(216, 180, 254, 0.15)" },
  Respondida: { color: "#cbd5e1", bg: "rgba(203, 213, 225, 0.15)" },
  Concluída: { color: "#86efac", bg: "rgba(134, 239, 172, 0.15)" },
};

const mockManifestacoesIniciais: Manifestacao[] = [
  {
    id: "1",
    protocolo: "#2026-000450",
    tipo: "Reclamação",
    categoria: "Financeiro",
    titulo: "Boleto da mensalidade com valor incorreto",
    descricao:
      "O boleto referente ao mês de junho veio sem o desconto da minha bolsa de monitoria. Preciso que o valor seja ajustado antes do vencimento no dia 30.",
    autor: "Lucas Martins",
    criadaEm: "23/06/2026",
    atualizadaEm: "23/06/2026",
    status: "Aberta",
    isMeuAtendimento: false,
    historico: [
      { id: "h1", data: "23/06/2026 14:30", descricao: "Manifestação registrada pelo aluno." },
    ],
  },
  {
    id: "2",
    protocolo: "#2026-000451",
    tipo: "Reclamação",
    categoria: "TI e Suporte",
    titulo: "Wi-Fi caindo constantemente no Bloco C",
    descricao:
      "A rede de estudantes no Bloco C está muito instável há duas semanas. É impossível acompanhar as aulas que exigem pesquisa online.",
    autor: "Mariana Silva",
    criadaEm: "22/06/2026",
    atualizadaEm: "24/06/2026",
    status: "Em análise",
    isMeuAtendimento: true,
    atendenteNome: "Você",
    setor: "TI e Suporte",
    historico: [
      { id: "h1", data: "22/06/2026 09:15", descricao: "Manifestação registrada pelo aluno." },
      { id: "h2", data: "24/06/2026 08:00", descricao: "Atendimento assumido por Você." },
    ],
  },
  {
    id: "3",
    protocolo: "#2026-000452",
    tipo: "Solicitação",
    categoria: "Secretaria Acadêmica",
    titulo: "Demora na emissão do histórico escolar",
    descricao:
      "Solicitei meu histórico escolar assinado há mais de 10 dias e ainda consta como pendente no portal. Preciso dele com urgência para uma vaga de estágio.",
    autor: "Pedro Gonçalves",
    criadaEm: "14/06/2026",
    atualizadaEm: "20/06/2026",
    status: "Encaminhada",
    isMeuAtendimento: false,
    atendenteNome: "Carla Dias",
    setor: "Secretaria Acadêmica",
    historico: [
      { id: "h1", data: "14/06/2026 10:20", descricao: "Manifestação registrada pelo aluno." },
      { id: "h2", data: "20/06/2026 11:10", descricao: "Encaminhada para o setor Secretaria Acadêmica." },
    ],
  },
  {
    id: "4",
    protocolo: "#2026-000453",
    tipo: "Sugestão",
    categoria: "Biblioteca",
    titulo: "Aquisição de novos livros de Inteligência Artificial",
    descricao:
      "Gostaria de sugerir que a biblioteca adquira títulos mais recentes sobre Machine Learning e Inteligência Artificial, pois a grade curricular de computação foi atualizada, mas o acervo não.",
    autor: "Fernanda Costa",
    criadaEm: "18/06/2026",
    atualizadaEm: "21/06/2026",
    status: "Respondida",
    isMeuAtendimento: false,
    historico: [
      { id: "h1", data: "18/06/2026 16:45", descricao: "Manifestação registrada pelo aluno." },
      { id: "h2", data: "21/06/2026 14:00", descricao: "Resposta enviada ao aluno: 'Agradecemos a sugestão. O pedido de compra já foi repassado à direção da biblioteca.'" },
    ],
  },
  {
    id: "5",
    protocolo: "#2026-000454",
    tipo: "Reclamação",
    categoria: "Infraestrutura e Manutenção",
    titulo: "Ar-condicionado vazando na sala 204",
    descricao:
      "O aparelho de ar-condicionado do fundo da sala 204 está pingando água em cima das carteiras. Tivemos que afastar as mesas na última aula.",
    autor: "Roberto Almeida",
    criadaEm: "24/06/2026",
    atualizadaEm: "24/06/2026",
    status: "Em atendimento",
    isMeuAtendimento: true,
    atendenteNome: "Você",
    setor: "Infraestrutura e Manutenção",
    historico: [
      { id: "h1", data: "24/06/2026 07:30", descricao: "Manifestação registrada pelo aluno." },
      { id: "h2", data: "24/06/2026 08:15", descricao: "Atendimento assumido por Você." },
      { id: "h3", data: "24/06/2026 08:20", descricao: "Status alterado para: Em atendimento." },
    ],
  },
  {
    id: "6",
    protocolo: "#2026-000455",
    tipo: "Solicitação",
    categoria: "Coordenação de Cursos",
    titulo: "Revisão de nota final em Cálculo II",
    descricao:
      "O professor lançou minha média final como 5.5, mas de acordo com as minhas notas no sistema, a média exata seria 7.0. Tentei contato por e-mail e não obtive resposta.",
    autor: "Juliana Mendes",
    criadaEm: "23/06/2026",
    atualizadaEm: "23/06/2026",
    status: "Aberta",
    isMeuAtendimento: false,
    historico: [
      { id: "h1", data: "23/06/2026 19:10", descricao: "Manifestação registrada pelo aluno." },
    ],
  },
  {
    id: "7",
    protocolo: "#2026-000456",
    tipo: "Dúvida",
    categoria: "Secretaria Acadêmica",
    titulo: "Validação de horas complementares do semestre passado",
    descricao:
      "Enviei os certificados de dois cursos de extensão no semestre passado e queria saber se as horas já foram validadas no meu currículo.",
    autor: "Carlos Eduardo",
    criadaEm: "20/06/2026",
    atualizadaEm: "22/06/2026",
    status: "Concluída",
    isMeuAtendimento: false,
    atendenteNome: "João Silva",
    setor: "Secretaria Acadêmica",
    historico: [
      { id: "h1", data: "20/06/2026 08:50", descricao: "Manifestação registrada pelo aluno." },
      { id: "h2", data: "22/06/2026 15:30", descricao: "Status alterado para: Concluída." },
    ],
  },
];

function Header() {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, px: { xs: 2, sm: 4, md: 8, lg: 16 }, bgcolor: "#16171d", borderBottom: "1px solid #2e303a" }}>
      <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
        UniAcess <span style={{ color: "#9ca3af", fontWeight: 400 }}>| Ouvidoria Acadêmica</span>
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <NotificationsIcon sx={{ color: "#9ca3af", cursor: "pointer", "&:hover": { color: "white" } }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#3b82f6", fontSize: "0.875rem" }}>VC</Avatar>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography variant="body2" sx={{ color: "white", fontWeight: 500, lineHeight: 1.2 }}>Você</Typography>
            <Typography variant="caption" sx={{ color: "#9ca3af" }}>Atendente</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function CardResumo({ label, value }: { label: string; value: number }) {
  return (
    <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 }, flex: 1, minWidth: 0 }}>
      <Typography variant="body2" sx={{ color: "#9ca3af", mb: 1 }}>{label}</Typography>
      <Typography variant="h4" sx={{ color: "white", fontWeight: 700, lineHeight: 1 }}>{value}</Typography>
    </Box>
  );
}

function ItemManifestacao({ item, onClick }: { item: Manifestacao; onClick: () => void }) {
  return (
    <Box onClick={onClick} sx={{ bgcolor: "#16171d", borderRadius: 3, px: { xs: 2, sm: 3 }, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, cursor: "pointer", transition: "background-color 0.15s ease", "&:hover": { bgcolor: "#1f2028" } }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mb: 0.5 }}>
          {item.protocolo} &nbsp;&nbsp;<span style={{ color: "#9ca3af" }}>{item.tipo}</span>
        </Typography>
        <Typography variant="body1" sx={{ color: "white", fontWeight: 600, mb: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: { xs: "normal", sm: "nowrap" } }}>
          {item.titulo}
        </Typography>
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          Por {item.autor} · Atualizada em {item.atualizadaEm}
        </Typography>
      </Box>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexShrink: 0 }}>
        <Box sx={{ bgcolor: statusStyles[item.status].bg, color: statusStyles[item.status].color, px: 1.5, py: 0.25, borderRadius: "16px", fontSize: "0.75rem", fontWeight: 600 }}>
          {item.status}
        </Box>
        <ChevronRight sx={{ color: "#6b7280" }} />
      </Stack>
    </Box>
  );
}

function InfoItem({ icone: Icon, label, valor }: { icone: any; label: string; valor: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 2, bgcolor: "#2a2a2a", color: "#9ca3af", flexShrink: 0 }}>
        <Icon sx={{ fontSize: 20 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: "#9ca3af", display: "block" }}>{label}</Typography>
        <Typography variant="body2" sx={{ color: "white", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{valor}</Typography>
      </Box>
    </Box>
  );
}

function HistoricoTimeline({ historico }: { historico: HistoricoItem[] }) {
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
            <Typography variant="caption" sx={{ color: "#6b7280" }}>{h.data}</Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

function DetalheView({ item, onBack, onUpdate, onShowMessage }: { item: Manifestacao; onBack: () => void; onUpdate: (item: Manifestacao) => void; onShowMessage: (msg: string) => void }) {
  const [resposta, setResposta] = useState("");
  const [setorSelecionado, setSetorSelecionado] = useState<string>(item.setor || "");

  const semAtendente = !item.isMeuAtendimento;

  const getDataAtual = () => {
    return new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  };

  const handleAssumirAtendimento = () => {
    const historicoNovo: HistoricoItem = { id: Date.now().toString(), data: getDataAtual(), descricao: "Atendimento assumido por Você." };
    onUpdate({
      ...item,
      isMeuAtendimento: true,
      atendenteNome: "Você",
      status: "Em análise",
      atualizadaEm: new Date().toLocaleDateString('pt-BR'),
      historico: [...item.historico, historicoNovo]
    });
    onShowMessage("Atendimento assumido com sucesso e status alterado para 'Em análise'.");
  };

  const handleMudarStatus = (novoStatus: string) => {
    const historicoNovo: HistoricoItem = { id: Date.now().toString(), data: getDataAtual(), descricao: `Status alterado para: ${novoStatus}.` };
    onUpdate({
      ...item,
      status: novoStatus as StatusManifestacao,
      atualizadaEm: new Date().toLocaleDateString('pt-BR'),
      historico: [...item.historico, historicoNovo]
    });
    onShowMessage(`Status atualizado para '${novoStatus}'.`);
  };

  const handleEncaminhar = () => {
    if (!setorSelecionado) return;
    const historicoNovo: HistoricoItem = { id: Date.now().toString(), data: getDataAtual(), descricao: `Manifestação encaminhada para o setor: ${setorSelecionado}.` };
    onUpdate({
      ...item,
      setor: setorSelecionado,
      status: "Encaminhada",
      atualizadaEm: new Date().toLocaleDateString('pt-BR'),
      historico: [...item.historico, historicoNovo]
    });
    onShowMessage(`Atendimento encaminhado para '${setorSelecionado}'.`);
  };

  const handleResponder = () => {
    if (!resposta.trim()) return;
    const historicoNovo: HistoricoItem = { id: Date.now().toString(), data: getDataAtual(), descricao: `Resposta enviada ao aluno: "${resposta}"` };
    onUpdate({
      ...item,
      status: "Respondida",
      atualizadaEm: new Date().toLocaleDateString('pt-BR'),
      historico: [...item.historico, historicoNovo]
    });
    setResposta("");
    onShowMessage("Resposta enviada e status alterado para 'Respondida'.");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Button onClick={onBack} startIcon={<ArrowBack />} disableRipple sx={{ color: "#9ca3af", textTransform: "none", width: "fit-content", px: 0, "&:hover": { color: "white", bgcolor: "transparent" } }}>
        Voltar
      </Button>

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ color: "#9ca3af", fontFamily: "monospace", mb: 0.5 }}>Protocolo {item.protocolo}</Typography>
          <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>{item.titulo}</Typography>
        </Box>
        <Box sx={{ bgcolor: statusStyles[item.status as StatusManifestacao].bg, color: statusStyles[item.status as StatusManifestacao].color, px: 2, py: 0.5, borderRadius: "16px", fontSize: "0.875rem", fontWeight: 600, mt: 1 }}>
          {item.status}
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 3 }}>
        <Stack spacing={3}>
          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 3 }}>
              <InfoItem icone={LabelIcon} label="Categoria" valor={item.categoria} />
              <InfoItem icone={PersonIcon} label="Aluno(a)" valor={item.autor} />
              <InfoItem icone={CalendarIcon} label="Abertura" valor={item.criadaEm} />
            </Box>
          </Box>

          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 2 }}>Descrição</Typography>
            <Typography variant="body2" sx={{ color: "#d1d5db", lineHeight: 1.6 }}>{item.descricao}</Typography>
          </Box>

          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 2 }}>Histórico</Typography>
            <Divider sx={{ borderColor: "#2e303a", mb: 3 }} />
            <HistoricoTimeline historico={item.historico} />
          </Box>
        </Stack>

        <Stack spacing={3}>
          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 3 }}>Ações de atendimento</Typography>

            {semAtendente ? (
              <Button onClick={handleAssumirAtendimento} fullWidth sx={{ bgcolor: "white", color: "black", textTransform: "none", fontWeight: 600, mb: 3, "&:hover": { bgcolor: "#f3f4f6" } }}>
                Assumir atendimento
              </Button>
            ) : (
              <Box sx={{ border: "1px solid #2e303a", bgcolor: "#1f2028", borderRadius: 2, p: 2, mb: 3 }}>
                <Typography variant="caption" sx={{ color: "#9ca3af", display: "block" }}>Responsável</Typography>
                <Typography variant="body2" sx={{ color: "white", fontWeight: 500, mb: item.setor ? 0.5 : 0 }}>{item.atendenteNome}</Typography>
                {item.setor && <Typography variant="caption" sx={{ color: "#6b7280" }}>Setor: {item.setor}</Typography>}
              </Box>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
              <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>Alterar status</Typography>
              <Select
                size="small"
                disabled={semAtendente}
                value={item.status}
                onChange={(e) => handleMudarStatus(e.target.value as string)}
                sx={{
                  color: "white", bgcolor: "transparent", borderRadius: "8px", border: "1px solid #2e303a", fontSize: "0.875rem",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiSvgIcon-root": { color: "#9ca3af" }, "&.Mui-disabled": { opacity: 0.5 },
                }}
                MenuProps={{ slotProps: { paper: { sx: { bgcolor: "#16171d", color: "white", border: "1px solid #2e303a" } } } }}
              >
                {STATUS_LIST.map((s) => (
                  <MenuItem key={s} value={s} sx={{ fontSize: "0.875rem", "&:hover": { bgcolor: "#1f2028" }, "&.Mui-selected": { bgcolor: "#2a2a2a", "&:hover": { bgcolor: "#2a2a2a" } } }}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>Encaminhar para setor</Typography>
              <Select
                size="small"
                disabled={semAtendente}
                value={setorSelecionado}
                onChange={(e) => setSetorSelecionado(e.target.value)}
                displayEmpty
                sx={{
                  color: setorSelecionado ? "white" : "#9ca3af", bgcolor: "transparent", borderRadius: "8px", border: "1px solid #2e303a", fontSize: "0.875rem",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiSvgIcon-root": { color: "#9ca3af" }, "&.Mui-disabled": { opacity: 0.5 },
                }}
                MenuProps={{ slotProps: { paper: { sx: { bgcolor: "#16171d", color: "white", border: "1px solid #2e303a" } } } }}
              >
                <MenuItem value="" disabled sx={{ display: "none" }}>Selecione o setor acadêmico</MenuItem>
                {SETORES.map((s) => (
                  <MenuItem key={s} value={s} sx={{ fontSize: "0.875rem", "&:hover": { bgcolor: "#1f2028" }, "&.Mui-selected": { bgcolor: "#2a2a2a", "&:hover": { bgcolor: "#2a2a2a" } } }}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="outlined"
                onClick={handleEncaminhar}
                disabled={semAtendente || !setorSelecionado}
                sx={{
                  color: "white", borderColor: "#2e303a", textTransform: "none", mt: 1,
                  "&:hover": { borderColor: "#9ca3af", bgcolor: "rgba(255,255,255,0.05)" }, "&.Mui-disabled": { borderColor: "#2e303a", color: "#6b7280" },
                }}
              >
                Encaminhar
              </Button>
            </Box>
          </Box>

          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 2.5, sm: 3 } }}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 3 }}>Responder ao aluno</Typography>
            <TextField
              multiline rows={4} disabled={semAtendente}
              placeholder={semAtendente ? "Assuma o atendimento para responder" : "Escreva a resposta ao aluno"}
              value={resposta} onChange={(e) => setResposta(e.target.value)}
              sx={{
                width: "100%", mb: 2,
                "& .MuiOutlinedInput-root": {
                  color: "white", bgcolor: "transparent", fontSize: "0.875rem",
                  "& fieldset": { borderColor: "#2e303a", borderRadius: "8px" }, "&:hover fieldset": { borderColor: "#4b5563" },
                  "&.Mui-focused fieldset": { borderColor: "#93c5fd" }, "&.Mui-disabled": { opacity: 0.5 },
                },
              }}
            />
            <Button
              fullWidth
              onClick={handleResponder}
              disabled={semAtendente || !resposta.trim()}
              sx={{ bgcolor: "white", color: "black", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#f3f4f6" }, "&.Mui-disabled": { bgcolor: "#2a2a2a", color: "#6b7280" } }}
            >
              Enviar resposta
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default function AttendantPage() {
  const [manifestacoes, setManifestacoes] = useState<Manifestacao[]>(mockManifestacoesIniciais);
  const [tab, setTab] = useState<"todas" | "meus">("todas");
  const [filtroStatus, setFiltroStatus] = useState("Todos os status");
  const [selectedManifestacaoId, setSelectedManifestacaoId] = useState<string | null>(null);
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const manifestacoesRecebidas = manifestacoes.length;
  const semAtendente = manifestacoes.filter((m) => !m.isMeuAtendimento).length;
  const meusAtendimentosAtivos = manifestacoes.filter((m) => m.isMeuAtendimento && m.status !== "Concluída").length;

  const filteredManifestacoes = manifestacoes.filter((item) => {
    const matchTab = tab === "todas" || (tab === "meus" && item.isMeuAtendimento);
    const matchStatus = filtroStatus === "Todos os status" || item.status === filtroStatus;
    return matchTab && matchStatus;
  });

  const opcoesFiltro = ["Todos os status", ...STATUS_LIST];
  const selectedItem = manifestacoes.find((m) => m.id === selectedManifestacaoId);

  const handleUpdateManifestacao = (manifestacaoAtualizada: Manifestacao) => {
    setManifestacoes((prev) => prev.map((m) => (m.id === manifestacaoAtualizada.id ? manifestacaoAtualizada : m)));
  };

  const handleShowMessage = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0a", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box sx={{ px: { xs: 2, sm: 4, md: 8, lg: 16 }, py: { xs: 4, sm: 6 }, flex: 1, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 1000 }}>
          {selectedItem ? (
            <DetalheView 
              item={selectedItem} 
              onBack={() => setSelectedManifestacaoId(null)} 
              onUpdate={handleUpdateManifestacao} 
              onShowMessage={handleShowMessage}
            />
          ) : (
            <>
              <Box sx={{ mb: { xs: 4, sm: 5 } }}>
                <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>Atendimento Acadêmico</Typography>
                <Typography variant="body2" sx={{ color: "#9ca3af" }}>Gerencie as manifestações e requisições dos alunos.</Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: { xs: 4, sm: 5 } }}>
                <CardResumo label="Chamados recebidos" value={manifestacoesRecebidas} />
                <CardResumo label="Aguardando atendente" value={semAtendente} />
                <CardResumo label="Meus chamados ativos" value={meusAtendimentosAtivos} />
              </Stack>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 3 }}>
                <Box sx={{ display: "flex", bgcolor: "#16171d", borderRadius: "20px", p: 0.5 }}>
                  <Button onClick={() => setTab("todas")} sx={{ color: tab === "todas" ? "white" : "#9ca3af", bgcolor: tab === "todas" ? "#2a2a2a" : "transparent", borderRadius: "16px", px: 2, py: 0.5, textTransform: "none", fontWeight: tab === "todas" ? 600 : 400, "&:hover": { bgcolor: tab === "todas" ? "#2a2a2a" : "rgba(255,255,255,0.05)" } }}>
                    Todas
                  </Button>
                  <Button onClick={() => setTab("meus")} sx={{ color: tab === "meus" ? "white" : "#9ca3af", bgcolor: tab === "meus" ? "#2a2a2a" : "transparent", borderRadius: "16px", px: 2, py: 0.5, textTransform: "none", fontWeight: tab === "meus" ? 600 : 400, "&:hover": { bgcolor: tab === "meus" ? "#2a2a2a" : "rgba(255,255,255,0.05)" } }}>
                    Meus atendimentos
                  </Button>
                </Box>

                <Select
                  size="small"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  sx={{ color: "white", bgcolor: "transparent", borderRadius: "8px", minWidth: 180, border: "1px solid #2e303a", fontSize: "0.875rem", "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiSvgIcon-root": { color: "#9ca3af" } }}
                  MenuProps={{ slotProps: { paper: { sx: { bgcolor: "#16171d", color: "white", border: "1px solid #2e303a" } } } }}
                >
                  {opcoesFiltro.map((opcao) => (
                    <MenuItem key={opcao} value={opcao} sx={{ fontSize: "0.875rem", "&:hover": { bgcolor: "#1f2028" }, "&.Mui-selected": { bgcolor: "#2a2a2a", "&:hover": { bgcolor: "#2a2a2a" } } }}>
                      {opcao}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Stack spacing={2}>
                {filteredManifestacoes.length > 0 ? (
                  filteredManifestacoes.map((item) => (
                    <ItemManifestacao key={item.id} item={item} onClick={() => setSelectedManifestacaoId(item.id)} />
                  ))
                ) : (
                  <Box sx={{ textAlign: "center", py: 6, bgcolor: "#16171d", borderRadius: 3 }}>
                    <Typography sx={{ color: "#9ca3af" }}>Nenhuma manifestação encontrada.</Typography>
                  </Box>
                )}
              </Stack>
            </>
          )}
        </Box>
      </Box>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', bgcolor: '#059669', color: 'white', '& .MuiAlert-icon': { color: 'white' } }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}