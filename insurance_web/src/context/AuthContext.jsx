import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { login as loginApi } from '../services/authService';

const AuthContext = createContext(null);

const STORAGE_KEY = 'insurance_user';

function loadUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  const login = useCallback(async (username, password) => {
    const userData = await loginApi(username, password);
    setUser(userData);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
