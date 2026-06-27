// src/components/Header.tsx
import { Avatar, Box, Stack, Typography, useMediaQuery, useTheme, Button } from "@mui/material";
import { Chat } from "@mui/icons-material";
import { getUserSession, getRoleLabel, getAvatarLetter } from "../infra/UserSession";

// Cores do avatar por role
const AVATAR_COLORS: Record<number, string> = {
  1: "#2563eb", // Usuário — azul
  2: "#7c3aed", // Atendente — roxo
  3: "#b45309", // Administrador — âmbar
};

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const session = getUserSession();
  const name = session?.name ?? "Usuário";
  const role = session?.role ?? 1;
  const avatarLetter = getAvatarLetter(name);
  const roleLabel = getRoleLabel(role);
  const avatarColor = AVATAR_COLORS[role] ?? "#2563eb";

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
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Chat sx={{ color: "white", fontSize: { xs: 20, sm: 28 } }} />
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "white", whiteSpace: "nowrap" }}
        >
          Ouvidoria Digital
        </Typography>
      </Stack>

      <Button
        sx={{
          textTransform: "none",
          borderRadius: 2,
          px: 1,
          "&:hover": { bgcolor: "#1f2028" },
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: avatarColor,
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              fontSize: { xs: 14, sm: 18 },
              fontWeight: 700,
            }}
          >
            {avatarLetter}
          </Avatar>

          {!isMobile && (
            <Stack spacing={0} sx={{ alignItems: "flex-start" }}>
              <Typography variant="subtitle2" sx={{ color: "white", fontWeight: 600 }}>
                {name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                {roleLabel}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Button>
    </Box>
  );
}