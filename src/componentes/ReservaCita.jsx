import React from "react";
// src/componentes/ReservaCita.jsx - VERSIÓN MODERNA INDIGO/SLATE (v2)
import { useState, useCallback, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Star,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  Shield,
  Check,
  Flower2,
  Sparkles,
} from "lucide-react";

import API_BASE, { API_URL } from "../config/api";

// ============================================
// MODAL DE CONFIRMACIÓN
// ============================================
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
    const [enviarWhatsapp, setEnviarWhatsapp] = useState(false);
    const nombreRef = useRef(null);

    useEffect(() => {
      if (isOpen && nombreRef.current) {
        setTimeout(() => nombreRef.current?.focus(), 100);
      }
    }, [isOpen]);

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

    const handleInputChange = useCallback(
      (e) => {
        const { name, value } = e.target;
        setDatosCliente((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
      },
      [errors],
    );

    const validarFormulario = () => {
      const newErrors = {};
      if (!datosCliente.nombre.trim())
        newErrors.nombre = "El nombre es requerido";
      else if (datosCliente.nombre.trim().length < 3)
        newErrors.nombre = "Nombre demasiado corto";
      if (!datosCliente.telefono.trim())
        newErrors.telefono = "El teléfono es requerido";
      else if (
        !/^[0-9+\s()-]{10,}$/.test(datosCliente.telefono.replace(/\s/g, ""))
      ) {
        newErrors.telefono = "Teléfono inválido (mínimo 10 dígitos)";
      }
      if (!datosCliente.email.trim()) newErrors.email = "El email es requerido";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosCliente.email)) {
        newErrors.email = "Email inválido";
      }
      if (!datosCliente.identificacion.trim())
        newErrors.identificacion = "La identificación es requerida";
      else if (datosCliente.identificacion.trim().length < 5)
        newErrors.identificacion = "Identificación inválida";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = useCallback(
      (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;
        const datosCompletos = {
          ...datosReserva,
          cliente: datosCliente,
          fechaCreacion: new Date().toISOString(),
          estado: "pendiente",
          enviarWhatsapp: enviarWhatsapp,
        };
        onConfirm(datosCompletos);
      },
      [datosCliente, datosReserva, onConfirm, enviarWhatsapp],
    );

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white w-full max-w-2xl rounded-xl border border-slate-100 shadow-xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    }}
                  >
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Confirmar Reserva
                    </h2>
                    <p className="text-sm text-slate-500">
                      Completa los datos del cliente
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-colors hover:bg-slate-50"
                  disabled={loading}
                >
                  <X className="text-gray-500" size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {datosReserva && (
                <div
                  className="mb-6 p-4 rounded-lg border"
                  style={{
                    background: "rgba(79, 70, 229, 0.05)",
                    borderColor: "rgba(79, 70, 229, 0.2)",
                  }}
                >
                  <h3 className="font-semibold text-sm mb-3 text-indigo-600">
                    Detalles de la Reserva
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium mb-1 text-slate-400">
                        Servicio
                      </p>
                      <p className="font-semibold text-sm text-slate-900">
                        {datosReserva.servicio?.nombre}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {datosReserva.profesional?.imagen_url ? (
                        <img
                          src={
                            datosReserva.profesional.imagen_url.startsWith("http")
                              ? datosReserva.profesional.imagen_url
                              : `${API_URL}${datosReserva.profesional.imagen_url.startsWith("/") ? "" : "/"}${datosReserva.profesional.imagen_url}`
                          }
                          alt={datosReserva.profesional.nombre}
                          className="w-6 h-6 rounded-full object-cover border border-indigo-200"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User size={12} className="text-indigo-600" />
                        </div>
                      )}
                      <p className="font-semibold text-sm text-slate-900 line-clamp-1">
                        {datosReserva.profesional?.nombre}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1 text-slate-400">
                        Fecha
                      </p>
                      <p className="font-semibold text-sm text-slate-900">
                        {(() => {
                          const [año, mes, dia] = datosReserva.fecha
                            .split("-")
                            .map(Number);
                          const fechaLocal = new Date(año, mes - 1, dia);
                          return fechaLocal.toLocaleDateString("es-ES", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          });
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1 text-slate-400">
                        Hora
                      </p>
                      <p className="font-semibold text-sm text-slate-900">
                        {datosReserva.hora}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900">
                    Nombre completo *
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600"
                      size={18}
                    />
                    <input
                      ref={nombreRef}
                      type="text"
                      name="nombre"
                      value={datosCliente.nombre}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 text-sm ${errors.nombre
                        ? "border-slate-200 bg-red-50"
                        : "border-gray-300"
                        }`}
                      style={{ focusRingColor: "rgba(79, 70, 229, 0.4)" }}
                      placeholder="Nombre completo"
                      disabled={loading}
                    />
                  </div>
                  {errors.nombre && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.nombre}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-900">
                      Teléfono *
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600"
                        size={18}
                      />
                      <input
                        type="tel"
                        name="telefono"
                        value={datosCliente.telefono}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm ${errors.telefono
                          ? "border-slate-200 bg-red-50"
                          : "border-gray-300"
                          }`}
                        placeholder="300 234 5678"
                        disabled={loading}
                      />
                    </div>
                    {errors.telefono && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.telefono}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-900">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-600"
                        size={18}
                      />
                      <input
                        type="email"
                        name="email"
                        value={datosCliente.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm ${errors.email
                          ? "border-slate-200 bg-red-50"
                          : "border-gray-300"
                          }`}
                        placeholder="cliente@email.com"
                        disabled={loading}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900">
                    Identificación (CC/NIT) *
                  </label>
                  <input
                    type="text"
                    name="identificacion"
                    value={datosCliente.identificacion}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg text-sm ${errors.identificacion
                      ? "border-slate-200 bg-red-50"
                      : "border-gray-300"
                      }`}
                    placeholder="Número de identificación"
                    disabled={loading}
                  />
                  {errors.identificacion && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.identificacion}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-900">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    name="notas"
                    value={datosCliente.notas}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm resize-none"
                    rows="3"
                    placeholder="Alergias, preferencias, comentarios especiales..."
                    disabled={loading}
                  />
                </div>

                <div
                  className="flex items-start gap-2 text-xs p-3 rounded-lg border"
                  style={{
                    background: "rgba(245, 169, 184, 0.05)",
                    borderColor: "rgba(79, 70, 229, 0.1)",
                    color: "#475569",
                  }}
                >
                  <Shield
                    className="mt-0.5 flex-shrink-0 text-indigo-600"
                    size={14}
                  />
                  <div>
                    <p className="font-medium mb-0.5 text-slate-900">
                      Protección de datos
                    </p>
                    <p>
                      Tu información está protegida según nuestra política de
                      privacidad.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border border-green-200 bg-green-50/50">
                  <input
                    type="checkbox"
                    id="enviarWhatsapp"
                    checked={enviarWhatsapp}
                    onChange={(e) => setEnviarWhatsapp(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <label
                    htmlFor="enviarWhatsapp"
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-medium text-sm text-green-700">
                      Enviar recordatorio por WhatsApp
                    </span>
                    <p className="text-xs text-green-600 mt-0.5">
                      Recibirás un mensaje con los detalles de tu cita
                    </p>
                  </label>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-5 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-slate-100 disabled:opacity-50 text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 text-white transition-all shadow-md bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />{" "}
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} /> Confirmar reserva
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

// ============================================
// COMPONENTE PRINCIPAL - RESERVA CITA
// ============================================
const ReservaCita = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const servicio = location.state?.servicio || null;

  useEffect(() => {
    if (!servicio) navigate("/servicios");
  }, [servicio, navigate]);

  // Scroll al inicio al montar el componente
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Estados principales
  const [paso, setPaso] = useState(1);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [fechaActual, setFechaActual] = useState(new Date());
  const [errorFecha, setErrorFecha] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [profesionales, setProfesionales] = useState([]);
  const [cargandoProfesionales, setCargandoProfesionales] = useState(true);
  const [errorProfesionales, setErrorProfesionales] = useState("");

  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [esDiaFestivo, setEsDiaFestivo] = useState(false);
  const [festivos, setFestivos] = useState([]);

  // ========================================
  // 1. CARGAR PROFESIONALES
  // ========================================
  useEffect(() => {
    const cargarProfesionales = async () => {
      try {
        setCargandoProfesionales(true);
        setErrorProfesionales("");
        const response = await fetch(`${API_BASE}/especialistas`);
        if (!response.ok) throw new Error("Error al cargar profesionales");
        const data = await response.json();
        if (data.success) setProfesionales(data.data);
        else if (Array.isArray(data)) setProfesionales(data);
        else setProfesionales([]);
      } catch (error) {
        console.error("Error al cargar profesionales:", error);
        setErrorProfesionales("No se pudieron cargar los profesionales");
        setProfesionales([]);
      } finally {
        setCargandoProfesionales(false);
      }
    };
    cargarProfesionales();
  }, []);

  // ========================================
  // 2. CARGAR DÍAS FESTIVOS
  // ========================================
  useEffect(() => {
    const cargarFestivos = async () => {
      try {
        const response = await fetch(`${API_BASE}/festivos`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setFestivos(data.data || []);
          }
        }
      } catch (error) {
        console.error("Error al cargar festivos:", error);
      }
    };
    cargarFestivos();
  }, []);

  // ========================================
  // 3. VERIFICAR SI LA FECHA ES FESTIVA
  // ========================================
  useEffect(() => {
    const verificarFestivo = async () => {
      if (!fechaSeleccionada) {
        setEsDiaFestivo(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE}/festivos/verificar/${fechaSeleccionada}`,
        );
        if (response.ok) {
          const data = await response.json();
          setEsDiaFestivo(data.es_festivo || false);

          if (data.es_festivo) {
            setErrorFecha("Fecha no disponible - Selecciona otro día");
          }
        }
      } catch (error) {
        console.error("Error verificando festivo:", error);
      }
    };
    verificarFestivo();
  }, [fechaSeleccionada]);

  // ========================================
  // 4. CARGAR HORAS OCUPADAS
  // ========================================
  const obtenerHorasOcupadas = useCallback(
    async (fecha, profesionalId) => {
      if (!fecha || !profesionalId) return [];
      setCargandoHorarios(true);
      setErrorGeneral("");

      try {
        if (esDiaFestivo) {
          setCargandoHorarios(false);
          return [
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
          ];
        }

        const [reservasRes, bloqueadasRes, bloqueosAgendaRes] =
          await Promise.all([
            fetch(
              `${API_BASE}/reservas?fecha=${fecha}&especialista_id=${profesionalId}`,
            ),
            fetch(`${API_BASE}/horas-bloqueadas?fecha=${fecha}`),
            fetch(
              `${API_BASE}/bloqueos-agenda?fecha_especifica=${fecha}&especialista_id=${profesionalId}`,
            ),
          ]);

        let reservasActivas = [];
        if (reservasRes.ok) {
          const reservasData = await reservasRes.json();
          if (reservasData.success && Array.isArray(reservasData.data)) {
            reservasActivas = reservasData.data
              .filter((r) => r.estado !== "cancelada")
              .map((r) => r.hora?.substring(0, 5))
              .filter(Boolean);
          }
        }

        let horasBloqueadas = [];
        if (bloqueadasRes.ok) {
          const bloqueadasData = await bloqueadasRes.json();
          if (bloqueadasData.success && Array.isArray(bloqueadasData.data)) {
            horasBloqueadas = bloqueadasData.data
              .map((b) => b.hora?.substring(0, 5))
              .filter(Boolean);
          }
        }

        let bloqueosHoras = [];
        if (bloqueosAgendaRes.ok) {
          const bloqueosAgendaData = await bloqueosAgendaRes.json();
          if (
            bloqueosAgendaData.success &&
            Array.isArray(bloqueosAgendaData.data)
          ) {
            bloqueosAgendaData.data.forEach((bloqueo) => {
              const horaInicio = parseInt(bloqueo.hora_inicio.split(":")[0]);
              const horaFin = parseInt(bloqueo.hora_fin.split(":")[0]);

              for (let h = horaInicio; h < horaFin; h++) {
                const horaStr = `${h.toString().padStart(2, "0")}:00`;
                bloqueosHoras.push(horaStr);
              }
            });
          }
        }

        const todasOcupadas = [
          ...new Set([
            ...reservasActivas,
            ...horasBloqueadas,
            ...bloqueosHoras,
          ]),
        ];

        return todasOcupadas;
      } catch (error) {
        console.error("Error al obtener horas ocupadas:", error);
        setErrorGeneral("Error al consultar disponibilidad");
        return [];
      } finally {
        setCargandoHorarios(false);
      }
    },
    [esDiaFestivo],
  );

  useEffect(() => {
    if (fechaSeleccionada && profesionalSeleccionado) {
      obtenerHorasOcupadas(fechaSeleccionada, profesionalSeleccionado.id).then(
        setHorasOcupadas,
      );
    }
  }, [fechaSeleccionada, profesionalSeleccionado, obtenerHorasOcupadas]);

  const horariosDisponibles = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const isHoraDisponible = useCallback(
    (hora) => {
      if (!fechaSeleccionada || !profesionalSeleccionado) return false;
      if (esDiaFestivo) return false;

      const horaFormateada = hora.includes(":")
        ? hora.substring(0, 5)
        : `${hora}:00`;

      if (horasOcupadas.includes(horaFormateada)) return false;

      const hoy = new Date().toISOString().split("T")[0];
      if (fechaSeleccionada === hoy) {
        const [horas, minutos] = horaFormateada.split(":").map(Number);
        const ahora = new Date();
        const horaActual = ahora.getHours();
        const minutosActual = ahora.getMinutes();
        if (
          horas < horaActual ||
          (horas === horaActual && minutos <= minutosActual)
        )
          return false;
      }
      return true;
    },
    [fechaSeleccionada, profesionalSeleccionado, horasOcupadas, esDiaFestivo],
  );

  const handleFechaChange = useCallback((e) => {
    const fecha = e.target.value;
    setFechaSeleccionada(fecha);
    setHoraSeleccionada("");
    setErrorGeneral("");

    if (fecha) {
      const [año, mes, dia] = fecha.split("-").map(Number);
      const fechaObj = new Date(año, mes - 1, dia);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaObj < hoy) {
        setErrorFecha("No puedes seleccionar una fecha pasada");
      } else if (fechaObj.getDay() === 0) {
        setErrorFecha("No realizamos reservas los domingos");
      } else {
        setErrorFecha("");
      }
    } else {
      setErrorFecha("");
    }
  }, []);

  const handleSelectFechaCalendario = useCallback((fecha) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fecha < hoy) {
      setErrorFecha("No puedes seleccionar una fecha pasada");
      return;
    }
    if (fecha.getDay() === 0) {
      setErrorFecha("No realizamos reservas los domingos");
      return;
    }

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    const fechaStr = `${año}-${mes}-${dia}`;

    setFechaSeleccionada(fechaStr);
    setHoraSeleccionada("");
    setErrorFecha("");
    setErrorGeneral("");
  }, []);

  const handleSelectProfesional = useCallback((prof) => {
    setProfesionalSeleccionado(prof);
    setHoraSeleccionada("");
    setHorasOcupadas([]);
    setErrorGeneral("");
  }, []);

  const handleSelectHora = useCallback(
    (hora) => {
      if (!isHoraDisponible(hora)) return;
      setHoraSeleccionada(hora);
    },
    [isHoraDisponible],
  );

  const cambiarMes = useCallback(
    (direccion) => {
      const nuevaFecha = new Date(fechaActual);
      nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion);
      setFechaActual(nuevaFecha);
    },
    [fechaActual],
  );

  const isStepValid = useCallback(() => {
    switch (paso) {
      case 1:
        return profesionalSeleccionado !== null;
      case 2:
        return fechaSeleccionada !== "" && !errorFecha && !esDiaFestivo;
      case 3:
        return horaSeleccionada !== "";
      default:
        return true;
    }
  }, [
    paso,
    profesionalSeleccionado,
    fechaSeleccionada,
    errorFecha,
    horaSeleccionada,
    esDiaFestivo,
  ]);

  const avanzarPaso = useCallback(() => {
    if (paso < 3 && isStepValid()) {
      setPaso(paso + 1);
    } else if (paso === 3 && isStepValid()) {
      setModalOpen(true);
    }
  }, [paso, isStepValid]);

  const retrocederPaso = useCallback(() => {
    if (paso > 1) setPaso(paso - 1);
  }, [paso]);

  const procesarReserva = useCallback(
    async (datosCompletos) => {
      setIsSubmitting(true);
      try {
        const reservaData = {
          cliente_nombre: datosCompletos.cliente.nombre,
          cliente_telefono: datosCompletos.cliente.telefono,
          cliente_email: datosCompletos.cliente.email,
          servicio_id: servicio.id,
          servicio_nombre: servicio.nombre,
          especialista_id: profesionalSeleccionado.id,
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          duracion_estimada: servicio.duracion || 60,
          estado: "pendiente",
          notas: datosCompletos.cliente.notas || observaciones,
          precio_total: servicio.precio,
          metodo_pago: "pendiente",
          pagado: 0,
          identificacion: datosCompletos.cliente.identificacion,
        };

        const response = await fetch(`${API_BASE}/reservas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reservaData),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          if (data.error && data.error.includes("no está disponible")) {
            setErrorGeneral("Esta hora ya no está disponible");
            setHoraSeleccionada("");
            obtenerHorasOcupadas(
              fechaSeleccionada,
              profesionalSeleccionado.id,
            ).then(setHorasOcupadas);
            throw new Error("Hora no disponible");
          } else {
            throw new Error(
              data.message || data.error || "Error al crear la reserva",
            );
          }
        }

        // Mostrar resumen antes de navegar
        const fechaFormateada = new Date(fechaSeleccionada).toLocaleDateString(
          "es-ES",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          },
        );

        const mensajeWhatsapp =
          `*¡Tu reserva ha sido confirmada! 🎉*\n\n` +
          `📋 *Detalles de tu cita:*\n` +
          `• Servicio: ${servicio.nombre}\n` +
          `• Profesional: ${profesionalSeleccionado.nombre}\n` +
          `• Fecha: ${fechaFormateada}\n` +
          `• Hora: ${horaSeleccionada}\n` +
          `• Código: ${data.data?.codigo_reserva}\n\n` +
          `📍 *DM SALUD Y BELLEZA*\n` +
          `Gracias por confiar en nosotros`;

        const telefonoCliente = datosCompletos.cliente.telefono.replace(
          /\D/g,
          "",
        );

        // Preparar datos para el modal de éxito
        const datosReservaConfirmada = {
          servicio: servicio.nombre,
          profesional: profesionalSeleccionado.nombre,
          fecha: fechaFormateada,
          hora: horaSeleccionada,
          codigo: data.data?.codigo_reserva,
          telefono: telefonoCliente,
        };

        // Si选择了 enviar WhatsApp, abrir WhatsApp
        if (datosCompletos.enviarWhatsapp && datosCompletos.cliente.telefono) {
          const whatsappUrl = `https://wa.me/57${telefonoCliente}?text=${encodeURIComponent(mensajeWhatsapp)}`;
          window.open(whatsappUrl, "_blank");
        }

        setModalOpen(false);
        setReservaConfirmada(datosReservaConfirmada);
        setSuccessModalOpen(true);
      } catch (error) {
        console.error("❌ Error al procesar reserva:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      servicio,
      profesionalSeleccionado,
      fechaSeleccionada,
      horaSeleccionada,
      observaciones,
      navigate,
      obtenerHorasOcupadas,
    ],
  );

  // ========================================
  // MODAL DE RESERVA EXITOSA
  // ========================================
  const ModalReservaExitosa = () => {
    if (!successModalOpen || !reservaConfirmada) return null;

    const handleCerrar = () => {
      setSuccessModalOpen(false);
      setReservaConfirmada(null);
      navigate("/");
    };

    const handleWhatsapp = () => {
      const mensaje =
        `*¡Tu reserva ha sido confirmada! 🎉*\n\n` +
        `📋 *Detalles de tu cita:*\n` +
        `• Servicio: ${reservaConfirmada.servicio}\n` +
        `• Profesional: ${reservaConfirmada.profesional}\n` +
        `• Fecha: ${reservaConfirmada.fecha}\n` +
        `• Hora: ${reservaConfirmada.hora}\n` +
        `• Código: ${reservaConfirmada.codigo}\n\n` +
        `📍 *DM SALUD Y BELLEZA*\n` +
        `Gracias por confiar en nosotros`;
      const whatsappUrl = `https://wa.me/57${reservaConfirmada.telefono}?text=${encodeURIComponent(mensaje)}`;
      window.open(whatsappUrl, "_blank");
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header con gradiente */}
          <div
            className="p-8 text-center"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            }}
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={48} className="text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              ¡Reserva Confirmada!
            </h2>
            <p className="text-white/80">
              Tu cita ha sido agendada exitosamente
            </p>
          </div>

          {/* Detalles de la reserva */}
          <div className="p-6">
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Servicio</span>
                  <span className="font-semibold text-gray-800">
                    {reservaConfirmada.servicio}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Profesional</span>
                  <span className="font-semibold text-gray-800">
                    {reservaConfirmada.profesional}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Fecha</span>
                  <span className="font-semibold text-gray-800">
                    {reservaConfirmada.fecha}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 text-sm">Hora</span>
                  <span className="font-semibold text-gray-800">
                    {reservaConfirmada.hora}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 text-sm">Código</span>
                  <span className="font-bold text-indigo-600">
                    {reservaConfirmada.codigo}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={handleWhatsapp}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.497.099-.198.05-.371-.025-.521-.075-.148-.671-1.641-1.841-2.847-.271-.274-.481-.411-.688-.461-.208-.05-.397-.04-.566.05-.17.099-.748.497-.919.757-.172.26-.183.347-.183.521s.05.347.124.496c.075.149.173.298.372.447.297.149.595.298.892.447.148.075.273.124.42.149.148.025.297.05.446.05.149 0 .372-.025.57-.124.198-.099.595-.297 1.073-.744.478-.447 1.025-.92 1.322-1.173.297-.253.496-.347.669-.347.173 0 .372.025.532.099.16.074.298.149.42.149.149 0 .298-.05.42-.099.124-.05.223-.149.322-.248.099-.1.173-.199.273-.323.099-.124.149-.248.199-.372.05-.124.05-.248 0-.372-.05-.124-.149-.273-.347-.471z" />
                </svg>
                Enviar por WhatsApp
              </button>
              <button
                onClick={handleCerrar}
                className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 text-center">
            <p className="text-sm text-gray-500">📍 DM SALUD Y BELLEZA</p>
          </div>
        </motion.div>
      </div>
    );
  };

  if (!servicio) return null;

  // ========================================
  // PASO 1: SELECCIÓN DE PROFESIONAL
  // ========================================
  const PasoSeleccionProfesional = memo(() => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2 text-slate-900">
          Selecciona tu Especialista
        </h2>
        <p className="text-sm text-slate-500">
          Elige al profesional que realizará tu servicio
        </p>
      </div>

      {cargandoProfesionales ? (
        <div className="flex justify-center items-center p-12">
          <div className="text-center">
            <Loader2 size={24} className="text-indigo-600" />
            <p className="text-sm text-slate-500">Cargando profesionales...</p>
          </div>
        </div>
      ) : errorProfesionales ? (
        <div
          className="p-6 rounded-lg border text-center"
          style={{
            background: "rgba(79, 70, 229, 0.05)",
            borderColor: "rgba(79, 70, 229, 0.2)",
          }}
        >
          <AlertCircle size={32} className="text-indigo-600" />
          <p className="font-medium mb-2 text-slate-900">
            {errorProfesionales}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-indigo-600"
          >
            Reintentar
          </button>
        </div>
      ) : profesionales.length === 0 ? (
        <div
          className="p-6 rounded-lg border text-center"
          style={{
            background: "rgba(79, 70, 229, 0.05)",
            borderColor: "rgba(79, 70, 229, 0.2)",
          }}
        >
          <AlertCircle size={32} className="text-indigo-600" />
          <p className="font-medium text-slate-900">
            No hay profesionales disponibles
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Opción "Cualquiera" */}
          <button
            onClick={() =>
              handleSelectProfesional({
                id: "cualquiera",
                nombre: "Cualquiera",
                especialidad: "El primero disponible",
                imagen_url: null,
              })
            }
            className={`text-left rounded-xl p-3 border transition-all ${profesionalSeleccionado?.id === "cualquiera"
              ? "shadow-sm"
              : "bg-white"
              }`}
            style={{
              borderColor:
                profesionalSeleccionado?.id === "cualquiera"
                  ? "#4f46e5"
                  : "rgba(79, 70, 229, 0.1)",
              background:
                profesionalSeleccionado?.id === "cualquiera"
                  ? "linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(232, 155, 176, 0.05))"
                  : "white",
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-2">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <User className="text-[#4f46e5]" size={24} />
                  </div>
                </div>
                {profesionalSeleccionado?.id === "cualquiera" && (
                  <div
                    className="absolute -top-1 -right-1 rounded-full p-1"
                    style={{
                      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    }}
                  >
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-900">Cualquiera</h3>
              <p className="font-medium text-xs text-indigo-600">
                Primer disponible
              </p>
            </div>
          </button>
          {profesionales.map((prof) => (
            <button
              key={prof.id}
              onClick={() => handleSelectProfesional(prof)}
              className={`text-left rounded-xl p-3 border transition-all ${profesionalSeleccionado?.id === prof.id
                ? "shadow-sm"
                : "bg-white"
                }`}
              style={{
                borderColor:
                  profesionalSeleccionado?.id === prof.id
                    ? "#4f46e5"
                    : "rgba(79, 70, 229, 0.1)",
                background:
                  profesionalSeleccionado?.id === prof.id
                    ? "linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(232, 155, 176, 0.05))"
                    : "white",
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  {prof.imagen_url ? (
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5"
                      style={{
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      }}
                    >
                      <img
                        src={
                          prof.imagen_url.startsWith("http")
                            ? prof.imagen_url
                            : `${API_URL}${prof.imagen_url.startsWith("/") ? "" : "/"}${prof.imagen_url}`
                        }
                        alt={prof.nombre}
                        className="w-full h-full rounded-full object-cover bg-white"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="w-full h-full rounded-full bg-white flex items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <User className="text-[#4f46e5]" size={28} />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1"
                      style={{
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <User className="text-[#4f46e5]" size={28} />
                      </div>
                    </div>
                  )}
                  {profesionalSeleccionado?.id === prof.id && (
                    <div
                      className="absolute -top-1 -right-1 rounded-full p-1"
                      style={{
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      }}
                    >
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                  <div
                    className={`absolute -top-1 -left-1 w-2 h-2 rounded-full ${prof.status === "Disponible"
                      ? "bg-green-500"
                      : "bg-amber-500"
                      }`}
                  />
                </div>
                <h3 className="text-slate-900">{prof.nombre}</h3>
                <p className="text-indigo-600">{prof.especialidad}</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={`${i < Math.floor(prof.rating || 4.5) ? "fill-current" : ""
                        }`}
                    />
                  ))}
                  <span className="text-xs ml-1 text-slate-500">
                    {prof.rating || 4.5}
                  </span>
                </div>
                <p className="text-slate-500">{prof.descripcion}</p>
                <div className="flex items-center justify-between w-full text-xs">
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-indigo-600" />
                    <span className="text-slate-400">
                      {prof.experiencia || "5+ años"}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${prof.status === "Disponible"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                      }`}
                  >
                    {prof.status || "Disponible"}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  ));

  // ========================================
  // PASO 2: SELECCIÓN DE FECHA
  // ========================================
  const PasoSeleccionFecha = memo(() => {
    const hoy = new Date();
    const primerDiaMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      1,
    );
    const diasEnMes = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth() + 1,
      0,
    ).getDate();

    const generarDiasDelMes = () => {
      const dias = [];
      for (let i = 0; i < primerDiaMes.getDay(); i++) dias.push(null);
      for (let i = 1; i <= diasEnMes; i++) {
        dias.push(
          new Date(fechaActual.getFullYear(), fechaActual.getMonth(), i),
        );
      }
      return dias;
    };

    const diasDelMes = generarDiasDelMes();

    const esFechaDisponible = (fecha) => {
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const dia = String(fecha.getDate()).padStart(2, "0");
      const fechaStr = `${año}-${mes}-${dia}`;

      const esPasada = fecha < hoy;
      const esDomingo = fecha.getDay() === 0;
      const esFestivo = festivos.some((f) => f.fecha === fechaStr);

      return !esPasada && !esDomingo && !esFestivo;
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 text-slate-900">
            Selecciona la Fecha
          </h2>
          <p className="text-sm text-slate-500">
            Elige el día que prefieres para tu cita
          </p>
        </div>

        {errorGeneral && (
          <div
            className="p-3 rounded-lg mb-4"
            style={{
              background: "rgba(79, 70, 229, 0.05)",
              border: "1px solid rgba(79, 70, 229, 0.2)",
            }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-indigo-600" />
              <p className="font-medium text-sm text-slate-900">
                {errorGeneral}
              </p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-slate-900">Seleccionar fecha</label>
              <div className="relative">
                <Calendar size={18} className="text-indigo-600" />
                <input
                  type="date"
                  value={fechaSeleccionada}
                  onChange={handleFechaChange}
                  min={hoy.toISOString().split("T")[0]}
                  max={
                    new Date(hoy.getFullYear(), hoy.getMonth() + 2, 0)
                      .toISOString()
                      .split("T")[0]
                  }
                  className="w-full border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "rgba(79, 70, 229, 0.2)",
                    focusRingColor: "rgba(79, 70, 229, 0.4)",
                  }}
                />
              </div>
            </div>

            <div className="border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => cambiarMes(-1)}
                  className="p-1 rounded hover:bg-slate-50"
                >
                  <ChevronLeft size={18} className="text-indigo-600" />
                </button>
                <h4 className="text-slate-900">
                  {fechaActual.toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  })}
                </h4>
                <button
                  onClick={() => cambiarMes(1)}
                  className="p-1 rounded hover:bg-slate-50"
                >
                  <ChevronRight size={18} className="text-indigo-600" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                  (dia) => (
                    <div key={dia} className="text-slate-400">
                      {dia}
                    </div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {diasDelMes.map((fecha, i) => {
                  if (!fecha) return <div key={`empty-${i}`} className="h-8" />;

                  const esHoy = fecha.toDateString() === hoy.toDateString();
                  const disponible = esFechaDisponible(fecha);

                  const año = fecha.getFullYear();
                  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
                  const dia = String(fecha.getDate()).padStart(2, "0");
                  const fechaStr = `${año}-${mes}-${dia}`;

                  const esSeleccionada = fechaStr === fechaSeleccionada;

                  return (
                    <button
                      key={fecha.getDate()}
                      onClick={() =>
                        disponible && handleSelectFechaCalendario(fecha)
                      }
                      disabled={!disponible}
                      className={`h-8 rounded text-sm transition-all ${esSeleccionada
                        ? "text-white"
                        : esHoy
                          ? "font-semibold"
                          : disponible
                            ? "hover:bg-slate-50"
                            : "cursor-not-allowed"
                        }`}
                      style={{
                        background: esSeleccionada
                          ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                          : esHoy
                            ? "rgba(79, 70, 229, 0.1)"
                            : "transparent",
                        color: esSeleccionada
                          ? "white"
                          : !disponible
                            ? "#94a3b8"
                            : "#1e293b",
                      }}
                    >
                      {fecha.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {errorFecha && (
              <div
                className="p-3 rounded-lg"
                style={{
                  background: "rgba(79, 70, 229, 0.05)",
                  border: "1px solid rgba(79, 70, 229, 0.2)",
                }}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-indigo-600" />
                  <p className="text-slate-900">{errorFecha}</p>
                </div>
              </div>
            )}

            {esDiaFestivo && fechaSeleccionada && (
              <div
                className="p-3 rounded-lg"
                style={{
                  background: "rgba(79, 70, 229, 0.05)",
                  border: "1px solid rgba(79, 70, 229, 0.2)",
                }}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-indigo-600" />
                  <p className="text-slate-900">Fecha no disponible</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-slate-900">Profesional Seleccionado</h3>
              {profesionalSeleccionado && (
                <button onClick={() => setPaso(1)} className="text-indigo-600">
                  Cambiar
                </button>
              )}
            </div>
            {profesionalSeleccionado ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50/50 border border-indigo-100">
                  {profesionalSeleccionado.imagen_url ? (
                    <img
                      src={
                        profesionalSeleccionado.imagen_url.startsWith("http")
                          ? profesionalSeleccionado.imagen_url
                          : `${API_URL}${profesionalSeleccionado.imagen_url.startsWith("/") ? "" : "/"}${profesionalSeleccionado.imagen_url}`
                      }
                      alt={profesionalSeleccionado.nombre}
                      className="w-10 h-10 rounded-full object-cover border border-indigo-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-100 border border-indigo-200">
                      <User className="text-indigo-600" size={18} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-slate-900 font-medium truncate">
                      {profesionalSeleccionado.nombre}
                    </p>
                    <p className="text-xs text-indigo-600 truncate">
                      {profesionalSeleccionado.especialidad}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-slate-400">
                  Selecciona un profesional en el paso anterior
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  });

  // ========================================
  // PASO 3: SELECCIÓN DE HORA
  // ========================================
  const PasoSeleccionHora = memo(() => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2 text-slate-900">
          Selecciona la Hora
        </h2>
        <p className="text-sm text-slate-500">
          Elige el horario que mejor se adapte
        </p>
      </div>

      {errorGeneral && (
        <div
          className="p-3 rounded-lg"
          style={{
            background: "rgba(79, 70, 229, 0.05)",
            border: "1px solid rgba(79, 70, 229, 0.2)",
          }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-indigo-600" />
            <p className="font-medium text-sm text-slate-900">{errorGeneral}</p>
          </div>
        </div>
      )}

      {fechaSeleccionada && (
        <div className="border-slate-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs mb-1 text-slate-400">Fecha seleccionada</p>
              <p className="font-semibold text-slate-900">
                {(() => {
                  const [año, mes, dia] = fechaSeleccionada
                    .split("-")
                    .map(Number);
                  const fechaLocal = new Date(año, mes - 1, dia);
                  return fechaLocal.toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  });
                })()}
              </p>
              {esDiaFestivo && (
                <p className="text-xs mt-1 text-indigo-600">
                  Fecha no disponible
                </p>
              )}
            </div>
            {profesionalSeleccionado && (
              <div>
                <p className="text-xs mb-1 text-slate-400">Profesional</p>
                <p className="font-semibold text-slate-900">
                  {profesionalSeleccionado.nombre}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {esDiaFestivo ? (
        <div className="p-6 rounded-lg border border-indigo-200 bg-indigo-50/50 text-center">
          <AlertCircle size={32} className="text-indigo-600" />
          <h3 className="font-bold mb-1 text-slate-900">Fecha no disponible</h3>
          <p className="text-sm text-slate-500">
            No hay horarios disponibles para esta fecha
          </p>
        </div>
      ) : cargandoHorarios ? (
        <div
          className="flex items-center justify-center p-4 rounded-lg border"
          style={{
            background: "rgba(245, 169, 184, 0.05)",
            borderColor: "rgba(79, 70, 229, 0.1)",
          }}
        >
          <div className="flex items-center gap-2">
            <Loader2 size={18} className="text-indigo-600" />
            <span className="text-sm text-slate-500">
              Consultando disponibilidad...
            </span>
          </div>
        </div>
      ) : !fechaSeleccionada ? (
        <div
          className="p-4 rounded-lg"
          style={{
            background: "rgba(79, 70, 229, 0.05)",
            border: "1px solid rgba(79, 70, 229, 0.2)",
          }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-indigo-600" />
            <p className="font-medium text-sm text-slate-900">
              Selecciona una fecha primero
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-slate-900">Horarios disponibles</h3>
              <p className="text-xs text-slate-400">
                Duración: {servicio.duracion || 60} minutos
              </p>
            </div>
            <div className="text-xs">
              {horasOcupadas.length === 0 ? (
                <span className="text-green-600">✓ Todos disponibles</span>
              ) : (
                <span className="text-indigo-600">
                  {horasOcupadas.length} ocupado(s)
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-white border border-slate-200"></div>
              <span className="text-slate-400">Disponible</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-slate-100 border border-slate-200"></div>
              <span className="text-slate-400">Ocupado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-indigo-600"></div>
              <span className="text-slate-400">Seleccionado</span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {horariosDisponibles.map((horaItem) => {
              const disponible = isHoraDisponible(horaItem);
              const seleccionada = horaSeleccionada === horaItem;
              const ocupada = horasOcupadas.includes(horaItem);

              return (
                <button
                  key={horaItem}
                  onClick={() => handleSelectHora(horaItem)}
                  disabled={!disponible}
                  className={`p-3 rounded-lg border transition-all text-sm ${seleccionada
                    ? "shadow-sm"
                    : !disponible
                      ? "cursor-not-allowed"
                      : "bg-white hover:shadow-sm"
                    }`}
                  style={{
                    borderColor: seleccionada
                      ? "#4f46e5"
                      : "rgba(79, 70, 229, 0.1)",
                    background: seleccionada
                      ? "linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(232, 155, 176, 0.1))"
                      : !disponible
                        ? "#f9fafb"
                        : "white",
                    color: seleccionada
                      ? "#4f46e5"
                      : !disponible
                        ? "#94a3b8"
                        : "#1e293b",
                  }}
                >
                  <div className="text-center">
                    <div
                      className={`font-medium ${!disponible ? "line-through" : ""}`}
                    >
                      {horaItem}
                    </div>
                    {!disponible && (
                      <div className="text-xs mt-1">
                        <span className="text-slate-400">Ocupado</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 text-xs text-slate-400">
            <p>
              Mostrando{" "}
              {horariosDisponibles.filter((h) => isHoraDisponible(h)).length} de{" "}
              {horariosDisponibles.length} horarios disponibles
            </p>
          </div>

          {horaSeleccionada && (
            <div
              className="mt-4 p-4 rounded-xl border"
              style={{
                background: "rgba(79, 70, 229, 0.05)",
                borderColor: "rgba(79, 70, 229, 0.2)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-600">Hora seleccionada</p>
                  <p className="font-bold text-slate-900">{horaSeleccionada}</p>
                </div>
                <button
                  onClick={() => setHoraSeleccionada("")}
                  className="text-indigo-600"
                >
                  Cambiar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <label className="text-slate-900">
          Observaciones adicionales (opcional)
        </label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Alergias, preferencias específicas, comentarios..."
          className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none"
          style={{
            borderColor: "rgba(79, 70, 229, 0.2)",
            focusRingColor: "rgba(79, 70, 229, 0.4)",
          }}
          rows="3"
        />
      </div>
    </motion.div>
  ));

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm border-b border-indigo-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Volver</span>
              </button>
              <div className="h-6 w-px bg-indigo-100" />
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  Nueva Reserva
                </h1>
                <p className="text-xs text-slate-500">
                  {servicio.nombre} • ${servicio.precio?.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Paso</p>
                <p className="font-bold text-indigo-600">
                  {paso} <span className="text-slate-300">/ 3</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 rounded-full bg-indigo-50" />
          <div
            className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 transition-all duration-500 rounded-full bg-indigo-600"
            style={{
              width: `${(paso - 1) * 50}%`,
            }}
          />
          <div className="flex justify-between relative z-10">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${paso >= num
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-slate-200 text-slate-400"
                    }`}
                >
                  {paso > num ? (
                    <Check size={16} className="text-white" />
                  ) : (
                    <span
                      className="font-bold text-sm"
                      style={{
                        color: paso >= num ? "white" : "#94a3b8",
                      }}
                    >
                      {num}
                    </span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${paso >= num ? "text-[#1e293b]" : "text-[#94a3b8]"
                    }`}
                >
                  {num === 1 && "Profesional"}
                  {num === 2 && "Fecha"}
                  {num === 3 && "Hora"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl border border-indigo-100 shadow-sm p-6">
          <AnimatePresence mode="wait">
            {paso === 1 && <PasoSeleccionProfesional key="paso1" />}
            {paso === 2 && <PasoSeleccionFecha key="paso2" />}
            {paso === 3 && <PasoSeleccionHora key="paso3" />}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={retrocederPaso}
            disabled={paso === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${paso > 1 ? "hover:bg-slate-50" : "cursor-not-allowed opacity-50"
              }`}
          >
            <ArrowLeft size={16} /> Anterior
          </button>
          <div className="text-center">
            <p className="text-sm text-slate-400">
              {paso === 1 && "Selecciona un profesional para continuar"}
              {paso === 2 && "Selecciona una fecha disponible"}
              {paso === 3 && "Elige el horario que prefieras"}
            </p>
          </div>
          <button
            onClick={avanzarPaso}
            disabled={!isStepValid()}
            className="flex items-center gap-2 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paso < 3 ? "Continuar" : "Confirmar reserva"}{" "}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <ModalConfirmacion
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={procesarReserva}
        datosReserva={{
          servicio,
          profesional: profesionalSeleccionado,
          fecha: fechaSeleccionada,
          hora: horaSeleccionada,
          observaciones,
        }}
        loading={isSubmitting}
      />

      <ModalReservaExitosa />
    </div>
  );
};

export default ReservaCita;
