export const theme = {
  colors: {
    primary: "#e84a7f",
    primaryLight: "#ff6b9d",
    primaryDark: "#c73e68",
    primaryPale: "#ffeef3",
    
    secondary: "#ff8fab",
    accent: "#ff5a87",
    
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#06b6d4",
    
    textPrimary: "#831843",
    textSecondary: "#be185d",
    textLight: "#db2777",
    textMuted: "#9d174d",
    
    background: "#fff0f5",
    surface: "#ffffff",
    surfaceAlt: "#fff5f8",
    
    border: "#fbcfe8",
    borderLight: "#fce7f3",
  },
  
  gradients: {
    primary: "linear-gradient(135deg, #e84a7f 0%, #ff6b9d 50%, #ff8fab 100%)",
    primaryAlt: "linear-gradient(135deg, #ff6b9d 0%, #e84a7f 100%)",
    soft: "linear-gradient(180deg, #fff0f5 0%, #ffffff 50%, #fff5f8 100%)",
    card: "linear-gradient(145deg, #ffffff 0%, #fff5f8 100%)",
  },
  
  shadows: {
    sm: "0 2px 8px rgba(232, 74, 127, 0.15)",
    md: "0 4px 16px rgba(232, 74, 127, 0.2)",
    lg: "0 8px 30px rgba(232, 74, 127, 0.25)",
    xl: "0 15px 40px rgba(232, 74, 127, 0.3)",
    glow: "0 0 20px rgba(232, 74, 127, 0.4)",
  },
  
  animations: {
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    bounce: "bounce 1s infinite",
    spin: "spin 1s linear infinite",
  }
};

export default theme;
