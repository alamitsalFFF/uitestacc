import React, { createContext, useContext, useState ,useCallback } from "react";
import LoginModal from "../Login/LoginModal";
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const showLoginModal = () => setLoginModalOpen(true);
  const hideLoginModal = () => setLoginModalOpen(false);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("userToken", newToken);
    hideLoginModal();
  };
  const logout = () => {
  setToken(null);
  localStorage.removeItem("userToken");
};

  return (
    // <AuthContext.Provider value={{ token, setToken, showLoginModal, login }}>
    <AuthContext.Provider value={{ 
      token, setToken, showLoginModal, hideLoginModal, login, logout 
      }}>
      {children}
      <LoginModal open={isLoginModalOpen} onSuccess={login} />
    </AuthContext.Provider>
  );
}