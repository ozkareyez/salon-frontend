import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEnviado(true);
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        mensaje: "",
      });
      setTimeout(() => setEnviado(false), 5000);
    } catch (err) {
      setError("Error al enviar el mensaje. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-20 px-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100 relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 mb-4">
            <MessageSquare className="text-indigo-600" size={28} />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-3">
            Contáctanos
          </h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            Cuéntanos tus dudas y te responderemos en el menor tiempo posible.
          </p>
        </div>

        {enviado && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 p-4 rounded-2xl flex items-center gap-3 bg-emerald-50 border border-emerald-100 shadow-sm"
          >
            <div className="p-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200">
              <CheckCircle size={18} className="text-white" />
            </div>
            <p className="text-emerald-800 font-bold text-sm">
              ¡Mensaje enviado con éxito! Te contactaremos pronto.
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 p-4 rounded-2xl flex items-center gap-3 bg-rose-50 border border-rose-100 shadow-sm"
          >
            <div className="p-2 rounded-full bg-rose-500 shadow-lg shadow-rose-200">
              <AlertCircle size={18} className="text-white" />
            </div>
            <p className="text-rose-800 font-bold text-sm">
              {error}
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">
                Nombre completo
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 font-medium shadow-inner-sm"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">
                Correo electrónico
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 font-medium shadow-inner-sm"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">
              Teléfono
            </label>
            <div className="relative group">
              <Phone
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 font-medium shadow-inner-sm"
                placeholder="300 123 4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">
              Mensaje
            </label>
            <div className="relative group">
              <MessageSquare
                className="absolute left-4 top-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows="4"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 font-medium shadow-inner-sm resize-none"
                placeholder="Cuéntanos cómo podemos ayudarte..."
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={enviando}
            className="w-full py-5 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            {enviando ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="animate-spin" size={22} />
                <span>Enviando mensaje...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Send size={22} />
                <span className="text-lg">Enviar mensaje</span>
              </div>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactForm;
