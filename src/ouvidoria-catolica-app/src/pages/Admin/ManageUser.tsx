import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  keyframes,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { Add, EditRounded, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const SETORES = ["Administração", "Financeiro", "Infraestrutura", "Recursos Humanos", "Biblioteca", "TI"];

const perfilLabel: Record<string, string> = {
  usuario: "Usuário",
  atendente: "Atendente",
  administrador: "Administrador",
};

const MOCK_USUARIOS = [
  { id: "1", nome: "João Silva", email: "joao@email.com", perfil: "administrador", ativo: true },
  { id: "2", nome: "Maria Souza", email: "maria@email.com", perfil: "atendente", setor: "Saúde", ativo: true },
  { id: "3", nome: "Carlos Lima", email: "carlos@email.com", perfil: "usuario", ativo: false },
  { id: "4", nome: "Ana Beatriz Costa", email: "ana.costa@email.com", perfil: "atendente", setor: "Educação", ativo: true },
  { id: "5", nome: "Pedro Henrique Santos", email: "pedro.santos@email.com", perfil: "usuario", ativo: true },
  { id: "6", nome: "Fernanda Oliveira", email: "fernanda.oliveira@email.com", perfil: "atendente", setor: "Financeiro", ativo: true },
  { id: "7", nome: "Lucas Mendes", email: "lucas.mendes@email.com", perfil: "administrador", ativo: true },
  { id: "8", nome: "Juliana Ferreira", email: "juliana.ferreira@email.com", perfil: "usuario", ativo: false },
  { id: "9", nome: "Roberto Almeida", email: "roberto.almeida@email.com", perfil: "atendente", setor: "Infraestrutura", ativo: true },
  { id: "10", nome: "Camila Rodrigues", email: "camila.rodrigues@email.com", perfil: "usuario", ativo: true },
  { id: "11", nome: "Rafael Costa", email: "rafael.costa@email.com", perfil: "atendente", setor: "Recursos Humanos", ativo: true },
  { id: "12", nome: "Beatriz Lima", email: "beatriz.lima@email.com", perfil: "usuario", ativo: false },
];

const formVazio = {
  nome: "",
  email: "",
  senha: "",
  perfil: "usuario" as const,
  setor: "",
  ativo: true,
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function ManageUser() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const [usuarios, setUsuarios] = useState(MOCK_USUARIOS);
  const [aberto, setAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(formVazio);
  const [toast, setToast] = useState({ open: false, mensagem: "" });

  function abrirNovo() {
    setEditandoId(null);
    setForm(formVazio);
    setAberto(true);
  }

  function abrirEdicao(u: any) {
    setEditandoId(u.id);
    setForm({
      nome: u.nome,
      email: u.email,
      senha: "",
      perfil: u.perfil,
      setor: u.setor ?? "",
      ativo: u.ativo,
    });
    setAberto(true);
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim()) return;

    if (editandoId) {
      setUsuarios(
        usuarios.map((u) =>
          u.id === editandoId ? { ...u, ...form, setor: form.perfil === "atendente" ? form.setor : undefined } : u
        )
      );
      setToast({ open: true, mensagem: "Usuário atualizado com sucesso!" });
    } else {
      setUsuarios([
        ...usuarios,
        {
          id: Math.random().toString(36).substring(2),
          ...form,
          setor: form.perfil === "atendente" ? form.setor : undefined,
        },
      ]);
      setToast({ open: true, mensagem: "Usuário criado com sucesso!" });
    }
    setAberto(false);
  }

  function fecharToast(event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") return;
    setToast({ ...toast, open: false });
  }

  const isFormValido = form.nome.trim() !== "" && form.email.trim() !== "";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#090a0f", pb: 10 }}>
      <style>
        {`
          @keyframes fadeBackdrop {
            from { opacity: 0; backdrop-filter: blur(0px); }
            to { opacity: 1; backdrop-filter: blur(8px); }
          }
          @keyframes popModal {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .custom-input {
            background-color: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            padding: 10px 14px;
            color: #f3f4f6;
            font-size: 14px;
            outline: none;
            transition: all 0.2s;
            width: 100%;
            box-sizing: border-box;
          }
          .custom-input:focus {
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
            background-color: rgba(255, 255, 255, 0.06);
          }
          .custom-select {
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
          }
          .btn-save {
            background: #27272a;
            color: #ffffff;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .btn-save:hover:not(:disabled) {
            background: #3f3f46;
            border-color: rgba(255,255,255,0.2);
          }
          .btn-save:disabled {
            background: rgba(255, 255, 255, 0.02);
            color: #6b7280;
            border-color: transparent;
            cursor: not-allowed;
          }
          .btn-cancel {
            background: transparent;
            color: #9ca3af;
            border: none;
            border-radius: 8px;
            padding: 10px 16px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .btn-cancel:hover {
            color: #f3f4f6;
            background: rgba(255, 255, 255, 0.05);
          }
          .btn-close {
            background: transparent;
            border: none;
            color: #9ca3af;
            border-radius: 6px;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            padding: 0;
          }
          .btn-close:hover {
            background: rgba(255, 255, 255, 0.05);
            color: #f3f4f6;
          }
        `}
      </style>

      <Header />
      
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          width: "100%",
          px: { xs: 2, sm: 4, md: 5 },
          py: { xs: 4, sm: 5 },
          animation: `${fadeIn} 0.4s ease-out`,
        }}
      >
        <Button
          startIcon={<ArrowBack fontSize="small" />}
          onClick={() => navigate("/admin")}
          sx={{
            color: "#6b7280",
            textTransform: "none",
            mb: 4,
            px: 0,
            fontWeight: 500,
            transition: "0.2s",
            "&:hover": { color: "#e5e7eb", bgcolor: "transparent", transform: "translateX(-4px)" },
          }}
        >
          Voltar para Visão Geral
        </Button>

        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 3,
            mb: 5,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ color: "#f9fafb", fontWeight: 700, mb: 1, letterSpacing: "-0.5px" }}>
              Gestão de Usuários
            </Typography>
            <Typography variant="body1" sx={{ color: "#9ca3af" }}>
              Administre os acessos, perfis e permissões da equipe.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={abrirNovo}
            sx={{
              bgcolor: "#18181b",
              color: "#ffffff",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.05)",
              px: 2,
              py: 0.6,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.9rem",
              boxShadow: "none",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#27272a",
                boxShadow: "none",
              },
            }}
          >
            Adicionar Usuário
          </Button>
        </Box>

        {isMobileOrTablet ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2.5,
              justifyContent: "center",
            }}
          >
            {usuarios.map((u) => (
              <Box
                key={u.id}
                sx={{
                  bgcolor: "#111318",
                  border: "1px solid",
                  borderColor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "16px",
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      color: "#f3f4f6",
                      width: 48,
                      height: 48,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      borderRadius: "12px",
                    }}
                  >
                    {u.nome.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0, pr: 4 }}>
                    <Typography variant="subtitle1" noWrap sx={{ color: "#f3f4f6", fontWeight: 600, lineHeight: 1.2, mb: 0.5 }}>
                      {u.nome}
                    </Typography>
                    <Typography variant="body2" noWrap sx={{ color: "#6b7280" }}>
                      {u.email}
                    </Typography>
                  </Box>
                  
                  <Tooltip title="Editar" placement="top">
                    <IconButton
                      className="action-btn"
                      onClick={() => abrirEdicao(u)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        bgcolor: "transparent",
                        color: "#d1d5db",
                        opacity: 1,
                        boxShadow: "none",
                        transition: "all 0.2s",
                        "&:hover": { bgcolor: "#232326", color: "#ffffff" },
                      }}
                    >
                      <EditRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: "auto" }}>
                  <Chip
                    label={perfilLabel[u.perfil]}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      color: "#d1d5db",
                      fontWeight: 500,
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.05)"
                    }}
                  />
                  {u.setor && (
                    <Chip
                      label={u.setor}
                      size="small"
                      sx={{
                        bgcolor: "transparent",
                        color: "#9ca3af",
                        fontWeight: 500,
                        borderRadius: "8px",
                        border: "1px dashed rgba(255,255,255,0.15)"
                      }}
                    />
                  )}
                  <Chip
                    label={u.ativo ? "Ativo" : "Inativo"}
                    size="small"
                    sx={{
                      ml: "auto",
                      bgcolor: u.ativo ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      color: u.ativo ? "#34d399" : "#f87171",
                      fontWeight: 600,
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: u.ativo ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <TableContainer
            sx={{
              bgcolor: "#111318",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
                  <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#9ca3af", fontWeight: 600, py: 2.5, px: 3 }}>Usuário</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#9ca3af", fontWeight: 600, py: 2.5 }}>Perfil</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#9ca3af", fontWeight: 600, py: 2.5 }}>Setor</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#9ca3af", fontWeight: 600, py: 2.5 }}>Situação</TableCell>
                  <TableCell align="right" sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#9ca3af", fontWeight: 600, py: 2.5, px: 3 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow
                    key={u.id}
                    sx={{
                      transition: "all 0.2s",
                      "& td": { borderBottom: "1px solid rgba(255,255,255,0.03)", py: 2 },
                      "&:last-child td": { borderBottom: "none" },
                      "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                    }}
                  >
                    <TableCell sx={{ px: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: "rgba(255, 255, 255, 0.05)",
                            color: "#f3f4f6",
                            width: 44,
                            height: 44,
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            borderRadius: "10px",
                          }}
                        >
                          {u.nome.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: "#f3f4f6" }}>
                            {u.nome}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "0.85rem" }}>
                            {u.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={perfilLabel[u.perfil]}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.05)",
                          color: "#d1d5db",
                          fontWeight: 500,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                        {u.setor || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={u.ativo ? "Ativo" : "Inativo"}
                        size="small"
                        sx={{
                          bgcolor: u.ativo ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                          color: u.ativo ? "#34d399" : "#f87171",
                          fontWeight: 600,
                          borderRadius: "6px",
                          border: "1px solid",
                          borderColor: u.ativo ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                        }}
                      />
                    </TableCell>

                    <TableCell align="right" sx={{ px: 3 }}>
                      <Tooltip title="Editar" placement="left">
                        <IconButton
                          className="action-btn"
                          onClick={() => abrirEdicao(u)}
                          sx={{
                            color: "#d1d5db",
                            bgcolor: "transparent",
                            opacity: 1,
                            boxShadow: "none",
                            transition: "all 0.2s",
                            "&:hover": { color: "#ffffff", bgcolor: "#232326" },
                          }}
                        >
                          <EditRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {aberto && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px",
          animation: "fadeBackdrop 0.3s forwards"
        }}>
          <div style={{
            backgroundColor: "#111318",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "380px",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Inter, sans-serif",
            color: "#f3f4f6",
            animation: "popModal 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          }}>
            
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "16px 20px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div>
                <h2 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                  {editandoId ? "Editar Usuário" : "Novo Usuário"}
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>
                  {editandoId 
                    ? "Atualize as informações e acessos." 
                    : "Preencha os dados do novo membro."}
                </p>
              </div>
              <button className="btn-close" onClick={() => setAberto(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={salvar} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 500, color: "#d1d5db" }}>Nome Completo</label>
                <input 
                  type="text" 
                  className="custom-input"
                  placeholder="Ex: João da Silva"
                  value={form.nome} 
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 500, color: "#d1d5db" }}>E-mail</label>
                <input 
                  type="email" 
                  className="custom-input"
                  placeholder="joao@empresa.com"
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 500, color: "#d1d5db" }}>Senha</label>
                <input 
                  type="password" 
                  className="custom-input"
                  placeholder="••••••••"
                  value={form.senha} 
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 500, color: "#d1d5db" }}>Perfil</label>
                <select 
                  className="custom-input custom-select"
                  value={form.perfil} 
                  onChange={(e) => setForm({ ...form, perfil: e.target.value as any })}
                >
                  <option value="administrador" style={{ backgroundColor: "#1f2937" }}>Administrador</option>
                  <option value="atendente" style={{ backgroundColor: "#1f2937" }}>Atendente</option>
                  <option value="usuario" style={{ backgroundColor: "#1f2937" }}>Usuário Comum</option>
                </select>
              </div>

              {editandoId && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 500, color: "#d1d5db" }}>Situação</label>
                  <select 
                    className="custom-input custom-select"
                    value={form.ativo ? "ativo" : "inativo"} 
                    onChange={(e) => setForm({ ...form, ativo: e.target.value === "ativo" })}
                    style={{ borderColor: form.ativo ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)" }}
                  >
                    <option value="ativo" style={{ backgroundColor: "#1f2937" }}>Ativo</option>
                    <option value="inativo" style={{ backgroundColor: "#1f2937" }}>Inativo</option>
                  </select>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setAberto(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-save"
                  disabled={!isFormValido}
                >
                  Salvar
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={fecharToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={fecharToast} 
          severity="success" 
          variant="filled"
          sx={{ 
            width: "100%", 
            bgcolor: "#059669", 
            color: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            "& .MuiAlert-icon": { color: "#ffffff" }
          }}
        >
          {toast.mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}