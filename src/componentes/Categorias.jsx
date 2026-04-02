import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Scissors,
  Package,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Flower2,
  Trees,
  Leaf,
  Palette,
  Waves,
  AlertCircle,
  RefreshCw,
  Crown,
} from "lucide-react";

import API_BASE from "../config/api";
import facialesImg from "../assets/categorias/faciales.jpg";
import cortesImg from "../assets/categorias/cortes.jpg";
import manicureImg from "../assets/categorias/manicure.jpg";
import spaImg from "../assets/categorias/spa.jpg";
import maquiagemImg from "../assets/categorias/maquillaje.jpg";
import premiumImg from "../assets/categorias/premium.jpg";

const imagenPorCategoriaFallback = {
  1: facialesImg,
  2: cortesImg,
  3: manicureImg,
  4: spaImg,
  5: maquiagemImg,
  6: premiumImg,
};

const emojisPorCategoria = {
  1: "🌸",
  2: "💇",
  3: "💅",
  4: "🛁",
  5: "✨",
  6: "👑",
};

// 💠 ICONOS MODERNOS - Estilo Slate/Indigo
const iconosPorCategoria = {
  1: <Flower2 className="text-indigo-500" size={20} />,
  2: <Scissors className="text-indigo-500" size={20} />,
  3: <Sparkles className="text-indigo-500" size={20} />,
  4: <Waves className="text-indigo-500" size={20} />,
  5: <Palette className="text-indigo-500" size={20} />,
  6: <Crown className="text-violet-500" size={20} />,
};

const Categorias = ({ onSelect, categoriaActiva, soloDestacadas = false }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setError("");
        let url = soloDestacadas
          ? `${API_BASE}/categorias/destacadas`
          : `${API_BASE}/categorias`;

        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Error ${response.status}: ${response.statusText}`);

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setCategorias(result.data);
        } else if (Array.isArray(result)) {
          setCategorias(result);
        } else {
          throw new Error("Formato de datos inválido");
        }
      } catch (error) {
        console.error("❌ Error al cargar categorías:", error);
        setError("No se pudieron cargar las categorías");
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, [soloDestacadas]);

  const handleRetry = () => {
    setLoading(true);
    setError("");
    window.location.reload();
  };

  const getImagenCategoria = (categoria) => {
    if (categoria.imagen_url) {
      return categoria.imagen_url.startsWith("http")
        ? categoria.imagen_url
        : `${API_BASE}${categoria.imagen_url}`;
    }
    return imagenPorCategoriaFallback[categoria.id] || facialesImg;
  };

  const getEmojiCategoria = (categoria) =>
    emojisPorCategoria[categoria.id] || "✨";

  const getIconoCategoria = (categoria) => {
    if (categoria.icono) {
      const iconMap = {
        flower: <Flower2 className="text-indigo-500" size={20} />,
        scissors: <Scissors className="text-indigo-500" size={20} />,
        sparkles: <Sparkles className="text-indigo-500" size={20} />,
        waves: <Waves className="text-indigo-500" size={20} />,
        palette: <Palette className="text-indigo-500" size={20} />,
        leaf: <Leaf className="text-indigo-500" size={20} />,
        facial: <Flower2 className="text-indigo-500" size={20} />,
        nail: <Sparkles className="text-indigo-500" size={20} />,
        spa: <Waves className="text-indigo-500" size={20} />,
        makeup: <Palette className="text-indigo-500" size={20} />,
        premium: <Crown className="text-violet-500" size={20} />,
      };
      return (
        iconMap[categoria.icono] ||
        iconosPorCategoria[categoria.id] || (
          <Sparkles className="text-indigo-500" size={20} />
        )
      );
    }
    return (
      iconosPorCategoria[categoria.id] || (
        <Sparkles className="text-indigo-500" size={20} />
      )
    );
  };

  // Loading
  if (loading) {
    return (
      <section className="w-full py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl shadow-xl bg-gradient-to-br from-indigo-500 to-violet-500">
                <Sparkles className="text-white" size={28} />
              </div>
              <div className="h-8 w-64 rounded-lg bg-slate-200 animate-pulse"></div>
            </div>
            <div className="h-4 w-96 rounded mx-auto bg-slate-100 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[400px] rounded-3xl animate-pulse border border-slate-100 bg-white"
              >
                <div className="h-48 rounded-t-3xl bg-slate-200/60"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 rounded bg-slate-200 w-3/4"></div>
                  <div className="h-4 rounded bg-slate-100 w-full"></div>
                  <div className="h-4 rounded bg-slate-100 w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section className="w-full py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-slate-100 text-slate-400">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800">
            ¡Ups! Algo salió mal
          </h3>
          <p className="mb-6 max-w-md mx-auto text-slate-500">
            {error}. Por favor, intenta nuevamente.
          </p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-gradient-to-r from-indigo-600 to-violet-600"
          >
            <RefreshCw size={18} />
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  // Empty
  if (categorias.length === 0) {
    return (
      <section className="w-full py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-slate-100">
            <Package className="text-slate-400" size={32} />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-slate-800">
            No hay categorías disponibles
          </h3>
          <p className="text-slate-500">
            Próximamente estaremos agregando nuevos servicios para ti.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-20 relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      {/* Decorativos Modernos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20 bg-indigo-200"></div>
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full blur-3xl opacity-20 bg-violet-200"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex flex-col items-center">
            <div className="inline-flex items-center gap-4 mb-4">
              <div className="p-4 rounded-2xl shadow-xl shadow-indigo-200/50 bg-gradient-to-br from-indigo-600 to-violet-600">
                <Sparkles className="text-white" size={36} />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-indigo-700 to-violet-800 tracking-tight">
                {soloDestacadas ? "Servicios Destacados" : "Nuestros Servicios"}
              </h2>
            </div>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed font-medium text-slate-600">
              {soloDestacadas
                ? "Descubre nuestros tratamientos más populares y exclusivos"
                : "Descubre una experiencia única de belleza y bienestar con nuestros tratamientos especializados"}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categorias.map((cat, index) => {
            const isActive =
              categoriaActiva &&
              categoriaActiva.toString() === cat.id.toString();
            const isHov = hoveredId === cat.id;
            const imagen = getImagenCategoria(cat);
            const emoji = getEmojiCategoria(cat);
            const icono = getIconoCategoria(cat);

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 80,
                  damping: 15,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative h-full"
              >
                <button
                  onClick={() => onSelect?.(cat.id)}
                  className={`w-full h-full text-left rounded-3xl overflow-hidden border-2 transition-all duration-500 group shadow-lg hover:shadow-2xl flex flex-col ${
                    isActive
                      ? "bg-gradient-to-b from-indigo-50 to-white border-indigo-500 shadow-indigo-200"
                      : "bg-white border-slate-100 hover:border-indigo-200"
                  }`}
                >
                  {/* IMAGEN ALTA CALIDAD */}
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <motion.img
                      src={imagen}
                      alt={cat.nombre}
                      className="w-full h-full object-cover"
                      animate={{
                        scale: isHov ? 1.08 : 1,
                        filter: isHov
                          ? "brightness(1.05) contrast(1.1)"
                          : "brightness(0.95)",
                      }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      onError={(e) => {
                        e.target.src =
                          imagenPorCategoriaFallback[cat.id] || facialesImg;
                      }}
                    />
                    
                    {/* Overlay Gradiente Oscuro para Legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />

                    {/* Emoji badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <motion.div
                        animate={{ rotate: isHov ? [0, 15, -15, 0] : 0 }}
                        transition={{ duration: 0.5 }}
                        className={`p-3 rounded-xl backdrop-blur-md shadow-lg border ${
                          isActive
                            ? "bg-indigo-500/90 border-indigo-400"
                            : "bg-white/90 border-white"
                        }`}
                      >
                        <span className="text-2xl drop-shadow-sm">{emoji}</span>
                      </motion.div>
                    </div>

                    {cat.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white border border-white/20"
                        >
                          <Heart size={14} fill="currentColor" />
                          <span className="text-xs font-bold tracking-wider">
                            POPULAR
                          </span>
                        </motion.div>
                      </div>
                    )}

                    {/* Titulo en la Imagen (Opcional, estilo moderno) */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                       <h3 className="text-2xl font-bold text-white drop-shadow-md">
                          {cat.nombre}
                       </h3>
                    </div>
                  </div>

                  {/* CONTENIDO TEXTUAL */}
                  <div className="p-6 relative z-10 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 text-sm font-semibold text-slate-500 mb-3">
                          <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md text-slate-700">
                            <Package size={14} className="text-indigo-500" />
                            {cat.product_count || 0} servicios
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md text-slate-700">
                            <Clock size={14} className="text-violet-500" />
                            {cat.duracion_promedio || "60 min"}
                          </span>
                        </div>
                      </div>

                      <motion.div
                        animate={{
                          x: isHov || isActive ? 4 : 0,
                          scale: isHov || isActive ? 1.1 : 1,
                        }}
                        className={`p-2.5 rounded-xl transition-colors shadow-sm ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-indigo-600 group-hover:bg-indigo-50"
                        }`}
                      >
                        <ArrowRight size={18} />
                      </motion.div>
                    </div>

                    <p className="mb-6 text-sm leading-relaxed line-clamp-3 text-slate-600 flex-grow">
                      {cat.descripcion || "Descripción no disponible"}
                    </p>

                    {/* PIE DE TARJETA */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-100/80 group-hover:bg-indigo-50 transition-colors">
                          <Calendar size={16} className="text-indigo-500" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Precio Base
                          </div>
                          <div className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors">
                            {cat.precio_promedio || "$50,000"}
                          </div>
                        </div>
                      </div>

                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-indigo-50 border-indigo-200"
                        >
                          <div className="w-2 h-2 rounded-full animate-pulse bg-indigo-600"></div>
                          <span className="text-xs font-bold text-indigo-700">
                            Activo
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categorias;
