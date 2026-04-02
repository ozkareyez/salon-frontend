import React from 'react';
import { Flower2 } from "lucide-react";

const LoadingSpinner = ({
  size = "md",
  text = "Cargando...",
  fullScreen = false,
}) => {
  // 🎨 PALETA DE COLORES CORPORATIVA
  const colors = {
    primary: "#2563eb",
    primaryLight: "#eff6ff",
    textSecondary: "#6b7280",
    background: "#f9fafb",
    white: "#ffffff",
  };

  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-[3px]",
    lg: "w-16 h-16 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
      />
      {text && <p className="text-sm font-medium text-gray-500">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.background }}
      >
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};

export default LoadingSpinner;
