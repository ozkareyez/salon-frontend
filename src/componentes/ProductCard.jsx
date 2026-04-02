import React from 'react';
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { useState } from "react";

const ProductCard = ({ producto }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(producto);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl overflow-hidden border shadow-lg hover:shadow-2xl transition-all duration-300"
      style={{
        background: "white",
        borderColor: "rgba(245, 169, 184, 0.2)",
        boxShadow: "0 8px 20px rgba(245, 169, 184, 0.1)",
      }}
    >
      {/* Badge de popularidad */}
      {producto.popular && (
        <div className="absolute top-3 left-3 z-10">
          <div
            className="px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #f5a9b8, #e89bb0)",
            }}
          >
            <Heart size={10} className="text-white" fill="white" />
            <span className="text-white">POPULAR</span>
          </div>
        </div>
      )}

      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={producto.imagen_principal}
          alt={producto.nombre}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.5 }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to top, rgba(245, 169, 184, 0.2), transparent)",
          }}
        />
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Rating */}
        {producto.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={14} style={{ color: "#f5a9b8" }} fill="#f5a9b8" />
            <span className="text-xs font-medium" style={{ color: "#b88d9a" }}>
              {producto.rating} / 5.0
            </span>
          </div>
        )}

        {/* Título */}
        <h3
          className="font-bold text-lg mb-1 line-clamp-1"
          style={{ color: "#9b6b7a" }}
        >
          {producto.nombre}
        </h3>

        {/* Descripción corta */}
        {producto.descripcion_corta && (
          <p className="text-sm mb-3 line-clamp-2" style={{ color: "#b88d9a" }}>
            {producto.descripcion_corta}
          </p>
        )}

        {/* Precio y duración */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs" style={{ color: "#c89aab" }}>
              Precio
            </p>
            <p
              className="font-bold text-xl"
              style={{
                background: "linear-gradient(90deg, #f5a9b8, #e89bb0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ${producto.precio?.toLocaleString()}
            </p>
          </div>
          {producto.duracion && (
            <div className="text-right">
              <p className="text-xs" style={{ color: "#c89aab" }}>
                Duración
              </p>
              <p className="font-medium text-sm" style={{ color: "#9b6b7a" }}>
                {producto.duracion} min
              </p>
            </div>
          )}
        </div>

        {/* Botón agregar */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="relative w-full py-3 rounded-xl font-semibold transition-all overflow-hidden group"
          style={{
            background: isAdded
              ? "linear-gradient(135deg, #b0d9b1, #8fc98f)"
              : "linear-gradient(135deg, #f5a9b8, #e89bb0)",
            boxShadow: "0 4px 12px rgba(245, 169, 184, 0.3)",
          }}
        >
          <div
            className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            }}
          />
          <span className="relative flex items-center justify-center gap-2 text-white">
            {isAdded ? (
              <>
                <span>✓ Agregado</span>
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                <span>Agregar al carrito</span>
              </>
            )}
          </span>
        </motion.button>
      </div>

      {/* Efecto de brillo al hacer hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(245, 169, 184, 0.1), transparent 70%)",
        }}
      />
    </motion.div>
  );
};

export default ProductCard;
