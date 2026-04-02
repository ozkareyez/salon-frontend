// src/admin/AdminComisiones.jsx
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
  Divider,
  Stack,
  InputAdornment,
  Fade,
  Zoom,
  alpha,
  LinearProgress,
} from "@mui/material";
import {
  AttachMoney,
  Person as PersonIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  TrendingUp,
  TrendingDown,
  CalendarToday,
  FilterList,
  Clear,
  Payment,
  History,
  Edit as EditIcon,
} from "@mui/icons-material";

const API_URL = API_BASE;

const AdminComisiones = () => {
  const [especialistas, setEspecialistas] = useState([]);
  const [comisiones, setComisiones] = useState([]);
  const [resumen, setResumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [filtros, setFiltros] = useState({
    especialista_id: "",
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    pagado: "",
  });

  const [modalComision, setModalComision] = useState({
    abierto: false,
    especialista: null,
    comisiones_pendientes: [],
    total_pendiente: 0,
  });

  const [editPorcentaje, setEditPorcentaje] = useState({
    abierto: false,
    especialista: null,
    porcentaje: 0,
  });

  // 🎨 PALETA DE COLORES CORPORATIVA
  const colors = {
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    primaryLight: "#eff6ff",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#06b6d4",
    secondary: "#6b7280",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    background: "#f9fafb",
  };

  useEffect(() => {
    cargarDatos();
  }, [filtros.mes, filtros.ano]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Primero recalcular comisiones desde reservas completadas
      try {
        await axios.post(`${API_URL}/comisiones/recalcular`);
      } catch (e) {
        console.log("No se pudo recalcular comisiones automatically");
      }

      const [especialistasRes, resumenRes] = await Promise.all([
        axios.get(`${API_URL}/especialistas-comisiones`),
        axios.get(`${API_URL}/comisiones/resumen`, {
          params: { mes: filtros.mes, ano: filtros.ano },
        }),
      ]);

      if (especialistasRes.data.success) {
        setEspecialistas(especialistasRes.data.data);
      }

      if (resumenRes.data.success) {
        setResumen(resumenRes.data.data);
      }

      await cargarComisiones();
    } catch (err) {
      setError("Error al cargar datos de comisiones");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarComisiones = async () => {
    try {
      const params = {};
      if (filtros.especialista_id)
        params.especialista_id = filtros.especialista_id;
      if (filtros.pagado !== "") params.pagado = filtros.pagado;

      const response = await axios.get(`${API_URL}/comisiones`, { params });
      if (response.data.success) {
        setComisiones(response.data.data);
      }
    } catch (err) {
      console.error("Error cargando comisiones:", err);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const aplicarFiltros = () => {
    cargarComisiones();
  };

  const limpiarFiltros = () => {
    setFiltros({
      especialista_id: "",
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear(),
      pagado: "",
    });
    setTimeout(() => {
      cargarDatos();
    }, 100);
  };

  const handleCambiarPorcentaje = async (especialistaId, nuevoPorcentaje) => {
    try {
      await axios.put(`${API_URL}/especialistas/${especialistaId}/comision`, {
        comision_porcentaje: nuevoPorcentaje,
      });
      setSuccess(`✅ Porcentaje de comisión actualizado a ${nuevoPorcentaje}%`);
      setEditPorcentaje({ abierto: false, especialista: null, porcentaje: 0 });
      cargarDatos();
    } catch (err) {
      setError("Error al actualizar porcentaje");
      console.error(err);
    }
  };

  const abrirEditarPorcentaje = (especialista) => {
    setEditPorcentaje({
      abierto: true,
      especialista,
      porcentaje: especialista.comision_porcentaje || 30,
    });
  };

  const cerrarEditarPorcentaje = () => {
    setEditPorcentaje({ abierto: false, especialista: null, porcentaje: 0 });
  };

  const handlePagarComision = async (comisionId) => {
    try {
      await axios.patch(`${API_URL}/comisiones/${comisionId}/pagar`);
      setSuccess("✅ Comisión marcada como pagada");
      cargarComisiones();
      cargarDatos();
    } catch (err) {
      setError("Error al pagar comisión");
    }
  };

  const abrirModalPago = (especialista) => {
    const comisionesPendientes = comisiones.filter(
      (c) => c.especialista_id === especialista.id && !c.pagado,
    );
    const totalPendiente = comisionesPendientes.reduce(
      (sum, c) => sum + parseFloat(c.valor_comision),
      0,
    );

    setModalComision({
      abierto: true,
      especialista,
      comisiones_pendientes: comisionesPendientes,
      total_pendiente: totalPendiente,
    });
  };

  const pagarTodasComisiones = async () => {
    try {
      await axios.post(`${API_URL}/comisiones/pagar-todas`, {
        especialista_id: modalComision.especialista.id,
      });
      setSuccess(
        `✅ Todas las comisiones de ${modalComision.especialista.nombre} han sido pagadas`,
      );
      setModalComision({ ...modalComision, abierto: false });
      cargarComisiones();
      cargarDatos();
    } catch (err) {
      setError("Error al pagar comisiones");
    }
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const totalComisionesPagadas = resumen.reduce(
    (sum, e) => sum + parseFloat(e.comisiones_pagadas || 0),
    0,
  );
  const totalComisionesPendientes = resumen.reduce(
    (sum, e) => sum + parseFloat(e.comisiones_pendientes || 0),
    0,
  );

  if (loading && especialistas.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: colors.background,
        }}
      >
        <CircularProgress sx={{ color: colors.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: colors.background }}>
      <Container maxWidth="xl">
        {/* Header Corporativo */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="700">
                Gestión de Comisiones
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
                Control de pagos y porcentajes por servicio
              </Typography>
            </Box>
            <Avatar
              sx={{ width: 80, height: 80, bgcolor: "rgba(255,255,255,0.2)" }}
            >
              <AttachMoney sx={{ fontSize: 40 }} />
            </Avatar>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(colors.primary, 0.1),
                      color: colors.primary,
                    }}
                  >
                    <TrendingUp />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Comisiones Pagadas
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight="700"
                      sx={{ color: colors.primary }}
                    >
                      {formatMoney(totalComisionesPagadas)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(colors.warning, 0.1),
                      color: colors.warning,
                    }}
                  >
                    <TrendingDown />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Comisiones Pendientes
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight="700"
                      sx={{ color: colors.warning }}
                    >
                      {formatMoney(totalComisionesPendientes)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 2, border: "1px solid #e5e7eb" }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(colors.info, 0.1),
                      color: colors.info,
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Trabajadores Activos
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight="700"
                      sx={{ color: colors.info }}
                    >
                      {
                        especialistas.filter(
                          (e) =>
                            e.status === "Disponible" || e.status === "Ocupado",
                        ).length
                      }
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filtros */}
        <Paper
          sx={{ p: 3, mb: 4, borderRadius: 2, border: "1px solid #e5e7eb" }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Trabajador</InputLabel>
                <Select
                  name="especialista_id"
                  value={filtros.especialista_id}
                  onChange={handleFiltroChange}
                  label="Trabajador"
                >
                  <MenuItem value="">Todos los trabajadores</MenuItem>
                  {especialistas.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Mes</InputLabel>
                <Select
                  name="mes"
                  value={filtros.mes}
                  onChange={handleFiltroChange}
                  label="Mes"
                >
                  {meses.map((mes, index) => (
                    <MenuItem key={index + 1} value={index + 1}>
                      {mes}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Año"
                name="ano"
                value={filtros.ano}
                onChange={handleFiltroChange}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  name="pagado"
                  value={filtros.pagado}
                  onChange={handleFiltroChange}
                  label="Estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="false">Pendiente</MenuItem>
                  <MenuItem value="true">Pagado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={aplicarFiltros}
                  startIcon={<FilterList />}
                  sx={{ bgcolor: colors.primary }}
                >
                  Aplicar
                </Button>
                <Button
                  variant="outlined"
                  onClick={limpiarFiltros}
                  startIcon={<Clear />}
                >
                  Limpiar
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabla de Resumen por Trabajador */}
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ mb: 2, color: colors.textPrimary }}
        >
          Resumen de Comisiones - {meses[filtros.mes - 1]} {filtros.ano}
        </Typography>

        <Paper
          sx={{
            mb: 4,
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <TableContainer component="div" className="overflow-x-auto">
            <Table>
              <TableHead sx={{ bgcolor: colors.primaryLight }}>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                  >
                    Trabajador
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                  >
                    Especialidad
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                    align="center"
                  >
                    Comisión %
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                    align="right"
                  >
                    Servicios
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                    align="right"
                  >
                    Ventas
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                    align="right"
                  >
                    Comisión
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                    align="right"
                  >
                    Pendiente
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                    align="right"
                  >
                    Pagado
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                    align="center"
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumen.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      sx={{ py: 4, color: colors.textSecondary }}
                    >
                      No hay datos de comisiones para este período
                    </TableCell>
                  </TableRow>
                ) : (
                  resumen.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
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
                          <Typography
                            variant="body2"
                            fontWeight="500"
                            color={colors.textPrimary}
                          >
                            {row.nombre}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ color: colors.textSecondary }}>
                        {row.especialidad}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                          <Chip
                            label={`${row.comision_porcentaje || 30}%`}
                            size="small"
                            sx={{
                              bgcolor: alpha(colors.primary, 0.1),
                              color: colors.primary,
                              fontWeight: 600,
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => abrirEditarPorcentaje(row)}
                            sx={{ color: colors.primary }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: colors.textSecondary }}
                      >
                        {row.total_servicios || 0}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: colors.textSecondary }}
                      >
                        {formatMoney(row.ventas_totales)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 600, color: colors.primary }}
                      >
                        {formatMoney(row.comisiones_totales)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          sx={{ color: colors.warning, fontWeight: 600 }}
                        >
                          {formatMoney(row.comisiones_pendientes)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          sx={{ color: colors.success, fontWeight: 600 }}
                        >
                          {formatMoney(row.comisiones_pagadas)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {parseFloat(row.comisiones_pendientes || 0) > 0 && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Payment />}
                            onClick={() => abrirModalPago(row)}
                            sx={{
                              color: colors.primary,
                              borderColor: colors.primary,
                            }}
                          >
                            Pagar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Tabla de Comisiones Detalladas */}
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ mb: 2, mt: 4, color: colors.textPrimary }}
        >
          Historial de Comisiones
        </Typography>

        <Paper
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <TableContainer component="div" className="overflow-x-auto">
            <Table>
              <TableHead sx={{ bgcolor: colors.primaryLight }}>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                  >
                    Fecha
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                  >
                    Trabajador
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                  >
                    Cliente
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                  >
                    Servicio
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                    align="right"
                  >
                    Venta
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                    align="center"
                  >
                    %
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                    align="right"
                  >
                    Comisión
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                    align="center"
                  >
                    Estado
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: colors.textPrimary }}
                    align="center"
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comisiones.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      sx={{ py: 4, color: colors.textSecondary }}
                    >
                      No hay comisiones registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  comisiones.map((comision) => (
                    <TableRow key={comision.id} hover>
                      <TableCell sx={{ color: colors.textSecondary }}>
                        {new Date(comision.fecha).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell sx={{ color: colors.textSecondary }}>
                        {comision.especialista_nombre}
                      </TableCell>
                      <TableCell sx={{ color: colors.textSecondary }}>
                        {comision.cliente_nombre}
                      </TableCell>
                      <TableCell sx={{ color: colors.textSecondary }}>
                        {comision.servicio_nombre}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: colors.textSecondary }}
                      >
                        {formatMoney(comision.precio_total)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${comision.porcentaje_comision}%`}
                          size="small"
                          sx={{ fontSize: "0.75rem", height: 20 }}
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 600, color: colors.primary }}
                      >
                        {formatMoney(comision.valor_comision)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={comision.pagado ? "Pagado" : "Pendiente"}
                          size="small"
                          color={comision.pagado ? "success" : "warning"}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {!comision.pagado && (
                          <Tooltip title="Marcar como pagado">
                            <IconButton
                              size="small"
                              onClick={() => handlePagarComision(comision.id)}
                              sx={{ color: colors.primary }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Modal de Pago */}
        <Dialog
          open={modalComision.abierto}
          onClose={() => setModalComision({ ...modalComision, abierto: false })}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: colors.primary }}>
                <Payment />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="700"
                  color={colors.textPrimary}
                >
                  Pagar Comisiones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {modalComision.especialista?.nombre}
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ py: 2 }}>
              <Typography
                variant="subtitle2"
                color={colors.textSecondary}
                gutterBottom
              >
                Resumen de comisiones pendientes
              </Typography>

              <Paper
                sx={{
                  p: 3,
                  bgcolor: alpha(colors.warning, 0.05),
                  borderRadius: 1.5,
                  mb: 3,
                  border: `1px solid ${alpha(colors.warning, 0.2)}`,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    Total a pagar:
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="700"
                    sx={{ color: colors.warning }}
                  >
                    {formatMoney(modalComision.total_pendiente)}
                  </Typography>
                </Stack>
              </Paper>

              <Typography
                variant="body2"
                sx={{ mb: 2, color: colors.textSecondary }}
              >
                Se pagarán {modalComision.comisiones_pendientes?.length || 0}{" "}
                comisión(es)
              </Typography>

              <Alert severity="info" sx={{ mt: 2, borderRadius: 1.5 }}>
                Al confirmar, las comisiones serán marcadas como pagadas y se
                registrará la fecha de pago.
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() =>
                setModalComision({ ...modalComision, abierto: false })
              }
              sx={{ color: colors.textSecondary }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={pagarTodasComisiones}
              sx={{
                bgcolor: colors.primary,
                "&:hover": { bgcolor: colors.primaryDark },
              }}
            >
              Confirmar Pago
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbars */}
        <Snackbar
          open={!!error}
          autoHideDuration={5000}
          onClose={() => setError("")}
        >
          <Alert severity="error" variant="filled" sx={{ borderRadius: 1.5 }}>
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
            sx={{ bgcolor: colors.success, borderRadius: 1.5 }}
          >
            {success}
          </Alert>
        </Snackbar>

        {/* Modal Editar Porcentaje */}
        <Dialog
          open={editPorcentaje.abierto}
          onClose={cerrarEditarPorcentaje}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EditIcon sx={{ color: colors.primary }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Cambiar Porcentaje de Comisión
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ pt: 1 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Especialistas: <strong>{editPorcentaje.especialista?.nombre}</strong>
              </Typography>
              <TextField
                fullWidth
                label="Porcentaje de Comisión (%)"
                type="number"
                value={editPorcentaje.porcentaje}
                onChange={(e) =>
                  setEditPorcentaje((prev) => ({
                    ...prev,
                    porcentaje: e.target.value,
                  }))
                }
                inputProps={{ min: 0, max: 100 }}
                helperText="Ingrese un valor entre 0 y 100"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={cerrarEditarPorcentaje} variant="outlined">
              Cancelar
            </Button>
            <Button
              onClick={() =>
                handleCambiarPorcentaje(
                  editPorcentaje.especialista.id,
                  editPorcentaje.porcentaje
                )
              }
              variant="contained"
              sx={{ bgcolor: colors.primary }}
            >
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminComisiones;
