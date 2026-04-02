import React from 'react';
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Calendar,
} from "lucide-react";
import API_BASE from "../../config/api";

export default function LoginProfesional({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const particulas = useMemo(() => 
    [...Array(15)].map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    })), []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/profesional/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("profesional_token", data.data.token);
        localStorage.setItem("profesional_user", JSON.stringify(data.data.user));
        onLogin?.(true);
        navigate("/profesional");
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #fff5f7 40%, #ffeef2 70%, #ffe4e8 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(245, 169, 184, 0.15)" }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(232, 155, 176, 0.15)" }}></div>
        
        {particulas.map((p) => (
          <div key={p.id} className="absolute w-1 h-1 rounded-full" style={{ background: "rgba(245, 169, 184, 0.4)", top: `${p.top}%`, left: `${p.left}%`, animation: `float ${p.duration}s linear infinite`, animationDelay: `${p.delay}s` }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden" style={{ border: "1px solid rgba(245, 169, 184, 0.3)", boxShadow: "0 25px 50px -12px rgba(245, 169, 184, 0.25)" }}>
          <div className="p-8 text-center border-b" style={{ borderColor: "rgba(245, 169, 184, 0.2)", background: "linear-gradient(135deg, rgba(245, 169, 184, 0.08), rgba(232, 155, 176, 0.03))" }}>
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl shadow-lg" style={{ background: "linear-gradient(135deg, #f5a9b8, #e89bb0)", boxShadow: "0 8px 20px rgba(245, 169, 184, 0.4)" }}>
              <Calendar className="text-white" size={40} />
            </div>
            <h1 className="text-2xl font-bold" style={{ background: "linear-gradient(90deg, #f5a9b8, #e89bb0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Área Profesional
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#b88d9a" }}>
              Verifica tus citas y turnos asignados
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 p-4 rounded-xl border border-red-300/30" style={{ background: "rgba(245, 169, 184, 0.1)" }}>
                <div className="flex items-center gap-3" style={{ color: "#dc2626" }}>
                  <AlertCircle size={20} />
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: "#9b6b7a" }}>Usuario</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} style={{ color: "#f5a9b8" }} />
                </div>
                <input type="text" placeholder="Tu usuario" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 disabled:opacity-50" style={{ background: "white", borderColor: "rgba(245, 169, 184, 0.3)", color: "#9b6b7a" }} />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium mb-2" style={{ color: "#9b6b7a" }}>Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} style={{ color: "#f5a9b8" }} />
                </div>
                <input type={mostrarPassword ? "text" : "password"} placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="w-full border rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2 disabled:opacity-50" style={{ background: "white", borderColor: "rgba(245, 169, 184, 0.3)", color: "#9b6b7a" }} />
                <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} disabled={loading} className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50">
                  {mostrarPassword ? <EyeOff size={20} style={{ color: "#f5a9b8" }} /> : <Eye size={20} style={{ color: "#f5a9b8" }} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || !username.trim() || !password.trim()} className="w-full text-white font-bold py-3 px-4 rounded-xl shadow-lg disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, #f5a9b8, #e89bb0)", boxShadow: "0 8px 20px rgba(245, 169, 184, 0.4)" }}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn size={20} />
                  <span>Entrar</span>
                </div>
              )}
            </button>
          </form>

          <div className="px-8 py-4 border-t text-center" style={{ borderColor: "rgba(245, 169, 184, 0.15)" }}>
            <a href="/admin" className="text-sm" style={{ color: "#e84a7f" }}>
              ← Volver al admin
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: "#b88d9a" }}>
            DM Salud y Belleza
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}