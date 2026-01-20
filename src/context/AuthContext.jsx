import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  axios.defaults.withCredentials = true;

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/users/current-user");
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post("/api/users/login", { email, password });
    const { accessToken, data } = response.data;
    localStorage.setItem("accessToken", accessToken);
    setToken(accessToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setUser(data);
    return response.data;
  };

  const register = async (fullname, email, password, role) => {
    const response = await axios.post("/api/users/register", {
      fullname,
      email,
      password,
      role,
    });
    return response.data;
  };

  const logout = async () => {
    try {
      await axios.post("/api/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    token,
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
