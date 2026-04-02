import React from 'react';
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("admin_token");
  const lastLogin = localStorage.getItem("last_login");
  
  if (!token) {
    return <Navigate to="/admin" />;
  }

  try {
    const tokenData = JSON.parse(atob(token));
    const tokenAge = Date.now() - tokenData.timestamp;
    const maxAge = 24 * 60 * 60 * 1000;
    
    if (tokenAge > maxAge) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("last_login");
      localStorage.removeItem("CURRENT_USER_KEY");
      return <Navigate to="/admin" />;
    }
  } catch (e) {
    localStorage.removeItem("admin_token");
    return <Navigate to="/admin" />;
  }

  return children;
}