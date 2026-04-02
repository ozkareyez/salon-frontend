import React from 'react';
import {
  X,
  Plus,
  Minus,
  Trash,
  ShoppingCart,
  Truck,
  Shield,
  CreditCard,
  MessageCircle,
  AlertCircle,
  Package,
  Loader2,
  CheckCircle,
  Info,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import API_BASE from "../config/api";

// 🔥 IMPORTACIÓN DINÁMICA DE TODAS LAS IMÁGENES
const importAllImages = () => {
  const images = import.meta.glob(
    "../assets/productos/*.{jpg,jpeg,png,webp,gif}",
    {
      eager: true,
      import: "default",
    }
  );

  const imageMap = {};
  Object.keys(images).forEach((path) => {
    const fileName = path.split("/").pop();
    imageMap[fileName] = images[path];
  });

  return imageMap;
};

const ALL_IMAGES = importAllImages();

// Función para obtener la imagen correcta
const getProductImage = (imageName) => {
  if (!imageName) {
    return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop";
  }

  // Buscar la imagen en nuestro mapa
  const image = ALL_IMAGES[imageName];

  if (image) {
    return image;
  }

  // Si no se encuentra, intentar con variaciones del nombre
  const variations = [
    imageName,
    imageName.toLowerCase(),
    imageName.replace(/\s+/g, "_"),
    imageName.replace(/\s+/g, "-"),
  ];

  for (const variation of variations) {
    if (ALL_IMAGES[variation]) {
      return ALL_IMAGES[variation];
    }
  }

  return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop";
};

export default function CartDrawer() {
  const {
    cart,
    open,
    setOpen,
    updateQty,
    removeFromCart,
    total,
    clearCart,
    itemCount,
  } = useCart();
  const [checkout, setCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderType, setOrderType] = useState("domicilio");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* OVERLAY CON ANIMACIÓN */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-50 flex items-start justify-end bg-slate-950/60 backdrop-blur-sm"
      />

      {/* DRAWER CON ANIMACIÓN */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white h-full overflow-hidden border-l border-indigo-600/20 shadow-2xl"
      >
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950/80 to-slate-900/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                  Tu Pedido
                </h2>
                <p className="text-gray-400 text-sm">
                  {itemCount} item{itemCount !== 1 ? "s" : ""} en el carrito
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="text-gray-400 hover:text-white" size={24} />
            </button>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col h-[calc(100vh-200px)]">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-6 p-4 bg-slate-800/50 rounded-2xl">
                <Package className="text-gray-400 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Carrito vacío
                </h3>
                <p className="text-gray-400">Agrega productos para continuar</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-yellow-700 transition-all"
              >
                Explorar menú
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {cart.map((item, index) => {
                    console.log(`🛒 Item ${index}:`, item);
                    console.log(`📸 Imagen:`, item.imagen);
                    console.log(
                      `🔍 Imagen encontrada:`,
                      ALL_IMAGES[item.imagem] ? "Sí" : "No"
                    );

                    return (
                      <motion.div
                        key={item.cartItemId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-800 shadow-lg"
                      >
                        <div className="flex gap-4">
                          {/* IMAGEN */}
                          <div className="relative flex-shrink-0">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-indigo-600/20">
                              <img
                                src={getProductImage(item.imagen)}
                                alt={item.nombre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error(
                                    `❌ Error cargando imagen en carrito: ${item.imagen}`
                                  );
                                  console.log(
                                    "Imágenes disponibles:",
                                    Object.keys(ALL_IMAGES)
                                  );
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop";
                                }}
                              />
                            </div>
                            {item.cantidad > 1 && (
                              <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                ×{item.cantidad}
                              </div>
                            )}
                          </div>

                          {/* INFORMACIÓN */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-white text-lg truncate">
                                {item.nombre}
                              </h3>
                              <button
                                onClick={() => removeFromCart(item.cartItemId)}
                                className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                              >
                                <Trash
                                  className="text-red-400 hover:text-red-300"
                                  size={18}
                                />
                              </button>
                            </div>

                            {/* EXTRAS */}
                            {item.extras?.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {item.extras.map((extra, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                    <span className="text-green-400">
                                      + {extra.nombre}
                                    </span>
                                    <span className="text-indigo-400 font-medium">
                                      (+$
                                      {Number(
                                        extra.precio || 0
                                      ).toLocaleString()}
                                      )
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* INGREDIENTES QUITADOS */}
                            {item.ingredientes_quitados?.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {item.ingredientes_quitados.map((ing, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                    <span className="text-red-400">
                                      Sin {ing}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* PRECIO Y CONTROLES */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
                                  <button
                                    onClick={() =>
                                      updateQty(
                                        item.cartItemId,
                                        item.cantidad - 1
                                      )
                                    }
                                    disabled={item.cantidad <= 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Minus className="text-white" size={16} />
                                  </button>
                                  <span className="font-bold text-white min-w-[24px] text-center">
                                    {item.cantidad}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQty(
                                        item.cartItemId,
                                        item.cantidad + 1
                                      )
                                    }
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 transition-colors"
                                  >
                                    <Plus
                                      className="text-indigo-400"
                                      size={16}
                                    />
                                  </button>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                                  $
                                  {(
                                    item.precio_final * item.cantidad
                                  ).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-400">
                                  ${item.precio_final.toLocaleString()} c/u
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* RESUMEN */}
              <div className="border-t border-slate-800 bg-gradient-to-t from-slate-950/90 to-transparent p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="text-blue-400" size={20} />
                    <label className="text-gray-300 text-sm font-medium">
                      Tipo de pedido
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["domicilio", "mesa"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          orderType === type
                            ? "border-indigo-600 bg-indigo-600/10"
                            : "border-gray-700 bg-slate-800/50 hover:border-gray-600"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {type === "domicilio" ? (
                            <>
                              <Truck
                                className={
                                  orderType === type
                                    ? "text-indigo-400"
                                    : "text-gray-400"
                                }
                                size={20}
                              />
                              <span
                                className={
                                  orderType === type
                                    ? "text-indigo-400 font-semibold"
                                    : "text-gray-300"
                                }
                              >
                                Domicilio
                              </span>
                            </>
                          ) : (
                            <>
                              <Package
                                className={
                                  orderType === type
                                    ? "text-indigo-400"
                                    : "text-gray-400"
                                }
                                size={20}
                              />
                              <span
                                className={
                                  orderType === type
                                    ? "text-indigo-400 font-semibold"
                                    : "text-gray-300"
                                }
                              >
                                En mesa
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* RESUMEN DE PAGO */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Subtotal</span>
                    <span>${total.toLocaleString()}</span>
                  </div>

                  {orderType === "domicilio" && (
                    <div className="flex justify-between items-center text-gray-300">
                      <span>Costo de envío</span>
                      <span className="text-indigo-400">Según zona/barrio</span>
                    </div>
                  )}

                  <div className="h-px bg-slate-800"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">
                      Total estimado
                    </span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                      ${total.toLocaleString()}
                      {orderType === "domicilio" && " + envío*"}
                    </span>
                  </div>

                  {orderType === "domicilio" && (
                    <div className="text-sm text-gray-400 p-3 bg-slate-800/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle
                          size={16}
                          className="text-indigo-400 mt-0.5 flex-shrink-0"
                        />
                        <span>
                          *El costo del domicilio varía según tu zona/barrio. Se
                          calculará y confirmará contigo después de recibir tu
                          pedido.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="space-y-3">
                  <button
                    onClick={() => setCheckout(true)}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-yellow-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        <span>Finalizar pedido</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full bg-slate-800/50 hover:bg-slate-800 text-gray-300 font-medium py-2.5 rounded-xl border border-gray-700 transition-colors"
                  >
                    Vaciar carrito
                  </button>
                </div>

                {/* GARANTÍA */}
                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-800">
                  <Shield className="text-green-400" size={16} />
                  <span className="text-gray-400 text-sm">
                    Pago 100% seguro • Entrega garantizada
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* MODAL CHECKOUT */}
      <AnimatePresence>
        {checkout && (
          <CheckoutModal
            cart={cart}
            total={total}
            orderType={orderType}
            clearCart={clearCart}
            closeAll={() => {
              setCheckout(false);
              setOpen(false);
            }}
            setIsLoading={setIsLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= MODAL CHECKOUT MEJORADO ================= */
function CheckoutModal({
  cart,
  total,
  orderType,
  clearCart,
  closeAll,
  setIsLoading,
}) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    notas: "",
    metodoPago: "efectivo",
    numeroMesa: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    if (!form.nombre.trim()) {
      alert("Por favor ingresa tu nombre");
      return false;
    }
    if (!form.telefono.trim() || form.telefono.length < 7) {
      alert("Por favor ingresa un número de teléfono válido");
      return false;
    }
    if (orderType === "domicilio" && !form.direccion.trim()) {
      alert("Por favor ingresa tu dirección para el domicilio");
      return false;
    }
    if (orderType === "mesa" && !form.numeroMesa.trim()) {
      alert("Por favor ingresa el número de mesa");
      return false;
    }
    return true;
  };

  const enviarWhatsApp = (pedidoId) => {
    let mensaje = `🟡 *NUEVO PEDIDO #${pedidoId}* \n`;
    mensaje += `📦 *Tipo:* ${
      orderType === "domicilio" ? "Domicilio 🚚" : "Mesa 🍽️"
    }\n\n`;
    mensaje += `👤 *Cliente:* ${form.nombre}\n`;
    mensaje += `📞 *Teléfono:* ${form.telefono}\n`;

    if (orderType === "domicilio") {
      mensaje += `📍 *Dirección:* ${form.direccion}\n`;
      mensaje += `💰 *Costo envío:* **POR CALCULAR (según zona)**\n`;
    } else {
      mensaje += `🍽️ *Mesa #:* ${form.numeroMesa}\n`;
    }

    if (form.notas) {
      mensaje += `📝 *Notas:* ${form.notas}\n`;
    }

    mensaje += `\n🧾 *Pedido:*\n`;

    cart.forEach((item, index) => {
      mensaje += `\n${index + 1}. ${item.nombre} x${item.cantidad}`;
      if (item.extras?.length > 0) {
        item.extras.forEach((extra) => {
          mensaje += `\n   ➕ ${extra.nombre} (+$${Number(
            extra.precio || 0
          ).toLocaleString()})`;
        });
      }
      if (item.ingredientes_quitados?.length > 0) {
        mensaje += `\n   ❌ Sin ${item.ingredientes_quitados.join(", ")}`;
      }
      mensaje += `\n   💰 $${(
        item.precio_final * item.cantidad
      ).toLocaleString()}`;
    });

    const totalConEnvio = total; // Solo subtotal
    mensaje += `\n\n💰 *Subtotal:* $${total.toLocaleString()}`;
    if (orderType === "domicilio") {
      mensaje += `\n🚚 *Envío:* **Por calcular según zona**`;
    }
    mensaje += `\n💵 *TOTAL ESTIMADO:* $${totalConEnvio.toLocaleString()}`;
    if (orderType === "domicilio") {
      mensaje += ` + costo envío*`;
    }
    mensaje += `\n💳 *Método de pago:* ${
      form.metodoPago === "efectivo" ? "Efectivo 💵" : "Transferencia 🏦"
    }`;
    mensaje += `\n📦 *Estado:* Pendiente`;

    const telefonoAdmin = "3110000000"; // Cambia esto por el número del admin
    const url = `https://wa.me/57${telefonoAdmin}?text=${encodeURIComponent(
      mensaje
    )}`;

    window.open(url, "_blank");
    setWhatsappSent(true);
  };

  const confirmarPedido = async () => {
    if (!validarFormulario()) return;

    setSubmitting(true);
    setIsLoading(true);

    // NO sumar costo fijo de domicilio - solo subtotal
    const totalConEnvio = total;

    const payload = {
      cliente: {
        nombre: form.nombre,
        telefono: form.telefono,
        direccion:
          orderType === "domicilio"
            ? form.direccion
            : `Mesa ${form.numeroMesa}`,
        tipo: orderType,
        ...(orderType === "mesa" && { mesa: form.numeroMesa }),
      },
      total: totalConEnvio, // Solo subtotal
      costo_domicilio: 0, // Cero por ahora, se calculará después según zona
      costo_domicilio_pendiente: orderType === "domicilio", // Flag para indicar que falta calcular
      metodo_pago: form.metodoPago,
      notas: form.notas,
      items: cart.map((item) => ({
        producto_id: item.producto_id,
        nombre: item.nombre,
        precio_base: item.precio_base || item.precio_final,
        precio_final: item.precio_final,
        cantidad: item.cantidad,
        ingredientes_quitados: item.ingredientes_quitados || [],
        extras: (item.extras || []).map((e) => ({
          nombre: e.nombre,
          precio: Number(e.precio || 0),
        })),
      })),
    };

    try {
      const res = await fetch(`${API_BASE}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al enviar el pedido");

      const data = await res.json();
      const pedidoId = data.id || Date.now();

      // Mostrar éxito
      setSuccess(true);

      // Enviar WhatsApp al admin
      enviarWhatsApp(pedidoId);

      // Limpiar después de 3 segundos
      setTimeout(() => {
        clearCart();
        closeAll();
        setSubmitting(false);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error("❌ Error enviando pedido:", error);
      alert(
        "❌ Ocurrió un error al enviar su pedido. Por favor intenta nuevamente."
      );
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && !success && closeAll()}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      {/* MODAL */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-gradient-to-br from-slate-950 to-slate-900 border border-indigo-600/20 rounded-2xl shadow-2xl overflow-hidden"
      >
        {success ? (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4">
                <CheckCircle className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                ¡Pedido Confirmado!
              </h3>
              <p className="text-gray-400 mb-6">
                Tu pedido ha sido recibido y está siendo procesado.
              </p>
              {whatsappSent && (
                <div className="mb-6 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2 justify-center">
                    <MessageCircle className="text-green-400" size={20} />
                    <span className="text-green-400">
                      Notificación enviada al administrador
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="animate-pulse text-gray-400 text-sm">
              Redirigiendo...
            </div>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg">
                  <CreditCard className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                    Finalizar pedido
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {orderType === "domicilio" ? "Domicilio 🚚" : "Mesa 🍽️"} •
                    Total: ${total.toLocaleString()}
                    {orderType === "domicilio" && " + envío según zona"}
                  </p>
                </div>
              </div>

              {orderType === "domicilio" && (
                <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-300 flex items-center gap-1">
                    <Info className="size-4" />
                    El costo del domicilio se calculará según tu zona y se
                    confirmará contigo
                  </p>
                </div>
              )}
            </div>

            {/* FORMULARIO */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">
                  Nombre completo *
                </label>
                <input
                  name="nombre"
                  placeholder="Ingresa tu nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">
                  Teléfono *
                </label>
                <input
                  name="telefono"
                  placeholder="Ej: 3001234567"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                />
              </div>

              {orderType === "domicilio" ? (
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-2">
                    Dirección de entrega *
                  </label>
                  <input
                    name="direccion"
                    placeholder="Calle, número, barrio, referencia"
                    value={form.direccion}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    El costo del envío se calculará según tu zona/barrio
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-2">
                    Número de mesa *
                  </label>
                  <input
                    name="numeroMesa"
                    placeholder="Ej: 5, 12, etc."
                    value={form.numeroMesa}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                  />
                </div>
              )}

              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">
                  Método de pago
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "efectivo", label: "Efectivo", icon: "💵" },
                    {
                      value: "transferencia",
                      label: "Transferencia",
                      icon: "🏦",
                    },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, metodoPago: method.value })
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        form.metodoPago === method.value
                          ? "border-indigo-600 bg-indigo-600/10"
                          : "border-gray-700 bg-slate-950/50 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xl">{method.icon}</span>
                        <span
                          className={
                            form.metodoPago === method.value
                              ? "text-indigo-400 font-semibold"
                              : "text-gray-300"
                          }
                        >
                          {method.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  name="notas"
                  placeholder="Instrucciones especiales, alergias, etc."
                  value={form.notas}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-slate-950/50 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 resize-none"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-slate-800 bg-gradient-to-t from-slate-950/90 to-transparent">
              <div className="flex gap-3">
                <button
                  onClick={closeAll}
                  disabled={submitting}
                  className="flex-1 bg-slate-800/50 hover:bg-slate-800 text-gray-300 font-medium py-3 rounded-lg border border-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarPedido}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-yellow-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>Confirmar pedido</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// import {
//   X,
//   Plus,
//   Minus,
//   Trash,
//   ShoppingCart,
//   Truck,
//   Shield,
//   CreditCard,
//   MessageCircle,
//   AlertCircle,
//   Package,
//   Loader2,
//   CheckCircle,
// } from "lucide-react";
// import { useCart } from "../context/CartContext";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const API_URL = "http://localhost:3002";

// // 🔥 IMPORTACIÓN DINÁMICA DE TODAS LAS IMÁGENES
// const importAllImages = () => {
//   const images = import.meta.glob(
//     "../assets/productos/*.{jpg,jpeg,png,webp,gif}",
//     {
//       eager: true,
//       import: "default",
//     }
//   );

//   const imageMap = {};
//   Object.keys(images).forEach((path) => {
//     const fileName = path.split("/").pop();
//     imageMap[fileName] = images[path];
//   });

//   return imageMap;
// };

// const ALL_IMAGES = importAllImages();

// // Función para obtener la imagen correcta
// const getProductImage = (imageName) => {
//   if (!imageName) {
//     return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop";
//   }

//   // Buscar la imagen en nuestro mapa
//   const image = ALL_IMAGES[imageName];

//   if (image) {
//     return image;
//   }

//   // Si no se encuentra, intentar con variaciones del nombre
//   const variations = [
//     imageName,
//     imageName.toLowerCase(),
//     imageName.replace(/\s+/g, "_"),
//     imageName.replace(/\s+/g, "-"),
//   ];

//   for (const variation of variations) {
//     if (ALL_IMAGES[variation]) {
//       return ALL_IMAGES[variation];
//     }
//   }

//   return "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop";
// };

// export default function CartDrawer() {
//   const {
//     cart,
//     open,
//     setOpen,
//     updateQty,
//     removeFromCart,
//     total,
//     clearCart,
//     itemCount,
//   } = useCart();
//   const [checkout, setCheckout] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [orderType, setOrderType] = useState("domicilio");

//   useEffect(() => {
//     if (open) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [open]);

//   if (!open) return null;

//   const handleOverlayClick = (e) => {
//     if (e.target === e.currentTarget) {
//       setOpen(false);
//     }
//   };

//   return (
//     <>
//       {/* OVERLAY CON ANIMACIÓN */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         onClick={handleOverlayClick}
//         className="fixed inset-0 z-50 flex items-start justify-end bg-slate-950/60 backdrop-blur-sm"
//       />

//       {/* DRAWER CON ANIMACIÓN */}
//       <motion.div
//         initial={{ x: "100%" }}
//         animate={{ x: 0 }}
//         exit={{ x: "100%" }}
//         transition={{ type: "spring", damping: 25 }}
//         className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white h-full overflow-hidden border-l border-indigo-600/20 shadow-2xl"
//       >
//         {/* HEADER */}
//         <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950/80 to-slate-900/80">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl">
//                 <ShoppingCart className="text-white" size={24} />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
//                   Tu Pedido
//                 </h2>
//                 <p className="text-gray-400 text-sm">
//                   {itemCount} item{itemCount !== 1 ? "s" : ""} en el carrito
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setOpen(false)}
//               className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
//             >
//               <X className="text-gray-400 hover:text-white" size={24} />
//             </button>
//           </div>
//         </div>

//         {/* CONTENIDO */}
//         <div className="flex flex-col h-[calc(100vh-200px)]">
//           {cart.length === 0 ? (
//             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
//               <div className="mb-6 p-4 bg-slate-800/50 rounded-2xl">
//                 <Package className="text-gray-400 mx-auto mb-4" size={48} />
//                 <h3 className="text-xl font-semibold text-white mb-2">
//                   Carrito vacío
//                 </h3>
//                 <p className="text-gray-400">Agrega productos para continuar</p>
//               </div>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-yellow-700 transition-all"
//               >
//                 Explorar menú
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="flex-1 overflow-y-auto p-6 space-y-4">
//                 <AnimatePresence>
//                   {cart.map((item, index) => {
//                     console.log(`🛒 Item ${index}:`, item);
//                     console.log(`📸 Imagen:`, item.imagen);
//                     console.log(
//                       `🔍 Imagen encontrada:`,
//                       ALL_IMAGES[item.imagem] ? "Sí" : "No"
//                     );

//                     return (
//                       <motion.div
//                         key={item.cartItemId}
//                         initial={{ opacity: 0, x: 20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: -20 }}
//                         transition={{ delay: index * 0.05 }}
//                         className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-800 shadow-lg"
//                       >
//                         <div className="flex gap-4">
//                           {/* IMAGEN */}
//                           <div className="relative flex-shrink-0">
//                             <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-indigo-600/20">
//                               <img
//                                 src={getProductImage(item.imagen)}
//                                 alt={item.nombre}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                   console.error(
//                                     `❌ Error cargando imagen en carrito: ${item.imagen}`
//                                   );
//                                   console.log(
//                                     "Imágenes disponibles:",
//                                     Object.keys(ALL_IMAGES)
//                                   );
//                                   e.target.src =
//                                     "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop";
//                                 }}
//                               />
//                             </div>
//                             {item.cantidad > 1 && (
//                               <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
//                                 ×{item.cantidad}
//                               </div>
//                             )}
//                           </div>

//                           {/* INFORMACIÓN */}
//                           <div className="flex-1 min-w-0">
//                             <div className="flex justify-between items-start">
//                               <h3 className="font-bold text-white text-lg truncate">
//                                 {item.nombre}
//                               </h3>
//                               <button
//                                 onClick={() => removeFromCart(item.cartItemId)}
//                                 className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
//                               >
//                                 <Trash
//                                   className="text-red-400 hover:text-red-300"
//                                   size={18}
//                                 />
//                               </button>
//                             </div>

//                             {/* EXTRAS */}
//                             {item.extras?.length > 0 && (
//                               <div className="mt-2 space-y-1">
//                                 {item.extras.map((extra, idx) => (
//                                   <div
//                                     key={idx}
//                                     className="flex items-center gap-2 text-sm"
//                                   >
//                                     <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
//                                     <span className="text-green-400">
//                                       + {extra.nombre}
//                                     </span>
//                                     <span className="text-indigo-400 font-medium">
//                                       (+$
//                                       {Number(
//                                         extra.precio || 0
//                                       ).toLocaleString()}
//                                       )
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}

//                             {/* INGREDIENTES QUITADOS */}
//                             {item.ingredientes_quitados?.length > 0 && (
//                               <div className="mt-2 space-y-1">
//                                 {item.ingredientes_quitados.map((ing, idx) => (
//                                   <div
//                                     key={idx}
//                                     className="flex items-center gap-2 text-sm"
//                                   >
//                                     <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
//                                     <span className="text-red-400">
//                                       Sin {ing}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}

//                             {/* PRECIO Y CONTROLES */}
//                             <div className="flex items-center justify-between mt-3">
//                               <div className="flex items-center gap-3">
//                                 <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
//                                   <button
//                                     onClick={() =>
//                                       updateQty(
//                                         item.cartItemId,
//                                         item.cantidad - 1
//                                       )
//                                     }
//                                     disabled={item.cantidad <= 1}
//                                     className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                                   >
//                                     <Minus className="text-white" size={16} />
//                                   </button>
//                                   <span className="font-bold text-white min-w-[24px] text-center">
//                                     {item.cantidad}
//                                   </span>
//                                   <button
//                                     onClick={() =>
//                                       updateQty(
//                                         item.cartItemId,
//                                         item.cantidad + 1
//                                       )
//                                     }
//                                     className="w-8 h-8 flex items-center justify-center rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 transition-colors"
//                                   >
//                                     <Plus
//                                       className="text-indigo-400"
//                                       size={16}
//                                     />
//                                   </button>
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
//                                   $
//                                   {(
//                                     item.precio_final * item.cantidad
//                                   ).toLocaleString()}
//                                 </p>
//                                 <p className="text-sm text-gray-400">
//                                   ${item.precio_final.toLocaleString()} c/u
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </AnimatePresence>
//               </div>

//               {/* RESUMEN */}
//               <div className="border-t border-slate-800 bg-gradient-to-t from-slate-950/90 to-transparent p-6">
//                 <div className="mb-4">
//                   <div className="flex items-center gap-2 mb-3">
//                     <Truck className="text-blue-400" size={20} />
//                     <label className="text-gray-300 text-sm font-medium">
//                       Tipo de pedido
//                     </label>
//                   </div>
//                   <div className="grid grid-cols-2 gap-3">
//                     {["domicilio", "mesa"].map((type) => (
//                       <button
//                         key={type}
//                         onClick={() => setOrderType(type)}
//                         className={`p-3 rounded-xl border-2 transition-all ${
//                           orderType === type
//                             ? "border-indigo-600 bg-indigo-600/10"
//                             : "border-gray-700 bg-slate-800/50 hover:border-gray-600"
//                         }`}
//                       >
//                         <div className="flex flex-col items-center gap-1">
//                           {type === "domicilio" ? (
//                             <>
//                               <Truck
//                                 className={
//                                   orderType === type
//                                     ? "text-indigo-400"
//                                     : "text-gray-400"
//                                 }
//                                 size={20}
//                               />
//                               <span
//                                 className={
//                                   orderType === type
//                                     ? "text-indigo-400 font-semibold"
//                                     : "text-gray-300"
//                                 }
//                               >
//                                 Domicilio
//                               </span>
//                             </>
//                           ) : (
//                             <>
//                               <Package
//                                 className={
//                                   orderType === type
//                                     ? "text-indigo-400"
//                                     : "text-gray-400"
//                                 }
//                                 size={20}
//                               />
//                               <span
//                                 className={
//                                   orderType === type
//                                     ? "text-indigo-400 font-semibold"
//                                     : "text-gray-300"
//                                 }
//                               >
//                                 En mesa
//                               </span>
//                             </>
//                           )}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* RESUMEN DE PAGO */}
//                 <div className="space-y-3 mb-6">
//                   <div className="flex justify-between items-center text-gray-300">
//                     <span>Subtotal</span>
//                     <span>${total.toLocaleString()}</span>
//                   </div>
//                   {/* {orderType === "domicilio" && (
//                     <div className="flex justify-between items-center text-gray-300">
//                       <span>Costo de envío</span>
//                       <span className="text-indigo-400">Segun zona</span>
//                     </div>
//                   )} */}
//                   <div className="h-px bg-slate-800"></div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-lg font-bold text-white">Total</span>
//                     <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
//                       $
//                       {orderType === "domicilio"
//                         ? (total + 0).toLocaleString()
//                         : total.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>

//                 {/* BOTONES DE ACCIÓN */}
//                 <div className="space-y-3">
//                   <button
//                     onClick={() => setCheckout(true)}
//                     disabled={isLoading}
//                     className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-yellow-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="animate-spin" size={20} />
//                         <span>Procesando...</span>
//                       </>
//                     ) : (
//                       <>
//                         <CreditCard size={20} />
//                         <span>Finalizar pedido</span>
//                       </>
//                     )}
//                   </button>

//                   <button
//                     onClick={clearCart}
//                     className="w-full bg-slate-800/50 hover:bg-slate-800 text-gray-300 font-medium py-2.5 rounded-xl border border-gray-700 transition-colors"
//                   >
//                     Vaciar carrito
//                   </button>
//                 </div>

//                 {/* GARANTÍA */}
//                 <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-800">
//                   <Shield className="text-green-400" size={16} />
//                   <span className="text-gray-400 text-sm">
//                     Pago 100% seguro • Entrega garantizada
//                   </span>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </motion.div>

//       {/* MODAL CHECKOUT */}
//       <AnimatePresence>
//         {checkout && (
//           <CheckoutModal
//             cart={cart}
//             total={total}
//             orderType={orderType}
//             clearCart={clearCart}
//             closeAll={() => {
//               setCheckout(false);
//               setOpen(false);
//             }}
//             setIsLoading={setIsLoading}
//           />
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// /* ================= MODAL CHECKOUT MEJORADO ================= */
// function CheckoutModal({
//   cart,
//   total,
//   orderType,
//   clearCart,
//   closeAll,
//   setIsLoading,
// }) {
//   const [form, setForm] = useState({
//     nombre: "",
//     telefono: "",
//     direccion: "",
//     notas: "",
//     metodoPago: "efectivo",
//     numeroMesa: "",
//   });

//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [whatsappSent, setWhatsappSent] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const validarFormulario = () => {
//     if (!form.nombre.trim()) {
//       alert("Por favor ingresa tu nombre");
//       return false;
//     }
//     if (!form.telefono.trim() || form.telefono.length < 7) {
//       alert("Por favor ingresa un número de teléfono válido");
//       return false;
//     }
//     if (orderType === "domicilio" && !form.direccion.trim()) {
//       alert("Por favor ingresa tu dirección para el domicilio");
//       return false;
//     }
//     if (orderType === "mesa" && !form.numeroMesa.trim()) {
//       alert("Por favor ingresa el número de mesa");
//       return false;
//     }
//     return true;
//   };

//   const enviarWhatsApp = (pedidoId) => {
//     let mensaje = `🟡 *NUEVO PEDIDO #${pedidoId}* \n`;
//     mensaje += `📦 *Tipo:* ${
//       orderType === "domicilio" ? "Domicilio 🚚" : "Mesa 🍽️"
//     }\n\n`;
//     mensaje += `👤 *Cliente:* ${form.nombre}\n`;
//     mensaje += `📞 *Teléfono:* ${form.telefono}\n`;

//     if (orderType === "domicilio") {
//       mensaje += `📍 *Dirección:* ${form.direccion}\n`;
//     } else {
//       mensaje += `🍽️ *Mesa #:* ${form.numeroMesa}\n`;
//     }

//     if (form.notas) {
//       mensaje += `📝 *Notas:* ${form.notas}\n`;
//     }

//     mensaje += `\n🧾 *Pedido:*\n`;

//     cart.forEach((item, index) => {
//       mensaje += `\n${index + 1}. ${item.nombre} x${item.cantidad}`;
//       if (item.extras?.length > 0) {
//         item.extras.forEach((extra) => {
//           mensaje += `\n   ➕ ${extra.nombre} (+$${Number(
//             extra.precio || 0
//           ).toLocaleString()})`;
//         });
//       }
//       if (item.ingredientes_quitados?.length > 0) {
//         mensaje += `\n   ❌ Sin ${item.ingredientes_quitados.join(", ")}`;
//       }
//       mensaje += `\n   💰 $${(
//         item.precio_final * item.cantidad
//       ).toLocaleString()}`;
//     });

//     const totalConEnvio = orderType === "domicilio" ? total + 2000 : total;
//     mensaje += `\n\n💰 *Subtotal:* $${total.toLocaleString()}`;
//     if (orderType === "domicilio") {
//       mensaje += `\n🚚 *Envío:* $2.000`;
//     }
//     mensaje += `\n💵 *TOTAL:* $${totalConEnvio.toLocaleString()}`;
//     mensaje += `\n💳 *Método de pago:* ${
//       form.metodoPago === "efectivo" ? "Efectivo 💵" : "Transferencia 🏦"
//     }`;
//     mensaje += `\n📦 *Estado:* Pendiente`;

//     const telefonoAdmin = "3110000000"; // Cambia esto por el número del admin
//     const url = `https://wa.me/57${telefonoAdmin}?text=${encodeURIComponent(
//       mensaje
//     )}`;

//     window.open(url, "_blank");
//     setWhatsappSent(true);
//   };

//   const confirmarPedido = async () => {
//     if (!validarFormulario()) return;

//     setSubmitting(true);
//     setIsLoading(true);

//     const totalConEnvio = orderType === "domicilio" ? total + 2000 : total;

//     const payload = {
//       cliente: {
//         nombre: form.nombre,
//         telefono: form.telefono,
//         direccion:
//           orderType === "domicilio"
//             ? form.direccion
//             : `Mesa ${form.numeroMesa}`,
//         tipo: orderType,
//         ...(orderType === "mesa" && { mesa: form.numeroMesa }),
//       },
//       total: totalConEnvio,
//       costo_domicilio: orderType === "domicilio" ? 2000 : 0,
//       metodo_pago: form.metodoPago,
//       notas: form.notas,
//       items: cart.map((item) => ({
//         producto_id: item.producto_id,
//         nombre: item.nombre,
//         precio_base: item.precio_base || item.precio_final,
//         precio_final: item.precio_final,
//         cantidad: item.cantidad,
//         ingredientes_quitados: item.ingredientes_quitados || [],
//         extras: (item.extras || []).map((e) => ({
//           nombre: e.nombre,
//           precio: Number(e.precio || 0),
//         })),
//       })),
//     };

//     try {
//       const res = await fetch(`${API_BASE}/pedidos`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("Error al enviar el pedido");

//       const data = await res.json();
//       const pedidoId = data.id || Date.now();

//       // Mostrar éxito
//       setSuccess(true);

//       // Enviar WhatsApp al admin
//       enviarWhatsApp(pedidoId);

//       // Limpiar después de 3 segundos
//       setTimeout(() => {
//         clearCart();
//         closeAll();
//         setSubmitting(false);
//         setIsLoading(false);
//       }, 3000);
//     } catch (error) {
//       console.error("❌ Error enviando pedido:", error);
//       alert(
//         "❌ Ocurrió un error al enviar su pedido. Por favor intenta nuevamente."
//       );
//       setSubmitting(false);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[60] flex items-center justify-center p-4"
//       onClick={(e) => e.target === e.currentTarget && !success && closeAll()}
//     >
//       {/* OVERLAY */}
//       <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

//       {/* MODAL */}
//       <motion.div
//         initial={{ scale: 0.9, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.9, y: 20 }}
//         className="relative w-full max-w-md bg-gradient-to-br from-slate-950 to-slate-900 border border-indigo-600/20 rounded-2xl shadow-2xl overflow-hidden"
//       >
//         {success ? (
//           <div className="p-8 text-center">
//             <div className="mb-6">
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4">
//                 <CheckCircle className="text-white" size={40} />
//               </div>
//               <h3 className="text-2xl font-bold text-white mb-2">
//                 ¡Pedido Confirmado!
//               </h3>
//               <p className="text-gray-400 mb-6">
//                 Tu pedido ha sido recibido y está siendo procesado.
//               </p>
//               {whatsappSent && (
//                 <div className="mb-6 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
//                   <div className="flex items-center gap-2 justify-center">
//                     <MessageCircle className="text-green-400" size={20} />
//                     <span className="text-green-400">
//                       Notificación enviada al administrador
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="animate-pulse text-gray-400 text-sm">
//               Redirigiendo...
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* HEADER */}
//             <div className="p-6 border-b border-slate-800">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg">
//                   <CreditCard className="text-white" size={24} />
//                 </div>
//                 <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
//                   Finalizar pedido
//                 </h3>
//               </div>
//               <p className="text-gray-400 text-sm mt-1">
//                 {orderType === "domicilio" ? "Domicilio 🚚" : "Mesa 🍽️"} •
//                 Total: $
//                 {orderType === "domicilio"
//                   ? (total + 2000).toLocaleString()
//                   : total.toLocaleString()}
//               </p>
//             </div>

//             {/* FORMULARIO */}
//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="text-gray-300 text-sm font-medium block mb-2">
//                   Nombre completo *
//                 </label>
//                 <input
//                   name="nombre"
//                   placeholder="Ingresa tu nombre"
//                   value={form.nombre}
//                   onChange={handleChange}
//                   className="w-full bg-slate-950/50 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
//                 />
//               </div>

//               <div>
//                 <label className="text-gray-300 text-sm font-medium block mb-2">
//                   Teléfono *
//                 </label>
//                 <input
//                   name="telefono"
//                   placeholder="Ej: 3001234567"
//                   value={form.telefono}
//                   onChange={handleChange}
//                   className="w-full bg-slate-950/50 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
//                 />
//               </div>

//               {orderType === "domicilio" ? (
//                 <div>
//                   <label className="text-gray-300 text-sm font-medium block mb-2">
//                     Dirección de entrega *
//                   </label>
//                   <input
//                     name="direccion"
//                     placeholder="Calle, número, barrio"
//                     value={form.direccion}
//                     onChange={handleChange}
//                     className="w-full bg-slate-950/50 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
//                   />
//                 </div>
//               ) : (
//                 <div>
//                   <label className="text-gray-300 text-sm font-medium block mb-2">
//                     Número de mesa *
//                   </label>
//                   <input
//                     name="numeroMesa"
//                     placeholder="Ej: 5, 12, etc."
//                     value={form.numeroMesa}
//                     onChange={handleChange}
//                     className="w-full bg-slate-950/50 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
//                   />
//                 </div>
//               )}

//               <div>
//                 <label className="text-gray-300 text-sm font-medium block mb-2">
//                   Método de pago
//                 </label>
//                 <div className="grid grid-cols-2 gap-3">
//                   {[
//                     { value: "efectivo", label: "Efectivo", icon: "💵" },
//                     {
//                       value: "transferencia",
//                       label: "Transferencia",
//                       icon: "🏦",
//                     },
//                   ].map((method) => (
//                     <button
//                       key={method.value}
//                       type="button"
//                       onClick={() =>
//                         setForm({ ...form, metodoPago: method.value })
//                       }
//                       className={`p-3 rounded-lg border-2 transition-all ${
//                         form.metodoPago === method.value
//                           ? "border-indigo-600 bg-indigo-600/10"
//                           : "border-gray-700 bg-slate-950/50 hover:border-gray-600"
//                       }`}
//                     >
//                       <div className="flex flex-col items-center gap-1">
//                         <span className="text-xl">{method.icon}</span>
//                         <span
//                           className={
//                             form.metodoPago === method.value
//                               ? "text-indigo-400 font-semibold"
//                               : "text-gray-300"
//                           }
//                         >
//                           {method.label}
//                         </span>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="text-gray-300 text-sm font-medium block mb-2">
//                   Notas adicionales (opcional)
//                 </label>
//                 <textarea
//                   name="notas"
//                   placeholder="Instrucciones especiales, alergias, etc."
//                   value={form.notas}
//                   onChange={handleChange}
//                   rows="3"
//                   className="w-full bg-slate-950/50 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 resize-none"
//                 />
//               </div>
//             </div>

//             {/* FOOTER */}
//             <div className="p-6 border-t border-slate-800 bg-gradient-to-t from-slate-950/90 to-transparent">
//               <div className="flex gap-3">
//                 <button
//                   onClick={closeAll}
//                   disabled={submitting}
//                   className="flex-1 bg-slate-800/50 hover:bg-slate-800 text-gray-300 font-medium py-3 rounded-lg border border-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Cancelar
//                 </button>
//                 <button
//                   onClick={confirmarPedido}
//                   disabled={submitting}
//                   className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-yellow-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
//                 >
//                   {submitting ? (
//                     <>
//                       <Loader2 className="animate-spin" size={20} />
//                       <span>Procesando...</span>
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle size={20} />
//                       <span>Confirmar pedido</span>
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// }
