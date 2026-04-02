import React from 'react';
// src/components/TicketPrint.jsx
import { useEffect, useRef, useMemo } from "react";
import {
  Printer,
  Calendar,
  Clock,
  User,
  Phone,
  Sparkles,
  DollarSign,
  Scissors,
} from "lucide-react";

const TicketPrint = ({ reserva, profesional, servicio, onClose }) => {
  const ticketRef = useRef(null);

  const codigoBarras = useMemo(() => {
    return Array.from({ length: 20 }, () =>
      Math.random() > 0.5 ? "|" : " ",
    ).join("");
  }, [reserva.codigo_reserva, reserva.id]);

  // Formatear fecha
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Formatear hora (eliminar segundos)
  const formatearHora = (horaStr) => {
    return horaStr.substring(0, 5);
  };

  // Imprimir ticket
  const imprimirTicket = () => {
    const contenidoTicket = ticketRef.current.innerHTML;

    const ventanaImpresion = window.open("", "_blank");
    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket - ${reserva.cliente_nombre}</title>
          <style>
            /* ESTILOS ESPECÍFICOS PARA IMPRESORA TÉRMICA */
            @page {
              size: 80mm 297mm; /* Ancho 80mm, alto automático */
              margin: 0;
            }
            
            body {
              font-family: 'Courier New', monospace;
              width: 72mm; /* Ancho imprimible */
              margin: 0 auto;
              padding: 2mm;
              background: white;
              color: black;
              font-size: 12px;
              line-height: 1.3;
            }
            
            .ticket {
              width: 100%;
            }
            
            .header {
              text-align: center;
              border-bottom: 1px dashed #000;
              padding-bottom: 5px;
              margin-bottom: 5px;
            }
            
            .business-name {
              font-size: 18px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            
            .slogan {
              font-size: 10px;
              margin-top: 2px;
            }
            
            .divider {
              border-top: 1px dashed #000;
              margin: 8px 0;
            }
            
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
            }
            
            .label {
              font-weight: bold;
            }
            
            .service-detail {
              margin: 8px 0;
              padding: 5px;
              border: 1px solid #000;
              border-radius: 3px;
            }
            
            .total {
              font-size: 16px;
              font-weight: bold;
              text-align: right;
              margin: 10px 0;
            }
            
            .footer {
              text-align: center;
              margin-top: 15px;
              border-top: 1px dashed #000;
              padding-top: 8px;
              font-size: 10px;
            }
            
            .barcode {
              font-family: 'Courier New', monospace;
              letter-spacing: 2px;
              font-size: 14px;
              margin: 10px 0;
              text-align: center;
            }
            
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          ${contenidoTicket}
          <script>
            window.onload = () => {
              window.print();
              // Cerrar ventana después de imprimir (opcional)
              // window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);

    ventanaImpresion.document.close();
  };

  return (
    <>
      {/* VISTA PREVIA DEL TICKET */}
      <div
        ref={ticketRef}
        className="ticket-preview bg-white p-4 font-mono"
        style={{
          maxWidth: "80mm",
          margin: "0 auto",
          fontFamily: "'Courier New', monospace",
          fontSize: "12px",
        }}
      >
        {/* HEADER - Información del negocio */}
        <div className="text-center border-b border-black border-dashed pb-2 mb-2">
          <h1 className="text-xl font-bold uppercase tracking-wider">
            SPA & SALÓN
          </h1>
          <p className="text-xs mt-1">Belleza y Bienestar</p>
          <p className="text-xs">Tel: (123) 456-7890</p>
          <p className="text-xs">Av. Principal #123, Ciudad</p>
          <p className="text-xs">RUC: 123456789-0</p>
        </div>

        {/* TÍTULO DEL TICKET */}
        <div className="text-center mb-3">
          <p className="text-sm font-bold uppercase tracking-widest">
            COMPROBANTE DE SERVICIO
          </p>
          <p className="text-xs">
            #{reserva.codigo_reserva || reserva.id.slice(-8)}
          </p>
        </div>

        {/* FECHA Y HORA */}
        <div className="mb-3">
          <div className="flex justify-between text-xs">
            <span className="font-bold">Fecha:</span>
            <span>{formatearFecha(reserva.fecha)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-bold">Hora:</span>
            <span>{formatearHora(reserva.hora)} hrs</span>
          </div>
        </div>

        {/* LÍNEA SEPARADORA */}
        <div className="border-t border-black border-dashed my-2"></div>

        {/* DATOS DEL CLIENTE */}
        <div className="mb-3">
          <p className="font-bold text-xs mb-1">CLIENTE:</p>
          <div className="flex justify-between text-xs">
            <span>{reserva.cliente_nombre}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Tel: {reserva.cliente_telefono}</span>
          </div>
          {reserva.cliente_email && (
            <div className="flex justify-between text-xs">
              <span>Email: {reserva.cliente_email}</span>
            </div>
          )}
        </div>

        {/* LÍNEA SEPARADORA */}
        <div className="border-t border-black border-dashed my-2"></div>

        {/* DETALLE DEL SERVICIO */}
        <div className="mb-3">
          <p className="font-bold text-xs mb-2">DETALLE DEL SERVICIO:</p>
          <div className="service-detail border border-black p-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold">
                {servicio?.nombre || reserva.servicio_nombre}
              </span>
              <span>
                ${parseFloat(reserva.precio_total || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Duración:</span>
              <span>{reserva.duracion_estimada || 60} minutos</span>
            </div>
            {servicio?.descripcion && (
              <p className="text-xs mt-1 italic">{servicio.descripcion}</p>
            )}
          </div>
        </div>

        {/* PROFESIONAL ASIGNADO */}
        <div className="mb-3">
          <div className="flex justify-between text-xs">
            <span className="font-bold">Profesional:</span>
            <span>{profesional?.nombre || "Por asignar"}</span>
          </div>
        </div>

        {/* LÍNEA SEPARADORA */}
        <div className="border-t border-black border-dashed my-2"></div>

        {/* TOTAL */}
        <div className="total-section mb-3">
          <div className="flex justify-between text-sm font-bold">
            <span>TOTAL A PAGAR:</span>
            <span>
              ${parseFloat(reserva.precio_total || 0).toLocaleString()}
            </span>
          </div>
          {reserva.metodo_pago && (
            <div className="flex justify-between text-xs mt-1">
              <span>Método de pago:</span>
              <span className="uppercase">{reserva.metodo_pago}</span>
            </div>
          )}
        </div>

        {/* CÓDIGO DE BARRAS SIMULADO */}
        <div className="barcode text-center my-3 font-mono">
          {codigoBarras}
        </div>
        <div className="text-center text-xs font-mono mb-2">
          {reserva.codigo_reserva || reserva.id}
        </div>

        {/* FOOTER */}
        <div className="footer text-center mt-4 pt-2 border-t border-black border-dashed">
          <p className="text-xs font-bold">¡GRACIAS POR SU PREFERENCIA!</p>
          <p className="text-xs mt-1">Este comprobante es válido para</p>
          <p className="text-xs">reclamar el servicio en la fecha indicada</p>
          <p className="text-xs mt-2">Síguenos en @spaysalon</p>
          <p className="text-xs">www.spaysalon.com</p>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex justify-center gap-4 mt-6 no-print">
        <button
          onClick={imprimirTicket}
          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
        >
          <Printer size={20} />
          Imprimir Ticket
        </button>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
        >
          Cerrar
        </button>
      </div>
    </>
  );
};

export default TicketPrint;
