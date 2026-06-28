import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { Add, EditRounded, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { httpClient } from "../../infra/AxiosAdapter";
import { Sector } from "../../services/TicketService";
import type { SectorType } from "../../services/TicketService";

// ─── Service inline (crie um UserService.ts separado se preferir) ─────────────

const Role = { Common: 1, Attendant: 2, Admin: 3 } as const;
type RoleType = typeof Role[keyof typeof Role];

interface UsuarioResponse {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  sector?: SectorType;
  isActive: boolean;
  createdAt: string;
}

interface CriarUsuarioDTO {
  name: string;
  email: string;
  password: string;
  role: RoleType;
  sector?: SectorType;
}

interface AtualizarUsuarioDTO {
  name: string;
  email: string;
  role: RoleType;
  sector?: SectorType;
  isActive: boolean;
}

async function listarUsuarios(): Promise<UsuarioResponse[]> {
  return httpClient.get<UsuarioResponse[]>("/users");
}

async function criarUsuario(dados: CriarUsuarioDTO): Promise<UsuarioResponse> {
  return httpClient.post<UsuarioResponse>("/users", dados);
}

async function atualizarUsuario(id: string, dados: AtualizarUsuarioDTO): Promise<UsuarioResponse> {
  return httpClient.put<UsuarioResponse>(`/users/${id}`, dados);
}

// ─── Dicionários de exibição ──────────────────────────────────────────────────

const roleLabel: Record<number, string> = {
  1: "Usuário",
  2: "Atendente",
  3: "Administrador",
};

const sectorLabel: Record<number, string> = {
  [Sector.GeneralService]: "Serviços Gerais",
  [Sector.Financial]: "Financeiro",
  [Sector.Infrastructure]: "Infraestrutura",
  [Sector.HumanResources]: "Recursos Humanos",
  [Sector.Health]: "Saúde",
  [Sector.Education]: "Educação",
};

const setores = [
  { id: Sector.GeneralService, nome: "Serviços Gerais" },
  { id: Sector.Financial, nome: "Financeiro" },
  { id: Sector.Infrastructure, nome: "Infraestrutura" },
  { id: Sector.HumanResources, nome: "Recursos Humanos" },
  { id: Sector.Health, nome: "Saúde" },
  { id: Sector.Education, nome: "Educação" },
];

// ─── Form inicial ─────────────────────────────────────────────────────────────

const formVazio = {
  name: "",
  email: "",
  password: "",
  role: 1 as RoleType,
  sector: undefined as SectorType | undefined,
  isActive: true,
};

// ─── Animação ─────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ─── Componente ───────────────────────────────────────────────────────────────

export default function ManageUser() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [aberto, setAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(formVazio);
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState({ open: false, mensagem: "", erro: false });

  useEffect(() => {
    listarUsuarios()
      .then(setUsuarios)
      .catch(() => setToast({ open: true, mensagem: "Erro ao carregar usuários.", erro: true }))
      .finally(() => setLoading(false));
  }, []);

  function abrirNovo() {
    setEditandoId(null);
    setForm(formVazio);
    setAberto(true);
  }

  function abrirEdicao(u: UsuarioResponse) {
    setEditandoId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      sector: u.sector,
      isActive: u.isActive,
    });
    setAberto(true);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    setSalvando(true);
    try {
      if (editandoId) {
        const atualizado = await atualizarUsuario(editandoId, {
          name: form.name,
          email: form.email,
          role: form.role,
          sector: form.role === Role.Attendant ? form.sector : undefined,
          isActive: form.isActive,
        });
        setUsuarios(usuarios.map((u) => (u.id === editandoId ? atualizado : u)));
        setToast({ open: true, mensagem: "Usuário atualizado com sucesso!", erro: false });
      } else {
        const novo = await criarUsuario({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          sector: form.role === Role.Attendant ? form.sector : undefined,
        });
        setUsuarios([...usuarios, novo]);
        setToast({ open: true, mensagem: "Usuário criado com sucesso!", erro: false });
      }
      setAberto(false);
    } catch {
      setToast({ open: true, mensagem: "Erro ao salvar usuário. Tente novamente.", erro: true });
    } finally {
      setSalvando(false);
    }
  }

  function fecharToast(_event?: React.SyntheticEvent | Event, reason?: string) {
    if (reason === "clickaway") return;
    setToast({ ...toast, open: false });
  }

  const isFormValido = form.name.trim() !== "" && form.email.trim() !== "";

  // ─── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#090a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: "#6b7280" }} />
      </Box>
    );
  }

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
              "&:hover": { bgcolor: "#27272a", boxShadow: "none" },
            }}
          >
            Adicionar Usuário
          </Button>
        </Box>

        {/* ─── Cards (mobile/tablet) ─────────────────────────────────────── */}
        {isMobileOrTablet ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2.5,
            }}
          >
            {usuarios.map((u) => (
              <Box
                key={u.id}
                sx={{
                  bgcolor: "#111318",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "16px",
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transition: "all 0.3s",
                  "&:hover": { borderColor: "rgba(255,255,255,0.15)" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      color: "#f3f4f6",
                      width: 48,
                      height: 48,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      borderRadius: "12px",
                    }}
                  >
                    {u.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0, pr: 4 }}>
                    <Typography variant="subtitle1" noWrap sx={{ color: "#f3f4f6", fontWeight: 600, lineHeight: 1.2, mb: 0.5 }}>
                      {u.name}
                    </Typography>
                    <Typography variant="body2" noWrap sx={{ color: "#6b7280" }}>
                      {u.email}
                    </Typography>
                  </Box>

                  <Tooltip title="Editar" placement="top">
                    <IconButton
                      onClick={() => abrirEdicao(u)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        color: "#d1d5db",
                        "&:hover": { bgcolor: "#232326", color: "#ffffff" },
                      }}
                    >
                      <EditRounded fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: "auto" }}>
                  <Chip
                    label={roleLabel[u.role]}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      color: "#d1d5db",
                      fontWeight: 500,
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  />
                  {u.sector && (
                    <Chip
                      label={sectorLabel[u.sector]}
                      size="small"
                      sx={{
                        bgcolor: "transparent",
                        color: "#9ca3af",
                        fontWeight: 500,
                        borderRadius: "8px",
                        border: "1px dashed rgba(255,255,255,0.15)",
                      }}
                    />
                  )}
                  <Chip
                    label={u.isActive ? "Ativo" : "Inativo"}
                    size="small"
                    sx={{
                      ml: "auto",
                      bgcolor: u.isActive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                      color: u.isActive ? "#34d399" : "#f87171",
                      fontWeight: 600,
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: u.isActive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          /* ─── Tabela (desktop) ──────────────────────────────────────────── */
          <TableContainer
            sx={{
              bgcolor: "#111318",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.05)",
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
                            bgcolor: "rgba(255,255,255,0.05)",
                            color: "#f3f4f6",
                            width: 44,
                            height: 44,
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            borderRadius: "10px",
                          }}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: "#f3f4f6" }}>
                            {u.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "0.85rem" }}>
                            {u.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={roleLabel[u.role]}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.05)",
                          color: "#d1d5db",
                          fontWeight: 500,
                          borderRadius: "6px",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                        {u.sector ? sectorLabel[u.sector] : "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={u.isActive ? "Ativo" : "Inativo"}
                        size="small"
                        sx={{
                          bgcolor: u.isActive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                          color: u.isActive ? "#34d399" : "#f87171",
                          fontWeight: 600,
                          borderRadius: "6px",
                          border: "1px solid",
                          borderColor: u.isActive ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)",
                        }}
                      />
                    </TableCell>

                    <TableCell align="right" sx={{ px: 3 }}>
                      <Tooltip title="Editar" placement="left">
                        <IconButton
                          onClick={() => abrirEdicao(u)}
                          sx={{
                            color: "#d1d5db",
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

      {/* ─── Modal ──────────────────────────────────────────────────────────── */}
      {aberto && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "16px",
          animation: "fadeBackdrop 0.3s forwards",
        }}>
          <div style={{
            backgroundColor: "#111318",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "380px",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Inter, sans-serif",
            color: "#f3f4f6",
            animation: "popModal 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}>

            {/* Header do modal */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "16px 20px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              <div>
                <h2 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600 }}>
                  {editandoId ? "Editar Usuário" : "Novo Usuário"}
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>
                  {editandoId ? "Atualize as informações e acessos." : "Preencha os dados do novo membro."}
                </p>
              </div>
              <button className="btn-close" onClick={() => setAberto(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={salvar} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 500, color: "#d1d5db" }}>Nome Completo</label>
                <input
                  type="text"
                  className="custom-input"
                  placeholder="Ex: João da Silva"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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

              {/* Senha só aparece na criação */}
              {!editandoId && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 500, color: "#d1d5db" }}>Senha</label>
                  <input
                    type="password"
                    className="custom-input"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "13px", fontWeight: 500, color: "#d1d5db" }}>Perfil</label>
                <select
                  className="custom-input custom-select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: Number(e.target.value) as RoleType, sector: undefined })}
                >
                  <option value={Role.Admin} style={{ backgroundColor: "#1f2937" }}>Administrador</option>
                  <option value={Role.Attendant} style={{ backgroundColor: "#1f2937" }}>Atendente</option>
                  <option value={Role.Common} style={{ backgroundColor: "#1f2937" }}>Usuário Comum</option>
                </select>
              </div>

              {/* Setor só aparece se for Atendente */}
              {form.role === Role.Attendant && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 500, color: "#d1d5db" }}>Setor</label>
                  <select
                    className="custom-input custom-select"
                    value={form.sector ?? ""}
                    onChange={(e) => setForm({ ...form, sector: Number(e.target.value) as SectorType })}
                  >
                    <option value="" disabled style={{ backgroundColor: "#1f2937" }}>Selecione um setor</option>
                    {setores.map((s) => (
                      <option key={s.id} value={s.id} style={{ backgroundColor: "#1f2937" }}>{s.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Situação só aparece na edição */}
              {editandoId && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 500, color: "#d1d5db" }}>Situação</label>
                  <select
                    className="custom-input custom-select"
                    value={form.isActive ? "ativo" : "inativo"}
                    onChange={(e) => setForm({ ...form, isActive: e.target.value === "ativo" })}
                    style={{ borderColor: form.isActive ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)" }}
                  >
                    <option value="ativo" style={{ backgroundColor: "#1f2937" }}>Ativo</option>
                    <option value="inativo" style={{ backgroundColor: "#1f2937" }}>Inativo</option>
                  </select>
                </div>
              )}

              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                marginTop: "8px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}>
                <button type="button" className="btn-cancel" onClick={() => setAberto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={!isFormValido || salvando}>
                  {salvando ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Toast ──────────────────────────────────────────────────────────── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={fecharToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={fecharToast}
          severity={toast.erro ? "error" : "success"}
          variant="filled"
          sx={{
            width: "100%",
            bgcolor: toast.erro ? "#dc2626" : "#059669",
            color: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            "& .MuiAlert-icon": { color: "#ffffff" },
          }}
        >
          {toast.mensagem}
        </Alert>
      </Snackbar>
    </Box>
  );
}