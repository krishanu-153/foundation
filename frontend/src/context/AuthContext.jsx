import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("userToken");
    }
  };

  const loadAdmin = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    try {
      const { data } = await api.get("/admin/auth/me");
      setAdmin(data.admin);
    } catch {
      localStorage.removeItem("adminToken");
    }
  };

  useEffect(() => {
    Promise.all([loadUser(), loadAdmin()]).finally(() => setLoading(false));
  }, []);

  const loginUser = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("userToken", data.token);
    setUser(data.user);
    return data;
  };

  // ✅ Modified
  const registerUser = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  };

  const logoutUser = () => {
    localStorage.removeItem("userToken");
    setUser(null);
  };

  const loginAdmin = async (email, password) => {
    const { data } = await api.post("/admin/auth/login", { email, password });
    localStorage.setItem("adminToken", data.token);
    setAdmin(data.admin);
    return data;
  };

  const logoutAdmin = async () => {
    try {
      await api.post("/admin/auth/logout");
    } catch (err) {
      // Ignore logout API errors
    }

    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,

        setUser,
        setAdmin,

        loginUser,
        registerUser,
        logoutUser,

        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);