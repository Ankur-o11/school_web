import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_BASE_URL = "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("mpsa_token") || null);
  const [loading, setLoading] = useState(true);

  // Load user profile if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          // Token invalid or expired
          logout();
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  // LOGIN FUNCTION
  const login = async (identifier, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("mpsa_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  // CHANGE PASSWORD FUNCTION
  const changePassword = async (currentPassword, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update password");
    }

    setUser((prev) => (prev ? { ...prev, mustChangePassword: false } : null));
    return data;
  };

  // LOGOUT FUNCTION
  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        // Ignore errors on logout request
      }
    }
    localStorage.removeItem("mpsa_token");
    setToken(null);
    setUser(null);
  };

  // PERMISSION CHECK HELPER
  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === "Admin" || user.permissions?.includes("*")) return true;
    if (!permission) return true;
    return user.permissions?.includes(permission) || false;
  };

  // AUTHENTICATED FETCH HELPER
  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    const response = await fetch(fullUrl, { ...options, headers });

    if (response.status === 401) {
      logout();
      throw new Error("Session expired. Please log in again.");
    }

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        changePassword,
        logout,
        hasPermission,
        fetchWithAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
