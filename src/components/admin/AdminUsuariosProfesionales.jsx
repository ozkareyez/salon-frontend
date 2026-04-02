import React from 'react';
import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
} from "lucide-react";
import API_BASE from "../../config/api";

const AdminUsuariosProfesionales = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [especialistas, setEspecialistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nombre: "",
    email: "",
    especialista_id: "",
    rol: "profesional",
    activo: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usuariosRes, especialistasRes] = await Promise.all([
        fetch(`${API_BASE}/admin/profesionales/usuarios`),
        fetch(`${API_BASE}/especialistas`),
      ]);

      const usuariosData = await usuariosRes.json();
      const especialistasData = await especialistasRes.json();

      setUsuarios(usuariosData.success ? usuariosData.data : []);
      setEspecialistas(especialistasData.success ? especialistasData.data : []);
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditando(usuario);
      setFormData({
        username: usuario.username || "",
        password: "",
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        especialista_id: usuario.especialista_id ? String(usuario.especialista_id) : "",
        rol: usuario.rol || "profesional",
        activo: usuario.activo !== 0,
      });
    } else {
      setEditando(null);
      setFormData({
        username: "",
        password: "",
        nombre: "",
        email: "",
        especialista_id: "",
        rol: "profesional",
        activo: true,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditando(null);
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!editando && !formData.password) {
      setError("La contraseña es requerida para nuevos usuarios");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        nombre: formData.nombre,
        email: formData.email || null,
        especialista_id: formData.especialista_id ? parseInt(formData.especialista_id) : null,
        rol: formData.rol,
        activo: formData.activo ? 1 : 0,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const url = editando
        ? `${API_BASE}/admin/profesionales/usuarios/${editando.id}`
        : `${API_BASE}/admin/profesionales/usuarios`;

      const response = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editando ? "Usuario actualizado" : "Usuario creado");
        fetchData();
        handleCloseModal();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Error al guardar");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este usuario?")) {
      try {
        const response = await fetch(`${API_BASE}/admin/profesionales/usuarios/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setUsuarios(usuarios.filter((u) => u.id !== id));
          setSuccess("Usuario eliminado");
          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (err) {
        setError("Error al eliminar");
      }
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-center gap-2">
          <UserCheck size={18} />
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
          <X size={18} />
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Usuarios Profesionales</h2>
          <p className="text-sm text-gray-500">Gestiona el acceso de los profesionales</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus size={18} />
          Nuevo Usuario
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o usuario..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usuariosFiltrados.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900">No hay usuarios</h3>
            <p className="text-gray-500 text-sm">Crea el primer usuario profesional</p>
          </div>
        ) : (
          usuariosFiltrados.map((usuario) => (
            <div key={usuario.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${usuario.activo ? "bg-green-100" : "bg-gray-100"}`}>
                    <Users className={usuario.activo ? "text-green-600" : "text-gray-400"} size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{usuario.nombre}</h3>
                    <p className="text-sm text-gray-500">@{usuario.username}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${usuario.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {usuario.activo ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-3 space-y-1">
                {usuario.especialista_nombre && (
                  <p>Especialista: {usuario.especialista_nombre}</p>
                )}
                <p>Rol: {usuario.rol}</p>
                {usuario.email && <p>Email: {usuario.email}</p>}
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button onClick={() => handleOpenModal(usuario)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 text-sm">
                  <Edit size={14} /> Editar
                </button>
                <button onClick={() => handleDelete(usuario.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-sm">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editando ? "Editar Usuario" : "Nuevo Usuario"}
                </h3>
                <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-gray-100">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario *</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña {editando ? "(dejar vacío para mantener)" : "*"}
                </label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required={!editando} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialista asociado</label>
                <select name="especialista_id" value={formData.especialista_id} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white">
                  <option value="">Sin asociar</option>
                  {especialistas.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre} - {e.especialidad}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vista previa del especialista seleccionado */}
              {formData.especialista_id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vista previa</label>
                  <div className="flex items-center gap-4">
                    {(() => {
                      const especialista = especialistas.find(e => e.id === parseInt(formData.especialista_id));
                      if (!especialista) return null;
                      const imgUrl = especialista.imagen_url?.startsWith('http') 
                        ? especialista.imagen_url 
                        : `http://localhost:3002${especialista.imagen_url || ''}`;
                      return (
                        <>
                          <img 
                            src={imgUrl} 
                            alt={especialista.nombre}
                            className="w-16 h-16 rounded-full object-cover border-2 border-pink-300"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64?text=ESP';
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">{especialista.nombre}</p>
                            <p className="text-sm text-gray-500">{especialista.especialidad}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="activo" checked={formData.activo} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Usuario activo</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                  {editando ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsuariosProfesionales;