import React from 'react';
import { useState, useEffect, useMemo } from "react";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Shield,
  LogIn,
  AlertCircle,
  Flower2,
  Sparkles,
  Settings,
  KeyRound,
  Save,
  X,
} from "lucide-react";

const USERS_KEY = "dm_spa_admin_users";
const CURRENT_USER_KEY = "dm_spa_current_user";

const getStoredUsers = () => {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return "dm_" + Math.abs(hash).toString(16) + "_" + password.length;
};

const hashPasswordSimple = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

const initializeDefaultUser = () => {
  const users = getStoredUsers();
  if (users.length === 0) {
    const defaultUser = {
      id: 1,
      username: "oscar",
      password: hashPassword("811012"),
      nombre: "Administrador",
      role: "admin",
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
    return defaultUser;
  }
  return users[0];
};

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [intentos, setIntentos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  useEffect(() => {
    initializeDefaultUser();
  }, []);

  useEffect(() => {
    if (!bloqueado) return;

    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setBloqueado(false);
          setIntentos(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [bloqueado]);

  const particulas = useMemo(() => 
    [...Array(20)].map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    })), []
  );

  const autenticar = async (e) => {
    e.preventDefault();
    setError("");

    if (!usuario.trim() || !password.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (bloqueado) {
      setError(`Demasiados intentos. Intenta nuevamente en ${tiempoRestante} segundos`);
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const users = getStoredUsers();
    const userFound = users.find(
      (u) => u.username.toLowerCase() === usuario.toLowerCase()
    );

    if (userFound && userFound.password === hashPassword(password)) {
      userFound.lastLogin = new Date().toISOString();
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userFound));
      
      const token = btoa(JSON.stringify({ 
        userId: userFound.id, 
        username: userFound.username,
        timestamp: Date.now() 
      }));
      localStorage.setItem("admin_token", token);
      localStorage.setItem("last_login", new Date().toISOString());
      
      setIntentos(0);
      onLogin(true);
    } else {
      const nuevosIntentos = intentos + 1;
      setIntentos(nuevosIntentos);

      if (nuevosIntentos >= 3) {
        setBloqueado(true);
        setTiempoRestante(30);
        setError("Demasiados intentos fallidos. Cuenta bloqueada por 30 segundos");
      } else {
        setError(`Usuario o contraseña incorrectos. Intentos restantes: ${3 - nuevosIntentos}`);
      }
    }

    setLoading(false);
  };

  const cambiarPassword = (e) => {
    e.preventDefault();
    setChangePasswordError("");
    setChangePasswordSuccess(false);

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setChangePasswordError("Completa todos los campos");
      return;
    }

    if (newPassword.length < 4) {
      setChangePasswordError("La nueva contraseña debe tener al menos 4 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError("Las contraseñas no coinciden");
      return;
    }

    const users = getStoredUsers();
    const currentUser = users.find(
      (u) => u.username.toLowerCase() === usuario.toLowerCase()
    );

    if (!currentUser || currentUser.password !== hashPassword(currentPassword)) {
      setChangePasswordError("La contraseña actual es incorrecta");
      return;
    }

    currentUser.password = hashPassword(newPassword);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    
    setChangePasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    setTimeout(() => {
      setShowChangePassword(false);
      setChangePasswordSuccess(false);
    }, 2000);
  };

  const formatoTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs < 10 ? "0" : ""}${segs}`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #fff5f7 40%, #ffeef2 70%, #ffe4e8 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{ background: "rgba(245, 169, 184, 0.15)" }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{ background: "rgba(232, 155, 176, 0.15)" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(245, 169, 184, 0.08)" }}></div>
        
        {particulas.map((p) => (
          <div key={p.id} className="absolute w-1 h-1 rounded-full" style={{ background: "rgba(245, 169, 184, 0.4)", top: `${p.top}%`, left: `${p.left}%`, animation: `float ${p.duration}s linear infinite`, animationDelay: `${p.delay}s` }} />
        ))}
        
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9zm0 30c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9zM20 45c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5z' fill='%23f5a9b8' fill-opacity='0.3'/%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden" style={{ border: "1px solid rgba(245, 169, 184, 0.3)", boxShadow: "0 25px 50px -12px rgba(245, 169, 184, 0.25)" }}>
          <div className="p-8 text-center border-b" style={{ borderColor: "rgba(245, 169, 184, 0.2)", background: "linear-gradient(135deg, rgba(245, 169, 184, 0.08), rgba(232, 155, 176, 0.03))" }}>
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300" style={{ background: "linear-gradient(135deg, #f5a9b8, #e89bb0)", boxShadow: "0 8px 20px rgba(245, 169, 184, 0.4)" }}>
              <Shield className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-bold" style={{ background: "linear-gradient(90deg, #f5a9b8, #e89bb0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Panel Administrativo
            </h1>
            <p className="mt-2 text-sm font-light tracking-wide" style={{ color: "#b88d9a" }}>
              Sistema de gestión • DM Salud y Belleza
            </p>
            <div className="flex justify-center gap-1 mt-3">
              <Flower2 size={14} style={{ color: "#f5a9b8" }} />
              <Sparkles size={14} style={{ color: "#e89bb0" }} />
              <Flower2 size={14} style={{ color: "#f5a9b8" }} />
            </div>
          </div>

          {showChangePassword ? (
            <form onSubmit={cambiarPassword} className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "#831843" }}>Cambiar Contraseña</h2>
                <button type="button" onClick={() => setShowChangePassword(false)} className="p-2 rounded-lg hover:bg-rose-50 transition-colors">
                  <X size={20} style={{ color: "#e84a7f" }} />
                </button>
              </div>

              {changePasswordError && (
                <div className="mb-4 p-3 rounded-xl border border-red-300/30" style={{ background: "rgba(245, 169, 184, 0.1)" }}>
                  <div className="flex items-center gap-2" style={{ color: "#dc2626" }}>
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">{changePasswordError}</span>
                  </div>
                </div>
              )}

              {changePasswordSuccess && (
                <div className="mb-4 p-3 rounded-xl border border-green-300/30" style={{ background: "rgba(34, 197, 94, 0.1)" }}>
                  <div className="flex items-center gap-2" style={{ color: "#16a34a" }}>
                    <Sparkles size={16} />
                    <span className="text-sm font-medium">¡Contraseña actualizada correctamente!</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#9b6b7a" }}>Usuario</label>
                  <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} className="w-full border rounded-xl px-4 py-3" style={{ background: "#f9f9f9", borderColor: "rgba(245, 169, 184, 0.3)", color: "#9b6b7a" }} placeholder="Tu usuario" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#9b6b7a" }}>Contraseña Actual</label>
                  <div className="relative">
                    <input type={mostrarPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border rounded-xl pl-10 pr-12 py-3" style={{ background: "white", borderColor: "rgba(245, 169, 184, 0.3)", color: "#9b6b7a" }} placeholder="Contraseña actual" />
                    <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {mostrarPassword ? <EyeOff size={20} style={{ color: "#f5a9b8" }} /> : <Eye size={20} style={{ color: "#f5a9b8" }} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#9b6b7a" }}>Nueva Contraseña</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border rounded-xl px-4 py-3" style={{ background: "white", borderColor: "rgba(245, 169, 184, 0.3)", color: "#9b6b7a" }} placeholder="Mínimo 4 caracteres" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#9b6b7a" }}>Confirmar Nueva Contraseña</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border rounded-xl px-4 py-3" style={{ background: "white", borderColor: "rgba(245, 169, 184, 0.3)", color: "#9b6b7a" }} placeholder="Repite la nueva contraseña" />
                </div>
              </div>

              <button type="submit" className="w-full mt-6 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, #f5a9b8, #e89bb0)", boxShadow: "0 8px 20px rgba(245, 169, 184, 0.4)" }}>
                <div className="flex items-center justify-center gap-2">
                  <Save size={20} />
                  <span>Guardar Nueva Contraseña</span>
                </div>
              </button>
            </form>
          ) : (
            <form onSubmit={autenticar} className="p-8">
              {error && (
                <div className={`mb-6 p-4 rounded-xl border ${bloqueado ? "border-red-300/30" : "border-amber-300/30"}`} style={{ background: bloqueado ? "rgba(245, 169, 184, 0.1)" : "rgba(245, 169, 184, 0.08)" }}>
                  <div className="flex items-center gap-3">
                    <AlertCircle size={20} style={{ color: bloqueado ? "#dc2626" : "#d97706" }} />
                    <span className="font-medium" style={{ color: bloquequeado ? "#dc2626" : "#92400e" }}>{error}</span>
                  </div>
                </div>
              )}

              {bloqueado && (
                <div className="mb-6 p-4 rounded-xl" style={{ background: "rgba(245, 169, 184, 0.15)", border: "1px solid rgba(245, 169, 184, 0.3)" }}>
                  <div className="text-center">
                    <div className="font-bold text-2xl mb-2" style={{ color: "#f5a9b8" }}>{formatoTiempo(tiempoRestante)}</div>
                    <p className="text-sm" style={{ color: "#b88d9a" }}>Tiempo restante para desbloquear</p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: "#9b6b7a" }}>Usuario</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={20} style={{ color: "#f5a9b8" }} />
                  </div>
                  <input type="text" placeholder="Ingresa tu usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} disabled={bloqueado || loading} className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 disabled:opacity-50" style={{ background: "white", borderColor: "rgba(245, 169, 184, 0.3)", color: "#9b6b7a" }} />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: "#9b6b7a" }}>Contraseña</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} style={{ color: "#f5a9b8" }} />
                  </div>
                  <input type={mostrarPassword ? "text" : "password"} placeholder="Ingresa tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} disabled={bloqueado || loading} className="w-full border rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2 disabled:opacity-50" style={{ background: "white", borderColor: "rgba(245, 169, 184, 0.3)", color: "#9b6b7a" }} />
                  <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} disabled={bloqueado || loading} className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50">
                    {mostrarPassword ? <EyeOff size={20} style={{ color: "#f5a9b8" }} /> : <Eye size={20} style={{ color: "#f5a9b8" }} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={bloqueado || loading || !usuario.trim() || !password.trim()} className="group relative w-full text-white font-bold py-3 px-4 rounded-xl shadow-lg disabled:opacity-50 transition-all duration-300 transform hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, #f5a9b8, #e89bb0)", boxShadow: "0 8px 20px rgba(245, 169, 184, 0.4)" }}>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verificando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <LogIn size={20} />
                    <span>Acceder al Sistema</span>
                  </div>
                )}
              </button>

              <div className="mt-4 text-center">
                <button type="button" onClick={() => setShowChangePassword(true)} className="text-sm flex items-center justify-center gap-2 mx-auto transition-colors hover:opacity-80" style={{ color: "#e84a7f" }}>
                  <KeyRound size={16} />
                  <span>Cambiar mi contraseña</span>
                </button>
              </div>
            </form>
          )}

          <div className="px-8 py-6 border-t" style={{ background: "linear-gradient(90deg, rgba(245, 169, 184, 0.05), rgba(232, 155, 176, 0.02))", borderColor: "rgba(245, 169, 184, 0.15)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full animate-ping absolute" style={{ background: "#f5a9b8" }}></div>
                  <div className="w-2 h-2 rounded-full relative" style={{ background: "#f5a9b8" }}></div>
                </div>
                <span className="text-sm tracking-wide" style={{ color: "#b88d9a" }}>Sistema protegido</span>
              </div>
              <div className="flex items-center gap-2">
                <Flower2 size={14} style={{ color: "#f5a9b8" }} />
                <span className="text-xs" style={{ color: "#c89aab" }}>v2.1.0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm tracking-wide flex items-center justify-center gap-2" style={{ color: "#b88d9a" }}>
            <span>🌸</span>
            <span>DM Salud y Belleza • Bienestar Natural</span>
            <span>🌸</span>
          </p>
          <p className="text-xs mt-2" style={{ color: "#c89aab" }}>© {new Date().getFullYear()} Todos los derechos reservados</p>
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