import React from 'react';
import { useEffect, useState, useCallback } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Home,
  BarChart3,
  Menu,
  Bell,
  LogOut,
  User as UserIcon,
  Shield,
  Activity,
  ChevronRight,
  PlusCircle,
  AlertCircle,
  CalendarDays,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Mail,
  Phone,
  Building,
  Target,
  Zap,
  PieChart,
  Briefcase,
  CreditCard,
  FileText,
  ShieldCheck,
  CalendarX,
  Ban,
  CalendarOff,
  Flower2,
  Sparkles,
  Heart,
  X,
} from "lucide-react";

import API_BASE from "../../config/api";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    reservas_pendientes: 0,
    comisiones_pendientes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const [pendingCommissions, setPendingCommissions] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const user = {
    name: "Daniela Medina",
    role: "Gerente General",
    email: "danimedinaa@dmsaludybelleza.com",
    avatar: "DM",
  };

  const colors = {
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    primaryLight: "#3b82f6",
    secondary: "#64748b",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#06b6d4",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    textMuted: "#9ca3af",
    white: "#ffffff",
    border: "#e5e7eb",
    sidebarBg: "#ffffff",
    sidebarHover: "#f3f4f6",
    cardBg: "#ffffff",
    headerBg: "#ffffff",
  };

  // Estilos de scroll
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "admin-scroll-styles";
    style.textContent = `
      body::-webkit-scrollbar { width: 8px; height: 8px; }
      body::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
      body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      body::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      body { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f1f1; }
      .admin-dashboard::-webkit-scrollbar,
      .admin-dashboard *::-webkit-scrollbar { width: 8px; height: 8px; }
      .admin-dashboard::-webkit-scrollbar-track,
      .admin-dashboard *::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
      .admin-dashboard::-webkit-scrollbar-thumb,
      .admin-dashboard *::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      .admin-dashboard::-webkit-scrollbar-thumb:hover,
      .admin-dashboard *::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      .admin-dashboard,
      .admin-dashboard * { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f1f1; }
    `;
    document.head.appendChild(style);
    return () => {
      const existingStyle = document.getElementById("admin-scroll-styles");
      if (existingStyle) existingStyle.remove();
    };
  }, []);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const resPendientes = await fetch(
        `${API_BASE}/reservas?estado=pendiente&limit=3`,
      );
      if (resPendientes.ok) {
        const data = await resPendientes.json();
        const reservas = data.success ? data.data : data;
        setNotifications(reservas || []);
        setStats((prev) => ({
          ...prev,
          reservas_pendientes: reservas?.length || 0,
        }));
      }

      const resRecientes = await fetch(`${API_BASE}/reservas?limit=5`);
      if (resRecientes.ok) {
        const data = await resRecientes.json();
        setRecentReservations(data.success ? data.data : data || []);
      }

      try {
        const resComisiones = await fetch(
          `${API_BASE}/comisiones?pagado=false&limit=1`,
        );
        if (resComisiones.ok) {
          const data = await resComisiones.json();
          setPendingCommissions(data.count || 0);
          setStats((prev) => ({
            ...prev,
            comisiones_pendientes: data.count || 0,
          }));
        }
      } catch (error) {
        console.error("Error cargando comisiones:", error);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 100000);
    return () => clearInterval(interval);
  }, [cargarDatos]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const navigationItems = [
    {
      category: "PANEL PRINCIPAL",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: <PieChart size={isMobile ? 16 : 18} />,
          exact: true,
        },
      ],
    },
    {
      category: "OPERACIONES",
      items: [
        {
          name: "Reservas",
          path: "/dashboard/reservas",
          icon: <Calendar size={isMobile ? 16 : 18} />,
          badge: stats.reservas_pendientes,
        },
        {
          name: "Agenda",
          path: "/dashboard/agenda",
          icon: <CalendarDays size={isMobile ? 16 : 18} />,
        },
        {
          name: "Bloqueos",
          path: "/dashboard/bloqueos",
          icon: <CalendarX size={isMobile ? 16 : 18} />,
        },
        {
          name: "Clientes",
          path: "/dashboard/clientes",
          icon: <Users size={isMobile ? 16 : 18} />,
        },
        {
          name: "Especialistas",
          path: "/dashboard/especialistas",
          icon: <Flower2 size={isMobile ? 16 : 18} />,
        },
        {
          name: "Servicios",
          path: "/dashboard/servicios",
          icon: <Briefcase size={isMobile ? 16 : 18} />,
        },
      ],
    },
    {
      category: "FINANZAS",
      items: [
        {
          name: "Comisiones",
          path: "/dashboard/comisiones",
          icon: <DollarSign size={isMobile ? 16 : 18} />,
          badge: stats.comisiones_pendientes,
        },
        {
          name: "Facturación",
          path: "/dashboard/facturacion",
          icon: <CreditCard size={isMobile ? 16 : 18} />,
        },
        {
          name: "Reportes",
          path: "/dashboard/reportes",
          icon: <BarChart3 size={isMobile ? 16 : 18} />,
        },
      ],
    },
    {
      category: "CONFIGURACIÓN",
      items: [
        {
          name: "Días Festivos",
          path: "/dashboard/bloqueos?tipo=festivo",
          icon: <Ban size={isMobile ? 16 : 18} />,
        },
      ],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
          <p className="font-semibold text-gray-700 text-sm sm:text-base">
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard min-h-screen bg-gray-50">
      {/* Header Móvil */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Abrir menú"
              >
                <Menu size={18} className="sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm sm:text-lg">
                    DM
                  </span>
                </div>
                <div className="hidden xs:block">
                  <h1 className="font-bold text-gray-900 text-xs sm:text-sm">
                    DM Admin
                  </h1>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    Panel de Gestión
                  </p>
                </div>
              </div>
            </div>

            {notifications.length > 0 && (
              <div className="relative">
                <button
                  className="p-1.5 sm:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() =>
                    navigate("/dashboard/reservas?estado=pendiente")
                  }
                  aria-label="Notificaciones"
                >
                  <Bell
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-gray-600"
                  />
                </button>
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Sidebar Móvil */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-white shadow-xl overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 flex justify-end p-2 border-b">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Cerrar menú"
                >
                  <X size={20} />
                </button>
              </div>
              <UserProfile user={user} colors={colors} isMobile={isMobile} />
              <SidebarNavigation
                navigationItems={navigationItems}
                location={location}
                colors={colors}
                onItemClick={() => setSidebarOpen(false)}
                isMobile={isMobile}
              />
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="font-medium text-sm">Cerrar Sesión</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Layout Principal */}
      <div className="flex min-h-screen pt-14 sm:pt-16 lg:pt-0">
        {/* Sidebar Desktop */}
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="hidden lg:block w-64 min-h-screen bg-white border-r border-gray-200 flex-shrink-0"
        >
          <div className="p-4 sm:p-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base sm:text-lg">
                  DM
                </span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-base sm:text-lg">
                  DM Admin
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Gestión Integral
                </p>
              </div>
            </div>
          </div>

          <UserProfile user={user} colors={colors} isMobile={false} />

          <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-gray-200">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <SidebarNavigation
            navigationItems={navigationItems}
            location={location}
            colors={colors}
            isMobile={false}
          />

          <div className="p-3 sm:p-4 border-t border-gray-200 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="font-medium text-xs sm:text-sm">
                Cerrar Sesión
              </span>
            </button>
            <div className="flex items-center gap-2 mt-3 sm:mt-4">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
              <span className="text-[10px] sm:text-xs text-gray-500">
                En línea
              </span>
            </div>
          </div>
        </motion.aside>

        {/* Contenido Principal */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 min-w-0">
          {/* Header Superior */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Panel de Control
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                  Resumen de operaciones y gestión
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white border border-gray-200 shadow-sm">
                  <Calendar
                    size={14}
                    className="sm:w-[18px] sm:h-[18px] text-blue-600"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                    {new Date().toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notificaciones */}
          {notifications.length > 0 && (
            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="rounded-lg sm:rounded-xl bg-blue-50 border border-blue-200 p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <AlertCircle
                        size={16}
                        className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-blue-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        Acción Requerida
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Tienes {notifications.length} reserva(s) pendiente(s)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      navigate("/dashboard/reservas?estado=pendiente")
                    }
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                  >
                    Revisar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notificación Comisiones */}
          {pendingCommissions > 0 && (
            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="rounded-lg sm:rounded-xl bg-amber-50 border border-amber-200 p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <DollarSign
                        size={16}
                        className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-amber-600"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        Comisiones Pendientes
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Tienes {pendingCommissions} comisión(es) pendiente(s)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/dashboard/comisiones")}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                  >
                    Ver comisiones
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Área de Contenido Dinámico */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Outlet />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                <span className="font-medium text-gray-700">DM Spa CRM</span> •
                Sistema de gestión
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-[10px] sm:text-xs text-gray-400">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    En línea
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

// Componentes auxiliares optimizados
function UserProfile({ user, colors, isMobile }) {
  return (
    <div className="px-3 sm:px-4 py-3 sm:py-5 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-white font-bold text-sm sm:text-base md:text-lg">
            {user.avatar}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
            {user.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-blue-600 truncate">
            {user.role}
          </p>
          {!isMobile && (
            <p className="text-[10px] text-gray-500 truncate hidden sm:block">
              {user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarNavigation({
  navigationItems,
  location,
  colors,
  onItemClick,
  isMobile,
}) {
  return (
    <nav className="px-2 sm:px-3 py-3 sm:py-4 overflow-y-auto flex-1">
      {navigationItems.map((category) => (
        <div key={category.category} className="mb-4 sm:mb-6">
          <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3 px-2 sm:px-3 text-gray-500">
            {category.category}
          </h4>
          <ul className="space-y-0.5 sm:space-y-1">
            {category.items.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (!item.exact && location.pathname.startsWith(item.path));

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onItemClick}
                    className={`
                      flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200
                      ${isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
                    `}
                  >
                    <span
                      className={isActive ? "text-blue-600" : "text-gray-400"}
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium text-xs sm:text-sm truncate">
                      {item.name}
                    </span>
                    {item.badge > 0 && (
                      <span className="ml-auto w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center flex-shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
