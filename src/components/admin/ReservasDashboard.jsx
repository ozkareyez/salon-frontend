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
  Tabs,
  Tab,
  Avatar,
  Stack,
  LinearProgress,
  Divider,
  CardHeader,
  Badge,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Spa as SpaIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";

const API_URL = API_BASE;

const ReservasDashboard = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [filtros, setFiltros] = useState({
    estado: "",
    fecha: "",
    search: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("create");
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [nuevaReserva, setNuevaReserva] = useState({
    cliente_nombre: "",
    cliente_telefono: "",
    cliente_email: "",
    servicio_id: "",
    servicio_nombre: "",
    fecha: "",
    hora: "",
    duracion_estimada: 60,
    estado: "pendiente",
    notas: "",
    precio_total: "",
    metodo_pago: "pendiente",
    pagado: false,
  });
  const [estadisticas, setEstadisticas] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [quickFilters, setQuickFilters] = useState({
    hoy: false,
    pendientes: false,
  });

  useEffect(() => {
    cargarReservas();
    cargarEstadisticas();
    cargarServicios();
  }, []);

  const cargarReservas = async (filtrosAplicados = filtros) => {
    setLoading(true);
    try {
      let url = `${API_URL}/reservas`;
      const params = new URLSearchParams();

      if (filtrosAplicados.estado)
        params.append("estado", filtrosAplicados.estado);
      if (filtrosAplicados.fecha)
        params.append("fecha", filtrosAplicados.fecha);
      if (filtrosAplicados.search)
        params.append("search", filtrosAplicados.search);

      // Filtros rápidos
      if (quickFilters.hoy) {
        const hoy = new Date().toISOString().split("T")[0];
        params.append("fecha", hoy);
      }
      if (quickFilters.pendientes) {
        params.append("estado", "pendiente");
      }

      if (params.toString()) url += `?${params.toString()}`;

      const response = await axios.get(url);
      setReservas(response.data.data || []);
      setError("");
    } catch (err) {
      setError("Error al cargar las reservas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await axios.get(`${API_URL}/reservas/estadisticas`);
      setEstadisticas(response.data.estadisticas);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
    }
  };

  const cargarServicios = async () => {
    try {
      const response = await axios.get(`${API_URL}/servicios`);
      setServicios(response.data || []);
    } catch (err) {
      console.error("Error al cargar servicios:", err);
    }
  };

  const cargarHorariosDisponibles = async (fecha) => {
    try {
      const response = await axios.get(
        `${API_URL}/horarios-disponibles/${fecha}`,
      );
      setHorariosDisponibles(response.data.horarios_disponibles || []);
    } catch (err) {
      console.error("Error al cargar horarios:", err);
    }
  };

  const handleFechaChange = (e) => {
    const fecha = e.target.value;
    setNuevaReserva({ ...nuevaReserva, fecha });
    if (fecha) {
      cargarHorariosDisponibles(fecha);
    }
  };

  const handleServicioChange = (e) => {
    const servicioId = e.target.value;
    const servicio = servicios.find((s) => s.id == servicioId);
    if (servicio) {
      setNuevaReserva({
        ...nuevaReserva,
        servicio_id: servicio.id,
        servicio_nombre: servicio.nombre,
        precio_total: servicio.precio,
        duracion_estimada: servicio.duracion || 60,
      });
    }
  };

  const abrirDialogo = (tipo, reserva = null) => {
    setDialogType(tipo);
    if (tipo === "create") {
      setNuevaReserva({
        cliente_nombre: "",
        cliente_telefono: "",
        cliente_email: "",
        servicio_id: "",
        servicio_nombre: "",
        fecha: "",
        hora: "",
        duracion_estimada: 60,
        estado: "pendiente",
        notas: "",
        precio_total: "",
        metodo_pago: "pendiente",
        pagado: false,
      });
    } else if (tipo === "edit" && reserva) {
      setReservaSeleccionada(reserva);
      setNuevaReserva({
        ...reserva,
        pagado: reserva.pagado === 1,
      });
    } else if (tipo === "view" && reserva) {
      setReservaSeleccionada(reserva);
    }
    setDialogOpen(true);
  };

  const cerrarDialogo = () => {
    setDialogOpen(false);
    setReservaSeleccionada(null);
  };

  const handleSubmit = async () => {
    try {
      if (dialogType === "create") {
        await axios.post(`${API_URL}/reservas`, nuevaReserva);
        setSuccess("Reserva creada exitosamente");
      } else if (dialogType === "edit") {
        await axios.put(
          `${API_URL}/reservas/${reservaSeleccionada.id}`,
          nuevaReserva,
        );
        setSuccess("Reserva actualizada exitosamente");
      }

      cerrarDialogo();
      cargarReservas();
      cargarEstadisticas();
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar la reserva");
    }
  };

  const eliminarReserva = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta reserva?")) {
      try {
        await axios.delete(`${API_URL}/reservas/${id}`);
        setSuccess("Reserva eliminada exitosamente");
        cargarReservas();
        cargarEstadisticas();
      } catch (err) {
        setError("Error al eliminar la reserva");
      }
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.patch(`${API_URL}/reservas/${id}/estado`, {
        estado: nuevoEstado,
      });
      setSuccess(`Estado cambiado a: ${nuevoEstado}`);
      cargarReservas();
      cargarEstadisticas();
    } catch (err) {
      setError("Error al cambiar el estado");
    }
  };

  const cambiarPago = async (id, pagado) => {
    try {
      await axios.patch(`${API_URL}/reservas/${id}/pago`, { pagado });
      setSuccess(
        `Estado de pago actualizado: ${pagado ? "Pagado" : "Pendiente"}`,
      );
      cargarReservas();
      cargarEstadisticas();
    } catch (err) {
      setError("Error al actualizar el pago");
    }
  };

  const aplicarFiltros = () => {
    cargarReservas(filtros);
  };

  const limpiarFiltros = () => {
    setFiltros({ estado: "", fecha: "", search: "" });
    setQuickFilters({ hoy: false, pendientes: false });
    cargarReservas({ estado: "", fecha: "", search: "" });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "warning";
      case "confirmada":
        return "info";
      case "completada":
        return "success";
      case "cancelada":
        return "error";
      default:
        return "default";
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "pendiente":
        return <AccessTimeIcon />;
      case "confirmada":
        return <CheckCircleIcon />;
      case "completada":
        return <CheckCircleIcon />;
      case "cancelada":
        return <CancelIcon />;
      default:
        return null;
    }
  };

  const handleQuickFilterChange = (filter) => {
    const newFilters = { ...quickFilters, [filter]: !quickFilters[filter] };
    setQuickFilters(newFilters);

    // Aplicar filtros inmediatamente
    setTimeout(() => {
      cargarReservas();
    }, 100);
  };

  const calcularIngresosMensuales = () => {
    if (!estadisticas?.ingresos_mensuales) return 0;
    const ingresos = Array.isArray(estadisticas.ingresos_mensuales)
      ? estadisticas.ingresos_mensuales.reduce(
          (sum, item) => sum + (item.ingresos || 0),
          0,
        )
      : estadisticas.ingresos_mensuales;
    return ingresos;
  };

  if (loading && !reservas.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const pendientesCount = reservas.filter(
    (r) => r.estado === "pendiente",
  ).length;
  const reservasHoy = reservas.filter((r) => {
    const hoy = new Date().toISOString().split("T")[0];
    return r.fecha === hoy;
  }).length;

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        {/* Header con estadísticas */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="700"
                    color="grey.900"
                  >
                    Gestión de Reservas
                  </Typography>
                  <Typography variant="body2" color="grey.600">
                    Administra todas las reservas del sistema
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => abrirDialogo("create")}
                  sx={{
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  Nueva Reserva
                </Button>
              </Box>
            </Grid>

            {/* Cards de estadísticas */}
            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{ bgcolor: "primary.main", width: 56, height: 56 }}
                    >
                      <CalendarIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" fontWeight="700">
                        {estadisticas?.total_reservas || 0}
                      </Typography>
                      <Typography variant="body2" color="grey.600">
                        Total Reservas
                      </Typography>
                    </Box>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={80}
                    sx={{ mt: 2, borderRadius: 5, height: 6 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{ bgcolor: "warning.main", width: 56, height: 56 }}
                    >
                      <Badge badgeContent={pendientesCount} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        fontWeight="700"
                        color="warning.dark"
                      >
                        {pendientesCount}
                      </Typography>
                      <Typography variant="body2" color="grey.600">
                        Pendientes
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{ bgcolor: "success.main", width: 56, height: 56 }}
                    >
                      <AttachMoneyIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        fontWeight="700"
                        color="success.dark"
                      >
                        ${(estadisticas?.ingreso_total || 0).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="grey.600">
                        Ingresos Totales
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{ bgcolor: "info.main", width: 56, height: 56 }}
                    >
                      <TrendingUpIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        fontWeight="700"
                        color="info.dark"
                      >
                        {reservasHoy}
                      </Typography>
                      <Typography variant="body2" color="grey.600">
                        Hoy
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Filtros y controles */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar cliente o servicio..."
                value={filtros.search}
                onChange={(e) =>
                  setFiltros({ ...filtros, search: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "grey.500" }} />
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filtros.estado}
                  label="Estado"
                  onChange={(e) =>
                    setFiltros({ ...filtros, estado: e.target.value })
                  }
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="confirmada">Confirmada</MenuItem>
                  <MenuItem value="completada">Completada</MenuItem>
                  <MenuItem value="cancelada">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Fecha"
                value={filtros.fecha}
                onChange={(e) =>
                  setFiltros({ ...filtros, fecha: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControlLabel
                  control={
                    <Switch
                      checked={quickFilters.hoy}
                      onChange={() => handleQuickFilterChange("hoy")}
                      size="small"
                    />
                  }
                  label="Solo hoy"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={quickFilters.pendientes}
                      onChange={() => handleQuickFilterChange("pendientes")}
                      size="small"
                    />
                  }
                  label="Solo pendientes"
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={aplicarFiltros}
                  sx={{ borderRadius: 2 }}
                >
                  Aplicar
                </Button>
                <Button
                  variant="text"
                  onClick={limpiarFiltros}
                  sx={{ borderRadius: 2 }}
                >
                  Limpiar
                </Button>
                <Button
                  variant="text"
                  startIcon={<DownloadIcon />}
                  sx={{ ml: "auto" }}
                >
                  Exportar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabla de reservas */}
        <Paper sx={{ borderRadius: 3, boxShadow: 2, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "grey.100" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Cliente</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>
                    Servicio
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>
                    Fecha y Hora
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Pago</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 700, py: 2 }} align="center">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservas.map((reserva) => (
                  <TableRow
                    key={reserva.id}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            bgcolor: "primary.light",
                            width: 40,
                            height: 40,
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {reserva.cliente_nombre}
                          </Typography>
                          <Typography variant="caption" color="grey.600">
                            {reserva.cliente_telefono}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <SpaIcon sx={{ color: "primary.main", fontSize: 20 }} />
                        <Typography variant="body2">
                          {reserva.servicio_nombre}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(reserva.fecha).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="grey.600">
                          {reserva.hora}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={reserva.estado}
                        color={getEstadoColor(reserva.estado)}
                        icon={getEstadoIcon(reserva.estado)}
                        size="small"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip
                          label={reserva.pagado ? "Pagado" : "Pendiente"}
                          color={reserva.pagado ? "success" : "warning"}
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color="primary.main"
                      >
                        $
                        {parseFloat(reserva.precio_total || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => abrirDialogo("view", reserva)}
                            sx={{ bgcolor: "grey.100" }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => abrirDialogo("edit", reserva)}
                            sx={{ bgcolor: "primary.50" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Confirmar">
                          <IconButton
                            size="small"
                            onClick={() =>
                              cambiarEstado(reserva.id, "confirmada")
                            }
                            sx={{ bgcolor: "info.50", color: "info.main" }}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Marcar como pagado">
                          <IconButton
                            size="small"
                            onClick={() => cambiarPago(reserva.id, true)}
                            sx={{
                              bgcolor: "success.50",
                              color: "success.main",
                            }}
                          >
                            <PaymentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Diálogo */}
        <Dialog
          open={dialogOpen}
          onClose={cerrarDialogo}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
            {dialogType === "create" && "Nueva Reserva"}
            {dialogType === "edit" && "Editar Reserva"}
            {dialogType === "view" && "Detalles de Reserva"}
          </DialogTitle>
          <DialogContent dividers sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre del Cliente"
                  value={nuevaReserva.cliente_nombre}
                  onChange={(e) =>
                    setNuevaReserva({
                      ...nuevaReserva,
                      cliente_nombre: e.target.value,
                    })
                  }
                  disabled={dialogType === "view"}
                  margin="normal"
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={nuevaReserva.cliente_telefono}
                  onChange={(e) =>
                    setNuevaReserva({
                      ...nuevaReserva,
                      cliente_telefono: e.target.value,
                    })
                  }
                  disabled={dialogType === "view"}
                  margin="normal"
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={nuevaReserva.cliente_email}
                  onChange={(e) =>
                    setNuevaReserva({
                      ...nuevaReserva,
                      cliente_email: e.target.value,
                    })
                  }
                  disabled={dialogType === "view"}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Servicio</InputLabel>
                  <Select
                    value={nuevaReserva.servicio_id}
                    onChange={handleServicioChange}
                    label="Servicio"
                    disabled={dialogType === "view"}
                    required
                    variant="outlined"
                  >
                    <MenuItem value="">Seleccionar servicio</MenuItem>
                    {servicios.map((servicio) => (
                      <MenuItem key={servicio.id} value={servicio.id}>
                        {servicio.nombre} - $
                        {servicio.precio?.toLocaleString() || 0}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fecha"
                  type="date"
                  value={nuevaReserva.fecha}
                  onChange={handleFechaChange}
                  disabled={dialogType === "view"}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Hora</InputLabel>
                  <Select
                    value={nuevaReserva.hora}
                    onChange={(e) =>
                      setNuevaReserva({ ...nuevaReserva, hora: e.target.value })
                    }
                    label="Hora"
                    disabled={dialogType === "view" || !nuevaReserva.fecha}
                    required
                    variant="outlined"
                  >
                    <MenuItem value="">Seleccionar hora</MenuItem>
                    {horariosDisponibles.map((hora) => (
                      <MenuItem key={hora} value={hora}>
                        {hora}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={cerrarDialogo} variant="outlined">
              {dialogType === "view" ? "Cerrar" : "Cancelar"}
            </Button>
            {dialogType !== "view" && (
              <Button onClick={handleSubmit} variant="contained" sx={{ px: 4 }}>
                {dialogType === "create" ? "Crear Reserva" : "Guardar"}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Notificaciones */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setError("")} severity="error" variant="filled">
            {error}
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess("")}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSuccess("")}
            severity="success"
            variant="filled"
          >
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ReservasDashboard;
