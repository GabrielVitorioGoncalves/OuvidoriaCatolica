import { Avatar, Box, Stack, Typography, useMediaQuery, useTheme, Button } from "@mui/material";
import { Chat } from "@mui/icons-material";
import { deepOrange } from "@mui/material/colors";

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        justifyContent: "space-between",
        minHeight: "10vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "#202020",
        px: { xs: 2, sm: 4, md: 8, lg: 24 },
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Chat
          sx={{ color: "white", fontSize: { xs: 20, sm: 28 } }}
        />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", color: "white", whiteSpace: "nowrap" }}
          >
            Ouvidoria Digital
          </Typography>
      </Stack>

      <Button>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center" }}
        >
          <Avatar sx={{ bgcolor: deepOrange[500], width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}>
            T
          </Avatar>

          {!isMobile && (
            <Stack spacing={-1}>
              <Typography variant="subtitle2" sx={{ color: "white" }}>
                Nome usuário
              </Typography>
              <Typography variant="body2" sx={{ color: "#909090" }}>
                Tipo usuário
              </Typography>
            </Stack>
          )}
        </Stack>
      </Button>
    </Box>
  );
}