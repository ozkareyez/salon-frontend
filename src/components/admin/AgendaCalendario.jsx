import React from 'react';
// src/admin/AgendaCalendario.jsx - CON BLOQUEOS DE AGENDA Y FESTIVOS - ESTILO CRM EMPRESARIAL
import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "../../config/api";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Sparkles,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  CalendarOff,
  Ban,
  AlertCircle,
  Flower2,
  Heart,
  Waves,
  Briefcase,
  UserCheck,
  DollarSign,
} from "lucide-react";

const API_URL = API_BASE;

const AgendaCalendario = () => {
  const [reservas, setReservas] = useState([]);
  const [bloqueos, setBloqueos] = useState([]);
  const [festivos, setFestivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [filtroProfesional, setFiltroProfesional] = useState("todos");
  const [profesionales, setProfesionales] = useState([]);
  const [error, setError] = useState("");

  // Estado para el modal de completar cita
  const [modalCompletar, setModalCompletar] = useState({
    abierto: false,
    reservaId: null,
    clienteNombre: "",
    servicioNombre: "",
    hora: "",
    profesionalNombre: "",
    precio: 0,
  });

  const [notasCita, setNotasCita] = useState("");

  // 🎨 PALETA DE COLORES CORPORATIVA EMPRESARIAL
  const colors = {
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    primaryLight: "#eff6ff",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
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
    blocked: "#fee2e2",
    blockedText: "#dc2626",
  };

  // Cargar profesionales
  useEffect(() => {
    const cargarProfesionales = async () => {
      try {
        const res = await axios.get(`${API_URL}/especialistas`);
        if (res.data.success) {
          setProfesionales(res.data.data);
        }
      } catch (error) {
        console.error("Error al cargar profesionales:", error);
      }
    };
    cargarProfesionales();
  }, []);

  // Cargar TODOS los datos (reservas, bloqueos, festivos)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError("");

        const fechaStr = fechaSeleccionada.toISOString().split("T")[0];

        // Cargar reservas
        let urlReservas = `${API_URL}/reservas`;
        const params = new URLSearchParams();

        if (filtroProfesional !== "todos") {
          params.append("especialista_id", filtroProfesional);
        }

        if (params.toString()) {
          urlReservas += `?${params.toString()}`;
        }

        const resReservas = await axios.get(urlReservas);
        const resBloqueos = await axios.get(`${API_URL}/bloqueos-agenda`, {
          params: { fecha_especifica: fechaStr },
        });
        const resFestivos = await axios.get(`${API_URL}/festivos`);

        if (resReservas.data.success && Array.isArray(resReservas.data.data)) {
          const reservasActivas = resReservas.data.data.filter(
            (r) => r.estado !== "cancelada",
          );
          setReservas(reservasActivas);
        }

        if (resBloqueos.data.success) {
          setBloqueos(resBloqueos.data.data || []);
        }

        if (resFestivos.data.success) {
          setFestivos(resFestivos.data.data || []);
        }
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        setError("Error al cargar la agenda");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [filtroProfesional, fechaSeleccionada]);

  // Verificar si una hora está bloqueada
  const horaEstaBloqueada = (hora, fecha) => {
    if (!bloqueos || bloqueos.length === 0) return false;
    const horaCompleta = `${hora}:00`;
    return bloqueos.some(
      (b) =>
        b.fecha === fecha &&
        b.hora_inicio <= horaCompleta &&
        b.hora_fin > horaCompleta,
    );
  };

  // Obtener motivo del bloqueo
  const getMotivoBloqueo = (hora, fecha) => {
    if (!bloqueos) return null;
    const horaCompleta = `${hora}:00`;
    const bloqueo = bloqueos.find(
      (b) =>
        b.fecha === fecha &&
        b.hora_inicio <= horaCompleta &&
        b.hora_fin > horaCompleta,
    );
    return bloqueo || null;
  };

  // Verificar si la fecha es festiva
  const esFestivo = (fecha) => {
    return festivos.some((f) => f.fecha === fecha);
  };

  // Obtener nombre del festivo
  const getNombreFestivo = (fecha) => {
    const festivo = festivos.find((f) => f.fecha === fecha);
    return festivo?.nombre || "Día festivo";
  };

  // Filtrar reservas del día
  const reservasDelDia = reservas.filter((r) => {
    const fechaReservaStr = r.fecha.split("T")[0];
    const year = fechaSeleccionada.getFullYear();
    const month = String(fechaSeleccionada.getMonth() + 1).padStart(2, "0");
    const day = String(fechaSeleccionada.getDate()).padStart(2, "0");
    const fechaSelStr = `${year}-${month}-${day}`;
    return fechaReservaStr === fechaSelStr;
  });

  // Ordenar reservas por hora
  const reservasOrdenadas = [...reservasDelDia].sort((a, b) => {
    const horaA = a.hora.substring(0, 5);
    const horaB = b.hora.substring(0, 5);
    return horaA.localeCompare(horaB);
  });

  // Navegación de fechas
  const diaAnterior = () => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() - 1);
    setFechaSeleccionada(nuevaFecha);
  };

  const diaSiguiente = () => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + 1);
    setFechaSeleccionada(nuevaFecha);
  };

  const irHoy = () => {
    setFechaSeleccionada(new Date());
  };

  const irAFecha = (year, month, day) => {
    const nuevaFecha = new Date(year, month - 1, day);
    setFechaSeleccionada(nuevaFecha);
  };

  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const fechasConReservas = [
    ...new Set(reservas.map((r) => r.fecha.split("T")[0])),
  ].sort();

  const getEstadoStyles = (estado) => {
    switch (estado) {
      case "pendiente":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-l-4 border-amber-500",
          badge: "bg-amber-100 text-amber-800",
        };
      case "confirmada":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-l-4 border-blue-500",
          badge: "bg-blue-100 text-blue-800",
        };
      case "completada":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-l-4 border-green-500",
          badge: "bg-green-100 text-green-800",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-l-4 border-gray-400",
          badge: "bg-gray-100 text-gray-800",
        };
    }
  };

  // Abrir modal para completar cita
  const abrirModalCompletar = (reserva) => {
    const profesional = profesionales.find(
      (p) => p.id === reserva.especialista_id,
    );

    setModalCompletar({
      abierto: true,
      reservaId: reserva.id,
      clienteNombre: reserva.cliente_nombre,
      servicioNombre: reserva.servicio_nombre,
      hora: reserva.hora.substring(0, 5),
      profesionalNombre: profesional?.nombre || "Sin asignar",
      precio: reserva.precio_total || 0,
    });
    setNotasCita("");
  };

  const cerrarModal = () => {
    setModalCompletar({
      abierto: false,
      reservaId: null,
      clienteNombre: "",
      servicioNombre: "",
      hora: "",
      profesionalNombre: "",
      precio: 0,
    });
    setNotasCita("");
  };

  const confirmarCompletar = async () => {
    try {
      setLoading(true);

      await axios.patch(
        `${API_URL}/reservas/${modalCompletar.reservaId}/estado`,
        {
          estado: "completada",
        },
      );

      setReservas(
        reservas.map((r) =>
          r.id === modalCompletar.reservaId
            ? { ...r, estado: "completada" }
            : r,
        ),
      );

      cerrarModal();
    } catch (error) {
      console.error("❌ Error al completar la cita:", error);
      setError("Error al completar la cita. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const horarios = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const fechaActualStr = fechaSeleccionada.toISOString().split("T")[0];
  const esDiaFestivo = esFestivo(fechaActualStr);

  if (loading && reservas.length === 0 && bloqueos.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medium text-gray-500">Cargando agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 shadow-sm">
              <CalendarIcon className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Agenda de Citas
              </h1>
              <p className="text-sm text-gray-500">
                {formatearFecha(fechaSeleccionada)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filtroProfesional}
              onChange={(e) => setFiltroProfesional(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
            >
              <option value="todos">Todos los profesionales</option>
              {profesionales.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ALERTA DE DÍA FESTIVO */}
      {esDiaFestivo && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Ban size={20} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Día Festivo</h3>
              <p className="text-sm text-gray-600">
                {getNombreFestivo(fechaActualStr)} - No hay atención programada
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selector de fechas con reservas */}
      {fechasConReservas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              📅 Fechas con reservas:
            </span>
            <div className="flex flex-wrap gap-2">
              {fechasConReservas.map((fechaStr) => {
                const [year, month, day] = fechaStr.split("-").map(Number);
                const fecha = new Date(year, month - 1, day);
                const isSelected = fechaStr === fechaActualStr;
                return (
                  <button
                    key={fechaStr}
                    onClick={() => irAFecha(year, month, day)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {fecha.toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                    })}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Controles de fecha */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={diaAnterior}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={irHoy}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Hoy
            </button>
            <button
              onClick={diaSiguiente}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
            <span className="ml-2 font-semibold text-gray-900">
              {formatearFecha(fechaSeleccionada)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700">
              {reservasDelDia.length} reserva(s)
            </span>
            {bloqueos.length > 0 && (
              <span className="text-sm px-3 py-1.5 rounded-lg bg-red-50 text-red-600 flex items-center gap-1">
                <CalendarOff size={14} />
                {bloqueos.length} bloqueo(s)
              </span>
            )}
            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Actualizar"
            >
              <RefreshCw size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 rounded-lg mb-6 bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* Grid de horarios */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-13 bg-gray-50 border-b border-gray-200">
          <div className="col-span-1 p-3 font-medium text-gray-700 border-r border-gray-200">
            Hora
          </div>
          <div className="col-span-12 p-3 font-medium text-gray-700">
            {esDiaFestivo
              ? "📅 DÍA FESTIVO - SIN ATENCIÓN"
              : `Reservas - ${formatearFecha(fechaSeleccionada)}`}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {horarios.map((hora) => {
            const fechaStr = fechaSeleccionada.toISOString().split("T")[0];
            const bloqueada = horaEstaBloqueada(hora, fechaStr);
            const bloqueoInfo = getMotivoBloqueo(hora, fechaStr);
            const reservasEnHora = reservasOrdenadas.filter((r) => {
              const horaReserva = r.hora.substring(0, 5);
              return horaReserva === hora;
            });

            if (esDiaFestivo) {
              return (
                <div
                  key={hora}
                  className="grid grid-cols-13 hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-1 p-3 text-sm font-medium border-r border-gray-200 bg-gray-50/50">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-400" />
                      {hora}
                    </div>
                  </div>
                  <div className="col-span-12 p-3">
                    <div className="rounded-lg p-4 bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-2">
                        <Flower2 size={16} className="text-amber-500" />
                        <span className="text-sm font-medium text-gray-500">
                          Día festivo - Sin atención
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={hora}
                className={`grid grid-cols-13 hover:bg-gray-50 transition-colors ${
                  bloqueada ? "bg-red-50/30" : ""
                }`}
              >
                <div className="col-span-1 p-3 text-sm font-medium border-r border-gray-200 bg-gray-50/50">
                  <div className="flex items-center gap-1">
                    <Clock
                      size={14}
                      className={bloqueada ? "text-red-400" : "text-gray-400"}
                    />
                    {hora}
                  </div>
                </div>
                <div className="col-span-12 p-3">
                  {bloqueada ? (
                    <div className="rounded-lg p-4 bg-red-50 border border-red-200">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-red-100">
                          <CalendarOff size={16} className="text-red-600" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-red-700">
                            Hora bloqueada
                          </span>
                          <p className="text-xs mt-0.5 text-red-600">
                            {bloqueoInfo?.motivo || "Sin atención disponible"}
                          </p>
                          <p className="text-xs mt-1 text-gray-500">
                            {bloqueoInfo?.tipo === "festivo"
                              ? "📅 Festivo"
                              : bloqueoInfo?.tipo === "medico"
                                ? "🏥 Cita médica"
                                : bloqueoInfo?.tipo === "capacitacion"
                                  ? "📚 Capacitación"
                                  : "⏰ Bloqueo personal"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : reservasEnHora.length > 0 ? (
                    <div className="space-y-2">
                      {reservasEnHora.map((reserva) => {
                        const profesional = profesionales.find(
                          (p) => p.id === reserva.especialista_id,
                        );
                        const estadoStyles = getEstadoStyles(reserva.estado);
                        return (
                          <div
                            key={reserva.id}
                            className={`rounded-lg p-4 hover:shadow-md transition-shadow ${estadoStyles.bg} ${estadoStyles.border}`}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className="font-semibold text-gray-900">
                                    {reserva.cliente_nombre}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoStyles.badge}`}
                                  >
                                    {reserva.estado === "pendiente"
                                      ? "Pendiente"
                                      : reserva.estado === "confirmada"
                                        ? "Confirmada"
                                        : "Completada"}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  {reserva.servicio_nombre}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <UserCheck size={12} />
                                    {profesional?.nombre || "Sin asignar"}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone size={12} />
                                    {reserva.cliente_telefono}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Briefcase size={12} />#
                                    {reserva.codigo_reserva?.slice(-6) || "N/A"}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end gap-2">
                                <div className="flex items-center gap-1">
                                  <DollarSign
                                    size={14}
                                    className="text-gray-500"
                                  />
                                  <span className="text-lg font-bold text-gray-900">
                                    $
                                    {parseFloat(
                                      reserva.precio_total || 0,
                                    ).toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {reserva.duracion_estimada || 60} min
                                </div>
                                {reserva.estado !== "completada" && (
                                  <button
                                    onClick={() => abrirModalCompletar(reserva)}
                                    className="mt-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1"
                                  >
                                    <CheckCircle size={14} /> Completar
                                  </button>
                                )}
                                {reserva.estado === "completada" && (
                                  <div className="mt-2 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-lg flex items-center gap-1">
                                    <CheckCircle size={14} /> Completada
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm italic py-2 text-gray-400">
                      Sin reservas
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda de estados */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-sm font-medium text-gray-700">Estados:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500"></div>
            <span className="text-xs text-gray-600">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-xs text-gray-600">Confirmada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-xs text-gray-600">Completada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-400"></div>
            <span className="text-xs text-gray-600">Bloqueada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-400"></div>
            <span className="text-xs text-gray-600">Festivo</span>
          </div>
        </div>
      </div>

      {/* Modal para completar cita */}
      {modalCompletar.abierto && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={cerrarModal}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-xl animate-slideUpAndFade">
              <div className="px-6 py-5 rounded-t-2xl bg-blue-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <CheckCircle className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Completar Cita
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {modalCompletar.hora} hrs
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={cerrarModal}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XCircle className="text-white" size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="mb-4 text-gray-700">
                  ¿Confirmas que la siguiente cita fue realizada?
                </p>
                <div className="rounded-xl p-5 mb-6 bg-gray-50 border border-gray-200">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <User size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Cliente
                        </p>
                        <p className="font-semibold text-gray-900">
                          {modalCompletar.clienteNombre}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Sparkles size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Servicio
                        </p>
                        <p className="text-gray-700">
                          {modalCompletar.servicioNombre}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <UserCheck size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Profesional
                        </p>
                        <p className="text-gray-700">
                          {modalCompletar.profesionalNombre}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <DollarSign size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Valor
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ${modalCompletar.precio.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={cerrarModal}
                    className="px-5 py-2.5 rounded-xl transition-colors font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarCompletar}
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl transition-all shadow-sm hover:bg-blue-700 hover:shadow-md flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Sí, completar cita
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slideUpAndFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUpAndFade {
          animation: slideUpAndFade 0.3s ease-out;
        }
        .grid-cols-13 {
          display: grid;
          grid-template-columns: 100px 1fr;
        }
        @media (min-width: 768px) {
          .grid-cols-13 {
            grid-template-columns: 100px 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AgendaCalendario;
