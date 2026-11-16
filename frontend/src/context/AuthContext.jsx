import { createContext, useMemo, useState } from "react";

const TOKEN_STORAGE_KEY = "pawsstore_token";

export const AuthContext = createContext();

const readTokenPayload = (token) => {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(normalized))));
  } catch {
    return null;
  }
};

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const user = useMemo(() => readTokenPayload(token), [token]);

  const login = (nextToken) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === "admin",
      login,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
