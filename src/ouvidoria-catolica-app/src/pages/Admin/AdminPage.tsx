import { useMemo } from "react"
import { Box, Button, Grid, Stack, Typography, keyframes } from "@mui/material"
import {
  PeopleAltOutlined,
  DescriptionOutlined,
  Timeline,
  CheckCircle,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import Header from "../../components/Header"

const MOCK_CATEGORIAS = [
  { label: "Reclamação", valor: 1 },
  { label: "Sugestão", valor: 1 },
  { label: "Elogio", valor: 1 },
  { label: "Denúncia", valor: 1 },
  { label: "Solicitação", valor: 1 },
  { label: "Outros", valor: 0 },
]

const MOCK_STATUS = [
  { label: "Aberta", valor: 1, color: "#93c5fd", bg: "rgba(147, 197, 253, 0.15)" },
  { label: "Em análise", valor: 1, color: "#fde047", bg: "rgba(253, 224, 71, 0.15)" },
  { label: "Em atendimento", valor: 1, color: "#d8b4fe", bg: "rgba(216, 180, 254, 0.15)" },
  { label: "Encaminhada", valor: 1, color: "#e879f9", bg: "rgba(232, 121, 249, 0.15)" },
  { label: "Respondida", valor: 0, color: "#5eead4", bg: "rgba(94, 234, 212, 0.15)" },
  { label: "Concluída", valor: 1, color: "#86efac", bg: "rgba(134, 239, 172, 0.15)" },
]

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export default function AdminPage() {
  const navigate = useNavigate()

  const maxCategoria = useMemo(() => {
    const max = Math.max(...MOCK_CATEGORIAS.map((c) => c.valor))
    return max > 0 ? max : 1
  }, [])

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0a" }}>
      <Header />
      
      <Box 
        sx={{ 
          maxWidth: 1200, 
          mx: "auto", 
          width: "100%", 
          px: { xs: 2, sm: 4, md: 6 }, 
          py: { xs: 4, sm: 6 } 
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 5,
            animation: `${fadeUp} 0.5s ease-out both`,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
              Visão Geral
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
              Indicadores gerais do sistema de ouvidoria.
            </Typography>
          </Box>
          <Button
            startIcon={<PeopleAltOutlined />}
            onClick={() => navigate("/admin/manageuser")}
            sx={{
              color: "white",
              px: 2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2 },
            }}
          >
            Gerenciar usuários
          </Button>
        </Box>

        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          sx={{ mb: 3 }}
        >
          <Grid
            size={{ xs: 12, sm: 6, lg: 3 }}
            sx={{
              display: "flex",
              animation: `${fadeUp} 0.5s ease-out 0.1s both`,
            }}
          >
            <IndicadorCard
              icone={DescriptionOutlined}
              label="Total de manifestações"
              valor={5}
            />
          </Grid>

          <Grid
            size={{ xs: 12, sm: 6, lg: 3 }}
            sx={{
              display: "flex",
              animation: `${fadeUp} 0.5s ease-out 0.2s both`,
            }}
          >
            <IndicadorCard
              icone={Timeline}
              label="Em andamento"
              valor={3}
            />
          </Grid>

          <Grid
            size={{ xs: 12, sm: 6, lg: 3 }}
            sx={{
              display: "flex",
              animation: `${fadeUp} 0.5s ease-out 0.3s both`,
            }}
          >
            <IndicadorCard
              icone={CheckCircle}
              label="Concluídas"
              valor={1}
            />
          </Grid>

          <Grid
            size={{ xs: 12, sm: 6, lg: 3 }}
            sx={{
              display: "flex",
              animation: `${fadeUp} 0.5s ease-out 0.4s both`,
            }}
          >
            <IndicadorCard
              icone={PeopleAltOutlined}
              label="Usuários cadastrados"
              valor={5}
            />
          </Grid>
        </Grid>

        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
        >
          <Grid
            size={{ xs: 12, lg: 6 }}
            sx={{
              display: "flex",
              animation: `${fadeUp} 0.5s ease-out 0.5s both`,
            }}
          >
            <Box
              sx={{
                bgcolor: "#16171d",
                borderRadius: 3,
                p: 4,
                width: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  mb: 4,
                }}
              >
                Manifestações por categoria
              </Typography>

              <Stack spacing={3}>
                {MOCK_CATEGORIAS.map((c, index) => (
                  <Box key={c.label}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#d1d5db",
                          fontWeight: 500,
                        }}
                      >
                        {c.label}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "white",
                          fontWeight: 700,
                        }}
                      >
                        {c.valor}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        height: 6,
                        bgcolor: "#2e303a",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          bgcolor: "white",
                          borderRadius: 4,
                          width: `${(c.valor / maxCategoria) * 100}%`,
                          transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                          animationDelay: `${0.5 + index * 0.1}s`,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid
            size={{ xs: 12, lg: 6 }}
            sx={{
              display: "flex",
              animation: `${fadeUp} 0.5s ease-out 0.6s both`,
            }}
          >
            <Box
              sx={{
                bgcolor: "#16171d",
                borderRadius: 3,
                p: 4,
                width: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: "white",
                  fontWeight: 600,
                  mb: 4,
                }}
              >
                Distribuição por status
              </Typography>

              <Stack spacing={2.5}>
                {MOCK_STATUS.map((s) => (
                  <Box
                    key={s.label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: "1px solid #2e303a",
                      bgcolor: "#0a0a0a",
                      borderRadius: 2,
                      px: 2.5,
                      py: 1.5,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        borderColor: "#4b5563",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: s.bg,
                        color: s.color,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "16px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {s.label}
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontWeight: 700,
                      }}
                    >
                      {s.valor}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

function IndicadorCard({ icone: Icone, label, valor }: any) {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#16171d",
        borderRadius: 3,
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        border: "1px solid transparent",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          borderColor: "#2e303a",
          transform: "translateY(-4px)",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          bgcolor: "#2e303a",
          borderRadius: 2,
          color: "white",
          flexShrink: 0,
        }}
      >
        <Icone />
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: "#9ca3af", mb: 0.5, fontWeight: 500 }}>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ color: "white", fontWeight: 700, lineHeight: 1 }}>
          {valor}
        </Typography>
      </Box>
    </Box>
  )
}