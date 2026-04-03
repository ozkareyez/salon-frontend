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
  UserCheck,
  UserX,
  Star,
  Clock,
  Briefcase,
  Image,
  Loader2,
  Eye,
} from "lucide-react";
import API_BASE, { API_URL, getImagenUrl } from "../../config/api";

const STATUS_OPTIONS = [
  { value: "Disponible", label: "Disponible", color: "bg-green-100 text-green-700" },
  { value: "Ocupado", label: "Ocupado", color: "bg-yellow-100 text-yellow-700" },
  { value: "Inactivo", label: "Inactivo", color: "bg-gray-100 text-gray-700" },
];

const AdminEspecialistas = () => {
  const [especialistas, setEspecialistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    especialidad: "",
    descripcion: "",
    experiencia: "",
    rating: "5.0",
    horario: "",
    status: "Disponible",
    imagen_url: "",
    orden: "0",
  });

  const fetchEspecialistas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/especialistas`);
      const data = await response.json();
      if (data.success) {
        setEspecialistas(data.data || []);
      } else {
        setError(data.error || "Error al cargar");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEspecialistas();
  }, []);

  const handleOpenModal = (especialista = null) => {
    if (especialista) {
      setEditando(especialista);
      setFormData({
        nombre: especialista.nombre || "",
        especialidad: especialista.especialidad || "",
        descripcion: especialista.descripcion || "",
        experiencia: especialista.experiencia || "",
        rating: String(especialista.rating || "5.0"),
        horario: especialista.horario || "",
        status: especialista.status || "Disponible",
        imagen_url: especialista.imagen_url || "",
        orden: String(especialista.orden || "0"),
      });
    } else {
      setEditando(null);
      setFormData({
        nombre: "",
        especialidad: "",
        descripcion: "",
        experiencia: "",
        rating: "5.0",
        horario: "",
        status: "Disponible",
        imagen_url: "",
        orden: "0",
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setModalOpen(false);
    setEditando(null);
    setError("");
    setPreviewUrl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        nombre: formData.nombre,
        especialidad: formData.especialidad,
        descripcion: formData.descripcion,
        experiencia: formData.experiencia,
        rating: parseFloat(formData.rating),
        horario: formData.horario,
        status: formData.status,
        imagen_url: formData.imagen_url || null,
        orden: parseInt(formData.orden),
      };

      const url = editando
        ? `${API_BASE}/especialistas/${editando.id}`
        : `${API_BASE}/especialistas`;

      const response = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editando ? "Especialista actualizado" : "Especialista creado");
        fetchEspecialistas();
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
    if (window.confirm("¿Eliminar este especialista? Esto también puede afectar las reservas asociadas.")) {
      try {
        const response = await fetch(`${API_BASE}/especialistas/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          setEspecialistas(especialistas.filter((e) => e.id !== id));
          setSuccess("Especialista eliminado");
          setTimeout(() => setSuccess(""), 3000);
        } else {
          setError(data.error || "Error al eliminar");
        }
      } catch (err) {
        setError("Error de conexión");
      }
    }
  };

  const especialistasFiltrados = especialistas.filter(
    (e) =>
      e.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.especialidad?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const option = STATUS_OPTIONS.find((o) => o.value === status);
    return option ? option.color : "bg-gray-100 text-gray-700";
  };

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Especialistas</h2>
          <p className="text-sm text-gray-500">Gestiona los empleados del spa</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus size={18} />
          Nuevo Especialista
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar especialistas..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid de Especialistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {especialistasFiltrados.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900">No hay especialistas</h3>
            <p className="text-gray-500 text-sm">Agrega tu primer especialista</p>
          </div>
        ) : (
          especialistasFiltrados.map((esp) => {
            const imgUrl = getImagenUrl(esp.imagen_url);
            
            return (
              <div key={esp.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={esp.nombre}
                          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                          {esp.nombre ? esp.nombre.charAt(0) : "E"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{esp.nombre}</h3>
                      <p className="text-sm text-gray-500">{esp.especialidad}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(esp.status)}`}>
                        {esp.status}
                      </span>
                    </div>
                  </div>

                  {/* Info adicional */}
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    {esp.experiencia && (
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} />
                        <span>{esp.experiencia}</span>
                      </div>
                    )}
                    {esp.horario && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span className="truncate">{esp.horario}</span>
                      </div>
                    )}
                    {esp.rating && (
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-yellow-500" />
                        <span>{esp.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenModal(esp)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 text-sm"
                    >
                      <Edit size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(esp.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editando ? "Editar Especialista" : "Nuevo Especialista"}
                </h3>
                <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-gray-100">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad *</label>
                  <input
                    type="text"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Ej: Esteticista"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Breve descripción del especialista"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia</label>
                  <input
                    type="text"
                    name="experiencia"
                    value={formData.experiencia}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Ej: 5 años"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                  <input
                    type="text"
                    name="horario"
                    value={formData.horario}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Lun-Vie 9am-6pm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                  <input
                    type="number"
                    name="orden"
                    value={formData.orden}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                <div className="flex items-center gap-4">
                  <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${uploading ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
                    {uploading ? (
                      <span className="animate-pulse">Subiendo...</span>
                    ) : (
                      <>
                        <Image size={18} />
                        <span>Subir imagen</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        
                        // Show immediate preview
                        const objectUrl = URL.createObjectURL(file);
                        setPreviewUrl(objectUrl);
                        setFormData(prev => ({ ...prev, imagen_url: "" }));
                        
                        setUploading(true);
                        setError("");
                        
                        const uploadFormData = new FormData();
                        uploadFormData.append("imagen", file);
                        
                        try {
                          const response = await fetch(`${API_BASE}/upload-especialista`, {
                            method: "POST",
                            body: uploadFormData,
                          });
                          const data = await response.json();
                          
                          if (data.success) {
                            setFormData(prev => ({ ...prev, imagen_url: data.data.path }));
                            setSuccess("Imagen subida correctamente");
                            setTimeout(() => setSuccess(""), 3000);
                          } else {
                            setError(data.error || "Error al subir imagen");
                            setPreviewUrl(null);
                          }
                        } catch (err) {
                          console.error("Upload error:", err);
                          setError("Error de conexión al subir imagen");
                          setPreviewUrl(null);
                        } finally {
                          setUploading(false);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  { (previewUrl || formData.imagen_url) && (
                    <div className="flex items-center gap-2">
                      <img
                        src={previewUrl || getImagenUrl(formData.imagen_url)}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover border border-indigo-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (previewUrl) URL.revokeObjectURL(previewUrl);
                          setPreviewUrl(null);
                          setFormData({ ...formData, imagen_url: "" });
                        }}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Formats: jpg, png, webp, gif (max 5MB)</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
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

export default AdminEspecialistas;