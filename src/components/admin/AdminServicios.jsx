import React from 'react';
import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Sparkles,
  Image,
  Filter,
  X,
  ChevronDown,
  Eye,
  EyeOff,
  Save,
  Package,
  Upload,
  ImagePlus,
  Loader2,
  Trash,
} from "lucide-react";
import API_BASE from "../../config/api";

const AdminServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [servicioEditando, setServicioEditando] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precio_original: "",
    duracion: "60",
    categoria_id: "",
    destacado: false,
    disponible: true,
    imagen_url: "",
    tags: "",
    orden: "0",
  });

  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [serviciosRes, categoriasRes] = await Promise.all([
        fetch(`${API_BASE}/servicios`),
        fetch(`${API_BASE}/categorias`),
      ]);

      if (serviciosRes.ok) {
        const serviciosData = await serviciosRes.json();
        setServicios(serviciosData.success ? serviciosData.data : serviciosData);
      }
      if (categoriasRes.ok) {
        const categoriasData = await categoriasRes.json();
        setCategorias(categoriasData.success ? categoriasData.data : categoriasData);
      }
    } catch (err) {
      setError("Error al cargar datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (modo, servicio = null) => {
    setModalMode(modo);
    if (modo === "edit" && servicio) {
      setServicioEditando(servicio);
      setFormData({
        nombre: servicio.nombre || "",
        descripcion: servicio.descripcion || "",
        precio: servicio.precio || "",
        precio_original: servicio.precio_original || "",
        duracion: String(servicio.duracion || 60),
        categoria_id: String(servicio.categoria_id || ""),
        destacado: Boolean(servicio.destacado),
        disponible: servicio.disponible !== 0,
        imagen_url: servicio.imagen_url || "",
        tags: servicio.tags || "",
        orden: String(servicio.orden || 0),
      });
      setPreviewImage(servicio.imagen_url ? (servicio.imagen_url.startsWith("http") ? servicio.imagen_url : `${API_BASE}${servicio.imagen_url}`) : null);
    } else {
      setServicioEditando(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        precio_original: "",
        duracion: "60",
        categoria_id: categorias[0]?.id ? String(categorias[0].id) : "",
        destacado: false,
        disponible: true,
        imagen_url: "",
        tags: "",
        orden: "0",
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setServicioEditando(null);
    setError("");
    setPreviewImage(null);
    setUploading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    const formDataUpload = new FormData();
    formDataUpload.append("imagen", file);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formDataUpload,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormData((prev) => ({ ...prev, imagen_url: data.data.path }));
        setPreviewImage(data.data.url);
        setSuccess("Imagen subida correctamente");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Error al subir imagen");
      }
    } catch (err) {
      setError("Error al subir imagen");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imagen_url: "" }));
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        precio_original: formData.precio_original ? parseFloat(formData.precio_original) : null,
        duracion: parseInt(formData.duracion),
        categoria_id: parseInt(formData.categoria_id),
        destacado: formData.destacado ? 1 : 0,
        disponible: formData.disponible ? 1 : 0,
        imagen_url: formData.imagen_url,
        tags: formData.tags,
        orden: parseInt(formData.orden),
      };

      let response;
      if (modalMode === "edit" && servicioEditando) {
        response = await fetch(`${API_BASE}/servicios/${servicioEditando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${API_BASE}/servicios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(modalMode === "edit" ? "Servicio actualizado" : "Servicio creado");
        fetchData();
        handleCloseModal();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Error al guardar el servicio");
      }
    } catch (err) {
      setError("Error al guardar el servicio");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este servicio?")) {
      try {
        const response = await fetch(`${API_BASE}/servicios/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setServicios(servicios.filter((s) => s.id !== id));
          setSuccess("Servicio eliminado");
          setTimeout(() => setSuccess(""), 3000);
        } else {
          setError("Error al eliminar el servicio");
        }
      } catch (err) {
        setError("Error al eliminar el servicio");
        console.error(err);
      }
    }
  };

  const handleToggleDisponible = async (servicio) => {
    try {
      const response = await fetch(`${API_BASE}/servicios/${servicio.id}/disponible`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disponible: !servicio.disponible }),
      });
      if (response.ok) {
        setServicios(servicios.map((s) => 
          s.id === servicio.id ? { ...s, disponible: s.disponible ? 0 : 1 } : s
        ));
        setSuccess(servicio.disponible ? "Servicio desactivado" : "Servicio activado");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError("Error al cambiar disponibilidad");
    }
  };

  const serviciosFiltrados = servicios.filter((s) => {
    const matchesSearch =
      s.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = !categoriaFilter || s.categoria_id == categoriaFilter;
    return matchesSearch && matchesCategoria;
  });

  const limpiarFiltros = () => {
    setSearchTerm("");
    setCategoriaFilter("");
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-500">Cargando servicios...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 flex items-center gap-2">
          <Sparkles size={18} />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
          <X size={18} />
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Servicios</h2>
          <p className="text-sm text-gray-500">Administra los servicios del salón</p>
        </div>
        <button 
          onClick={() => handleOpenModal("create")}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nuevo Servicio</span>
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar servicios..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative min-w-[140px]">
              <select
                className="w-full px-3 py-2.5 pr-8 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                value={categoriaFilter}
                onChange={(e) => setCategoriaFilter(e.target.value)}
              >
                <option value="">Todas</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Filtros activos */}
        {(searchTerm || categoriaFilter) && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-gray-500">Filtros:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                "{searchTerm}"
                <button onClick={() => setSearchTerm("")}><X size={12} /></button>
              </span>
            )}
            {categoriaFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                {categorias.find((c) => c.id == categoriaFilter)?.nombre}
                <button onClick={() => setCategoriaFilter("")}><X size={12} /></button>
              </span>
            )}
            <button onClick={limpiarFiltros} className="text-xs text-gray-500 hover:text-gray-700 underline">Limpiar</button>
          </div>
        )}
      </div>

      {/* Resultados */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {serviciosFiltrados.length} de {servicios.length} servicios
        </p>
      </div>

      {/* Grid de Servicios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {serviciosFiltrados.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Sparkles size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No hay servicios</h3>
            <p className="text-gray-500 text-sm">Comienza agregando tu primer servicio</p>
          </div>
        ) : (
          serviciosFiltrados.map((servicio) => (
            <div key={servicio.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
              <div className="h-36 sm:h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                {servicio.imagen_url ? (
                  <img src={servicio.imagen_url.startsWith("http") ? servicio.imagen_url : `${API_BASE}${servicio.imagen_url}`} alt={servicio.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles size={40} className="text-gray-400" />
                    <span className="text-xs text-gray-400">Sin imagen</span>
                  </div>
                )}
                <span className="absolute top-2 right-2 px-2 py-1 rounded-md bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 shadow-sm">
                  {categorias.find((c) => c.id === servicio.categoria_id)?.nombre || "Sin categoría"}
                </span>
                {!servicio.disponible && (
                  <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                    <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium">No disponible</span>
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm truncate">{servicio.nombre}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{servicio.descripcion || "Sin descripción"}</p>

                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-1">
                    <DollarSign size={12} className="text-gray-400" />
                    <span className="font-semibold">${Number(servicio.precio || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-gray-400" />
                    <span>{servicio.duracion || 60} min</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 pt-3 border-t border-gray-100">
                  <button onClick={() => handleToggleDisponible(servicio)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-colors hover:bg-gray-100" title={servicio.disponible ? "Desactivar" : "Activar"}>
                    {servicio.disponible ? <EyeOff size={14} className="text-amber-600" /> : <Eye size={14} className="text-green-600" />}
                  </button>
                  <button onClick={() => handleOpenModal("edit", servicio)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 text-xs transition-colors">
                    <Edit size={14} /> <span className="hidden sm:inline">Editar</span>
                  </button>
                  <button onClick={() => handleDelete(servicio.id)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {modalMode === "edit" ? "Editar Servicio" : "Nuevo Servicio"}
                </h3>
                <button onClick={handleCloseModal} className="p-2 rounded-lg hover:bg-gray-100">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Nombre del servicio" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Descripción del servicio" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input type="number" name="precio" value={formData.precio} onChange={handleInputChange} required min="0" className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio original</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input type="number" name="precio_original" value={formData.precio_original} onChange={handleInputChange} min="0" className="w-full pl-7 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="0" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duración (min)</label>
                  <input type="number" name="duracion" value={formData.duracion} onChange={handleInputChange} min="15" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                  <input type="number" name="orden" value={formData.orden} onChange={handleInputChange} min="0" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                <select name="categoria_id" value={formData.categoria_id} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-white">
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del servicio</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  {previewImage || formData.imagen_url ? (
                    <div className="relative inline-block">
                      <img 
                        src={previewImage || (formData.imagen_url.startsWith("http") ? formData.imagen_url : `${API_BASE}${formData.imagen_url}`)} 
                        alt="Preview" 
                        className="max-h-40 rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-2">
                        {uploading ? (
                          <Loader2 className="animate-spin text-blue-500" size={32} />
                        ) : (
                          <ImagePlus className="text-gray-400" size={32} />
                        )}
                        <span className="text-sm text-gray-500">
                          {uploading ? "Subiendo..." : "Click para subir imagen"}
                        </span>
                        <span className="text-xs text-gray-400">JPG, PNG, WebP (max 5MB)</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="tag1, tag2, tag3" />
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="destacado" checked={formData.destacado} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Destacado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="disponible" checked={formData.disponible} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Disponible</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                  {modalMode === "edit" ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServicios;