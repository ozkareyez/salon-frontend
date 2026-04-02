import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  RefreshCw,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import API_BASE from "../../config/api";

const getToken = () => localStorage.getItem("profesional_token");
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("profesional_user") || "{}");
  } catch {
    return {};
  }
};

const ESTADO_COLORS = {
  pendiente: { bg: "bg-amber-100", text: "text-amber-800", icon: AlertCircle },
  confirmada: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
  cancelada: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
  completada: { bg: "bg-blue-100", text: "text-blue-800", icon: CheckCircle },
};

const DashboardProfesional = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    if (!getToken()) {
      navigate("/profesional/login");
      return;
    }
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const url = filtroEstado 
        ? `${API_BASE}/profesional/reservas?estado=${filtroEstado}`
        : `${API_BASE}/profesional/reservas`;
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      
      const data = await response.json();
      if (data.success) {
        setReservas(data.data);
      }
    } catch (err) {
      console.error("Error cargando reservas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, [filtroEstado]);

  const handleLogout = () => {
    localStorage.removeItem("profesional_token");
    localStorage.removeItem("profesional_user");
    navigate("/profesional/login");
  };

  const cambiarEstado = async (reservaId, nuevoEstado) => {
    try {
      const response = await fetch(`${API_BASE}/profesional/reservas/${reservaId}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      
      if (response.ok) {
        cargarReservas();
      }
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const reservasHoy = reservas.filter(r => {
    const hoy = new Date().toISOString().split("T")[0];
    return r.fecha === hoy;
  });

  const reservasPendientes = reservas.filter(r => r.estado === "pendiente");

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                <User className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{user.nombre}</h1>
                <p className="text-sm text-gray-500">{user.especialista_nombre}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut size={18} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                <Calendar className="text-pink-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reservas.length}</p>
                <p className="text-xs text-gray-500">Total Citas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reservas.filter(r => r.estado === "confirmada").length}</p>
                <p className="text-xs text-gray-500">Confirmadas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertCircle className="text-amber-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reservasPendientes.length}</p>
                <p className="text-xs text-gray-500">Pendientes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reservasHoy.length}</p>
                <p className="text-xs text-gray-500">Hoy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filtrar:</span>
            <div className="flex gap-2 flex-wrap">
              {["", "pendiente", "confirmada", "completada", "cancelada"].map((estado) => (
                <button
                  key={estado}
                  onClick={() => setFiltroEstado(estado)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filtroEstado === estado
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {estado === "" ? "Todas" : estado.charAt(0).toUpperCase() + estado.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={cargarReservas} className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Actualizar">
              <RefreshCw size={18} className={loading ? "animate-spin text-pink-500" : "text-gray-500"} />
            </button>
          </div>
        </div>

        {/* Lista de Reservas */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-500">Cargando reservas...</p>
            </div>
          ) : reservas.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reservas</h3>
              <p className="text-gray-500">No tienes reservas {filtroEstado ? `en estado "${filtroEstado}"` : "asignadas"}</p>
            </div>
          ) : (
            reservas.map((reserva) => {
              const estadoStyle = ESTADO_COLORS[reserva.estado] || ESTADO_COLORS.pendiente;
              const EstadoIcon = estadoStyle.icon;

              return (
                <div key={reserva.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Fecha y Hora */}
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="text-pink-600" size={24} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{formatearFecha(reserva.fecha)}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock size={14} />
                            {reserva.hora?.substring(0, 5)}
                            <span className="ml-1">• {reserva.duracion_servicio || 60} min</span>
                          </div>
                        </div>
                      </div>

                      {/* Servicio y Cliente */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{reserva.servicio_nombre}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            {reserva.cliente_nombre || "Cliente"}
                          </div>
                          {reserva.cliente_telefono && (
                            <div className="flex items-center gap-1">
                              <Phone size={14} />
                              {reserva.cliente_telefono}
                            </div>
                          )}
                          {reserva.cliente_email && (
                            <div className="flex items-center gap-1">
                              <Mail size={14} />
                              {reserva.cliente_email}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Estado y Acciones */}
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${estadoStyle.bg} ${estadoStyle.text}`}>
                          <EstadoIcon size={14} />
                          {reserva.estado}
                        </span>
                        
                        {reserva.estado === "pendiente" && (
                          <div className="flex gap-2">
                            <button onClick={() => cambiarEstado(reserva.id, "confirmada")} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors">
                              Confirmar
                            </button>
                            <button onClick={() => cambiarEstado(reserva.id, "cancelada")} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors">
                              Cancelar
                            </button>
                          </div>
                        )}
                        
                        {reserva.estado === "confirmada" && (
                          <button onClick={() => cambiarEstado(reserva.id, "completada")} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                            Completar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardProfesional;