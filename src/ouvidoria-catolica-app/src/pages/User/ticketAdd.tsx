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
import type { SelectChangeEvent } from "@mui/material";
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

// ─── Estilos compartilhados dos campos ────────────────────────────────────────

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

// ─── Componente principal ──────────────────────────────────────────────────────

export default function TicketSubmit() {
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
      // Substitua pela sua chamada real:
      // await api.post("/manifestacoes", form);
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
        Voltar
      </Button>

      {/* Título da página */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
          Nova Manifestação
        </Typography>
        <Typography variant="body2" sx={{ color: "#909090" }}>
          Descreva sua manifestação com o máximo de detalhes possível.
        </Typography>
      </Box>

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
      </Box>
    </Box>
    </div>
  );
}