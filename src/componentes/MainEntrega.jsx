import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Shield,
  Package,
  Phone,
  Mail,
  MapPin,
  Flower2,
} from "lucide-react";

const MainEntrega = () => {
  return (
    <section
      id="entrega"
      className="py-24 relative overflow-hidden bg-slate-50"
    >
      {/* Decorativos */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 bg-indigo-500"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 bg-violet-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl shadow-xl shadow-indigo-200 bg-gradient-to-br from-indigo-600 to-violet-600">
              <MapPin className="text-white" size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Contacto y Ubicación
            </h2>
          </div>
          <p className="text-xl max-w-2xl mx-auto text-slate-600 font-medium">
            Visítanos o contáctanos para reservar tu experiencia de belleza y
            bienestar en nuestro oasis urbano.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* CARD IZQUIERDA: Contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 p-8 md:p-10 rounded-3xl border border-slate-200 shadow-2xl bg-white/80 backdrop-blur-md"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                <Flower2 className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">
                Información de Contacto
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              {[
                {
                  icon: <Phone className="text-indigo-600" size={22} />,
                  title: "Teléfono",
                  main: "(601) 555-0123",
                  sub: "Atención inmediata 9AM-8PM",
                },
                {
                  icon: <Mail className="text-indigo-600" size={22} />,
                  title: "Email",
                  main: "reservas@dmspa.com",
                  sub: "Respondemos en menos de 2h",
                },
                {
                  icon: <MapPin className="text-indigo-600" size={22} />,
                  title: "Ubicación",
                  main: "Calle 22 Norte #5B-21",
                  sub: "Local 102, Cali, Valle",
                },
                {
                  icon: <Clock className="text-indigo-600" size={22} />,
                  title: "Horario General",
                  main: "Lunes a Sábado",
                  sub: "9:00 AM - 8:00 PM",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="p-3 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:border-indigo-200 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-slate-900 font-semibold">{item.main}</p>
                    <p className="text-sm text-slate-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Horarios Detallados */}
            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-indigo-500" size={20} />
                <h4 className="font-bold text-slate-800">Disponibilidad Semanal</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { dia: "Lun - Vie", hora: "9am - 8pm" },
                  { dia: "Sábados", hora: "9am - 6pm" },
                  { dia: "Domingos", hora: "10am - 4pm" },
                  { dia: "Festivos", hora: "10am - 2pm" },
                ].map((h, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center"
                  >
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                      {h.dia}
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {h.hora}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CARD DERECHA: Beneficios + Mapa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Beneficios */}
            <div className="grid gap-4">
              {[
                {
                  icon: <Clock className="text-white" size={20} />,
                  title: "Reserva Rápida",
                  desc: "Agenda en línea en 2 minutos",
                },
                {
                  icon: <Shield className="text-white" size={20} />,
                  title: "Cancelación Flexible",
                  desc: "Gratuita hasta 24h antes",
                },
              ].map((b, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border border-slate-200 shadow-xl bg-white/80 backdrop-blur-md flex items-center gap-5"
                >
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-100 flex-shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{b.title}</h4>
                    <p className="text-sm text-slate-600 font-medium">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* GOOGLE MAPS EMBED */}
            <div className="rounded-3xl border border-slate-200 shadow-2xl overflow-hidden bg-white">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Cómo llegar</h4>
                  <p className="text-xs text-slate-500 font-medium">Cali, Valle del Cauca</p>
                </div>
                <a
                  href="https://www.google.com/maps?q=Calle+22+Norte+%235B-21+Local+102,+Cali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  Abrir Mapa
                </a>
              </div>
              <iframe
                title="Ubicación DM Salud y Belleza"
                src="https://www.google.com/maps?q=Calle+22+Norte+%235B-21+Local+102,+Cali,+Valle+del+Cauca,+Colombia&output=embed"
                width="100%"
                height="280"
                className="grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>

        {/* Cta Final */}
        <div className="mt-20 text-center">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://wa.me/573001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-indigo-200 bg-gradient-to-r from-indigo-600 to-violet-600 group"
          >
            <Phone size={24} className="group-hover:rotate-12 transition-transform" />
            <span className="text-lg">Reservar por WhatsApp</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default MainEntrega;
