import React from 'react';
import { useState, useCallback, useRef, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  Mail,
  CheckCircle,
  Shield,
  Loader2,
} from "lucide-react";

const ModalConfirmacion = memo(
  ({ isOpen, onClose, onConfirm, datosReserva, loading = false }) => {
    const [datosCliente, setDatosCliente] = useState({
      nombre: "",
      telefono: "",
      email: "",
      identificacion: "",
      notas: "",
    });

    const [errors, setErrors] = useState({});

    const nombreRef = useRef(null);
    const telefonoRef = useRef(null);
    const emailRef = useRef(null);
    const identificacionRef = useRef(null);
    const notasRef = useRef(null);

    useEffect(() => {
      if (isOpen) {
        setTimeout(() => {
          nombreRef.current?.focus();
        }, 100);
      }
    }, [isOpen]);

    const handleInputChange = useCallback(
      (e) => {
        const { name, value } = e.target;
        const currentRef =
          name === "nombre"
            ? nombreRef
            : name === "telefono"
              ? telefonoRef
              : name === "email"
                ? emailRef
                : name === "identificacion"
                  ? identificacionRef
                  : notasRef;

        const cursorPos = e.target.selectionStart;

        setDatosCliente((prev) => ({
          ...prev,
          [name]: value,
        }));

        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: undefined }));
        }

        setTimeout(() => {
          if (currentRef.current) {
            currentRef.current.focus();
            if (cursorPos !== null) {
              currentRef.current.setSelectionRange(cursorPos, cursorPos);
            }
          }
        }, 0);
      },
      [errors],
    );

    const validarFormulario = () => {
      const newErrors = {};
      if (!datosCliente.nombre.trim())
        newErrors.nombre = "El nombre es requerido";
      if (!datosCliente.telefono.trim()) {
        newErrors.telefono = "El teléfono es requerido";
      } else if (!/^[0-9+\s()-]{10,}$/.test(datosCliente.telefono)) {
        newErrors.telefono = "Teléfono inválido";
      }
      if (!datosCliente.email.trim()) {
        newErrors.email = "El email es requerido";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosCliente.email)) {
        newErrors.email = "Email inválido";
      }
      if (!datosCliente.identificacion.trim()) {
        newErrors.identificacion = "La identificación es requerida";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = useCallback(
      (e) => {
        e?.preventDefault();
        if (!validarFormulario()) return;
        const datosCompletos = {
          ...datosReserva,
          cliente: datosCliente,
          fechaCreacion: new Date().toISOString(),
          estado: "pendiente",
          codigoReserva: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        };
        onConfirm(datosCompletos);
      },
      [datosCliente, datosReserva, onConfirm],
    );

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          handleSubmit(e);
        }
      },
      [handleSubmit],
    );

    useEffect(() => {
      if (!isOpen) {
        setDatosCliente({
          nombre: "",
          telefono: "",
          email: "",
          identificacion: "",
          notas: "",
        });
        setErrors({});
      }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Completa tus datos
                    </h2>
                    <p className="text-sm text-gray-600">
                      Último paso para confirmar tu reserva
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={loading}
                >
                  <X className="text-gray-500" size={20} />
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Resumen de la reserva */}
              {datosReserva && (
                <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-800 text-sm mb-3">
                    Resumen de tu reserva
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-emerald-600 text-xs">Servicio</p>
                      <p className="font-semibold text-gray-900">
                        {datosReserva.servicio?.nombre}
                      </p>
                    </div>
                    <div>
                      <p className="text-emerald-600 text-xs">Fecha y hora</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(datosReserva.fecha).toLocaleDateString(
                          "es-ES",
                          {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          },
                        )}{" "}
                        a las {datosReserva.hora}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 🔥 FORMULARIO CORREGIDO - CON ESTILOS FORZADOS 🔥 */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      ref={nombreRef}
                      type="text"
                      name="nombre"
                      value={datosCliente.nombre}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      style={{ color: "#111827", backgroundColor: "#ffffff" }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none
                        ${errors.nombre ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"}`}
                      placeholder="Tu nombre completo"
                      required
                      disabled={loading}
                    />
                  </div>
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                  )}
                </div>

                {/* Teléfono y Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        ref={telefonoRef}
                        type="tel"
                        name="telefono"
                        value={datosCliente.telefono}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        style={{ color: "#111827", backgroundColor: "#ffffff" }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none
                          ${errors.telefono ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"}`}
                        placeholder="+57 300 123 4567"
                        required
                        disabled={loading}
                      />
                    </div>
                    {errors.telefono && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.telefono}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        ref={emailRef}
                        type="email"
                        name="email"
                        value={datosCliente.email}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        style={{ color: "#111827", backgroundColor: "#ffffff" }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none
                          ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"}`}
                        placeholder="tu@email.com"
                        required
                        disabled={loading}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Identificación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Identificación (CC/NIT) *
                  </label>
                  <input
                    ref={identificacionRef}
                    type="text"
                    name="identificacion"
                    value={datosCliente.identificacion}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    style={{ color: "#111827", backgroundColor: "#ffffff" }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none
                      ${errors.identificacion ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"}`}
                    placeholder="Número de identificación"
                    required
                    disabled={loading}
                  />
                  {errors.identificacion && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.identificacion}
                    </p>
                  )}
                </div>

                {/* Notas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    ref={notasRef}
                    name="notas"
                    value={datosCliente.notas}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    style={{ color: "#111827", backgroundColor: "#ffffff" }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none outline-none bg-white"
                    rows="3"
                    placeholder="Alergias, preferencias, comentarios..."
                    disabled={loading}
                  />
                </div>

                {/* Políticas */}
                <div className="flex items-start gap-2 text-sm p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Shield
                    className="text-emerald-500 mt-0.5 flex-shrink-0"
                    size={16}
                  />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      Políticas de privacidad
                    </p>
                    <p className="text-gray-700">
                      Tus datos están protegidos y solo se usarán para procesar
                      tu reserva.
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-700 hover:to-teal-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Confirmar reserva
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  },
);

ModalConfirmacion.displayName = "ModalConfirmacion";

export default ModalConfirmacion;
