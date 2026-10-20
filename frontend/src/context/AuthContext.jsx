import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("routecraft_token");
    if (!token) {
      setReady(true);
      return;
    }
    api
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("routecraft_token");
      })
      .finally(() => setReady(true));
  }, []);

  const loginWithGoogle = useCallback(async (credential) => {
    const res = await api.googleLogin(credential);
    localStorage.setItem("routecraft_token", res.access_token);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("routecraft_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
