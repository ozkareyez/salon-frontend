import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShoppingBag,
  Home as HomeIcon,
  Truck,
  Menu,
  X,
  Flower2,
  Waves,
  Mountain,
  Bird,
  Heart,
  User,
  Briefcase,
} from "lucide-react";

import API_BASE from "../config/api";
import MainCTA from "./MainCTA";
import Categorias from "./Categorias";
import Servicios from "./Servicios";
import MainEntrega from "./MainEntrega";

const HEADER_OFFSET = 90; // altura del header sticky

const Home = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [nombreCategoriaSeleccionada, setNombreCategoriaSeleccionada] =
    useState("");

  const emojisPorCategoria = {
    1: "🌸",
    2: "💇",
    3: "💅",
    4: "🛁",
    5: "✨",
    6: "👑",
  };

  const goTo = (sectionId) => {
    setMobileMenuOpen(false);

    if (sectionId === "inicio") {
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("inicio");
      return;
    }

    const idMap = {
      categorias: "seccion-categorias",
      nosotros: "seccion-nosotros",
      entrega: "entrega",
      servicios: "seccion-servicios",
    };

    const domId = idMap[sectionId] || sectionId;

    setTimeout(() => {
      const el = document.getElementById(domId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(sectionId);
      }
    }, 50);
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${API_BASE}/categorias`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setCategorias(result.data.sort((a, b) => a.id - b.id));
          }
        }
      } catch {
        setCategorias([
          {
            id: 1,
            nombre: "Tratamientos Faciales",
            product_count: 8,
            descripcion: "Rejuvenecimiento facial",
          },
          {
            id: 2,
            nombre: "Cortes y Peinados",
            product_count: 6,
            descripcion: "Cortes modernos",
          },
          {
            id: 3,
            nombre: "Manicure y Pedicure",
            product_count: 5,
            descripcion: "Cuidado de uñas",
          },
          {
            id: 4,
            nombre: "Spa y Masajes",
            product_count: 4,
            descripcion: "Masajes relajantes",
          },
          {
            id: 5,
            nombre: "Maquillaje",
            product_count: 7,
            descripcion: "Maquillaje profesional",
          },
          {
            id: 6,
            nombre: "Tratamientos Premium",
            product_count: 3,
            descripcion: "Servicios exclusivos",
          },
        ]);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 400);

      const ids = [
        "seccion-nosotros",
        "entrega",
        "seccion-servicios",
        "seccion-categorias",
      ];
      const sectionMap = {
        "seccion-nosotros": "nosotros",
        entrega: "entrega",
        "seccion-servicios": "categorias",
        "seccion-categorias": "categorias",
      };

      if (window.scrollY < 200) {
        setActiveSection("inicio");
        return;
      }

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(sectionMap[id]);
          return;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectCategoria = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
    const categoria = categorias.find((cat) => cat.id === categoriaId);
    if (categoria) setNombreCategoriaSeleccionada(categoria.nombre);
    setTimeout(() => goTo("servicios"), 100);
  };

  const handleReservarServicio = (servicio) => {
    alert(`Reservando: ${servicio.nombre}\nPrecio: $${servicio.precio}`);
  };

  const handleLimpiarCategoria = () => {
    setCategoriaSeleccionada(null);
    setNombreCategoriaSeleccionada("");
    goTo("categorias");
  };

  const navItems = [
    { id: "inicio", label: "Inicio", icon: <HomeIcon size={18} /> },
    { id: "categorias", label: "Servicios", icon: <ShoppingBag size={18} /> },
    { id: "nosotros", label: "Nosotros", icon: <Heart size={18} /> },
    { id: "entrega", label: "Contacto", icon: <Truck size={18} /> },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 overflow-x-clip">
      {/* ===== HEADER STICKY ===== */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isSticky ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 py-2.5 shadow-md bg-white/95 backdrop-blur-xl border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-1.5 rounded-xl cursor-pointer bg-indigo-50 border border-indigo-100 transition-colors hover:bg-indigo-100"
                onClick={() => goTo("inicio")}
              >
                <Sparkles size={20} className="text-indigo-600" />
              </motion.div>
              <span
                className="font-bold text-lg md:text-xl cursor-pointer bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
                onClick={() => goTo("inicio")}
              >
                DM SALUD Y BELLEZA
              </span>
            </div>

            {/* Menú desktop */}
            <div className="hidden lg:flex items-center gap-1.5">
              {navItems.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => goTo(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-semibold text-sm ${
                    activeSection === id
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {React.cloneElement(icon, { size: 16 })}
                  <span>{label}</span>
                </button>
              ))}
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <button
                onClick={() => navigate("/admin")}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <User size={18} />
              </button>
            </div>

            {/* Botón menú móvil */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MENÚ MÓVIL STICKY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[55] bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed z-[60] left-0 right-0 top-[68px] shadow-2xl rounded-b-[2.5rem] bg-white border-t border-slate-100 overflow-hidden lg:hidden"
            >
              <div className="p-6 space-y-3 max-w-7xl mx-auto">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">NAVEGACIÓN</p>
                {navItems.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => goTo(id)}
                    className={`flex items-center gap-4 py-3.5 px-4 font-bold text-left w-full rounded-2xl transition-all duration-200 ${
                      activeSection === id
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${activeSection === id ? "bg-white text-indigo-600" : "bg-slate-50 text-slate-400"}`}>
                      {icon}
                    </div>
                    <span>{label}</span>
                  </button>
                ))}
                
                <div className="pt-4 mt-2 border-t border-slate-100 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate("/profesional/login")}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold bg-violet-50 text-violet-700 border border-violet-100"
                  >
                    <Briefcase size={18} />
                    <span className="text-sm">Staff</span>
                  </button>
                  <button
                    onClick={() => navigate("/admin")}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  >
                    <User size={18} />
                    <span className="text-sm">Admin</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16 md:h-20"></div>

      {/* HERO */}
      <div id="hero">
        <MainCTA />
      </div>

      {/* CATEGORÍAS */}
      <section
        id="seccion-categorias"
        className="max-w-7xl mx-auto px-4 mt-10 scroll-mt-24"
      >
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-center mb-10"
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flower2 size={36} className="text-indigo-500" />
            <span className="text-slate-800">Nuestros Servicios</span>
            <Sparkles size={36} className="text-violet-500" />
          </div>
          <p className="text-lg font-medium mt-2 text-slate-500">
            Descubre tratamientos exclusivos para tu bienestar
          </p>
        </motion.h2>
        <Categorias
          onSelect={handleSelectCategoria}
          categoriaActiva={categoriaSeleccionada}
        />
      </section>

      {/* SERVICIOS */}
      {categoriaSeleccionada && (
        <section
          id="seccion-servicios"
          className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl border bg-indigo-50 border-indigo-100">
                  <span className="text-2xl">
                    {emojisPorCategoria[categoriaSeleccionada] || "🌸"}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                    {nombreCategoriaSeleccionada}
                  </h2>
                  <p className="mt-2 text-slate-600">
                    {
                      categorias.find((c) => c.id === categoriaSeleccionada)
                        ?.descripcion
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={handleLimpiarCategoria}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-200 hover:text-indigo-600"
              >
                <Flower2 size={18} />
                <span className="font-medium">Volver a Categorías</span>
              </button>
            </div>
            <Servicios
              categoriaId={categoriaSeleccionada}
              categoriaNombre={nombreCategoriaSeleccionada}
              onReservar={handleReservarServicio}
            />
          </motion.div>
        </section>
      )}

      {/* NOSOTROS */}
      <section
        id="seccion-nosotros"
        className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart size={36} className="text-violet-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Sobre Nosotros
            </h2>
          </div>
          <p className="text-lg max-w-3xl mx-auto mt-4 leading-relaxed text-slate-600">
            En DM Salud y Belleza, ofrecemos un espacio único donde la armonía,
            la relajación y los tratamientos de alta calidad se combinan para
            brindarte una experiencia transformadora.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: <Flower2 size={32} className="text-indigo-500" />,
                title: "Productos Naturales",
                desc: "Ingredientes orgánicos y libres de químicos",
              },
              {
                icon: <Sparkles size={32} className="text-violet-500" />,
                title: "Profesionales Certificados",
                desc: "Equipo altamente capacitado",
              },
              {
                icon: <Heart size={32} className="text-indigo-500" />,
                title: "Atención Personalizada",
                desc: "Tratamientos a tu medida",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-full bg-slate-50 border border-slate-100">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CONTACTO */}
      <section id="entrega" className="scroll-mt-24">
        <MainEntrega />
      </section>
    </div>
  );
};

export default Home;
