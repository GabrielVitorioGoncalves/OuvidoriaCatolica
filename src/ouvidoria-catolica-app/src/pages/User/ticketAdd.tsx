import { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  type SelectChangeEvent
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
// IMPORTAÇÃO CORRIGIDA PARA PEGAR O SECTOR DO SEU SERVICE
import { TicketService, Sector, type SectorType, type CriarTicketDTO } from "../../services/TicketService";
import { httpClient } from "../../infra/AxiosAdapter";

const ticketService = new TicketService(httpClient);

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface FormData {
  sector: SectorType | ""; // Mudei de 'Sector' para 'SectorType'
  titulo: string;
  descricao: string;
}

// ─── Dicionário de Setores para a Tela ────────────────────────────────────────
// Isso converte os números do seu C# para textos amigáveis na tela
const setores = [
  { id: Sector.GeneralService, nome: "Serviços Gerais" },
  { id: Sector.Financial, nome: "Financeiro" },
  { id: Sector.Infrastructure, nome: "Infraestrutura" },
  { id: Sector.HumanResources, nome: "Recursos Humanos" },
  { id: Sector.Health, nome: "Saúde" },
  { id: Sector.Education, nome: "Educação" },
];

// ─── Estilos padronizados ─────────────────────────────────────────────────────

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    bgcolor: "#16171d",
    borderRadius: 2,
    "& fieldset": { borderColor: "#2e303a" },
    "&:hover fieldset": { borderColor: "#6b7280" },
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
  "& .MuiInputLabel-root": { color: "#6b7280" },
  "& .MuiInputLabel-root.Mui-focused": { color: "white" },
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function TicketAdd() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    sector: "",
    titulo: "",
    descricao: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    mensagem: string;
    tipo: "success" | "error";
  }>({ open: false, mensagem: "", tipo: "success" });

  function handleVoltar() {
    navigate("/user");
  }

  // ATUALIZADO PARA LIDAR COM NÚMEROS DO ENUM
  function handleSector(e: SelectChangeEvent) {
    setForm((prev) => ({ ...prev, sector: Number(e.target.value) as SectorType }));
  }
  function handleChange(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handleCloseSnackbar() {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }

  async function handleEnviar() {
    if (!formValido) return;

    setEnviando(true);
    try {
      // O PAYLOAD AGORA FALA O MESMO IDIOMA DO C# (title, description, sector)
     const payload: CriarTicketDTO = {
        sector: form.sector as SectorType, // <-- O SEGREDO ESTÁ AQUI
        title: form.titulo.trim(),
        description: form.descricao.trim(),
      };

      await ticketService.criar(payload);

      setSnackbar({
        open: true,
        mensagem: "Manifestação enviada com sucesso!",
        tipo: "success",
      });

      setTimeout(() => navigate("/user"), 1500);
    } catch {
      setSnackbar({
        open: true,
        mensagem: "Erro ao enviar manifestação. Tente novamente.",
        tipo: "error",
      });
    } finally {
      setEnviando(false);
    }
  }

  const formValido =
    form.sector !== "" &&
    form.titulo.trim() !== "" &&
    form.descricao.trim() !== "";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0a" }}>
      <Header />
      <Box
        sx={{
          px: { xs: 2, sm: 4, md: 8, lg: 16 },
          py: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ maxWidth: 720, width: "100%" }}>

          {/* Botão Voltar */}
          <Button
            startIcon={<ArrowBack />}
            onClick={handleVoltar}
            sx={{
              color: "#9ca3af",
              textTransform: "none",
              mb: 3,
              pl: 0,
              "&:hover": { bgcolor: "transparent", color: "white" },
            }}
          >
            Voltar
          </Button>

          {/* Título da página */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
              Nova Manifestação
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
              Descreva sua manifestação com o máximo de detalhes possível.
            </Typography>
          </Box>

          {/* Card do formulário */}
          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 3, sm: 4 } }}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
              Dados da manifestação
            </Typography>

            <Stack spacing={3}>
              {/* Setor */}
              <FormControl fullWidth sx={fieldSx}>
                <InputLabel>Selecione o setor responsável</InputLabel>
                <Select
                  value={form.sector.toString()} // Converte para string pro Select não reclamar
                  label="Selecione o setor responsável"
                  onChange={handleSector}
                  MenuProps={{
                    slotProps: {
                      paper: {
                        sx: { bgcolor: "#16171d", color: "white", border: "1px solid #2e303a" },
                      },
                    },
                  }}
                >
                  {setores.map((setor) => (
                    <MenuItem key={setor.id} value={setor.id} sx={{ "&:hover": { bgcolor: "#1f2028" } }}>
                      {setor.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Título */}
              <TextField
                label="Título"
                placeholder="Resuma a manifestação em uma frase"
                value={form.titulo}
                onChange={handleChange("titulo")}
                fullWidth
                sx={fieldSx}
                slotProps={{ inputLabel: { shrink: true } }}
              />

              {/* Descrição */}
              <TextField
                label="Descrição"
                placeholder="Descreva os detalhes, datas, locais e demais informações relevantes"
                value={form.descricao}
                onChange={handleChange("descricao")}
                fullWidth
                multiline
                rows={5}
                sx={fieldSx}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>

            {/* Ações */}
            <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={handleEnviar}
                disabled={!formValido || enviando}
                sx={{
                  color: "white",
                  borderColor: "#2e303a",
                  borderRadius: 6,
                  px: 3,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#1f2028", borderColor: "#9ca3af" },
                  "&.Mui-disabled": { borderColor: "#2e303a", color: "#6b7280" },
                }}
              >
                {enviando ? "Enviando..." : "Enviar manifestação"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Feedback visual */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.tipo}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}