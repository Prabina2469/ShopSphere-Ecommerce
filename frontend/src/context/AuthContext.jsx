import { createContext, useContext, useEffect, useState } from "react";
import { api, setTokens, clearTokens } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("shopsphere_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  function persistSession(data) {
    setTokens(data);
    const nextUser = { id: data.userId, name: data.name, email: data.email, role: data.role };
    localStorage.setItem("shopsphere_user", JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  }

  async function register({ name, email, password }) {
    const data = await api.register({ name, email, password });
    return persistSession(data);
  }

  async function login({ email, password }) {
    const data = await api.login({ email, password });
    return persistSession(data);
  }

  async function logout() {
    await api.logout();
    clearTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, isAdmin: user?.role === "ADMIN" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
