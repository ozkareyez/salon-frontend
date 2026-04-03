// // src/admin/AdminReservas.jsx - VERSIÓN PROFESIONAL CRM EMPRESARIAL
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import API_BASE from "../../config/api";
// import {
//   Container,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Chip,
//   TextField,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   Box,
//   Grid,
//   Card,
//   CardContent,
//   Alert,
//   Snackbar,
//   Tooltip,
//   CircularProgress,
//   Avatar,
//   Divider,
//   Stack,
//   InputAdornment,
//   Fade,
//   Zoom,
//   alpha,
// } from "@mui/material";
// import {
//   Delete as DeleteIcon,
//   CheckCircle as CheckCircleIcon,
//   Cancel as CancelIcon,
//   Visibility as VisibilityIcon,
//   Payment as PaymentIcon,
//   Search as SearchIcon,
//   Event as EventIcon,
//   Clear as ClearIcon,
//   CalendarToday as CalendarTodayIcon,
//   AccessTime as TimeIcon,
//   Person as PersonIcon,
//   Phone as PhoneIcon,
//   Email as EmailIcon,
//   AttachMoney,
//   Inventory as InventoryIcon,
//   CheckCircleOutline as CheckCircleOutlineIcon,
//   CancelOutlined as CancelOutlinedIcon,
//   Schedule as ScheduleIcon,
//   Receipt as ReceiptIcon,
//   Print as PrintIcon,
//   Business as BusinessIcon,
//   Dashboard as DashboardIcon,
// } from "@mui/icons-material";

// // IMPORTAR COMPONENTE DE TICKET
// import TicketPrint from "./TicketPrint";

// const API_URL = `${API_BASE}`;

// const AdminReservas = () => {
//   const [reservas, setReservas] = useState([]);
//   const [reservasOriginales, setReservasOriginales] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // ESTADOS PARA DATOS DE TICKET
//   const [profesionales, setProfesionales] = useState([]);
//   const [servicios, setServicios] = useState([]);

//   // ESTADO PARA MODAL DE TICKET
//   const [modalTicket, setModalTicket] = useState({
//     abierto: false,
//     reserva: null,
//     profesional: null,
//     servicio: null,
//   });

//   const [filtros, setFiltros] = useState({
//     estado: "",
//     fecha: "",
//     busqueda: "",
//   });

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
//   const [horasBloqueadas, setHorasBloqueadas] = useState([]);
//   const [searchTimeout, setSearchTimeout] = useState(null);

//   // 🎨 PALETA DE COLORES CORPORATIVA EMPRESARIAL
//   const colors = {
//     primary: "#2563eb",
//     primaryDark: "#1d4ed8",
//     primaryLight: "#eff6ff",
//     secondary: "#64748b",
//     success: "#10b981",
//     warning: "#f59e0b",
//     error: "#ef4444",
//     info: "#06b6d4",
//     textPrimary: "#111827",
//     textSecondary: "#6b7280",
//     textMuted: "#9ca3af",
//     border: "#e5e7eb",
//     background: "#f9fafb",
//     white: "#ffffff",
//     pending: "#fef3c7",
//     pendingText: "#d97706",
//     confirmed: "#dbeafe",
//     confirmedText: "#2563eb",
//     completed: "#d1fae5",
//     completedText: "#059669",
//     cancelled: "#fee2e2",
//     cancelledText: "#dc2626",
//   };

//   // CARGAR DATOS PARA TICKETS
//   useEffect(() => {
//     const cargarDatosTicket = async () => {
//       try {
//         const [profRes, servRes] = await Promise.all([
//           axios.get(`${API_BASE}/especialistas`),
//           axios.get(`${API_BASE}/servicios`),
//         ]);

//         if (profRes.data.success) setProfesionales(profRes.data.data);
//         if (servRes.data.success) setServicios(servRes.data.data);
//       } catch (error) {
//         console.error("Error cargando datos para tickets:", error);
//       }
//     };

//     cargarDatosTicket();
//   }, []);

//   useEffect(() => {
//     cargarReservas();
//     cargarHorasBloqueadas();
//   }, []);

//   // FUNCIÓN PRINCIPAL - Cargar todas las reservas
//   const cargarReservas = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE}/reservas`);
//       let todasLasReservas = response.data.data || [];

//       todasLasReservas = todasLasReservas.map((reserva) => ({
//         ...reserva,
//         fecha: reserva.fecha ? reserva.fecha.split("T")[0] : reserva.fecha,
//       }));

//       setReservasOriginales(todasLasReservas);
//       aplicarFiltrosCompletos(todasLasReservas, filtros);
//       setError("");
//     } catch (err) {
//       setError("Error al cargar las reservas");
//       console.error("❌ ERROR:", err.response || err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // FUNCIÓN CORREGIDA - Aplica TODOS los filtros
//   const aplicarFiltrosCompletos = (reservasParaFiltrar, filtrosActuales) => {
//     let reservasFiltradas = [...reservasParaFiltrar];

//     // FILTRO DE FECHA
//     if (filtrosActuales.fecha && filtrosActuales.fecha !== "") {
//       const fechaSeleccionada = filtrosActuales.fecha;
//       reservasFiltradas = reservasFiltradas.filter((reserva) => {
//         const fechaReserva = reserva.fecha
//           ? reserva.fecha.substring(0, 10)
//           : "";
//         return fechaReserva === fechaSeleccionada;
//       });
//     }

//     // FILTRO DE ESTADO
//     if (filtrosActuales.estado && filtrosActuales.estado !== "") {
//       reservasFiltradas = reservasFiltradas.filter(
//         (reserva) => reserva.estado === filtrosActuales.estado,
//       );
//     }

//     // FILTRO DE BÚSQUEDA
//     if (
//       filtrosActuales.busqueda &&
//       filtrosActuales.busqueda.trim().length >= 2
//     ) {
//       const busqueda = filtrosActuales.busqueda.trim().toLowerCase();
//       reservasFiltradas = reservasFiltradas.filter((reserva) => {
//         const nombre = reserva.cliente_nombre?.toLowerCase() || "";
//         const telefono = reserva.cliente_telefono?.toLowerCase() || "";
//         const codigo = reserva.codigo_reserva?.toLowerCase() || "";
//         const email = reserva.cliente_email?.toLowerCase() || "";
//         return (
//           nombre.includes(busqueda) ||
//           telefono.includes(busqueda) ||
//           codigo.includes(busqueda) ||
//           email.includes(busqueda)
//         );
//       });
//     }

//     setReservas(reservasFiltradas);
//   };

//   const actualizarFiltros = (nuevosFiltros) => {
//     setFiltros(nuevosFiltros);
//     aplicarFiltrosCompletos(reservasOriginales, nuevosFiltros);
//   };

//   const handleBusquedaChange = (e) => {
//     const valor = e.target.value;
//     const nuevosFiltros = { ...filtros, busqueda: valor };
//     setFiltros(nuevosFiltros);

//     if (searchTimeout) clearTimeout(searchTimeout);
//     const timeout = setTimeout(() => {
//       aplicarFiltrosCompletos(reservasOriginales, nuevosFiltros);
//     }, 300);
//     setSearchTimeout(timeout);
//   };

//   const handleFechaChange = (e) => {
//     const valor = e.target.value;
//     const nuevosFiltros = { ...filtros, fecha: valor };
//     setFiltros(nuevosFiltros);
//     aplicarFiltrosCompletos(reservasOriginales, nuevosFiltros);
//   };

//   const handleEstadoChange = (e) => {
//     const valor = e.target.value;
//     const nuevosFiltros = { ...filtros, estado: valor };
//     setFiltros(nuevosFiltros);
//     aplicarFiltrosCompletos(reservasOriginales, nuevosFiltros);
//   };

//   const filtrarHoy = () => {
//     const hoy = new Date();
//     const year = hoy.getFullYear();
//     const month = String(hoy.getMonth() + 1).padStart(2, "0");
//     const day = String(hoy.getDate()).padStart(2, "0");
//     const hoyStr = `${year}-${month}-${day}`;

//     const nuevosFiltros = {
//       ...filtros,
//       fecha: filtros.fecha === hoyStr ? "" : hoyStr,
//     };
//     setFiltros(nuevosFiltros);
//     aplicarFiltrosCompletos(reservasOriginales, nuevosFiltros);
//   };

//   const limpiarFiltros = () => {
//     const filtrosLimpios = { estado: "", fecha: "", busqueda: "" };
//     setFiltros(filtrosLimpios);
//     setReservas(reservasOriginales);
//   };

//   const aplicarFiltros = () => {
//     aplicarFiltrosCompletos(reservasOriginales, filtros);
//   };

//   const formatearFechaVisual = (fechaStr) => {
//     if (!fechaStr) return "";
//     const [year, month, day] = fechaStr.split("-");
//     return `${day}/${month}/${year}`;
//   };

//   const cargarHorasBloqueadas = async () => {
//     try {
//       const response = await axios.get(`${API_BASE}/horas-bloqueadas`);
//       setHorasBloqueadas(response.data.data || []);
//     } catch (err) {
//       console.error("Error al cargar horas bloqueadas:", err);
//     }
//   };

//   const bloquearHora = async (fecha, hora, reservaId) => {
//     try {
//       await axios.post(`${API_BASE}/horas-bloqueadas`, {
//         fecha,
//         hora,
//         motivo: "Reserva confirmada",
//         reserva_id: reservaId,
//       });
//       return true;
//     } catch (err) {
//       console.error("Error al bloquear hora:", err);
//       return false;
//     }
//   };

//   const desbloquearHora = async (fecha, hora) => {
//     try {
//       await axios.delete(
//         `${API_BASE}/horas-bloqueadas/fecha/${fecha}/hora/${hora}`,
//       );
//       return true;
//     } catch (err) {
//       try {
//         const horaBloqueada = horasBloqueadas.find(
//           (h) => h.fecha === fecha && h.hora === hora,
//         );
//         if (horaBloqueada) {
//           await axios.delete(
//             `${API_BASE}/horas-bloqueadas/${horaBloqueada.id}`,
//           );
//           return true;
//         }
//       } catch (secondErr) {
//         console.error("Error en segundo intento:", secondErr);
//       }
//       return false;
//     }
//   };

//   const abrirTicket = (reserva) => {
//     const profesional = profesionales.find(
//       (p) => p.id === reserva.especialista_id,
//     );
//     const servicio = servicios.find((s) => s.id === reserva.servicio_id) || {
//       nombre: reserva.servicio_nombre,
//       descripcion: reserva.servicio_descripcion || "",
//     };

//     setModalTicket({
//       abierto: true,
//       reserva,
//       profesional,
//       servicio,
//     });
//   };

//   const cambiarEstado = async (id, nuevoEstado, imprimirTicket = false) => {
//     try {
//       const reserva = reservas.find((r) => r.id === id);
//       await axios.patch(`${API_BASE}/reservas/${id}/estado`, {
//         estado: nuevoEstado,
//       });

//       if (nuevoEstado === "confirmada" && reserva) {
//         await bloquearHora(reserva.fecha, reserva.hora, id);
//         setSuccess("✅ Reserva confirmada - Hora bloqueada");
//       } else if (
//         nuevoEstado === "cancelada" &&
//         reserva?.estado === "confirmada"
//       ) {
//         await desbloquearHora(reserva.fecha, reserva.hora);
//         setSuccess("✅ Reserva cancelada - Hora desbloqueada");
//       } else if (nuevoEstado === "completada") {
//         setSuccess("✅ Reserva completada");
//         if (imprimirTicket) {
//           setTimeout(() => abrirTicket(reserva), 500);
//         }
//       } else {
//         setSuccess(`✅ Estado actualizado a: ${nuevoEstado}`);
//       }

//       cargarReservas();
//       cargarHorasBloqueadas();
//     } catch (err) {
//       setError("Error al cambiar el estado");
//       console.error(err);
//     }
//   };

//   const cambiarPago = async (id, pagado) => {
//     try {
//       await axios.patch(`${API_BASE}/reservas/${id}/pago`, { pagado });
//       setSuccess(`✅ Pago: ${pagado ? "Pagado" : "Pendiente"}`);
//       cargarReservas();
//     } catch (err) {
//       setError("Error al actualizar el pago");
//     }
//   };

//   const eliminarReserva = async (id) => {
//     if (window.confirm("¿Está seguro de eliminar esta reserva?")) {
//       try {
//         const reserva = reservas.find((r) => r.id === id);
//         if (reserva?.estado === "confirmada") {
//           await desbloquearHora(reserva.fecha, reserva.hora);
//         }
//         await axios.delete(`${API_BASE}/reservas/${id}`);
//         setSuccess("🗑️ Reserva eliminada");
//         cargarReservas();
//         cargarHorasBloqueadas();
//       } catch (err) {
//         setError("Error al eliminar la reserva");
//       }
//     }
//   };

//   const verDetalles = (reserva) => {
//     setReservaSeleccionada(reserva);
//     setDialogOpen(true);
//   };

//   const getEstadoColor = (estado) => {
//     switch (estado) {
//       case "pendiente":
//         return "warning";
//       case "confirmada":
//         return "info";
//       case "completada":
//         return "success";
//       case "cancelada":
//         return "error";
//       default:
//         return "default";
//     }
//   };

//   const getEstadoIcon = (estado) => {
//     switch (estado) {
//       case "pendiente":
//         return <ScheduleIcon fontSize="small" />;
//       case "confirmada":
//         return <CheckCircleOutlineIcon fontSize="small" />;
//       case "completada":
//         return <CheckCircleIcon fontSize="small" />;
//       case "cancelada":
//         return <CancelOutlinedIcon fontSize="small" />;
//       default:
//         return <EventIcon fontSize="small" />;
//     }
//   };

//   const getEstadoStyles = (estado) => {
//     switch (estado) {
//       case "pendiente":
//         return { bg: colors.pending, text: colors.pendingText };
//       case "confirmada":
//         return { bg: colors.confirmed, text: colors.confirmedText };
//       case "completada":
//         return { bg: colors.completed, text: colors.completedText };
//       case "cancelada":
//         return { bg: colors.cancelled, text: colors.cancelledText };
//       default:
//         return { bg: colors.border, text: colors.textSecondary };
//     }
//   };

//   const isHoraBloqueada = (fecha, hora) => {
//     return horasBloqueadas.some((h) => h.fecha === fecha && h.hora === hora);
//   };

//   const stats = {
//     total: reservasOriginales.length,
//     pendientes: reservasOriginales.filter((r) => r.estado === "pendiente")
//       .length,
//     confirmadas: reservasOriginales.filter((r) => r.estado === "confirmada")
//       .length,
//     completadas: reservasOriginales.filter((r) => r.estado === "completada")
//       .length,
//     pagadas: reservasOriginales.filter((r) => r.pagado === 1).length,
//     ingresos: reservasOriginales
//       .filter((r) => r.pagado === 1)
//       .reduce((acc, r) => acc + parseFloat(r.precio_total || 0), 0),
//   };

//   if (loading && reservasOriginales.length === 0) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           bgcolor: colors.background,
//         }}
//       >
//         <Paper
//           elevation={0}
//           sx={{
//             p: 6,
//             borderRadius: 2,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             background: colors.white,
//             border: `1px solid ${colors.border}`,
//           }}
//         >
//           <CircularProgress
//             size={70}
//             thickness={4}
//             sx={{ color: colors.primary, mb: 3 }}
//           />
//           <Typography
//             variant="h5"
//             fontWeight="600"
//             color="textPrimary"
//             gutterBottom
//           >
//             Cargando reservas
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             Espere un momento por favor
//           </Typography>
//         </Paper>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: colors.background, py: 4 }}>
//       <Container maxWidth="xl">
//         {/* Header Corporativo */}
//         <Zoom in={true} style={{ transitionDelay: "100ms" }}>
//           <Paper
//             elevation={0}
//             sx={{
//               p: 4,
//               mb: 4,
//               borderRadius: 2,
//               background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
//               color: "white",
//               position: "relative",
//               overflow: "hidden",
//               boxShadow: `0 4px 20px ${alpha(colors.primary, 0.3)}`,
//             }}
//           >
//             <Box
//               sx={{
//                 position: "absolute",
//                 top: -20,
//                 right: -20,
//                 width: 200,
//                 height: 200,
//                 borderRadius: "50%",
//                 background: "rgba(255,255,255,0.1)",
//                 zIndex: 0,
//               }}
//             />
//             <Box
//               sx={{
//                 position: "absolute",
//                 bottom: -40,
//                 left: -40,
//                 width: 200,
//                 height: 200,
//                 borderRadius: "50%",
//                 background: "rgba(255,255,255,0.08)",
//                 zIndex: 0,
//               }}
//             />
//             <Box sx={{ position: "relative", zIndex: 1 }}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <Box>
//                   <Typography
//                     variant="h3"
//                     fontWeight="700"
//                     sx={{
//                       fontSize: { xs: "1.8rem", md: "2.5rem" },
//                       letterSpacing: "-0.5px",
//                       mb: 1,
//                     }}
//                   >
//                     Gestión de Reservas
//                   </Typography>
//                   <Typography
//                     variant="h6"
//                     sx={{ opacity: 0.95, fontWeight: 400 }}
//                   >
//                     Panel administrativo • CRM Empresarial
//                   </Typography>
//                 </Box>
//                 <Avatar
//                   sx={{
//                     width: { xs: 60, md: 80 },
//                     height: { xs: 60, md: 80 },
//                     bgcolor: "rgba(255,255,255,0.2)",
//                     backdropFilter: "blur(10px)",
//                     border: "2px solid rgba(255,255,255,0.3)",
//                   }}
//                 >
//                   <DashboardIcon sx={{ fontSize: { xs: 30, md: 40 } }} />
//                 </Avatar>
//               </Box>
//             </Box>
//           </Paper>
//         </Zoom>

//         {/* Stats Cards */}
//         <Grid container spacing={3} sx={{ mb: 5 }}>
//           {[
//             {
//               icon: <EventIcon />,
//               label: "Total",
//               value: stats.total,
//               color: colors.primary,
//               delay: 100,
//             },
//             {
//               icon: <ScheduleIcon />,
//               label: "Pendientes",
//               value: stats.pendientes,
//               color: colors.warning,
//               delay: 200,
//             },
//             {
//               icon: <CheckCircleIcon />,
//               label: "Completadas",
//               value: stats.completadas,
//               color: colors.success,
//               delay: 300,
//             },
//             {
//               icon: <AttachMoney />,
//               label: "Ingresos",
//               value: `$${stats.ingresos.toLocaleString()}`,
//               color: colors.info,
//               delay: 400,
//             },
//           ].map((stat, idx) => (
//             <Grid item xs={12} sm={6} md={3} key={idx}>
//               <Zoom in={true} style={{ transitionDelay: `${stat.delay}ms` }}>
//                 <Card
//                   elevation={0}
//                   sx={{
//                     borderRadius: 2,
//                     border: `1px solid ${colors.border}`,
//                     transition: "all 0.3s",
//                     "&:hover": {
//                       transform: "translateY(-4px)",
//                       boxShadow: `0 8px 20px ${alpha(stat.color, 0.15)}`,
//                       borderColor: stat.color,
//                     },
//                   }}
//                 >
//                   <CardContent sx={{ p: 3 }}>
//                     <Stack direction="row" alignItems="center" spacing={2}>
//                       <Avatar
//                         sx={{
//                           width: 56,
//                           height: 56,
//                           bgcolor: alpha(stat.color, 0.1),
//                           color: stat.color,
//                         }}
//                       >
//                         {stat.icon}
//                       </Avatar>
//                       <Box>
//                         <Typography
//                           variant="caption"
//                           color="textSecondary"
//                           fontWeight={500}
//                           gutterBottom
//                         >
//                           {stat.label}
//                         </Typography>
//                         <Typography
//                           variant="h4"
//                           fontWeight="700"
//                           sx={{ color: stat.color, lineHeight: 1.2 }}
//                         >
//                           {stat.value}
//                         </Typography>
//                       </Box>
//                     </Stack>
//                   </CardContent>
//                 </Card>
//               </Zoom>
//             </Grid>
//           ))}
//         </Grid>

//         {/* FILTROS */}
//         <Paper
//           elevation={0}
//           sx={{
//             p: 3,
//             mb: 4,
//             borderRadius: 2,
//             border: `1px solid ${colors.border}`,
//             background: colors.white,
//           }}
//         >
//           <Grid container spacing={2} alignItems="center">
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 size="medium"
//                 placeholder="Buscar por nombre, teléfono, email o código..."
//                 value={filtros.busqueda}
//                 onChange={handleBusquedaChange}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon sx={{ color: colors.textMuted }} />
//                     </InputAdornment>
//                   ),
//                   endAdornment: filtros.busqueda && (
//                     <InputAdornment position="end">
//                       <IconButton
//                         size="small"
//                         onClick={() => {
//                           const nuevosFiltros = { ...filtros, busqueda: "" };
//                           setFiltros(nuevosFiltros);
//                           aplicarFiltrosCompletos(
//                             reservasOriginales,
//                             nuevosFiltros,
//                           );
//                         }}
//                       >
//                         <ClearIcon fontSize="small" />
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
//               />
//             </Grid>

//             <Grid item xs={12} md={2}>
//               <TextField
//                 fullWidth
//                 size="medium"
//                 type="date"
//                 label="Fecha específica"
//                 value={filtros.fecha}
//                 onChange={handleFechaChange}
//                 InputLabelProps={{ shrink: true }}
//                 sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
//               />
//             </Grid>

//             <Grid item xs={12} md={2}>
//               <Button
//                 variant={
//                   filtros.fecha === new Date().toISOString().split("T")[0]
//                     ? "contained"
//                     : "outlined"
//                 }
//                 onClick={filtrarHoy}
//                 fullWidth
//                 startIcon={<CalendarTodayIcon />}
//                 sx={{
//                   borderRadius: 1.5,
//                   py: 1.2,
//                   borderColor: colors.primary,
//                   color:
//                     filtros.fecha === new Date().toISOString().split("T")[0]
//                       ? "white"
//                       : colors.primary,
//                   bgcolor:
//                     filtros.fecha === new Date().toISOString().split("T")[0]
//                       ? colors.primary
//                       : "transparent",
//                   "&:hover": {
//                     bgcolor:
//                       filtros.fecha === new Date().toISOString().split("T")[0]
//                         ? colors.primaryDark
//                         : alpha(colors.primary, 0.05),
//                     borderColor: colors.primaryDark,
//                   },
//                 }}
//               >
//                 {filtros.fecha === new Date().toISOString().split("T")[0]
//                   ? "Hoy ✓"
//                   : "Hoy"}
//               </Button>
//             </Grid>

//             <Grid item xs={12} md={2}>
//               <FormControl fullWidth size="medium">
//                 <InputLabel>Estado</InputLabel>
//                 <Select
//                   value={filtros.estado}
//                   label="Estado"
//                   onChange={handleEstadoChange}
//                   sx={{ borderRadius: 1.5 }}
//                 >
//                   <MenuItem value="">Todos los estados</MenuItem>
//                   <MenuItem value="pendiente">Pendiente</MenuItem>
//                   <MenuItem value="confirmada">Confirmada</MenuItem>
//                   <MenuItem value="completada">Completada</MenuItem>
//                   <MenuItem value="cancelada">Cancelada</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12} md={2}>
//               <Stack direction="row" spacing={1}>
//                 <Button
//                   variant="contained"
//                   onClick={aplicarFiltros}
//                   fullWidth
//                   startIcon={<SearchIcon />}
//                   sx={{
//                     borderRadius: 1.5,
//                     py: 1.2,
//                     bgcolor: colors.primary,
//                     "&:hover": { bgcolor: colors.primaryDark },
//                   }}
//                 >
//                   Buscar
//                 </Button>
//                 <Tooltip title="Limpiar filtros">
//                   <IconButton
//                     onClick={limpiarFiltros}
//                     sx={{
//                       borderRadius: 1.5,
//                       border: `1px solid ${colors.border}`,
//                       "&:hover": {
//                         borderColor: colors.primary,
//                         color: colors.primary,
//                       },
//                     }}
//                   >
//                     <ClearIcon />
//                   </IconButton>
//                 </Tooltip>
//               </Stack>
//             </Grid>
//           </Grid>
//         </Paper>

//         {/* Tabla de Reservas */}
//         <Paper
//           elevation={0}
//           sx={{
//             borderRadius: 2,
//             border: `1px solid ${colors.border}`,
//             overflow: "hidden",
//           }}
//         >
//           <TableContainer sx={{ maxHeight: "calc(100vh - 400px)" }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow sx={{ bgcolor: colors.primaryLight }}>
//                   {[
//                     "Código",
//                     "Cliente",
//                     "Servicio",
//                     "Fecha",
//                     "Hora",
//                     "Estado",
//                     "Pago",
//                     "Total",
//                     "Acciones",
//                   ].map((header) => (
//                     <TableCell
//                       key={header}
//                       sx={{
//                         fontWeight: 600,
//                         bgcolor: colors.primaryLight,
//                         color: colors.textPrimary,
//                         borderBottom: `1px solid ${colors.border}`,
//                       }}
//                     >
//                       {header}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {reservas.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
//                       <Fade in={true}>
//                         <Box>
//                           <InventoryIcon
//                             sx={{
//                               fontSize: 64,
//                               color: colors.textMuted,
//                               mb: 2,
//                             }}
//                           />
//                           <Typography
//                             variant="h6"
//                             color="textSecondary"
//                             gutterBottom
//                           >
//                             No hay reservas para mostrar
//                           </Typography>
//                           <Typography variant="body2" color="textSecondary">
//                             {filtros.fecha
//                               ? `No hay reservas para la fecha ${formatearFechaVisual(filtros.fecha)}`
//                               : filtros.estado
//                                 ? `No hay reservas con estado "${filtros.estado}"`
//                                 : filtros.busqueda
//                                   ? `No se encontraron resultados para "${filtros.busqueda}"`
//                                   : "Intenta ajustar los filtros o crea una nueva reserva"}
//                           </Typography>
//                         </Box>
//                       </Fade>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   reservas.map((reserva, index) => (
//                     <Fade
//                       in={true}
//                       style={{ transitionDelay: `${index * 30}ms` }}
//                       key={reserva.id}
//                     >
//                       <TableRow
//                         hover
//                         sx={{
//                           "&:hover": {
//                             bgcolor: alpha(colors.primaryLight, 0.5),
//                           },
//                           transition: "background-color 0.2s",
//                           opacity: reserva.estado === "cancelada" ? 0.7 : 1,
//                         }}
//                       >
//                         <TableCell>
//                           <Typography
//                             variant="body2"
//                             fontWeight="600"
//                             sx={{
//                               color: colors.primary,
//                               fontFamily: "monospace",
//                               letterSpacing: "0.5px",
//                             }}
//                           >
//                             #{reserva.codigo_reserva}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Stack
//                             direction="row"
//                             alignItems="center"
//                             spacing={1.5}
//                           >
//                             <Avatar
//                               sx={{
//                                 width: 36,
//                                 height: 36,
//                                 bgcolor: alpha(colors.primary, 0.1),
//                                 color: colors.primary,
//                               }}
//                             >
//                               <PersonIcon sx={{ fontSize: 18 }} />
//                             </Avatar>
//                             <Box>
//                               <Typography
//                                 variant="body2"
//                                 fontWeight="600"
//                                 color="textPrimary"
//                               >
//                                 {reserva.cliente_nombre}
//                               </Typography>
//                               <Typography
//                                 variant="caption"
//                                 sx={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   gap: 0.5,
//                                   color: colors.textSecondary,
//                                 }}
//                               >
//                                 <PhoneIcon sx={{ fontSize: 12 }} />
//                                 {reserva.cliente_telefono}
//                               </Typography>
//                             </Box>
//                           </Stack>
//                         </TableCell>
//                         <TableCell>
//                           <Typography
//                             variant="body2"
//                             fontWeight="500"
//                             color="textSecondary"
//                           >
//                             {reserva.servicio_nombre}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Stack
//                             direction="row"
//                             alignItems="center"
//                             spacing={0.5}
//                           >
//                             <CalendarTodayIcon
//                               sx={{ fontSize: 14, color: colors.textMuted }}
//                             />
//                             <Typography variant="body2" color="textSecondary">
//                               {formatearFechaVisual(reserva.fecha)}
//                             </Typography>
//                           </Stack>
//                         </TableCell>
//                         <TableCell>
//                           <Stack
//                             direction="row"
//                             alignItems="center"
//                             spacing={0.5}
//                           >
//                             <TimeIcon
//                               sx={{ fontSize: 14, color: colors.textMuted }}
//                             />
//                             <Typography variant="body2" color="textSecondary">
//                               {reserva.hora}
//                             </Typography>
//                             {isHoraBloqueada(reserva.fecha, reserva.hora) &&
//                               reserva.estado === "confirmada" && (
//                                 <Chip
//                                   label="Bloqueada"
//                                   size="small"
//                                   sx={{
//                                     ml: 1,
//                                     height: 20,
//                                     fontSize: "0.625rem",
//                                     bgcolor: alpha(colors.info, 0.1),
//                                     color: colors.info,
//                                     fontWeight: 600,
//                                   }}
//                                 />
//                               )}
//                           </Stack>
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             icon={getEstadoIcon(reserva.estado)}
//                             label={
//                               reserva.estado.charAt(0).toUpperCase() +
//                               reserva.estado.slice(1)
//                             }
//                             color={getEstadoColor(reserva.estado)}
//                             size="small"
//                             sx={{ fontWeight: 600, borderRadius: 1 }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Chip
//                             label={reserva.pagado ? "Pagado" : "Pendiente"}
//                             color={reserva.pagado ? "success" : "warning"}
//                             size="small"
//                             variant={reserva.pagado ? "filled" : "outlined"}
//                             sx={{ fontWeight: 600, borderRadius: 1 }}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Typography
//                             variant="body2"
//                             fontWeight="700"
//                             sx={{ color: colors.primary }}
//                           >
//                             $
//                             {parseFloat(
//                               reserva.precio_total || 0,
//                             ).toLocaleString()}
//                           </Typography>
//                         </TableCell>
//                         <TableCell>
//                           <Stack direction="row" spacing={0.5}>
//                             <Tooltip title="Ver detalles" arrow>
//                               <IconButton
//                                 size="small"
//                                 onClick={() => verDetalles(reserva)}
//                                 sx={{
//                                   color: colors.info,
//                                   "&:hover": {
//                                     bgcolor: alpha(colors.info, 0.1),
//                                   },
//                                 }}
//                               >
//                                 <VisibilityIcon fontSize="small" />
//                               </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Confirmar reserva" arrow>
//                               <span>
//                                 <IconButton
//                                   size="small"
//                                   onClick={() =>
//                                     cambiarEstado(reserva.id, "confirmada")
//                                   }
//                                   sx={{
//                                     color: colors.primary,
//                                     "&:hover": {
//                                       bgcolor: alpha(colors.primary, 0.1),
//                                     },
//                                   }}
//                                   disabled={
//                                     reserva.estado === "confirmada" ||
//                                     reserva.estado === "cancelada" ||
//                                     reserva.estado === "completada"
//                                   }
//                                 >
//                                   <CheckCircleIcon fontSize="small" />
//                                 </IconButton>
//                               </span>
//                             </Tooltip>
//                             <Tooltip title="Marcar como pagado" arrow>
//                               <span>
//                                 <IconButton
//                                   size="small"
//                                   onClick={() => cambiarPago(reserva.id, true)}
//                                   sx={{
//                                     color: colors.success,
//                                     "&:hover": {
//                                       bgcolor: alpha(colors.success, 0.1),
//                                     },
//                                   }}
//                                   disabled={reserva.pagado === 1}
//                                 >
//                                   <PaymentIcon fontSize="small" />
//                                 </IconButton>
//                               </span>
//                             </Tooltip>
//                             {reserva.estado === "confirmada" && (
//                               <Tooltip
//                                 title="Completar e imprimir ticket"
//                                 arrow
//                               >
//                                 <IconButton
//                                   size="small"
//                                   onClick={() =>
//                                     cambiarEstado(
//                                       reserva.id,
//                                       "completada",
//                                       true,
//                                     )
//                                   }
//                                   sx={{
//                                     color: colors.success,
//                                     "&:hover": {
//                                       bgcolor: alpha(colors.success, 0.1),
//                                     },
//                                   }}
//                                 >
//                                   <PrintIcon fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                             )}
//                             {reserva.estado === "completada" && (
//                               <Tooltip title="Reimprimir ticket" arrow>
//                                 <IconButton
//                                   size="small"
//                                   onClick={() => abrirTicket(reserva)}
//                                   sx={{
//                                     color: colors.primary,
//                                     "&:hover": {
//                                       bgcolor: alpha(colors.primary, 0.1),
//                                     },
//                                   }}
//                                 >
//                                   <ReceiptIcon fontSize="small" />
//                                 </IconButton>
//                               </Tooltip>
//                             )}
//                             <Tooltip title="Cancelar reserva" arrow>
//                               <span>
//                                 <IconButton
//                                   size="small"
//                                   onClick={() =>
//                                     cambiarEstado(reserva.id, "cancelada")
//                                   }
//                                   sx={{
//                                     color: colors.error,
//                                     "&:hover": {
//                                       bgcolor: alpha(colors.error, 0.1),
//                                     },
//                                   }}
//                                   disabled={reserva.estado === "cancelada"}
//                                 >
//                                   <CancelIcon fontSize="small" />
//                                 </IconButton>
//                               </span>
//                             </Tooltip>
//                             <Tooltip title="Eliminar reserva" arrow>
//                               <IconButton
//                                 size="small"
//                                 onClick={() => eliminarReserva(reserva.id)}
//                                 sx={{
//                                   color: colors.error,
//                                   "&:hover": {
//                                     bgcolor: alpha(colors.error, 0.1),
//                                   },
//                                 }}
//                               >
//                                 <DeleteIcon fontSize="small" />
//                               </IconButton>
//                             </Tooltip>
//                           </Stack>
//                         </TableCell>
//                       </TableRow>
//                     </Fade>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       </Container>

//       {/* Dialog de detalles */}
//       <Dialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         maxWidth="md"
//         fullWidth
//         TransitionComponent={Fade}
//         PaperProps={{
//           sx: {
//             borderRadius: 2,
//             boxShadow: `0 8px 32px ${alpha(colors.primary, 0.15)}`,
//           },
//         }}
//       >
//         {reservaSeleccionada && (
//           <>
//             <DialogTitle
//               sx={{
//                 pb: 1,
//                 borderBottom: `1px solid ${colors.border}`,
//                 bgcolor: colors.primaryLight,
//               }}
//             >
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <Avatar sx={{ bgcolor: colors.primary }}>
//                   <ReceiptIcon />
//                 </Avatar>
//                 <Box>
//                   <Typography variant="h5" fontWeight="700" color="textPrimary">
//                     Detalles de la Reserva
//                   </Typography>
//                   <Stack
//                     direction="row"
//                     spacing={1}
//                     alignItems="center"
//                     sx={{ mt: 0.5 }}
//                   >
//                     <Typography variant="caption" color="textSecondary">
//                       Código:
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       fontWeight="600"
//                       sx={{ fontFamily: "monospace", color: colors.primary }}
//                     >
//                       {reservaSeleccionada.codigo_reserva}
//                     </Typography>
//                   </Stack>
//                 </Box>
//               </Stack>
//             </DialogTitle>
//             <DialogContent dividers sx={{ borderColor: colors.border, py: 3 }}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={6}>
//                   <Typography
//                     variant="subtitle2"
//                     color="textSecondary"
//                     fontWeight={600}
//                     gutterBottom
//                   >
//                     INFORMACIÓN DEL CLIENTE
//                   </Typography>
//                   <Paper
//                     variant="outlined"
//                     sx={{
//                       p: 2.5,
//                       borderRadius: 1.5,
//                       borderColor: colors.border,
//                       bgcolor: alpha(colors.primaryLight, 0.3),
//                     }}
//                   >
//                     <Stack spacing={2}>
//                       <Stack direction="row" alignItems="center" spacing={1.5}>
//                         <Avatar
//                           sx={{
//                             width: 32,
//                             height: 32,
//                             bgcolor: colors.primary,
//                           }}
//                         >
//                           <PersonIcon sx={{ fontSize: 18, color: "white" }} />
//                         </Avatar>
//                         <Typography
//                           variant="body1"
//                           fontWeight="600"
//                           color="textPrimary"
//                         >
//                           {reservaSeleccionada.cliente_nombre}
//                         </Typography>
//                       </Stack>
//                       <Stack direction="row" alignItems="center" spacing={1.5}>
//                         <PhoneIcon
//                           sx={{ fontSize: 18, color: colors.success }}
//                         />
//                         <Typography variant="body2" color="textSecondary">
//                           {reservaSeleccionada.cliente_telefono}
//                         </Typography>
//                       </Stack>
//                       {reservaSeleccionada.cliente_email && (
//                         <Stack
//                           direction="row"
//                           alignItems="center"
//                           spacing={1.5}
//                         >
//                           <EmailIcon
//                             sx={{ fontSize: 18, color: colors.info }}
//                           />
//                           <Typography variant="body2" color="textSecondary">
//                             {reservaSeleccionada.cliente_email}
//                           </Typography>
//                         </Stack>
//                       )}
//                     </Stack>
//                   </Paper>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Typography
//                     variant="subtitle2"
//                     color="textSecondary"
//                     fontWeight={600}
//                     gutterBottom
//                   >
//                     DETALLES DEL SERVICIO
//                   </Typography>
//                   <Paper
//                     variant="outlined"
//                     sx={{
//                       p: 2.5,
//                       borderRadius: 1.5,
//                       borderColor: colors.border,
//                       bgcolor: alpha(colors.primaryLight, 0.3),
//                     }}
//                   >
//                     <Stack spacing={2}>
//                       <Typography
//                         variant="body1"
//                         fontWeight="600"
//                         sx={{ color: colors.primaryDark }}
//                       >
//                         {reservaSeleccionada.servicio_nombre}
//                       </Typography>
//                       <Stack direction="row" spacing={2}>
//                         <Stack direction="row" alignItems="center" spacing={1}>
//                           <CalendarTodayIcon
//                             sx={{ fontSize: 16, color: colors.primary }}
//                           />
//                           <Typography variant="body2" color="textSecondary">
//                             {formatearFechaVisual(reservaSeleccionada.fecha)}
//                           </Typography>
//                         </Stack>
//                         <Stack direction="row" alignItems="center" spacing={1}>
//                           <TimeIcon
//                             sx={{ fontSize: 16, color: colors.primary }}
//                           />
//                           <Typography variant="body2" color="textSecondary">
//                             {reservaSeleccionada.hora}
//                           </Typography>
//                         </Stack>
//                       </Stack>
//                     </Stack>
//                   </Paper>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Divider sx={{ my: 1, borderColor: colors.border }} />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Typography
//                     variant="subtitle2"
//                     color="textSecondary"
//                     fontWeight={600}
//                     gutterBottom
//                   >
//                     ESTADO DE LA RESERVA
//                   </Typography>
//                   <Chip
//                     icon={getEstadoIcon(reservaSeleccionada.estado)}
//                     label={
//                       reservaSeleccionada.estado.charAt(0).toUpperCase() +
//                       reservaSeleccionada.estado.slice(1)
//                     }
//                     color={getEstadoColor(reservaSeleccionada.estado)}
//                     sx={{ fontWeight: 600, px: 1 }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Typography
//                     variant="subtitle2"
//                     color="textSecondary"
//                     fontWeight={600}
//                     gutterBottom
//                   >
//                     ESTADO DE PAGO
//                   </Typography>
//                   <Chip
//                     label={reservaSeleccionada.pagado ? "Pagado" : "Pendiente"}
//                     color={reservaSeleccionada.pagado ? "success" : "warning"}
//                     sx={{ fontWeight: 600, px: 1 }}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Divider sx={{ my: 1, borderColor: colors.border }} />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Paper
//                     sx={{
//                       p: 2,
//                       borderRadius: 1.5,
//                       bgcolor: alpha(colors.primaryLight, 0.5),
//                       border: `1px solid ${colors.border}`,
//                     }}
//                   >
//                     <Stack
//                       direction="row"
//                       justifyContent="space-between"
//                       alignItems="center"
//                     >
//                       <Typography
//                         variant="h6"
//                         fontWeight="600"
//                         color="textPrimary"
//                       >
//                         Total a pagar
//                       </Typography>
//                       <Typography
//                         variant="h4"
//                         fontWeight="700"
//                         sx={{ color: colors.primary }}
//                       >
//                         $
//                         {parseFloat(
//                           reservaSeleccionada.precio_total || 0,
//                         ).toLocaleString()}
//                       </Typography>
//                     </Stack>
//                   </Paper>
//                 </Grid>
//               </Grid>
//             </DialogContent>
//             <DialogActions
//               sx={{ p: 3, bgcolor: alpha(colors.primaryLight, 0.3) }}
//             >
//               <Button
//                 onClick={() => setDialogOpen(false)}
//                 variant="outlined"
//                 sx={{
//                   borderRadius: 1.5,
//                   borderColor: colors.border,
//                   color: colors.textSecondary,
//                 }}
//               >
//                 Cerrar
//               </Button>
//               {reservaSeleccionada.estado === "completada" && (
//                 <Button
//                   onClick={() => {
//                     abrirTicket(reservaSeleccionada);
//                     setDialogOpen(false);
//                   }}
//                   variant="contained"
//                   startIcon={<ReceiptIcon />}
//                   sx={{
//                     borderRadius: 1.5,
//                     bgcolor: colors.primary,
//                     "&:hover": { bgcolor: colors.primaryDark },
//                   }}
//                 >
//                   Ver Ticket
//                 </Button>
//               )}
//               {reservaSeleccionada.estado === "pendiente" && (
//                 <Button
//                   onClick={() => {
//                     cambiarEstado(reservaSeleccionada.id, "confirmada");
//                     setDialogOpen(false);
//                   }}
//                   variant="contained"
//                   startIcon={<CheckCircleIcon />}
//                   sx={{
//                     borderRadius: 1.5,
//                     bgcolor: colors.primary,
//                     "&:hover": { bgcolor: colors.primaryDark },
//                   }}
//                 >
//                   Confirmar y Bloquear Hora
//                 </Button>
//               )}
//             </DialogActions>
//           </>
//         )}
//       </Dialog>

//       {/* MODAL DEL TICKET */}
//       <Dialog
//         open={modalTicket.abierto}
//         onClose={() => setModalTicket({ ...modalTicket, abierto: false })}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: { borderRadius: 2, maxWidth: "90mm", mx: "auto" },
//         }}
//       >
//         <DialogContent sx={{ p: 0, bgcolor: "#f8fafc" }}>
//           {modalTicket.reserva && (
//             <TicketPrint
//               reserva={modalTicket.reserva}
//               profesional={modalTicket.profesional}
//               servicio={modalTicket.servicio}
//               onClose={() => setModalTicket({ ...modalTicket, abierto: false })}
//             />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Snackbars */}
//       <Snackbar
//         open={!!error}
//         autoHideDuration={5000}
//         onClose={() => setError("")}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         TransitionComponent={Fade}
//       >
//         <Alert severity="error" variant="filled" sx={{ borderRadius: 1.5 }}>
//           {error}
//         </Alert>
//       </Snackbar>
//       <Snackbar
//         open={!!success}
//         autoHideDuration={4000}
//         onClose={() => setSuccess("")}
//         anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//         TransitionComponent={Fade}
//       >
//         <Alert
//           severity="success"
//           variant="filled"
//           sx={{ borderRadius: 1.5, bgcolor: colors.success }}
//         >
//           {success}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default AdminReservas;

// src/admin/AdminReservas.jsx - VERSIÓN PROFESIONAL CRM EMPRESARIAL CON VISTA MÓVIL
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
} from "@mui/material";
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Payment as PaymentIcon,
  Search as SearchIcon,
  Event as EventIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AttachMoney,
  Inventory as InventoryIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CancelOutlined as CancelOutlinedIcon,
  Schedule as ScheduleIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";

import TicketPrint from "./TicketPrint";

const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [reservasOriginales, setReservasOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profesionales, setProfesionales] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [modalTicket, setModalTicket] = useState({
    abierto: false,
    reserva: null,
    profesional: null,
    servicio: null,
  });
  const [filtros, setFiltros] = useState({
    estado: "",
    fecha: "",
    busqueda: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [horasBloqueadas, setHorasBloqueadas] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const colors = {
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    primaryLight: "#eff6ff",
    secondary: "#64748b",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#06b6d4",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    textMuted: "#9ca3af",
    border: "#e5e7eb",
    background: "#f9fafb",
    white: "#ffffff",
    pending: "#fef3c7",
    pendingText: "#d97706",
    confirmed: "#dbeafe",
    confirmedText: "#2563eb",
    completed: "#d1fae5",
    completedText: "#059669",
    cancelled: "#fee2e2",
    cancelledText: "#dc2626",
  };

  useEffect(() => {
    const cargarDatosTicket = async () => {
      try {
        const [profRes, servRes] = await Promise.all([
          axios.get(`${API_BASE}/especialistas`),
          axios.get(`${API_BASE}/servicios`),
        ]);
        if (profRes.data.success) setProfesionales(profRes.data.data);
        if (servRes.data.success) setServicios(servRes.data.data);
      } catch (error) {
        console.error("Error cargando datos para tickets:", error);
      }
    };
    cargarDatosTicket();
  }, []);

  useEffect(() => {
    cargarReservas();
    cargarHorasBloqueadas();
  }, []);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/reservas`);
      let todasLasReservas = response.data.data || [];
      todasLasReservas = todasLasReservas.map((reserva) => ({
        ...reserva,
        fecha: reserva.fecha ? reserva.fecha.split("T")[0] : reserva.fecha,
      }));
      setReservasOriginales(todasLasReservas);
      aplicarFiltrosCompletos(todasLasReservas, filtros);
      setError("");
    } catch (err) {
      setError("Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltrosCompletos = (reservasParaFiltrar, filtrosActuales) => {
    let reservasFiltradas = [...reservasParaFiltrar];
    if (filtrosActuales.fecha && filtrosActuales.fecha !== "") {
      reservasFiltradas = reservasFiltradas.filter((reserva) => {
        const fechaReserva = reserva.fecha
          ? reserva.fecha.substring(0, 10)
          : "";
        return fechaReserva === filtrosActuales.fecha;
      });
    }
    if (filtrosActuales.estado && filtrosActuales.estado !== "") {
      reservasFiltradas = reservasFiltradas.filter(
        (reserva) => reserva.estado === filtrosActuales.estado,
      );
    }
    if (
      filtrosActuales.busqueda &&
      filtrosActuales.busqueda.trim().length >= 2
    ) {
      const busqueda = filtrosActuales.busqueda.trim().toLowerCase();
      reservasFiltradas = reservasFiltradas.filter((reserva) => {
        const nombre = reserva.cliente_nombre?.toLowerCase() || "";
        const telefono = reserva.cliente_telefono?.toLowerCase() || "";
        const codigo = reserva.codigo_reserva?.toLowerCase() || "";
        const email = reserva.cliente_email?.toLowerCase() || "";
        return (
          nombre.includes(busqueda) ||
          telefono.includes(busqueda) ||
          codigo.includes(busqueda) ||
          email.includes(busqueda)
        );
      });
    }
    setReservas(reservasFiltradas);
  };

  const actualizarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    aplicarFiltrosCompletos(reservasOriginales, nuevosFiltros);
  };

  const handleBusquedaChange = (e) => {
    const valor = e.target.value;
    const nuevosFiltros = { ...filtros, busqueda: valor };
    setFiltros(nuevosFiltros);
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(
      () => aplicarFiltrosCompletos(reservasOriginales, nuevosFiltros),
      300,
    );
    setSearchTimeout(timeout);
  };

  const handleFechaChange = (e) => {
    const nuevosFiltros = { ...filtros, fecha: e.target.value };
    setFiltros(nuevosFiltros);
    aplicarFiltrosCompletos(reservasOriginales, nuevosFiltros);
  };

  const handleEstadoChange = (e) => {
    const nuevosFiltros = { ...filtros, estado: e.target.value };
    setFiltros(nuevosFiltros);
    aplicarFiltrosCompletos(reservasOriginales, nuevosFiltros);
  };

  const filtrarHoy = () => {
    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
    const nuevosFiltros = {
      ...filtros,
      fecha: filtros.fecha === hoyStr ? "" : hoyStr,
    };
    setFiltros(nuevosFiltros);
    aplicarFiltrosCompletos(reservasOriginales, nuevosFiltros);
  };

  const limpiarFiltros = () => {
    const filtrosLimpios = { estado: "", fecha: "", busqueda: "" };
    setFiltros(filtrosLimpios);
    setReservas(reservasOriginales);
  };

  const aplicarFiltros = () =>
    aplicarFiltrosCompletos(reservasOriginales, filtros);

  const formatearFechaVisual = (fechaStr) => {
    if (!fechaStr) return "";
    const [year, month, day] = fechaStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const cargarHorasBloqueadas = async () => {
    try {
      const response = await axios.get(`${API_BASE}/horas-bloqueadas`);
      setHorasBloqueadas(response.data.data || []);
    } catch (err) {
      console.error("Error al cargar horas bloqueadas:", err);
    }
  };

  const bloquearHora = async (fecha, hora, reservaId) => {
    try {
      await axios.post(`${API_BASE}/horas-bloqueadas`, {
        fecha,
        hora,
        motivo: "Reserva confirmada",
        reserva_id: reservaId,
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  const desbloquearHora = async (fecha, hora) => {
    try {
      await axios.delete(
        `${API_BASE}/horas-bloqueadas/fecha/${fecha}/hora/${hora}`,
      );
      return true;
    } catch (err) {
      try {
        const horaBloqueada = horasBloqueadas.find(
          (h) => h.fecha === fecha && h.hora === hora,
        );
        if (horaBloqueada) {
          await axios.delete(
            `${API_BASE}/horas-bloqueadas/${horaBloqueada.id}`,
          );
          return true;
        }
      } catch (secondErr) {}
      return false;
    }
  };

  const abrirTicket = (reserva) => {
    const profesional = profesionales.find(
      (p) => p.id === reserva.especialista_id,
    );
    const servicio = servicios.find((s) => s.id === reserva.servicio_id) || {
      nombre: reserva.servicio_nombre,
      descripcion: reserva.servicio_descripcion || "",
    };
    setModalTicket({ abierto: true, reserva, profesional, servicio });
  };

  const cambiarEstado = async (id, nuevoEstado, imprimirTicket = false) => {
    try {
      const reserva = reservas.find((r) => r.id === id);
      await axios.patch(`${API_BASE}/reservas/${id}/estado`, {
        estado: nuevoEstado,
      });
      if (nuevoEstado === "confirmada" && reserva) {
        await bloquearHora(reserva.fecha, reserva.hora, id);
        setSuccess("✅ Reserva confirmada - Hora bloqueada");
      } else if (
        nuevoEstado === "cancelada" &&
        reserva?.estado === "confirmada"
      ) {
        await desbloquearHora(reserva.fecha, reserva.hora);
        setSuccess("✅ Reserva cancelada - Hora desbloqueada");
      } else if (nuevoEstado === "completada") {
        setSuccess("✅ Reserva completada");
        if (imprimirTicket) setTimeout(() => abrirTicket(reserva), 500);
      } else {
        setSuccess(`✅ Estado actualizado a: ${nuevoEstado}`);
      }
      cargarReservas();
      cargarHorasBloqueadas();
    } catch (err) {
      setError("Error al cambiar el estado");
    }
  };

  const cambiarPago = async (id, pagado) => {
    try {
      await axios.patch(`${API_BASE}/reservas/${id}/pago`, { pagado });
      setSuccess(`✅ Pago: ${pagado ? "Pagado" : "Pendiente"}`);
      cargarReservas();
    } catch (err) {
      setError("Error al actualizar el pago");
    }
  };

  const eliminarReserva = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta reserva?")) {
      try {
        const reserva = reservas.find((r) => r.id === id);
        if (reserva?.estado === "confirmada")
          await desbloquearHora(reserva.fecha, reserva.hora);
        await axios.delete(`${API_BASE}/reservas/${id}`);
        setSuccess("🗑️ Reserva eliminada");
        cargarReservas();
        cargarHorasBloqueadas();
      } catch (err) {
        setError("Error al eliminar la reserva");
      }
    }
  };

  const verDetalles = (reserva) => {
    setReservaSeleccionada(reserva);
    setDialogOpen(true);
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
        return <ScheduleIcon fontSize="small" />;
      case "confirmada":
        return <CheckCircleOutlineIcon fontSize="small" />;
      case "completada":
        return <CheckCircleIcon fontSize="small" />;
      case "cancelada":
        return <CancelOutlinedIcon fontSize="small" />;
      default:
        return <EventIcon fontSize="small" />;
    }
  };

  const isHoraBloqueada = (fecha, hora) =>
    horasBloqueadas.some((h) => h.fecha === fecha && h.hora === hora);

  const stats = {
    total: reservasOriginales.length,
    pendientes: reservasOriginales.filter((r) => r.estado === "pendiente")
      .length,
    completadas: reservasOriginales.filter((r) => r.estado === "completada")
      .length,
    ingresos: reservasOriginales
      .filter((r) => r.pagado === 1)
      .reduce((acc, r) => acc + parseFloat(r.precio_total || 0), 0),
  };

  const AccionesReserva = ({ reserva }) => (
    <Stack direction="row" spacing={0.5} flexWrap="wrap">
      <Tooltip title="Ver detalles" arrow>
        <IconButton
          size="small"
          onClick={() => verDetalles(reserva)}
          sx={{
            color: colors.info,
            "&:hover": { bgcolor: alpha(colors.info, 0.1) },
          }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Confirmar reserva" arrow>
        <span>
          <IconButton
            size="small"
            onClick={() => cambiarEstado(reserva.id, "confirmada")}
            sx={{
              color: colors.primary,
              "&:hover": { bgcolor: alpha(colors.primary, 0.1) },
            }}
            disabled={
              reserva.estado === "confirmada" ||
              reserva.estado === "cancelada" ||
              reserva.estado === "completada"
            }
          >
            <CheckCircleIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Marcar como pagado" arrow>
        <span>
          <IconButton
            size="small"
            onClick={() => cambiarPago(reserva.id, true)}
            sx={{
              color: colors.success,
              "&:hover": { bgcolor: alpha(colors.success, 0.1) },
            }}
            disabled={reserva.pagado === 1}
          >
            <PaymentIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      {reserva.estado === "confirmada" && (
        <Tooltip title="Completar e imprimir ticket" arrow>
          <IconButton
            size="small"
            onClick={() => cambiarEstado(reserva.id, "completada", true)}
            sx={{
              color: colors.success,
              "&:hover": { bgcolor: alpha(colors.success, 0.1) },
            }}
          >
            <PrintIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {reserva.estado === "completada" && (
        <Tooltip title="Reimprimir ticket" arrow>
          <IconButton
            size="small"
            onClick={() => abrirTicket(reserva)}
            sx={{
              color: colors.primary,
              "&:hover": { bgcolor: alpha(colors.primary, 0.1) },
            }}
          >
            <ReceiptIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Cancelar reserva" arrow>
        <span>
          <IconButton
            size="small"
            onClick={() => cambiarEstado(reserva.id, "cancelada")}
            sx={{
              color: colors.error,
              "&:hover": { bgcolor: alpha(colors.error, 0.1) },
            }}
            disabled={reserva.estado === "cancelada"}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Eliminar reserva" arrow>
        <IconButton
          size="small"
          onClick={() => eliminarReserva(reserva.id)}
          sx={{
            color: colors.error,
            "&:hover": { bgcolor: alpha(colors.error, 0.1) },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  if (loading && reservasOriginales.length === 0) {
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
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: colors.white,
            border: `1px solid ${colors.border}`,
          }}
        >
          <CircularProgress
            size={70}
            thickness={4}
            sx={{ color: colors.primary, mb: 3 }}
          />
          <Typography variant="h5" fontWeight="600" gutterBottom>
            Cargando reservas
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Espere un momento por favor
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: colors.background,
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
        {/* Header */}
        <Zoom in={true} style={{ transitionDelay: "100ms" }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 4 },
              mb: { xs: 2, md: 4 },
              borderRadius: 2,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
              color: "white",
              position: "relative",
              overflow: "hidden",
              boxShadow: `0 4px 20px ${alpha(colors.primary, 0.3)}`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                zIndex: 0,
              }}
            />
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight="700"
                    sx={{
                      fontSize: { xs: "1.4rem", md: "2.5rem" },
                      letterSpacing: "-0.5px",
                      mb: 0.5,
                    }}
                  >
                    Gestión de Reservas
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      opacity: 0.95,
                      fontWeight: 400,
                      fontSize: { xs: "0.85rem", md: "1.25rem" },
                    }}
                  >
                    Panel administrativo • CRM Empresarial
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: { xs: 48, md: 80 },
                    height: { xs: 48, md: 80 },
                    bgcolor: "rgba(255,255,255,0.2)",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <DashboardIcon sx={{ fontSize: { xs: 24, md: 40 } }} />
                </Avatar>
              </Box>
            </Box>
          </Paper>
        </Zoom>

        {/* Stats Cards */}
        <Grid
          container
          spacing={{ xs: 1.5, md: 3 }}
          sx={{ mb: { xs: 2, md: 5 } }}
        >
          {[
            {
              icon: <EventIcon />,
              label: "Total",
              value: stats.total,
              color: colors.primary,
              delay: 100,
            },
            {
              icon: <ScheduleIcon />,
              label: "Pendientes",
              value: stats.pendientes,
              color: colors.warning,
              delay: 200,
            },
            {
              icon: <CheckCircleIcon />,
              label: "Completadas",
              value: stats.completadas,
              color: colors.success,
              delay: 300,
            },
            {
              icon: <AttachMoney />,
              label: "Ingresos",
              value: `$${stats.ingresos.toLocaleString()}`,
              color: colors.info,
              delay: 400,
            },
          ].map((stat, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Zoom in={true} style={{ transitionDelay: `${stat.delay}ms` }}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${colors.border}`,
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 20px ${alpha(stat.color, 0.15)}`,
                      borderColor: stat.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, md: 3 } }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={{ xs: 1, md: 2 }}
                    >
                      <Avatar
                        sx={{
                          width: { xs: 36, md: 56 },
                          height: { xs: 36, md: 56 },
                          bgcolor: alpha(stat.color, 0.1),
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          fontWeight={500}
                        >
                          {stat.label}
                        </Typography>
                        <Typography
                          variant="h4"
                          fontWeight="700"
                          sx={{
                            color: stat.color,
                            lineHeight: 1.2,
                            fontSize: { xs: "1.3rem", md: "2.125rem" },
                          }}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Filtros */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: { xs: 2, md: 4 },
            borderRadius: 2,
            border: `1px solid ${colors.border}`,
            background: colors.white,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="medium"
                placeholder="Buscar por nombre, teléfono, email o código..."
                value={filtros.busqueda}
                onChange={handleBusquedaChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: colors.textMuted }} />
                    </InputAdornment>
                  ),
                  endAdornment: filtros.busqueda && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          const f = { ...filtros, busqueda: "" };
                          setFiltros(f);
                          aplicarFiltrosCompletos(reservasOriginales, f);
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="medium"
                type="date"
                label="Fecha específica"
                value={filtros.fecha}
                onChange={handleFechaChange}
                InputLabelProps={{ shrink: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant={
                  filtros.fecha === new Date().toISOString().split("T")[0]
                    ? "contained"
                    : "outlined"
                }
                onClick={filtrarHoy}
                fullWidth
                startIcon={<CalendarTodayIcon />}
                sx={{
                  borderRadius: 1.5,
                  py: 1.2,
                  borderColor: colors.primary,
                  color:
                    filtros.fecha === new Date().toISOString().split("T")[0]
                      ? "white"
                      : colors.primary,
                  bgcolor:
                    filtros.fecha === new Date().toISOString().split("T")[0]
                      ? colors.primary
                      : "transparent",
                  "&:hover": {
                    bgcolor:
                      filtros.fecha === new Date().toISOString().split("T")[0]
                        ? colors.primaryDark
                        : alpha(colors.primary, 0.05),
                  },
                }}
              >
                {filtros.fecha === new Date().toISOString().split("T")[0]
                  ? "Hoy ✓"
                  : "Hoy"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="medium">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filtros.estado}
                  label="Estado"
                  onChange={handleEstadoChange}
                  sx={{ borderRadius: 1.5 }}
                >
                  <MenuItem value="">Todos los estados</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="confirmada">Confirmada</MenuItem>
                  <MenuItem value="completada">Completada</MenuItem>
                  <MenuItem value="cancelada">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={aplicarFiltros}
                  fullWidth
                  startIcon={<SearchIcon />}
                  sx={{
                    borderRadius: 1.5,
                    py: 1.2,
                    bgcolor: colors.primary,
                    "&:hover": { bgcolor: colors.primaryDark },
                  }}
                >
                  Buscar
                </Button>
                <Tooltip title="Limpiar filtros">
                  <IconButton
                    onClick={limpiarFiltros}
                    sx={{
                      borderRadius: 1.5,
                      border: `1px solid ${colors.border}`,
                      "&:hover": {
                        borderColor: colors.primary,
                        color: colors.primary,
                      },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* ===== TABLA DESKTOP ===== */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: `1px solid ${colors.border}`,
            overflow: "hidden",
            display: { xs: "none", md: "block" },
          }}
        >
          <TableContainer sx={{ maxHeight: "calc(100vh - 400px)" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "Código",
                    "Cliente",
                    "Servicio",
                    "Fecha",
                    "Hora",
                    "Estado",
                    "Pago",
                    "Total",
                    "Acciones",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 600,
                        bgcolor: colors.primaryLight,
                        color: colors.textPrimary,
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reservas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                      <Fade in={true}>
                        <Box>
                          <InventoryIcon
                            sx={{
                              fontSize: 64,
                              color: colors.textMuted,
                              mb: 2,
                            }}
                          />
                          <Typography
                            variant="h6"
                            color="textSecondary"
                            gutterBottom
                          >
                            No hay reservas para mostrar
                          </Typography>
                        </Box>
                      </Fade>
                    </TableCell>
                  </TableRow>
                ) : (
                  reservas.map((reserva, index) => (
                    <Fade
                      in={true}
                      style={{ transitionDelay: `${index * 30}ms` }}
                      key={reserva.id}
                    >
                      <TableRow
                        hover
                        sx={{
                          "&:hover": {
                            bgcolor: alpha(colors.primaryLight, 0.5),
                          },
                          transition: "background-color 0.2s",
                          opacity: reserva.estado === "cancelada" ? 0.7 : 1,
                        }}
                      >
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            sx={{
                              color: colors.primary,
                              fontFamily: "monospace",
                            }}
                          >
                            #{reserva.codigo_reserva}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                          >
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: alpha(colors.primary, 0.1),
                                color: colors.primary,
                              }}
                            >
                              <PersonIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="600">
                                {reserva.cliente_nombre}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  color: colors.textSecondary,
                                }}
                              >
                                <PhoneIcon sx={{ fontSize: 12 }} />
                                {reserva.cliente_telefono}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight="500"
                            color="textSecondary"
                          >
                            {reserva.servicio_nombre}
                          </Typography>
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
                            <Typography variant="body2" color="textSecondary">
                              {formatearFechaVisual(reserva.fecha)}
                            </Typography>
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
                            <Typography variant="body2" color="textSecondary">
                              {reserva.hora}
                            </Typography>
                            {isHoraBloqueada(reserva.fecha, reserva.hora) &&
                              reserva.estado === "confirmada" && (
                                <Chip
                                  label="Bloqueada"
                                  size="small"
                                  sx={{
                                    ml: 1,
                                    height: 20,
                                    fontSize: "0.625rem",
                                    bgcolor: alpha(colors.info, 0.1),
                                    color: colors.info,
                                    fontWeight: 600,
                                  }}
                                />
                              )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getEstadoIcon(reserva.estado)}
                            label={
                              reserva.estado.charAt(0).toUpperCase() +
                              reserva.estado.slice(1)
                            }
                            color={getEstadoColor(reserva.estado)}
                            size="small"
                            sx={{ fontWeight: 600, borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={reserva.pagado ? "Pagado" : "Pendiente"}
                            color={reserva.pagado ? "success" : "warning"}
                            size="small"
                            variant={reserva.pagado ? "filled" : "outlined"}
                            sx={{ fontWeight: 600, borderRadius: 1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight="700"
                            sx={{ color: colors.primary }}
                          >
                            $
                            {parseFloat(
                              reserva.precio_total || 0,
                            ).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <AccionesReserva reserva={reserva} />
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* ===== VISTA TARJETAS MÓVIL ===== */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          {reservas.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <InventoryIcon
                sx={{ fontSize: 64, color: colors.textMuted, mb: 2 }}
              />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No hay reservas para mostrar
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Intenta ajustar los filtros
              </Typography>
            </Box>
          ) : (
            reservas.map((reserva, index) => (
              <Fade
                in={true}
                style={{ transitionDelay: `${index * 30}ms` }}
                key={reserva.id}
              >
                <Card
                  elevation={0}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    border: `1px solid ${colors.border}`,
                    opacity: reserva.estado === "cancelada" ? 0.7 : 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: `0 4px 12px ${alpha(colors.primary, 0.1)}`,
                      borderColor: colors.primary,
                    },
                  }}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    {/* Fila 1: Código + Chips de estado */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1.5}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="700"
                        sx={{
                          color: colors.primary,
                          fontFamily: "monospace",
                          fontSize: "0.8rem",
                        }}
                      >
                        #{reserva.codigo_reserva}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        flexWrap="wrap"
                        justifyContent="flex-end"
                      >
                        <Chip
                          icon={getEstadoIcon(reserva.estado)}
                          label={
                            reserva.estado.charAt(0).toUpperCase() +
                            reserva.estado.slice(1)
                          }
                          color={getEstadoColor(reserva.estado)}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                        />
                        <Chip
                          label={reserva.pagado ? "Pagado" : "Pendiente"}
                          color={reserva.pagado ? "success" : "warning"}
                          size="small"
                          variant={reserva.pagado ? "filled" : "outlined"}
                          sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                        />
                      </Stack>
                    </Stack>

                    {/* Fila 2: Cliente */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      mb={1.5}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: alpha(colors.primary, 0.1),
                          color: colors.primary,
                          flexShrink: 0,
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" fontWeight="600" noWrap>
                          {reserva.cliente_nombre}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <PhoneIcon
                            sx={{ fontSize: 12, color: colors.textMuted }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {reserva.cliente_telefono}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>

                    {/* Fila 3: Servicio */}
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      mb={1}
                      noWrap
                      sx={{ fontWeight: 500 }}
                    >
                      {reserva.servicio_nombre}
                    </Typography>

                    {/* Fila 4: Fecha, Hora, Total */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      mb={1.5}
                      flexWrap="wrap"
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <CalendarTodayIcon
                          sx={{ fontSize: 13, color: colors.textMuted }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          {formatearFechaVisual(reserva.fecha)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <TimeIcon
                          sx={{ fontSize: 13, color: colors.textMuted }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          {reserva.hora}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        fontWeight="700"
                        sx={{ color: colors.primary, ml: "auto" }}
                      >
                        $
                        {parseFloat(reserva.precio_total || 0).toLocaleString()}
                      </Typography>
                    </Stack>

                    <Divider sx={{ mb: 1.5, borderColor: colors.border }} />

                    {/* Acciones */}
                    <AccionesReserva reserva={reserva} />
                  </CardContent>
                </Card>
              </Fade>
            ))
          )}
        </Box>
      </Container>

      {/* Dialog detalles */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{ sx: { borderRadius: 2, mx: { xs: 1, md: 2 } } }}
      >
        {reservaSeleccionada && (
          <>
            <DialogTitle
              sx={{
                pb: 1,
                borderBottom: `1px solid ${colors.border}`,
                bgcolor: colors.primaryLight,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: colors.primary }}>
                  <ReceiptIcon />
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="700"
                    sx={{ fontSize: { xs: "1.1rem", md: "1.5rem" } }}
                  >
                    Detalles de la Reserva
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 0.5 }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      Código:
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ fontFamily: "monospace", color: colors.primary }}
                    >
                      {reservaSeleccionada.codigo_reserva}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent dividers sx={{ borderColor: colors.border, py: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    fontWeight={600}
                    gutterBottom
                  >
                    INFORMACIÓN DEL CLIENTE
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: 1.5,
                      borderColor: colors.border,
                      bgcolor: alpha(colors.primaryLight, 0.3),
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: colors.primary,
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 18, color: "white" }} />
                        </Avatar>
                        <Typography variant="body1" fontWeight="600">
                          {reservaSeleccionada.cliente_nombre}
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <PhoneIcon
                          sx={{ fontSize: 18, color: colors.success }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          {reservaSeleccionada.cliente_telefono}
                        </Typography>
                      </Stack>
                      {reservaSeleccionada.cliente_email && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <EmailIcon
                            sx={{ fontSize: 18, color: colors.info }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            {reservaSeleccionada.cliente_email}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    fontWeight={600}
                    gutterBottom
                  >
                    DETALLES DEL SERVICIO
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2.5,
                      borderRadius: 1.5,
                      borderColor: colors.border,
                      bgcolor: alpha(colors.primaryLight, 0.3),
                    }}
                  >
                    <Stack spacing={2}>
                      <Typography
                        variant="body1"
                        fontWeight="600"
                        sx={{ color: colors.primaryDark }}
                      >
                        {reservaSeleccionada.servicio_nombre}
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarTodayIcon
                            sx={{ fontSize: 16, color: colors.primary }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            {formatearFechaVisual(reservaSeleccionada.fecha)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TimeIcon
                            sx={{ fontSize: 16, color: colors.primary }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            {reservaSeleccionada.hora}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1, borderColor: colors.border }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    fontWeight={600}
                    gutterBottom
                  >
                    ESTADO DE LA RESERVA
                  </Typography>
                  <Chip
                    icon={getEstadoIcon(reservaSeleccionada.estado)}
                    label={
                      reservaSeleccionada.estado.charAt(0).toUpperCase() +
                      reservaSeleccionada.estado.slice(1)
                    }
                    color={getEstadoColor(reservaSeleccionada.estado)}
                    sx={{ fontWeight: 600, px: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    fontWeight={600}
                    gutterBottom
                  >
                    ESTADO DE PAGO
                  </Typography>
                  <Chip
                    label={reservaSeleccionada.pagado ? "Pagado" : "Pendiente"}
                    color={reservaSeleccionada.pagado ? "success" : "warning"}
                    sx={{ fontWeight: 600, px: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1, borderColor: colors.border }} />
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 1.5,
                      bgcolor: alpha(colors.primaryLight, 0.5),
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6" fontWeight="600">
                        Total a pagar
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="700"
                        sx={{ color: colors.primary }}
                      >
                        $
                        {parseFloat(
                          reservaSeleccionada.precio_total || 0,
                        ).toLocaleString()}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{ p: 3, bgcolor: alpha(colors.primaryLight, 0.3) }}
            >
              <Button
                onClick={() => setDialogOpen(false)}
                variant="outlined"
                sx={{
                  borderRadius: 1.5,
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
              >
                Cerrar
              </Button>
              {reservaSeleccionada.estado === "completada" && (
                <Button
                  onClick={() => {
                    abrirTicket(reservaSeleccionada);
                    setDialogOpen(false);
                  }}
                  variant="contained"
                  startIcon={<ReceiptIcon />}
                  sx={{
                    borderRadius: 1.5,
                    bgcolor: colors.primary,
                    "&:hover": { bgcolor: colors.primaryDark },
                  }}
                >
                  Ver Ticket
                </Button>
              )}
              {reservaSeleccionada.estado === "pendiente" && (
                <Button
                  onClick={() => {
                    cambiarEstado(reservaSeleccionada.id, "confirmada");
                    setDialogOpen(false);
                  }}
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  sx={{
                    borderRadius: 1.5,
                    bgcolor: colors.primary,
                    "&:hover": { bgcolor: colors.primaryDark },
                  }}
                >
                  Confirmar y Bloquear Hora
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Modal Ticket */}
      <Dialog
        open={modalTicket.abierto}
        onClose={() => setModalTicket({ ...modalTicket, abierto: false })}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, maxWidth: "90mm", mx: "auto" } }}
      >
        <DialogContent sx={{ p: 0, bgcolor: "#f8fafc" }}>
          {modalTicket.reserva && (
            <TicketPrint
              reserva={modalTicket.reserva}
              profesional={modalTicket.profesional}
              servicio={modalTicket.servicio}
              onClose={() => setModalTicket({ ...modalTicket, abierto: false })}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert severity="error" variant="filled" sx={{ borderRadius: 1.5 }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ borderRadius: 1.5, bgcolor: colors.success }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminReservas;
