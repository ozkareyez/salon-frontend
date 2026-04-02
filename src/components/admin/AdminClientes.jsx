import React from 'react';
import { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import API_BASE from "../../config/api";

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/clientes`);
      if (response.ok) {
        const data = await response.json();
        setClientes(data.success ? data.data : data);
      }
    } catch (err) {
      setError("Error al cargar clientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.telefono?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4" style={{ color: "#64748b" }}>Cargando clientes...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#0f172a" }}>
            Clientes
          </h2>
          <p style={{ color: "#64748b" }}>Gestiona tus clientes registrados</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={18} />
          Nuevo Cliente
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Buscar clientes..."
            className="w-full pl-10 pr-4 py-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderColor: "#e2e8f0", color: "#0f172a" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 rounded-lg bg-red-50 text-red-600">{error}</div>
      )}

      <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "#475569" }}>Cliente</th>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "#475569" }}>Teléfono</th>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "#475569" }}>Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "#475569" }}>Citas</th>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "#475569" }}>Última Cita</th>
                <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: "#475569" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: "#64748b" }}>
                    {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((cliente, index) => (
                  <tr
                    key={cliente.id || index}
                    className="border-t hover:bg-slate-50"
                    style={{ borderColor: "#f1f5f9" }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: "#e0f2fe" }}
                        >
                          <User size={20} style={{ color: "#0284c7" }} />
                        </div>
                        <span className="font-medium" style={{ color: "#0f172a" }}>
                          {cliente.nombre || "Sin nombre"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#64748b" }}>
                      {cliente.telefono || "-"}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#64748b" }}>
                      {cliente.email || "-"}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#0f172a" }}>
                      {cliente.citas_count || 0}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#64748b" }}>
                      {cliente.ultima_cita
                        ? new Date(cliente.ultima_cita).toLocaleDateString("es-ES")
                        : "Sin citas"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button className="p-2 rounded-md hover:bg-slate-100" style={{ color: "#64748b" }}>
                          <Edit size={18} />
                        </button>
                        <button className="p-2 rounded-md hover:bg-red-50" style={{ color: "#ef4444" }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminClientes;
