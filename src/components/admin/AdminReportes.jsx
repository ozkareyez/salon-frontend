import React from 'react';
import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Download,
  Filter,
  PieChart,
} from "lucide-react";
import API_BASE from "../../config/api";

const AdminReportes = () => {
  const [reservas, setReservas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reporteTipo, setReporteTipo] = useState("mensual");

  // 🎨 PALETA DE COLORES CORPORATIVA
  const colors = {
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    primaryLight: "#eff6ff",
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reservasRes, serviciosRes] = await Promise.all([
        fetch(`${API_BASE}/reservas`),
        fetch(`${API_BASE}/servicios`),
      ]);

      if (reservasRes.ok) {
        const data = await reservasRes.json();
        setReservas(data.success ? data.data : data);
      }
      if (serviciosRes.ok) {
        const data = await serviciosRes.json();
        setServicios(data.success ? data.data : data);
      }
    } catch (err) {
      setError("Error al cargar datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatsByMonth = () => {
    const months = {};
    reservas.forEach((r) => {
      if (r.fecha) {
        const month = new Date(r.fecha).toLocaleDateString("es-ES", {
          month: "long",
          year: "numeric",
        });
        if (!months[month]) {
          months[month] = { count: 0, revenue: 0 };
        }
        months[month].count += 1;
        months[month].revenue += parseFloat(r.precio_total) || 0;
      }
    });
    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data,
    }));
  };

  const getTopServicios = () => {
    const serviceCount = {};
    reservas.forEach((r) => {
      const servicio = r.servicio_nombre || "Otro";
      if (!serviceCount[servicio]) {
        serviceCount[servicio] = 0;
      }
      serviceCount[servicio] += 1;
    });
    return Object.entries(serviceCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  };

  const getTopClientes = () => {
    const clientCount = {};
    reservas.forEach((r) => {
      const cliente = r.cliente_nombre || "Anonimo";
      if (!clientCount[cliente]) {
        clientCount[cliente] = { count: 0, total: 0 };
      }
      clientCount[cliente].count += 1;
      clientCount[cliente].total += parseFloat(r.precio_total) || 0;
    });
    return Object.entries(clientCount)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));
  };

  const totalReservas = reservas.length;
  const reservasConfirmadas = reservas.filter(
    (r) => r.estado === "confirmada",
  ).length;
  const reservasPendientes = reservas.filter(
    (r) => r.estado === "pendiente",
  ).length;
  const reservasCanceladas = reservas.filter(
    (r) => r.estado === "cancelada",
  ).length;
  const ingresosTotales = reservas.reduce(
    (acc, r) => acc + (parseFloat(r.precio_total) || 0),
    0,
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const summaryStats = [
    {
      label: "Total Reservas",
      value: totalReservas,
      icon: <Calendar size={20} />,
      color: colors.primary,
      bgColor: "#eff6ff",
    },
    {
      label: "Confirmadas",
      value: reservasConfirmadas,
      icon: <TrendingUp size={20} />,
      color: colors.success,
      bgColor: "#f0fdf4",
    },
    {
      label: "Pendientes",
      value: reservasPendientes,
      icon: <Calendar size={20} />,
      color: colors.warning,
      bgColor: "#fffbeb",
    },
    {
      label: "Canceladas",
      value: reservasCanceladas,
      icon: <TrendingUp size={20} />,
      color: colors.error,
      bgColor: "#fef2f2",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medium text-gray-500">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>
          <p className="text-gray-500 mt-1">
            Estadísticas y análisis del negocio
          </p>
        </div>
        <div className="flex gap-3">
          <select
            className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={reporteTipo}
            onChange={(e) => setReporteTipo(e.target.value)}
          >
            <option value="diario">Diario</option>
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Download size={18} />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: stat.bgColor, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ingresos por Mes y Servicios más solicitados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Ingresos por Mes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Ingresos por Mes</h3>
          </div>
          {getStatsByMonth().length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay datos disponibles
            </p>
          ) : (
            <div className="space-y-4">
              {getStatsByMonth()
                .slice(-6)
                .map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{stat.month}</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(stat.revenue)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: `${Math.min((stat.revenue / ingresosTotales) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Ingresos</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(ingresosTotales)}
              </span>
            </div>
          </div>
        </div>

        {/* Servicios Más Solicitados */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">
              Servicios Más Solicitados
            </h3>
          </div>
          {getTopServicios().length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay datos disponibles
            </p>
          ) : (
            <div className="space-y-4">
              {getTopServicios().map((servicio, index) => {
                const porcentaje = (servicio.count / totalReservas) * 100;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: colors.primary }}
                        >
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{servicio.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-gray-900">
                          {servicio.count}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          citas
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Clientes Frecuentes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Users size={20} className="text-blue-600" />
          <h3 className="font-semibold text-gray-900">Clientes Frecuentes</h3>
        </div>
        {getTopClientes().length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No hay datos disponibles
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Citas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total Gastado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Promedio por Cita
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {getTopClientes().map((cliente, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs font-semibold text-blue-600">
                            {cliente.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {cliente.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600">
                        {cliente.count} citas
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(cliente.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600">
                        {formatCurrency(cliente.total / cliente.count)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {getTopClientes().length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Total clientes únicos
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {new Set(reservas.map((r) => r.cliente_nombre)).size}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default AdminReportes;
