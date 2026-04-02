const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";
const API_BASE = `${API_URL.replace(/\/$/, "")}/api`;

export const API_ENDPOINTS = {
  BASE: API_URL,
  API: API_BASE,

  // Reservas
  RESERVAS: `${API_BASE}/reservas`,
  RESERVAS_PENDIENTES: `${API_BASE}/reservas?estado=pendiente`,
  RESERVAS_ESTADISTICAS: `${API_BASE}/reservas/estadisticas`,

  // Servicios
  SERVICIOS: `${API_BASE}/servicios`,
  SERVICIOS_DESTACADOS: `${API_BASE}/servicios/destacados`,

  // Categorías
  CATEGORIAS: `${API_BASE}/categorias`,
  CATEGORIAS_DESTACADAS: `${API_BASE}/categorias/destacadas`,

  // Especialistas
  ESPECIALISTAS: `${API_BASE}/especialistas`,
  ESPECIALISTAS_COMISIONES: `${API_BASE}/especialistas-comisiones`,

  // Comisiones
  COMISIONES: `${API_BASE}/comisiones`,
  COMISIONES_RESUMEN: `${API_BASE}/comisiones/resumen`,

  // Bloqueos
  BLOQUEOS: `${API_BASE}/bloqueos-agenda`,
  FESTIVOS: `${API_BASE}/festivos`,

  // Horarios
  HORAS_BLOQUEADAS: `${API_BASE}/horas-bloqueadas`,
  HORARIOS_DISPONIBLES: `${API_BASE}/horarios-disponibles`,

  // Pedidos
  PEDIDOS: `${API_BASE}/pedidos`,
};

export default API_BASE;
export { API_URL };
