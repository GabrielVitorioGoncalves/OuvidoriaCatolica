import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  FormControlLabel
} from "@mui/material";

import { AuthService } from "./services/AuthService";
import { httpClient } from "./infra/AxiosAdapter";

const authService = new AuthService(httpClient);

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isPrimeiroAcesso, setIsPrimeiroAcesso] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    console.log("DADOS INDO PRO BACK:", { email: email, password: senha });

    try {
      if (isPrimeiroAcesso) {
        await authService.createPassword({ email: email, password: senha });
        alert('Senha cadastrada com sucesso! Agora você já pode fazer o login.');
        setIsPrimeiroAcesso(false); 
        setSenha("");
      } else {
        const resposta = await authService.login({ email: email, password: senha });
        localStorage.setItem('@Ouvidoria:token', resposta.token);
        alert('Login feito com sucesso!');
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErro("Credenciais inválidas ou erro no servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", overflow: "hidden" }}>
      {/* Lado esquerdo */}
      <Box sx={{ width: "50%", backgroundColor: "#EAEAEA", display: { xs: "none", md: "flex" }, flexDirection: "column", justifyContent: "center", position: "relative", p: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, position: "absolute", top: 48, left: 48 }}>
          <Box component="svg" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" sx={{ width: 24, height: 24 }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="8" y1="9" x2="16" y2="9" />
            <line x1="8" y1="13" x2="14" y2="13" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000" }}>Ouvidoria Digital</Typography>
        </Box>

        <Box sx={{ maxWidth: 480 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "2rem", lineHeight: 1.25, mb: 2 }}>
            Sua voz constrói um serviço público melhor.
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.7)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
            Registre reclamações, sugestões, elogios, denúncias e solicitações. Acompanhe cada manifestação por protocolo, com total transparência.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, position: "absolute", bottom: 48, left: 48 }}>
          <Box component="svg" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" sx={{ width: 16, height: 16, flexShrink: 0 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </Box>
          <Typography sx={{ color: "rgba(0,0,0,0.6)", fontSize: "0.875rem" }}>Ambiente seguro com controle de acesso por perfil</Typography>
        </Box>
      </Box>

      {/* Lado direito */}
      <Box sx={{ width: { xs: "100%", md: "50%" }, bgcolor: "#000", color: "#fff", display: "flex", alignItems: "center", p: { xs: 4, md: 8 } }}>
        <Box sx={{ width: "100%", maxWidth: 460 }}>
          
          <Typography sx={{ fontWeight: 700, fontSize: "2rem", mb: 0.5 }}>
            {isPrimeiroAcesso ? "Crie sua senha" : "Acessar sua conta"}
          </Typography>

          <Typography sx={{ color: "#9ca3af", fontSize: "0.9375rem", mb: 3 }}>
            {isPrimeiroAcesso ? "Defina uma senha segura para o seu primeiro acesso." : "Informe suas credenciais para continuar."}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Typography sx={{ mb: 1, fontSize: "0.875rem", fontWeight: 500 }}>E-mail</Typography>
            <TextField fullWidth value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" variant="outlined" sx={{ mb: 2, "& .MuiOutlinedInput-root": { color: "#fff", borderRadius: "8px", "& fieldset": { borderColor: "#333" }, "&:hover fieldset": { borderColor: "#555" }, "&.Mui-focused fieldset": { borderColor: "#fff" } } }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                {isPrimeiroAcesso ? "Nova Senha" : "Senha"}
              </Typography>
              {!isPrimeiroAcesso && (
                <Typography sx={{ cursor: "pointer", fontSize: "0.75rem", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}>
                  Esqueci minha senha
                </Typography>
              )}
            </Box>

            <TextField fullWidth type="password" value={senha} onChange={(e) => setSenha(e.target.value)} variant="outlined" sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { color: "#fff", borderRadius: "8px", "& fieldset": { borderColor: "#333" }, "&:hover fieldset": { borderColor: "#555" }, "&.Mui-focused fieldset": { borderColor: "#fff" } } }} />

            <FormControlLabel
              control={
                <Switch 
                  checked={isPrimeiroAcesso} 
                  onChange={(e) => setIsPrimeiroAcesso(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#fff' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#555' },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Primeiro acesso</Typography>}
              sx={{ mb: 2, display: 'block' }}
            />

            {erro && <Typography sx={{ color: "#ef4444", fontSize: "0.875rem", mb: 2 }}>{erro}</Typography>}

            <Button type="submit" fullWidth disabled={loading} variant="contained" sx={{ bgcolor: "#fff", color: "#000", py: 1.2, borderRadius: "8px", fontWeight: "bold", textTransform: "none", fontSize: "0.875rem", mb: 0, "&:hover": { bgcolor: "#e5e5e5" }, "&.Mui-disabled": { bgcolor: "#cccccc", color: "#666666" } }}>
              {loading ? "Carregando..." : isPrimeiroAcesso ? "Cadastrar" : "Entrar"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}