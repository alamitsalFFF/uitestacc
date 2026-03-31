// RequireAuth.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function isTokenExpired(token) {
  if (!token) return true;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return true;

    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export default function RequireAuth({ children }) {
  const token = localStorage.getItem('userToken');
  const { showLoginModal } = useAuth();
  const location = useLocation();

  if (!token) {
    // ยังไม่ login เลย ให้ไปหน้า LoginForm
    return <Navigate to="/uitestacc/Login" state={{ from: location }} replace />;
  }

  if (isTokenExpired(token)) {
    // login แล้วแต่ token หมดอายุ ให้เด้ง LoginModal
    showLoginModal();
    return null;
  }

  return children;
}