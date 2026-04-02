import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Star,
  Phone,
  Clock,
  Calendar,
  Menu,
  Crown,
  Flower2,
} from "lucide-react";

import logoSpa from "../assets/logo/logosalon.png";

import spa1 from "../assets/cta/spa1.jpg";
import spa2 from "../assets/cta/spa2.jpg";
import spa3 from "../assets/cta/spa3.jpg";

const generarParticulas = () =>
  [...Array(20)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 5 + 5,
    delay: Math.random() * 2,
  }));

const slides = [
  {
    img: spa1,
    title: "Experiencia Spa Natural",
    subtitle:
      "Descubre la conexión con la naturaleza en nuestro oasis de bienestar",
    highlight: "Renovación natural",
    ctaText: "Ver Tratamientos",
    icon: <Flower2 size={32} />,
  },
  {
    img: spa2,
    title: "Tratamientos Faciales",
    subtitle:
      "Recupera el brillo natural de tu piel con ingredientes orgánicos",
    highlight: "30% de descuento primera visita",
    ctaText: "Agendar Cita",
    icon: <Sparkles size={32} />,
  },
  {
    img: spa3,
    title: "Día de Spa Natural",
    subtitle:
      "Masajes, faciales y más en un paquete exclusivo con ingredientes naturales",
    highlight: "Pack completo $199.900",
    ctaText: "Reservar Ahora",
    icon: <Crown size={32} />,
  },
];

const scrollToId = (id) => {
  const idMap = {
    categorias: "seccion-categorias",
    nosotros: "seccion-nosotros",
    entrega: "entrega",
    servicios: "seccion-servicios",
    reservas: "seccion-categorias", // fallback
    hero: null,
  };

  if (id === "hero" || id === "inicio") {
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const domId = idMap[id] ?? id;
  const el = document.getElementById(domId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const MainCTA = ({ onNavigate }) => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const particulas = useMemo(() => generarParticulas(), []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      setScrollProgress(0);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setScrollProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 100 / 120;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [current, isHovered]);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setScrollProgress(0);
  }, []);
  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setScrollProgress(0);
  }, []);
  const goToSlide = useCallback((index) => {
    setCurrent(index);
    setScrollProgress(0);
  }, []);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      setTimeout(() => scrollToId(sectionId), 50);
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-slate-50 overflow-x-clip"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          {particulas.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-px h-px rounded-full bg-indigo-500/20"
              initial={{
                x: p.x + "vw",
                y: p.y + "vh",
                opacity: 0,
              }}
              animate={{ y: `-100vh`, opacity: [0, 0.4, 0] }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
              }}
            />
          ))}
        </div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl bg-indigo-500/5"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl bg-violet-500/5"></div>
      </div>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 shadow-sm bg-white/95 backdrop-blur-xl border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo y Nombre */}
            <div className="flex items-center gap-3 md:gap-4 flex-1 md:flex-none">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => scrollToSection("hero")}
                className="flex items-center gap-3 md:gap-4 cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-150"></div>
                  <img
                    src={logoSpa}
                    alt="DM Salud y Belleza"
                    className="h-14 md:h-24 w-auto relative object-contain drop-shadow-md"
                  />
                </div>
                <div className="text-left">
                  <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    DM Salud y Belleza
                  </h1>
                  <p className="hidden md:block text-sm text-slate-500 font-medium">
                    Belleza & Bienestar
                  </p>
                </div>
              </motion.button>
            </div>

            {/* Info Desktop (Hidden on Mobile) */}
            <div className="hidden lg:flex items-center gap-6 mr-8">
              {[
                {
                  icon: <Clock size={16} className="text-indigo-500" />,
                  label: "Horario",
                  value: "09:00 AM - 08:00 PM",
                },
                {
                  icon: <Phone size={16} className="text-indigo-500" />,
                  label: "Reservas",
                  value: "(601) 555-0123",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      {item.label}
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón Menú Móvil Moderno */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="group p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
              >
                {mobileMenuOpen ? <Sparkles size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Navegación Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              {["categorias", "nosotros", "entrega"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors group capitalize text-sm relative"
                >
                  <span className="relative z-10">
                    {section === "entrega"
                      ? "Contacto"
                      : section.charAt(0).toUpperCase() + section.slice(1)}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
              <button
                onClick={() => scrollToSection("reservas")}
                className="group relative px-6 py-2.5 text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-white bg-gradient-to-r from-indigo-600 to-violet-600 overflow-hidden hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <span className="relative flex items-center gap-2">
                  <Calendar size={18} />
                  <span>Reservar</span>
                </span>
              </button>
            </nav>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed z-50 left-0 right-0 top-[76px] shadow-2xl rounded-b-[2rem] bg-white border-t border-slate-100 overflow-hidden md:hidden"
            >
              <div className="p-6 space-y-3 max-w-7xl mx-auto">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">MENÚ PRINCIPAL</p>
                {[
                  { id: "hero", label: "Inicio", icon: <HomeIcon size={18} /> },
                  { id: "categorias", label: "Servicios", icon: <ShoppingBag size={18} /> },
                  { id: "nosotros", label: "Nosotros", icon: <Heart size={18} /> },
                  { id: "entrega", label: "Contacto", icon: <Truck size={18} /> },
                ].map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="flex items-center gap-4 py-3.5 px-4 font-semibold text-left w-full rounded-2xl transition-all duration-200 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 active:scale-95"
                  >
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-indigo-500">
                      {icon}
                    </div>
                    <span>{label}</span>
                  </button>
                ))}
                
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <button
                    onClick={() => scrollToSection("reservas")}
                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold w-full text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-transform"
                  >
                    <Calendar size={20} />
                    <span>Agendar Cita Ahora</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex gap-4">
                    <div className="p-2 rounded-full border border-slate-100 text-slate-400">
                      <Phone size={16} />
                    </div>
                    <div className="p-2 rounded-full border border-slate-100 text-slate-400">
                      <Sparkles size={16} />
                    </div>
                  </div>
                  <p className="text-[10px] font-medium text-slate-400">DM Salud y Belleza © 2024</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-40">
        <div className="relative h-[80vh] md:h-[85vh] rounded-3xl shadow-2xl border-4 border-white overflow-hidden bg-slate-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0">
                <img
                  src={slides[current].img}
                  alt={slides[current].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              </div>

              <div className="absolute inset-0 flex items-center">
                <div className="px-6 md:px-12 lg:px-16 max-w-2xl">
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-3 mb-6"
                  >
                    <div className="p-3 backdrop-blur-md rounded-xl shadow-lg border border-white/20 bg-white/10 text-white">
                      {slides[current].icon}
                    </div>
                    <span className="font-bold text-lg text-indigo-200 tracking-wide">
                      {slides[current].highlight}
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight"
                  >
                    <span className="text-white">
                      {slides[current].title.split(" ")[0]}
                    </span>
                    <br />
                    <span className="text-slate-200">
                      {slides[current].title.split(" ").slice(1).join(" ")}
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl font-medium"
                  >
                    {slides[current].subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex flex-col sm:flex-row gap-4"
                  >
                    <button
                      onClick={() => scrollToSection("categorias")}
                      className="group relative px-8 py-4 text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-indigo-600/30 overflow-hidden bg-indigo-600 hover:bg-indigo-500"
                    >
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      <span className="relative flex items-center justify-center gap-3">
                        {slides[current].ctaText}
                        <ArrowRight
                          className="group-hover:translate-x-1 transition-transform"
                          size={20}
                        />
                      </span>
                    </button>
                    <button
                      onClick={() => scrollToSection("entrega")}
                      className="group relative px-8 py-4 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      <span className="relative">Consultar horarios</span>
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 flex flex-wrap gap-6"
                  >
                    {[
                      { value: "4.9", label: "Rating", icon: <Star size={18} /> },
                      { value: "12+", label: "Años", icon: <Sparkles size={18} /> },
                      { value: "8k+", label: "Clientas", icon: <Heart size={18} /> },
                      { value: "18", label: "Expertas", icon: <Flower2 size={18} /> },
                    ].map((stat, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="p-2.5 backdrop-blur-md rounded-xl bg-white/10 border border-white/20 text-indigo-300">
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white tracking-wide">
                            {stat.value}
                          </p>
                          <p className="text-sm font-medium text-slate-300">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-900/50">
                <motion.div
                  className="h-full bg-indigo-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${scrollProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {isHovered && (
              <>
                {[
                  { dir: "left", action: prevSlide, Icon: ChevronLeft, pos: "left-6" },
                  { dir: "right", action: nextSlide, Icon: ChevronRight, pos: "right-6" },
                ].map(({ dir, action, Icon, pos }) => (
                  <motion.button
                    key={dir}
                    initial={{ x: dir === "left" ? -20 : 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: dir === "left" ? -20 : 20, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action}
                    className={`absolute ${pos} top-1/2 transform -translate-y-1/2 p-4 backdrop-blur-xl rounded-2xl shadow-xl z-20 bg-white/90 text-slate-800 hover:text-indigo-600 transition-colors border border-white/50`}
                  >
                    <Icon size={28} />
                  </motion.button>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-3 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="group flex flex-col items-center"
            >
              <div
                className={`w-12 h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "bg-indigo-600" : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
              <span
                className={`mt-2 text-xs font-bold font-mono transition-colors ${
                  i === current ? "text-indigo-600 scale-110" : "text-slate-400"
                }`}
              >
                0{i + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
      >
        <button
          onClick={() => scrollToSection("categorias")}
          className="flex flex-col items-center gap-3 group cursor-pointer"
        >
          <span className="text-sm font-semibold tracking-wide text-slate-500 group-hover:text-indigo-600 transition-colors">
            Explora tratamientos
          </span>
          <div className="w-px h-16 relative bg-gradient-to-b from-indigo-200 to-transparent">
            <div className="absolute inset-0 animate-bounce bg-gradient-to-b from-indigo-500/50 to-transparent"></div>
          </div>
        </button>
      </motion.div>
    </section>
  );
};

export default MainCTA;
