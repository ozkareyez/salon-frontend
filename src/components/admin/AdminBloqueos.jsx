// src/admin/AdminBloqueos.jsx - VERSIÓN PROFESIONAL CRM EMPRESARIAL
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "../../config/api";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Tooltip,
  CircularProgress,
  Avatar,
  Stack,
  Fade,
  Zoom,
  alpha,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from "@mui/material";

// ICONOS
import {
  Block as BlockIcon,
  EventBusy as EventBusyIcon,
  EventAvailable as EventAvailableIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as TimeIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
  HolidayVillage as HolidayIcon,
  MedicalServices as MedicalIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  SelfImprovement as SelfImprovementIcon,
  CalendarMonth as CalendarMonthIcon,
} from "@mui/icons-material";

const API_URL = API_BASE;

const AdminBloqueos = () => {
  const [bloqueos, setBloqueos] = useState([]);
  const [especialistas, setEspecialistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Estado para el diálogo de nuevo bloqueo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nuevoBloqueo, setNuevoBloqueo] = useState({
    especialista_id: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    motivo: "",
    tipo: "personal",
    recurrente: false,
    dia_semana: "",
    mes: "",
    dia_mes: "",
  });

  // Estado para filtros
  const [filtros, setFiltros] = useState({
    especialista_id: "",
    fecha_desde: "",
    fecha_hasta: "",
    tipo: "",
  });

  // 🎨 PALETA DE COLORES CORPORATIVA EMPRESARIAL
  const colors = {
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    primaryLight: "#eff6ff",
    secondary: "#64748b",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    textMuted: "#9ca3af",
    border: "#e5e7eb",
    background: "#f9fafb",
    white: "#ffffff",
    personal: "#64748b",
    festivo: "#f59e0b",
    capacitacion: "#8b5cf6",
    medico: "#06b6d4",
  };

  // Días festivos Colombia 2026
  const [festivosColombia, setFestivosColombia] = useState([
    { fecha: "2026-01-01", nombre: "Año Nuevo" },
    { fecha: "2026-01-12", nombre: "Día de los Reyes Magos" },
    { fecha: "2026-03-23", nombre: "Día de San José" },
    { fecha: "2026-04-02", nombre: "Jueves Santo" },
    { fecha: "2026-04-03", nombre: "Viernes Santo" },
    { fecha: "2026-04-05", nombre: "Domingo de Resurrección" },
    { fecha: "2026-05-01", nombre: "Día del Trabajo" },
    { fecha: "2026-05-18", nombre: "Día de la Ascensión" },
    { fecha: "2026-06-08", nombre: "Corpus Christi" },
    { fecha: "2026-06-15", nombre: "Sagrado Corazón de Jesús" },
    { fecha: "2026-06-29", nombre: "San Pedro y San Pablo" },
    { fecha: "2026-07-20", nombre: "Grito de Independencia" },
    { fecha: "2026-08-07", nombre: "Batalla de Boyacá" },
    { fecha: "2026-08-17", nombre: "Asunción de la Virgen" },
    { fecha: "2026-10-12", nombre: "Día de la Raza" },
    { fecha: "2026-11-02", nombre: "Todos los Santos" },
    { fecha: "2026-11-16", nombre: "Independencia de Cartagena" },
    { fecha: "2026-12-08", nombre: "Día de la Inmaculada Concepción" },
    { fecha: "2026-12-25", nombre: "Navidad" },
  ]);

  // Cargar datos iniciales
  useEffect(() => {
    cargarEspecialistas();
    cargarBloqueos();
  }, []);

  const cargarEspecialistas = async () => {
    try {
      const response = await axios.get(`${API_URL}/especialistas`);
      setEspecialistas(response.data.data || []);
    } catch (err) {
      console.error("Error cargando especialistas:", err);
    }
  };

  const cargarBloqueos = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/bloqueos-agenda`;
      const params = new URLSearchParams();

      if (filtros.especialista_id)
        params.append("especialista_id", filtros.especialista_id);
      if (filtros.fecha_desde)
        params.append("fecha_desde", filtros.fecha_desde);
      if (filtros.fecha_hasta)
        params.append("fecha_hasta", filtros.fecha_hasta);
      if (filtros.tipo) params.append("tipo", filtros.tipo);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await axios.get(url);
      setBloqueos(response.data.data || []);
    } catch (err) {
      setError("Error al cargar bloqueos de agenda");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const agregarFestivosColombia = async () => {
    if (
      !window.confirm(
        "¿Desea agregar todos los días festivos de Colombia 2026 como bloqueos para TODOS los especialistas?",
      )
    )
      return;

    try {
      setLoading(true);
      let exitosos = 0;
      let fallidos = 0;

      for (const festivo of festivosColombia) {
        for (const especialista of especialistas) {
          try {
            await axios.post(`${API_URL}/bloqueos-agenda`, {
              especialista_id: especialista.id,
              fecha: festivo.fecha,
              hora_inicio: "00:00",
              hora_fin: "23:59",
              motivo: `📅 Día Festivo: ${festivo.nombre}`,
              tipo: "festivo",
              recurrente: false,
            });
            exitosos++;
          } catch (err) {
            fallidos++;
          }
        }
      }

      setSuccess(
        `✅ ${exitosos} bloqueos de días festivos 2026 creados (${fallidos} fallidos)`,
      );
      cargarBloqueos();
    } catch (err) {
      setError("Error al agregar días festivos");
    } finally {
      setLoading(false);
    }
  };

  const guardarBloqueo = async () => {
    if (!nuevoBloqueo.especialista_id) {
      setError("Debe seleccionar un especialista");
      return;
    }
    if (!nuevoBloqueo.fecha) {
      setError("Debe seleccionar una fecha");
      return;
    }
    if (!nuevoBloqueo.hora_inicio || !nuevoBloqueo.hora_fin) {
      setError("Debe seleccionar horas de inicio y fin");
      return;
    }
    if (nuevoBloqueo.hora_inicio >= nuevoBloqueo.hora_fin) {
      setError("La hora de inicio debe ser menor a la hora de fin");
      return;
    }
    if (!nuevoBloqueo.motivo) {
      setError("Debe ingresar un motivo");
      return;
    }

    try {
      if (editandoId) {
        await axios.put(
          `${API_URL}/bloqueos-agenda/${editandoId}`,
          nuevoBloqueo,
        );
        setSuccess("✅ Bloqueo actualizado correctamente");
      } else {
        await axios.post(`${API_URL}/bloqueos-agenda`, nuevoBloqueo);
        setSuccess("✅ Bloqueo creado correctamente");
      }

      setDialogOpen(false);
      resetForm();
      cargarBloqueos();
    } catch (err) {
      setError("Error al guardar el bloqueo");
      console.error(err);
    }
  };

  const eliminarBloqueo = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este bloqueo?")) {
      try {
        await axios.delete(`${API_URL}/bloqueos-agenda/${id}`);
        setSuccess("🗑️ Bloqueo eliminado correctamente");
        cargarBloqueos();
      } catch (err) {
        setError("Error al eliminar el bloqueo");
      }
    }
  };

  const editarBloqueo = (bloqueo) => {
    setNuevoBloqueo({
      especialista_id: bloqueo.especialista_id,
      fecha: bloqueo.fecha,
      hora_inicio: bloqueo.hora_inicio,
      hora_fin: bloqueo.hora_fin,
      motivo: bloqueo.motivo,
      tipo: bloqueo.tipo,
      recurrente: bloqueo.recurrente || false,
      dia_semana: bloqueo.dia_semana || "",
      mes: bloqueo.mes || "",
      dia_mes: bloqueo.dia_mes || "",
    });
    setEditandoId(bloqueo.id);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setNuevoBloqueo({
      especialista_id: "",
      fecha: "",
      hora_inicio: "",
      hora_fin: "",
      motivo: "",
      tipo: "personal",
      recurrente: false,
      dia_semana: "",
      mes: "",
      dia_mes: "",
    });
    setEditandoId(null);
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "festivo":
        return "warning";
      case "medico":
        return "info";
      case "capacitacion":
        return "secondary";
      default:
        return "default";
    }
  };

  const getTipoIcono = (tipo) => {
    switch (tipo) {
      case "festivo":
        return <HolidayIcon fontSize="small" />;
      case "medico":
        return <MedicalIcon fontSize="small" />;
      case "capacitacion":
        return <WorkIcon fontSize="small" />;
      default:
        return <EventBusyIcon fontSize="small" />;
    }
  };

  const esFestivo = (fecha) => festivosColombia.some((f) => f.fecha === fecha);
  const getNombreFestivo = (fecha) =>
    festivosColombia.find((f) => f.fecha === fecha)?.nombre || "";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.background, py: 4 }}>
      <Container maxWidth="xl">
        {/* Header corporativo */}
        <Zoom in={true}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
              color: "white",
              position: "relative",
              overflow: "hidden",
              boxShadow: `0 4px 20px ${alpha(colors.primary, 0.3)}`,
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight="700"
                    sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
                  >
                    Administración de Agenda
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ opacity: 0.95, fontWeight: 400, mt: 1 }}
                  >
                    Gestión de bloqueos • Días Festivos 2026 • Agenda de
                    Especialistas
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Box>
            </Box>
          </Paper>
        </Zoom>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {[
            {
              icon: <EventBusyIcon />,
              label: "Total Bloqueos",
              value: bloqueos.length,
              color: colors.primary,
            },
            {
              icon: <HolidayIcon />,
              label: "Días Festivos",
              value: bloqueos.filter((b) => b.tipo === "festivo").length,
              color: colors.warning,
            },
            {
              icon: <MedicalIcon />,
              label: "Citas Médicas",
              value: bloqueos.filter((b) => b.tipo === "medico").length,
              color: colors.medico,
            },
            {
              icon: <WorkIcon />,
              label: "Capacitaciones",
              value: bloqueos.filter((b) => b.tipo === "capacitacion").length,
              color: colors.capacitacion,
            },
          ].map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Fade in timeout={500 + idx * 100}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(stat.color, 0.1),
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          {stat.label}
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight="700"
                          color="textPrimary"
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Filtros */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            border: `1px solid ${colors.border}`,
            boxShadow: "none",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Especialista</InputLabel>
                <Select
                  value={filtros.especialista_id}
                  label="Especialista"
                  onChange={(e) =>
                    setFiltros({ ...filtros, especialista_id: e.target.value })
                  }
                >
                  <MenuItem value="">Todos los especialistas</MenuItem>
                  {especialistas.map((esp) => (
                    <MenuItem key={esp.id} value={esp.id}>
                      {esp.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Fecha desde"
                value={filtros.fecha_desde}
                onChange={(e) =>
                  setFiltros({ ...filtros, fecha_desde: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Fecha hasta"
                value={filtros.fecha_hasta}
                onChange={(e) =>
                  setFiltros({ ...filtros, fecha_hasta: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={filtros.tipo}
                  label="Tipo"
                  onChange={(e) =>
                    setFiltros({ ...filtros, tipo: e.target.value })
                  }
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="festivo">Festivo</MenuItem>
                  <MenuItem value="medico">Cita Médica</MenuItem>
                  <MenuItem value="capacitacion">Capacitación</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={cargarBloqueos}
                  fullWidth
                  sx={{
                    bgcolor: colors.primary,
                    "&:hover": { bgcolor: colors.primaryDark },
                  }}
                >
                  Filtrar
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFiltros({
                      especialista_id: "",
                      fecha_desde: "",
                      fecha_hasta: "",
                      tipo: "",
                    });
                    cargarBloqueos();
                  }}
                >
                  <ClearIcon fontSize="small" />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Botones de Acción */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            sx={{
              bgcolor: colors.primary,
              "&:hover": { bgcolor: colors.primaryDark },
            }}
          >
            Nuevo Bloqueo
          </Button>
          <Button
            variant="outlined"
            startIcon={<HolidayIcon />}
            onClick={agregarFestivosColombia}
            sx={{ borderColor: colors.warning, color: colors.warning }}
          >
            Agregar Festivos Colombia 2026
          </Button>
        </Stack>

        {/* Tabla de Bloqueos */}
        <Paper
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border: `1px solid ${colors.border}`,
          }}
        >
          <TableContainer component="div" className="overflow-x-auto">
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: colors.primaryLight }}>
                  {[
                    "Especialista",
                    "Fecha",
                    "Horario",
                    "Tipo",
                    "Motivo",
                    "Acciones",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 600,
                        bgcolor: colors.primaryLight,
                        color: colors.textPrimary,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <CircularProgress sx={{ color: colors.primary }} />
                    </TableCell>
                  </TableRow>
                ) : bloqueos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <EventAvailableIcon
                        sx={{
                          fontSize: 64,
                          color: colors.textMuted,
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" color="textSecondary">
                        No hay bloqueos de agenda
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  bloqueos.map((bloqueo) => {
                    const especialista = especialistas.find(
                      (e) => e.id === bloqueo.especialista_id,
                    );
                    return (
                      <TableRow key={bloqueo.id} hover>
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: alpha(colors.primary, 0.1),
                              }}
                            >
                              <PersonIcon
                                sx={{ fontSize: 16, color: colors.primary }}
                              />
                            </Avatar>
                            <Typography variant="body2" fontWeight="500">
                              {especialista?.nombre || "Desconocido"}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <CalendarTodayIcon
                              sx={{ fontSize: 14, color: colors.textMuted }}
                            />
                            <Typography variant="body2">
                              {new Date(bloqueo.fecha).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                },
                              )}
                            </Typography>
                            {esFestivo(bloqueo.fecha) && (
                              <Tooltip title={getNombreFestivo(bloqueo.fecha)}>
                                <Chip
                                  label="Festivo"
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: "0.625rem",
                                    bgcolor: alpha(colors.warning, 0.1),
                                    color: colors.warning,
                                  }}
                                />
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <TimeIcon
                              sx={{ fontSize: 14, color: colors.textMuted }}
                            />
                            <Typography variant="body2">
                              {bloqueo.hora_inicio} - {bloqueo.hora_fin}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getTipoIcono(bloqueo.tipo)}
                            label={
                              bloqueo.tipo === "festivo"
                                ? "Festivo"
                                : bloqueo.tipo === "medico"
                                  ? "Médico"
                                  : bloqueo.tipo === "capacitacion"
                                    ? "Capacitación"
                                    : "Personal"
                            }
                            color={getTipoColor(bloqueo.tipo)}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {bloqueo.motivo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                onClick={() => editarBloqueo(bloqueo)}
                                sx={{ color: colors.textSecondary }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                onClick={() => eliminarBloqueo(bloqueo.id)}
                                sx={{ color: colors.error }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Diálogo para crear/editar bloqueo */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle sx={{ pb: 1, bgcolor: colors.primaryLight }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: colors.primary }}>
                {editandoId ? <EditIcon /> : <AddIcon />}
              </Avatar>
              <Typography variant="h5" fontWeight="700" color="textPrimary">
                {editandoId ? "Editar Bloqueo" : "Nuevo Bloqueo"}
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent dividers sx={{ py: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Especialista</InputLabel>
                  <Select
                    value={nuevoBloqueo.especialista_id}
                    label="Especialista *"
                    onChange={(e) =>
                      setNuevoBloqueo({
                        ...nuevoBloqueo,
                        especialista_id: e.target.value,
                      })
                    }
                  >
                    {especialistas.map((esp) => (
                      <MenuItem key={esp.id} value={esp.id}>
                        {esp.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Fecha"
                  value={nuevoBloqueo.fecha}
                  onChange={(e) =>
                    setNuevoBloqueo({ ...nuevoBloqueo, fecha: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  helperText={
                    esFestivo(nuevoBloqueo.fecha)
                      ? `📅 Día festivo: ${getNombreFestivo(nuevoBloqueo.fecha)}`
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  required
                  type="time"
                  label="Hora inicio"
                  value={nuevoBloqueo.hora_inicio}
                  onChange={(e) =>
                    setNuevoBloqueo({
                      ...nuevoBloqueo,
                      hora_inicio: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  required
                  type="time"
                  label="Hora fin"
                  value={nuevoBloqueo.hora_fin}
                  onChange={(e) =>
                    setNuevoBloqueo({
                      ...nuevoBloqueo,
                      hora_fin: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Tipo de bloqueo</FormLabel>
                  <RadioGroup
                    row
                    value={nuevoBloqueo.tipo}
                    onChange={(e) =>
                      setNuevoBloqueo({ ...nuevoBloqueo, tipo: e.target.value })
                    }
                  >
                    <FormControlLabel
                      value="personal"
                      control={<Radio sx={{ color: colors.primary }} />}
                      label="Personal"
                    />
                    <FormControlLabel
                      value="medico"
                      control={<Radio sx={{ color: colors.primary }} />}
                      label="Cita Médica"
                    />
                    <FormControlLabel
                      value="capacitacion"
                      control={<Radio sx={{ color: colors.primary }} />}
                      label="Capacitación"
                    />
                    <FormControlLabel
                      value="festivo"
                      control={<Radio sx={{ color: colors.primary }} />}
                      label="Día Festivo"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={2}
                  label="Motivo del bloqueo"
                  value={nuevoBloqueo.motivo}
                  onChange={(e) =>
                    setNuevoBloqueo({ ...nuevoBloqueo, motivo: e.target.value })
                  }
                  placeholder="Ej: Cita médica, Día festivo, Capacitación, Vacaciones, etc."
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={nuevoBloqueo.recurrente}
                      onChange={(e) =>
                        setNuevoBloqueo({
                          ...nuevoBloqueo,
                          recurrente: e.target.checked,
                        })
                      }
                      sx={{ color: colors.primary }}
                    />
                  }
                  label="Bloqueo recurrente (se repite)"
                />
              </Grid>
              {nuevoBloqueo.recurrente && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Día de la semana</InputLabel>
                      <Select
                        value={nuevoBloqueo.dia_semana}
                        label="Día de la semana"
                        onChange={(e) =>
                          setNuevoBloqueo({
                            ...nuevoBloqueo,
                            dia_semana: e.target.value,
                          })
                        }
                      >
                        {[
                          "Lunes",
                          "Martes",
                          "Miércoles",
                          "Jueves",
                          "Viernes",
                          "Sábado",
                          "Domingo",
                        ].map((dia, idx) => (
                          <MenuItem key={idx} value={idx + 1}>
                            {dia}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Día del mes (1-31)"
                      value={nuevoBloqueo.dia_mes}
                      onChange={(e) =>
                        setNuevoBloqueo({
                          ...nuevoBloqueo,
                          dia_mes: e.target.value,
                        })
                      }
                      InputProps={{ inputProps: { min: 1, max: 31 } }}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setDialogOpen(false)}
              variant="outlined"
              sx={{ color: colors.textSecondary }}
            >
              Cancelar
            </Button>
            <Button
              onClick={guardarBloqueo}
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                bgcolor: colors.primary,
                "&:hover": { bgcolor: colors.primaryDark },
              }}
            >
              {editandoId ? "Actualizar" : "Guardar"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbars */}
        <Snackbar
          open={!!error}
          autoHideDuration={5000}
          onClose={() => setError("")}
        >
          <Alert severity="error" variant="filled">
            {error}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={() => setSuccess("")}
        >
          <Alert
            severity="success"
            variant="filled"
            sx={{ bgcolor: colors.success }}
          >
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminBloqueos;
