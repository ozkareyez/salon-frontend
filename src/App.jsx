import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import React, { Suspense, lazy } from "react";

import Home from "./componentes/Home";
import ProductoDetalle from "./componentes/ProductoDetalle";
import ReservaCita from "./componentes/ReservaCita";
import ContactForm from "./componentes/ContactForm";

import Foter from "./componentes/Foter";
import CartButton from "./componentes/CartButton";
import CartDrawer from "./componentes/CartDrawer";
import WhatsAppButton from "./componentes/WhatsAppButton";

const Login = lazy(() => import("./components/admin/Login"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute"));
const AdminReservas = lazy(() => import("./components/admin/AdminReservas"));
const AdminBloqueos = lazy(() => import("./components/admin/AdminBloqueos"));
const AgendaCalendario = lazy(() => import("./components/admin/AgendaCalendario"));
const AdminComisiones = lazy(() => import("./components/admin/AdminComisiones"));
const AdminClientes = lazy(() => import("./components/admin/AdminClientes"));
const AdminServicios = lazy(() => import("./components/admin/AdminServicios"));
const AdminFacturacion = lazy(() => import("./components/admin/AdminFacturacion"));
const AdminReportes = lazy(() => import("./components/admin/AdminReportes"));
const AdminUsuariosProfesionales = lazy(() => import("./components/admin/AdminUsuariosProfesionales"));
const AdminEspecialistas = lazy(() => import("./components/admin/AdminEspecialistas"));

// Rutas de profesionales
const LoginProfesional = lazy(() => import("./components/profesional/LoginProfesional"));
const DashboardProfesional = lazy(() => import("./components/profesional/DashboardProfesional"));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50/50 backdrop-blur-sm">
    <div className="text-center group">
      <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6 shadow-indigo-100 shadow-xl"></div>
      <p className="font-bold text-slate-700 text-lg tracking-tight animate-pulse">Cargando experiencia...</p>
    </div>
  </div>
);

const PublicLayout = ({ children }) => (
  <>
    {children}
    <ContactForm />
    <Foter />
    <CartButton />
    <CartDrawer />
    <WhatsAppButton />
  </>
);

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route
              path="/producto/:id"
              element={
                <PublicLayout>
                  <ProductoDetalle />
                </PublicLayout>
              }
            />
            <Route
              path="/reservar"
              element={
                <PublicLayout>
                  <ReservaCita />
                </PublicLayout>
              }
            />
            <Route
              path="/admin"
              element={
                <Login onLogin={() => (window.location.href = "/dashboard")} />
              }
            />
            {/* Rutas de Profesionales */}
            <Route
              path="/profesional/login"
              element={
                <LoginProfesional onLogin={() => (window.location.href = "/profesional")} />
              }
            />
            <Route
              path="/profesional"
              element={<DashboardProfesional />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminReservas />} />
              <Route path="reservas" element={<AdminReservas />} />
              <Route path="bloqueos" element={<AdminBloqueos />} />
              <Route path="agenda" element={<AgendaCalendario />} />
              <Route path="comisiones" element={<AdminComisiones />} />
              <Route path="clientes" element={<AdminClientes />} />
              <Route path="servicios" element={<AdminServicios />} />
              <Route path="facturacion" element={<AdminFacturacion />} />
              <Route path="reportes" element={<AdminReportes />} />
              <Route path="usuarios" element={<AdminUsuariosProfesionales />} />
              <Route path="especialistas" element={<AdminEspecialistas />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;