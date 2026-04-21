// context/AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getToken, getUser, saveToken, saveUser, removeToken,
  generateMockJWT, isAuthenticated,
} from '../utils/auth';
import { loginUser } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => getUser());
  const [token,   setToken]   = useState(() => getToken());
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const authed = isAuthenticated();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userData  = await loginUser(email, password);
      const jwt       = generateMockJWT(userData);
      saveToken(jwt);
      saveUser(userData);
      setToken(jwt);
      setUser(userData);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setToken(null);
    setUser(null);
  }, []);

  // Clear expired session on mount
  useEffect(() => {
    if (token && !authed) logout();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, isAuthenticated: authed }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
