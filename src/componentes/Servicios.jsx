import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  User,
  Star,
  Filter,
  Calendar,
  CheckCircle,
  X,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  Layers,
} from "lucide-react";

import API_BASE from "../config/api";

const Servicios = ({ categoriaId, categoriaNombre, onReservar }) => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [filtroPrecio, setFiltroPrecio] = useState("todos");
  const [expandedServices, setExpandedServices] = useState({});
  const [error, setError] = useState(null);

  const fetchServicios = useCallback(async () => {
    if (!categoriaId) {
      setServicios([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE}/servicios/categoria/${categoriaId}`,
      );

      if (response.ok) {
        const result = await response.json();

        let serviciosData = [];

        if (result.success && Array.isArray(result.data)) {
          serviciosData = result.data;
        } else if (Array.isArray(result)) {
          serviciosData = result;
        } else {
          console.error("Formato inválido:", result);
          serviciosData = [];
        }

        setServicios(serviciosData);

        const expanded = {};
        serviciosData.forEach((servicio) => {
          expanded[servicio.id] = false;
        });
        setExpandedServices(expanded);
      } else {
        throw new Error("Error al cargar servicios");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cargar los servicios. Intenta nuevamente.");
      setServicios([]);
    } finally {
      setLoading(false);
    }
  }, [categoriaId]);

  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  const serviciosFiltrados = servicios.filter((servicio) => {
    if (filtroPrecio === "todos") return true;
    if (filtroPrecio === "economico") return servicio.precio <= 70000;
    if (filtroPrecio === "medio")
      return servicio.precio > 70000 && servicio.precio <= 120000;
    if (filtroPrecio === "premium") return servicio.precio > 120000;
    return true;
  });

  const handleReservarClick = (servicio) => {
    navigate("/reservar", { state: { servicio } });
    if (onReservar) onReservar(servicio);
  };

  const toggleExpand = (servicioId) => {
    setExpandedServices((prev) => ({
      ...prev,
      [servicioId]: !prev[servicioId],
    }));
  };

  const handleFilterClick = (value) => {
    setFiltroPrecio(value);
  };

  // State: No Category Selected
  if (!categoriaId) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-transparent">
        <div className="text-center p-8 bg-white/50 rounded-3xl border border-slate-100 shadow-sm backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-indigo-50 shadow-inner">
            <Info size={24} className="text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            Explora nuestros servicios
          </h3>
          <p className="text-slate-500 mt-2">
            Selecciona una categoría arriba para comenzar
          </p>
        </div>
      </div>
    );
  }

  // State: Loading
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col pt-10">
        <div className="animate-pulse space-y-6 max-w-7xl mx-auto w-full px-4">
          <div className="flex gap-4">
            <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
            <div className="h-10 w-24 bg-slate-200 rounded-lg hidden sm:block"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-white border border-slate-100 shadow-sm p-5 flex flex-col gap-4 justify-between"
              >
                 <div className="space-y-3">
                    <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                    <div className="h-4 w-full bg-slate-100 rounded"></div>
                    <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                 </div>
                 <div className="flex gap-2">
                    <div className="h-10 flex-1 bg-slate-100 rounded-lg"></div>
                    <div className="h-10 flex-1 bg-slate-200 rounded-lg"></div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {selectedService && (
          <ServiceModal
            servicio={selectedService}
            onClose={() => setSelectedService(null)}
            onReservar={() => handleReservarClick(selectedService)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header & Filtros */}
        <div className="mb-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-indigo-50 shadow-inner">
                  <Layers size={24} className="text-indigo-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  {categoriaNombre || "Servicios Disponibles"}
                </h2>
              </div>
              <p className="text-slate-500 font-medium">
                Hemos encontrado <span className="text-indigo-600 font-bold">{serviciosFiltrados.length}</span> resultados para ti
              </p>
            </div>

            {/* Filtros Modernos */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200/50">
                {["todos", "economico", "medio", "premium"].map((filtro) => (
                  <button
                    key={filtro}
                    type="button"
                    onClick={() => handleFilterClick(filtro)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                      filtroPrecio === filtro 
                        ? "bg-white text-indigo-700 shadow-md transform scale-105" 
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                  >
                    {filtro === "todos" && "Todos"}
                    {filtro === "economico" && "Económico"}
                    {filtro === "medio" && "Medio"}
                    {filtro === "premium" && "Premium"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 rounded-2xl bg-red-50 border border-red-100 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <X size={20} className="text-red-500" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            <button
              type="button"
              onClick={fetchServicios}
              className="text-sm font-bold text-red-600 hover:text-red-800 px-4 py-2 bg-white rounded-lg shadow-sm border border-red-100 transition-colors"
            >
              Reintentar
            </button>
          </motion.div>
        )}

        {/* Lista de Servicios */}
        {serviciosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-slate-50">
              <Filter size={32} className="text-slate-400" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">
              No se encontraron servicios
            </h4>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Intenta cambiar los filtros de precio o selecciona otra categoría.
            </p>
            {filtroPrecio !== "todos" && (
              <button
                type="button"
                onClick={() => setFiltroPrecio("todos")}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviciosFiltrados.map((servicio, index) => (
              <ServiceCard
                key={servicio.id}
                servicio={servicio}
                index={index}
                isExpanded={expandedServices[servicio.id]}
                onToggleExpand={() => toggleExpand(servicio.id)}
                onViewDetails={() => setSelectedService(servicio)}
                onReservar={() => handleReservarClick(servicio)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// COMPONENTE DE TARJETA ESTILO "SLATE/INDIGO"
const ServiceCard = ({
  servicio,
  isExpanded,
  onToggleExpand,
  onViewDetails,
  onReservar,
  index
}) => {
  const isLongDescription = servicio.descripcion?.length > 120;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full group"
    >
      <div className="p-6 flex flex-col flex-grow">
        {/* Encabezado */}
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1 group-hover:text-indigo-700 transition-colors">
              {servicio.nombre}
            </h3>
            {servicio.categoria_nombre && (
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                {servicio.categoria_nombre}
              </span>
            )}
          </div>
          {servicio.destacado && (
            <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm shrink-0 uppercase tracking-widest">
              <Star size={10} fill="currentColor" />
              Destacado
            </span>
          )}
        </div>

        {/* Descripción */}
        <div className="mb-6 flex-grow">
          <p className={`text-sm leading-relaxed text-slate-600 ${!isExpanded && isLongDescription ? "line-clamp-3" : ""}`}>
            {servicio.descripcion || "Sin descripción detallada por el momento."}
          </p>
          {isLongDescription && (
            <button
              type="button"
              onClick={onToggleExpand}
              className="mt-2 text-sm font-semibold flex items-center gap-1 text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              {isExpanded ? (
                <><ChevronUp size={16} /> Ocultar</>
              ) : (
                <><ChevronDown size={16} /> Leer más</>
              )}
            </button>
          )}
        </div>

        {/* Detalles Rápidos (Footer content) */}
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock size={16} className="text-indigo-400" />
              <span className="text-sm font-medium">{servicio.duracion || 60} min</span>
            </div>
            {servicio.especialista && (
              <div className="flex items-center gap-2 text-slate-600">
                <User size={16} className="text-violet-400" />
                <span className="text-sm font-medium line-clamp-1 max-w-[100px]">{servicio.especialista}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-end justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Precio Final</span>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-violet-700">
                ${parseFloat(servicio.precio || 0).toLocaleString()}
              </div>
              {servicio.precio_original && servicio.precio_original > servicio.precio && (
                <div className="text-xs font-semibold line-through text-slate-400">
                  ${parseFloat(servicio.precio_original).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 mt-auto">
          <button
            type="button"
            onClick={onViewDetails}
            className="flex-1 py-2.5 px-3 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
          >
            <Info size={16} />
            Info
          </button>
          <button
            type="button"
            onClick={onReservar}
            className="flex-1 py-2.5 px-3 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5"
          >
            <Calendar size={16} />
            Reservar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// MODAL DE DETALLES REDISEÑADO
const ServiceModal = ({ servicio, onClose, onReservar }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-start relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 w-full pr-8">
            <span className="inline-block px-2.5 py-1 mb-3 text-[10px] font-extrabold rounded-md bg-indigo-100 text-indigo-700 uppercase tracking-widest">
              {servicio.categoria_nombre || "Servicio"}
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
              {servicio.nombre}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors z-20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo Scrolleable */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
          <div className="mb-8">
             <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-3 uppercase tracking-wider text-xs">
                <Info size={16} className="text-indigo-500" />
                Resumen del Servicio
             </h4>
             <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                {servicio.descripcion || "Sin descripción proporcionada."}
             </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-slate-50 p-4 rounded-2xl flex flex-col border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                   <Clock size={12} /> Duración
                </span>
                <span className="text-lg font-bold text-slate-800">
                   {servicio.duracion || 60} mins
                </span>
             </div>
             
             <div className="bg-slate-50 p-4 rounded-2xl flex flex-col border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                   <User size={12} /> Especialista
                </span>
                <span className="text-lg font-bold text-slate-800 line-clamp-1">
                   {servicio.especialista || "Asignado"}
                </span>
             </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100 mb-8 flex items-center justify-between">
             <span className="text-sm font-bold text-indigo-900 uppercase tracking-wider">
               Precio de Reserva
             </span>
             <div className="text-right">
                <div className="text-3xl font-black text-indigo-700">
                   ${parseFloat(servicio.precio || 0).toLocaleString()}
                </div>
                {servicio.precio_original && servicio.precio_original > servicio.precio && (
                   <span className="text-sm font-semibold line-through text-indigo-400/80">
                      ${parseFloat(servicio.precio_original).toLocaleString()}
                   </span>
                )}
             </div>
          </div>

          <div className="space-y-3 px-2">
             <div className="flex items-start gap-3 text-sm">
                <CheckCircle size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-slate-600 font-medium">Confirmación instantánea de tu cita</span>
             </div>
             <div className="flex items-start gap-3 text-sm">
                <CheckCircle size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-slate-600 font-medium">Pagas directamente en el establecimiento</span>
             </div>
          </div>
        </div>

        {/* Footer Fijado */}
        <div className="p-6 pt-0 mt-auto">
          <button
            type="button"
            onClick={() => {
              onReservar();
              onClose();
            }}
            className="w-full py-4 text-white font-bold rounded-2xl shadow-lg hover:shadow-indigo-200 transition-all text-lg flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:-translate-y-1"
          >
            <Calendar size={22} />
            Agendar Cita Ahora
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Servicios;
