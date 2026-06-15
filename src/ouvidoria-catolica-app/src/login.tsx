import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      email,
      senha,
    });
  };

  const preencherDemo = (emailDemo: string) => {
    setEmail(emailDemo);
    setSenha("123456");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Lado esquerdo */}
      <Box
        sx={{
          width: "50%",
          backgroundColor: "#EAEAEA",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          p: 6,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, position: "absolute", top: 48, left: 48 }}>
          <Box
            component="svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            sx={{ width: 24, height: 24 }}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="8" y1="9" x2="16" y2="9" />
            <line x1="8" y1="13" x2="14" y2="13" />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#000",
            }}
          >
            Ouvidoria Digital
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 480 }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "2rem",
              lineHeight: 1.25,
              mb: 2,
            }}
          >
            Sua voz constrói um serviço público melhor.
          </Typography>

          <Typography
            sx={{
              color: "rgba(0,0,0,0.7)",
              fontSize: "0.9375rem",
              lineHeight: 1.6,
            }}
          >
            Registre reclamações, sugestões, elogios, denúncias e
            solicitações. Acompanhe cada manifestação por protocolo,
            com total transparência.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, position: "absolute", bottom: 48, left: 48 }}>
          <Box
            component="svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            sx={{ width: 16, height: 16, flexShrink: 0 }}
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </Box>
          <Typography sx={{ color: "rgba(0,0,0,0.6)", fontSize: "0.875rem" }}>
            Ambiente seguro com controle de acesso por perfil
          </Typography>
        </Box>
      </Box>

      {/* Lado direito */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          bgcolor: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          p: { xs: 4, md: 8 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 460,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "2rem",
              mb: 0.5,
            }}
          >
            Acessar sua conta
          </Typography>

          <Typography
            sx={{
              color: "#9ca3af",
              fontSize: "0.9375rem",
              mb: 3,
            }}
          >
            Informe suas credenciais para continuar.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Typography sx={{ mb: 1, fontSize: "0.875rem", fontWeight: 500 }}>E-mail</Typography>

            <TextField
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "#333",
                  },
                  "&:hover fieldset": {
                    borderColor: "#555",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>Senha</Typography>

              <Typography
                sx={{
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Esqueci minha senha
              </Typography>
            </Box>

            <TextField
              fullWidth
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: "#333",
                  },
                  "&:hover fieldset": {
                    borderColor: "#555",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#fff",
                color: "#000",
                py: 1.2,
                borderRadius: "8px",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "0.875rem",
                mb: 0,
                "&:hover": {
                  bgcolor: "#e5e5e5",
                },
              }}
            >
              Entrar
            </Button>
          </form>

          <Card
            sx={{
              bgcolor: "#0a0a0a",
              color: "#fff",
              borderRadius: "12px",
              border: "1px solid #262626",
              mt: 2,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography
                sx={{
                  color: "#9ca3af",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  mb: 2,
                }}
              >
                Contas de demonstração (senha: 123456)
              </Typography>

              {(
                [
                  ["Usuário", "ana@email.com"],
                  ["Atendente", "atendente@email.com"],
                  ["Administrador", "admin@email.com"],
                ] as [string, string][]
              ).map(([perfil, emailDemo]) => (
                <Box
                  key={perfil}
                  onClick={() => preencherDemo(emailDemo)}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderRadius: "6px",
                    border: "1px solid #222",
                    bgcolor: "#0a0a0a",
                    px: 1.5,
                    py: 1,
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "#1a1a1a",
                      borderColor: "#444",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: "0.9375rem", fontWeight: 500 }}>
                    {perfil}
                  </Typography>

                  <Typography sx={{ color: "#9ca3af", fontSize: "0.8125rem" }}>
                    {emailDemo}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}