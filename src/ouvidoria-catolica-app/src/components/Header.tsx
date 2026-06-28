// src/components/Header.tsx
import { useState } from "react";
import { Avatar, Box, Button, ClickAwayListener, Paper, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Chat, LogoutOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getUserSession, getRoleLabel, getAvatarLetter, clearUserSession } from "../infra/UserSession";

const AVATAR_COLORS: Record<number, string> = {
  1: "#2563eb",
  2: "#7c3aed",
  3: "#b45309",
};

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  const session = getUserSession();
  const name = session?.name ?? "Usuário";
  const role = session?.role ?? 1;
  const avatarLetter = getAvatarLetter(name);
  const roleLabel = getRoleLabel(role);
  const avatarColor = AVATAR_COLORS[role] ?? "#2563eb";

  function handleLogout() {
    clearUserSession();
    navigate("/");
  }

  return (
    <Box
      sx={{
        justifyContent: "space-between",
        minHeight: "10vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "#16171d",
        borderBottom: "1px solid #2e303a",
        px: { xs: 2, sm: 4, md: 8, lg: 24 },
        position: "relative",
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Chat sx={{ color: "white", fontSize: { xs: 20, sm: 28 } }} />
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "white", whiteSpace: "nowrap" }}>
          Ouvidoria Digital
        </Typography>
      </Stack>

      <ClickAwayListener onClickAway={() => setMenuAberto(false)}>
        <Box sx={{ position: "relative" }}>
          <Button
            onClick={() => setMenuAberto((prev) => !prev)}
            sx={{ textTransform: "none", borderRadius: 2, px: 1, "&:hover": { bgcolor: "#1f2028" } }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Avatar
                sx={{ bgcolor: avatarColor, width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, fontSize: { xs: 14, sm: 18 }, fontWeight: 700 }}
              >
                {avatarLetter}
              </Avatar>
              {!isMobile && (
                <Stack spacing={0} sx={{ alignItems: "flex-start" }}>
                  <Typography variant="subtitle2" sx={{ color: "white", fontWeight: 600 }}>{name}</Typography>
                  <Typography variant="body2" sx={{ color: "#9ca3af" }}>{roleLabel}</Typography>
                </Stack>
              )}
            </Stack>
          </Button>

          {menuAberto && (
            <Paper
              sx={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                bgcolor: "#16171d",
                border: "1px solid #2e303a",
                borderRadius: 2,
                minWidth: 180,
                overflow: "hidden",
                zIndex: 1000,
              }}
            >
              <Button
                fullWidth
                startIcon={<LogoutOutlined />}
                onClick={handleLogout}
                sx={{ color: "#f87171", textTransform: "none", justifyContent: "flex-start", px: 2, py: 1.5, borderRadius: 0, "&:hover": { bgcolor: "#1f2028" } }}
              >
                Sair
              </Button>
            </Paper>
          )}
        </Box>
      </ClickAwayListener>
    </Box>
  );
}