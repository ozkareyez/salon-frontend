import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Leaf,
  Flower2,
  Sparkles,
  Heart,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

import logoSpa from "../assets/logo/logosalon.png";

const Foter = ({ className }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer
      className={`relative pt-16 pb-8 overflow-hidden bg-slate-50 border-t border-slate-200 ${className || ""}`}
    >
      {/* FONDO DECORATIVO SUAVE */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-30 bg-indigo-500/10"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-30 bg-violet-500/10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* COLUMNA 1: LOGO */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <img
                  src={logoSpa}
                  alt="DM Salud y Belleza"
                  className="w-16 h-16 object-contain drop-shadow-sm"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  DM Salud y Belleza
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Belleza & Bienestar
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="leading-relaxed text-slate-600"
            >
              La mejor experiencia en belleza y bienestar. Tratamientos
              exclusivos que realzan tu belleza natural desde la primera visita.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6"
            >
              {[
                { value: "4.9", label: "Rating" },
                { value: "12+", label: "Años" },
                { value: "8k+", label: "Clientas" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {stat.value}
                  </div>
                  <div className="text-xs mt-1 text-slate-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* COLUMNA 2: NAVEGACIÓN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100">
                <Flower2 className="text-indigo-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Navegación
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { to: "/", label: "Inicio", icon: <Leaf size={16} /> },
                { to: "/categorias", label: "Categorías", icon: <Flower2 size={16} /> },
                { to: "/servicios", label: "Todos los Servicios", icon: <Sparkles size={16} /> },
                { to: "/nosotros", label: "Sobre Nosotros", icon: <Heart size={16} /> },
                { to: "/contacto", label: "Contacto", icon: <Phone size={16} /> },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={link.to}
                  className="flex items-center gap-3 transition-colors group text-slate-600 hover:text-indigo-600"
                >
                  <div className="transition-colors text-slate-400 group-hover:text-indigo-500">
                    {link.icon}
                  </div>
                  <span className="relative font-medium">
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* COLUMNA 3: CONTACTO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-violet-50 border border-violet-100">
                <MapPin className="text-violet-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Información
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { icon: <MapPin size={18} />, title: "Ubicación", content: "Cali 22 Norte #5B-21 Local 102" },
                { icon: <Phone size={18} />, title: "Teléfono", content: "(601) 555-0123" },
                { icon: <Clock size={18} />, title: "Horarios", content: "Lun-Dom: 09:00 AM - 08:00 PM" },
                { icon: <Mail size={18} />, title: "Email", content: "reservas@dmsaludybelleza.com" },
              ].map((info, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 text-indigo-500">{info.icon}</div>
                  <div>
                    <p className="font-bold text-sm text-slate-700">
                      {info.title}
                    </p>
                    <p className="text-sm mt-0.5 text-slate-500">
                      {info.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* COLUMNA 4: NEWSLETTER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100">
                <Send className="text-indigo-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Newsletter
              </h3>
            </div>
            <p className="text-sm mb-6 text-slate-600">
              Suscríbete y sé la primera en recibir nuestras promociones y
              novedades.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu email aquí"
                  className="w-full rounded-xl pl-4 pr-12 py-3 bg-white border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm transition-all"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all shadow-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <Send size={18} />
                </button>
              </div>
              {subscribed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 rounded-lg text-sm bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium font-sans"
                >
                  ¡Gracias por suscribirte! Pronto recibirás nuestras novedades.✨
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>

        <div className="h-px my-8 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

        {/* REDES SOCIALES Y COPYRIGHT */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6"
          >
            <p className="text-sm font-semibold text-slate-500">
              Síguenos:
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Heart, url: "https://instagram.com", label: "Instagram" },
                { icon: Star, url: "https://facebook.com", label: "Facebook" },
                { icon: Mail, url: "mailto:contacto@dmsaludybelleza.com", label: "Email" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
                  aria-label={social.label}
                >
                  <social.icon size={20} className="text-slate-600 group-hover:text-indigo-600 transition-colors" />
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-md border border-slate-200 bg-white text-slate-700 translate-y-2 group-hover:-translate-y-1 z-10">
                    {social.label}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-right"
          >
            <p className="text-sm text-slate-500 font-medium">
              © {new Date().getFullYear()} DM Salud y Belleza. Todos los
              derechos reservados.
            </p>
            <p className="text-xs mt-2 font-bold text-indigo-500 tracking-wide">
              ✨ Tu bienestar, nuestro arte
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Foter;
