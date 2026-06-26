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
<<<<<<< Updated upstream
=======
  Snackbar,
  Alert,
  type SelectChangeEvent
>>>>>>> Stashed changes
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { TicketService, type Categoria, type CriarTicketDTO } from "../../services/TicketService";
import { httpClient } from "../../infra/AxiosAdapter";

// ─── Instância do service ─────────────────────────────────────────────────────

const ticketService = new TicketService(httpClient);

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface FormData {
  categoria: Categoria | "";
  titulo: string;
  descricao: string;
}

<<<<<<< Updated upstream
// ─── Estilos compartilhados dos campos ────────────────────────────────────────
=======
// ─── Estilos padronizados ─────────────────────────────────────────────────────
>>>>>>> Stashed changes

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    bgcolor: "#202020",
    borderRadius: 2,
    "& fieldset": { borderColor: "#3a3a3a" },
    "&:hover fieldset": { borderColor: "#666" },
    "&.Mui-focused fieldset": { borderColor: "#888" },
  },
  "& .MuiInputLabel-root": { color: "#909090" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#aaa" },
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function TicketSubmit() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    categoria: "",
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

  function handleCategoria(e: SelectChangeEvent) {
    setForm((prev) => ({ ...prev, categoria: e.target.value as Categoria }));
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
<<<<<<< Updated upstream
      // Substitua pela sua chamada real:
      // await api.post("/manifestacoes", form);
      await new Promise((r) => setTimeout(r, 1000));
      alert("Manifestação enviada com sucesso!");
      navigate("/user");
=======
      const payload: CriarTicketDTO = {
        categoria: form.categoria as Categoria,
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
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
>>>>>>> Stashed changes
    } finally {
      setEnviando(false);
    }
  }

  const formValido =
    form.categoria !== "" &&
    form.titulo.trim() !== "" &&
    form.descricao.trim() !== "";

  return (
    <div>
    <Header/>
    <Box
      sx={{
        minHeight: "90vh",
        bgcolor: "#0A0A0A",
        px: { xs: 2, sm: 4, md: 8, lg: 16 },
        py: { xs: 1, sm: 1 },
        justifyItems: "center"
      }} 
    >
      {/* Voltar */}
      <Button
        startIcon={<ArrowBack />}
        onClick={handleVoltar}
        sx={{
          color: "white",
          textTransform: "none",
          mb: 3,
          pl: 0,
          "&:hover": { bgcolor: "transparent", opacity: 0.7 },
        }}
      >
<<<<<<< Updated upstream
        Voltar
      </Button>
=======
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
>>>>>>> Stashed changes

      {/* Título da página */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
          Nova Manifestação
        </Typography>
        <Typography variant="body2" sx={{ color: "#909090" }}>
          Descreva sua manifestação com o máximo de detalhes possível.
        </Typography>
      </Box>

<<<<<<< Updated upstream
      {/* Card do formulário */}
      <Box
        sx={{
          bgcolor: "#181818",
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          maxWidth: 720,
          width: "100%",
        }}
      >
        <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
          Dados da manifestação
        </Typography>

        <Stack spacing={3}>
          {/* Categoria */}
          <FormControl fullWidth sx={fieldSx}>
            <InputLabel id="categoria-label">Selecione a categoria</InputLabel>
            <Select
              labelId="categoria-label"
              value={form.categoria}
              label="Selecione a categoria"
              onChange={handleCategoria}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: { bgcolor: "#2a2a2a", color: "white" },
                  },
                },
              }}
            >
              {["Reclamação", "Sugestão", "Elogio", "Denúncia", "Solicitação", "Outros"].map(
                (cat) => (
                  <MenuItem
                    key={cat}
                    value={cat}
                    sx={{ "&:hover": { bgcolor: "#3a3a3a" } }}
                  >
                    {cat}
                  </MenuItem>
                )
              )}
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
        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 4, justifyContent:"flex-end" }}
        >

          <Button
            variant="outlined"
            onClick={handleEnviar}
            disabled={!formValido || enviando}
            sx={{
              color: "white",
              borderColor: "white",
              borderRadius: 6,
              px: 3,
              textTransform: "none",
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)", borderColor: "white" },
              "&.Mui-disabled": { borderColor: "#555", color: "#555" },
            }}
          >
            {enviando ? "Enviando..." : "Enviar manifestação"}
          </Button>
        </Stack>
=======
          {/* Card do formulário */}
          <Box sx={{ bgcolor: "#16171d", borderRadius: 3, p: { xs: 3, sm: 4 } }}>
            <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600, mb: 3 }}>
              Dados da manifestação
            </Typography>

            <Stack spacing={3}>
              {/* Categoria */}
              <FormControl fullWidth sx={fieldSx}>
                <InputLabel>Selecione a categoria</InputLabel>
                <Select
                  value={form.categoria}
                  label="Selecione a categoria"
                  onChange={handleCategoria}
                  MenuProps={{
                    slotProps: {
                      paper: {
                        sx: { bgcolor: "#16171d", color: "white", border: "1px solid #2e303a" },
                      },
                    },
                  }}
                >
                  {(["Reclamação", "Sugestão", "Elogio", "Denúncia", "Solicitação", "Outros"] as Categoria[]).map(
                    (cat) => (
                      <MenuItem key={cat} value={cat} sx={{ "&:hover": { bgcolor: "#1f2028" } }}>
                        {cat}
                      </MenuItem>
                    )
                  )}
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
>>>>>>> Stashed changes
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
    </div>
  );
}