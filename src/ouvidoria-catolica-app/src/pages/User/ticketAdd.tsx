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
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Categoria =
  | ""
  | "Reclamação"
  | "Sugestão"
  | "Elogio"
  | "Denúncia"
  | "Solicitação"
  | "Outros";

interface FormData {
  categoria: Categoria;
  titulo: string;
  descricao: string;
}

// ─── Estilos padronizados ────────────────────────────────────────

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

// ─── Componente principal ──────────────────────────────────────────────────────

export default function TicketAdd() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    categoria: "",
    titulo: "",
    descricao: "",
  });

  const [enviando, setEnviando] = useState(false);

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

  async function handleEnviar() {
    if (!form.categoria || !form.titulo.trim() || !form.descricao.trim()) return;

    setEnviando(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      alert("Manifestação enviada com sucesso!");
      navigate("/user");
    } finally {
      setEnviando(false);
    }
  }

  const formValido =
    form.categoria !== "" && form.titulo.trim() !== "" && form.descricao.trim() !== "";

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
          <Box
            sx={{
              bgcolor: "#16171d",
              borderRadius: 3,
              p: { xs: 3, sm: 4 },
            }}
          >
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
                  {["Reclamação", "Sugestão", "Elogio", "Denúncia", "Solicitação", "Outros"].map(
                    (cat) => (
                      <MenuItem
                        key={cat}
                        value={cat}
                        sx={{ "&:hover": { bgcolor: "#1f2028" } }}
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
              sx={{ mt: 4, justifyContent: "flex-end" }}
            >
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
    </Box>
  );
}