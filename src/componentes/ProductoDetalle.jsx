import React from 'react';
// src/componentes/ProductoDetalle.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Star,
  Heart,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  Flower2,
  Sparkles,
} from "lucide-react";

import API_BASE from "../config/api";

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/servicios/${id}`);

        if (!response.ok) {
          throw new Error("Servicio no encontrado");
        }

        const data = await response.json();
        setServicio(data);
      } catch (error) {
        console.error("Error:", error);
        setError("No se pudo cargar el servicio");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchServicio();
  }, [id]);

  const handleReservar = () => {
    navigate("/reserva-cita", {
      state: { servicio },
    });
  };

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #fff5f7 40%, #ffeef2 70%, #ffe4e8 100%)",
        }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2
              className="animate-spin mx-auto mb-4"
              size={48}
              style={{ color: "#e84a7f" }}
            />
            <p className="text-lg" style={{ color: "#9d174d" }}>
              Cargando servicio...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !servicio) {
    return (
      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #fff5f7 40%, #ffeef2 70%, #ffe4e8 100%)",
        }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle
              className="mx-auto mb-4"
              size={48}
              style={{ color: "#e84a7f" }}
            />
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#831843" }}
            >
              Servicio no encontrado
            </h2>
            <p className="mb-6" style={{ color: "#9d174d" }}>
              {error || "El servicio que buscas no existe o fue eliminado"}
            </p>
            <button
              onClick={() => navigate("/servicios")}
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl transition-all shadow-lg"
              style={{
                background: "linear-gradient(135deg, #e84a7f, #ff6b9d)",
                boxShadow: "0 8px 20px rgba(245, 169, 184, 0.3)",
              }}
            >
              <ArrowLeft size={18} />
              Volver a servicios
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #ffffff 0%, #fff5f7 40%, #ffeef2 70%, #ffe4e8 100%)",
      }}
    >
      {/* Header */}
      <div
        className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-10"
        style={{
          borderColor: "rgba(245, 169, 184, 0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 transition-colors group"
            style={{ color: "#9d174d" }}
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Volver</span>
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div
              className="aspect-square rounded-3xl overflow-hidden border shadow-xl"
              style={{
                background: "linear-gradient(135deg, #fff5f7, #ffeef2)",
                borderColor: "rgba(245, 169, 184, 0.3)",
                boxShadow: "0 20px 40px rgba(245, 169, 184, 0.15)",
              }}
            >
              <img
                src={
                  servicio.imagen_url ||
                  `https://via.placeholder.com/600x600?text=${servicio.nombre}`
                }
                alt={servicio.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            {servicio.popular && (
              <div className="absolute top-4 right-4">
                <div
                  className="px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #e84a7f, #ff6b9d)",
                  }}
                >
                  <Heart size={14} className="text-white" fill="white" />
                  <span className="text-white text-xs font-bold">POPULAR</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Información */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 text-sm mb-2">
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(245, 169, 184, 0.15)",
                    color: "#e84a7f",
                  }}
                >
                  {servicio.categoria_nombre || "Servicio"}
                </span>
              </div>
              <h1
                className="text-4xl font-bold mb-4"
                style={{ color: "#831843" }}
              >
                {servicio.nombre}
              </h1>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "#9d174d" }}
              >
                {servicio.descripcion}
              </p>
            </div>

            {/* Detalles */}
            <div
              className="grid grid-cols-2 gap-4 py-6 border-y"
              style={{
                borderColor: "rgba(245, 169, 184, 0.2)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: "rgba(245, 169, 184, 0.1)",
                  }}
                >
                  <Clock size={20} style={{ color: "#e84a7f" }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "#c89aab" }}>
                    Duración
                  </p>
                  <p className="font-semibold" style={{ color: "#831843" }}>
                    {servicio.duracion} minutos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: "rgba(245, 169, 184, 0.1)",
                  }}
                >
                  <Star size={20} style={{ color: "#e84a7f" }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "#c89aab" }}>
                    Rating
                  </p>
                  <p className="font-semibold" style={{ color: "#831843" }}>
                    {servicio.rating || "4.8"} / 5.0
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: "rgba(245, 169, 184, 0.1)",
                  }}
                >
                  <User size={20} style={{ color: "#e84a7f" }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "#c89aab" }}>
                    Especialista
                  </p>
                  <p className="font-semibold" style={{ color: "#831843" }}>
                    {servicio.especialista || "Profesional asignado"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: "rgba(245, 169, 184, 0.1)",
                  }}
                >
                  <Calendar size={20} style={{ color: "#e84a7f" }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: "#c89aab" }}>
                    Disponibilidad
                  </p>
                  <p className="font-semibold" style={{ color: "#831843" }}>
                    {servicio.disponible ? "Inmediata" : "Consultar"}
                  </p>
                </div>
              </div>
            </div>

            {/* Precio y acción */}
            <div className="flex items-center justify-between pt-4 flex-wrap gap-4">
              <div>
                <p className="text-sm mb-1" style={{ color: "#c89aab" }}>
                  Precio
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className="text-4xl font-bold"
                    style={{
                      background: "linear-gradient(90deg, #e84a7f, #ff6b9d)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ${servicio.precio?.toLocaleString()}
                  </span>
                  {servicio.precio_original && (
                    <span
                      className="text-lg line-through"
                      style={{ color: "#c89aab" }}
                    >
                      ${servicio.precio_original.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReservar}
                className="px-8 py-4 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #e84a7f, #ff6b9d)",
                  boxShadow: "0 8px 25px rgba(245, 169, 184, 0.4)",
                }}
              >
                Reservar ahora
              </motion.button>
            </div>

            {/* Tags */}
            {servicio.tags && (
              <div className="pt-6">
                <p className="text-sm mb-3" style={{ color: "#c89aab" }}>
                  Etiquetas
                </p>
                <div className="flex flex-wrap gap-2">
                  {servicio.tags.split(",").map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        background: "rgba(245, 169, 184, 0.1)",
                        color: "#9d174d",
                      }}
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;
