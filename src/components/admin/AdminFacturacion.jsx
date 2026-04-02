import React from 'react';
import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import API_BASE from "../../config/api";

const AdminFacturacion = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("mes");

  useEffect(() => {
    fetchData();
  }, [filtroFecha]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/reservas`);
      if (response.ok) {
        const data = await response.json();
        setReservas(data.success ? data.data : data);
      }
    } catch (err) {
      setError("Error al cargar datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportarExcel = () => {
    const headers = ["ID", "Cliente", "Servicio", "Especialista", "Fecha", "Hora", "Estado", "Pagado", "Total"];
    const rows = reservas.map(r => [
      r.id || "",
      r.cliente_nombre || r.cliente || "",
      r.servicio_nombre || r.servicio || "",
      r.especialista_nombre || r.especialista || "",
      r.fecha || "",
      r.hora || "",
      r.estado || "",
      r.pagado ? "Sí" : "No",
      r.precio_total || r.total || "0"
    ]);

    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Facturación</x:Name>
                  <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
        </head>
        <body>
          <table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif;">
            <tr style="background-color: #4472C4; color: white; font-weight: bold;">
              ${headers.map(h => `<th style="padding: 8px;">${h}</th>`).join("")}
            </tr>
            ${rows.map(row => `
              <tr>
                ${row.map(cell => `<td style="padding: 8px;">${cell}</td>`).join("")}
              </tr>
            `).join("")}
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `facturacion_${new Date().toISOString().split("T")[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const reservasPagadas = reservas.filter((r) => r.pagado);
  const reservasPendientes = reservas.filter((r) => !r.pagado);

  const ingresosTotales = reservasPagadas.reduce(
    (acc, r) => acc + (parseFloat(r.precio_total) || 0),
    0,
  );
  const ingresosPendientes = reservasPendientes.reduce(
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

  const stats = [
    {
      title: "Ingresos Totales",
      value: formatCurrency(ingresosTotales),
      icon: <DollarSign size={24} />,
      trend: "+12%",
      trendUp: true,
      color: "#2563eb",
      bgColor: "#eff6ff",
    },
    {
      title: "Pendiente por Cobrar",
      value: formatCurrency(ingresosPendientes),
      icon: <CreditCard size={24} />,
      trend: "",
      trendUp: false,
      color: "#f59e0b",
      bgColor: "#fffbeb",
    },
    {
      title: "Citas Pagadas",
      value: reservasPagadas.length,
      icon: <Receipt size={24} />,
      trend: "+8%",
      trendUp: true,
      color: "#10b981",
      bgColor: "#f0fdf4",
    },
    {
      title: "Citas Pendientes",
      value: reservasPendientes.length,
      icon: <Calendar size={24} />,
      trend: "",
      trendUp: false,
      color: "#6b7280",
      bgColor: "#f9fafb",
    },
  ];

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-500">Cargando facturación...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Facturación</h2>
          <p className="text-gray-500">Resumen financiero del salon</p>
        </div>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          >
            <option value="dia">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="año">Este año</option>
          </select>
          <button 
            onClick={exportarExcel}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: stat.bgColor }}
              >
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>
              {stat.trend && (
                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trendUp ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {stat.trendUp ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {stat.trend}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Transacciones Recientes
          </h3>
        </div>
        {error && (
          <div className="p-4 bg-red-50 text-red-600 border-b border-red-200">
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Servicio
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Monto
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {reservas.slice(0, 10).map((reserva, index) => (
                <tr
                  key={reserva.id || index}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-500">#{reserva.id}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">
                    {reserva.cliente_nombre || "Cliente"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {reserva.servicio_nombre || "Servicio"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {reserva.fecha
                      ? new Date(reserva.fecha).toLocaleDateString("es-ES")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {formatCurrency(reserva.precio_total || 0)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reserva.pagado
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {reserva.pagado ? "Pagado" : "Pendiente"}
                    </span>
                  </td>
                </tr>
              ))}
              {reservas.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No hay transacciones registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFacturacion;
