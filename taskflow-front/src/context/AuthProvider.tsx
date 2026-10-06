import { useState, useEffect, type ReactNode } from 'react';
import { apiFetch, type User } from '@/services/api';
import { loginRequest, registerRequest, type LoginDTO, type RegisterDTO } from '@/services/auth.service';
import { AuthContext } from './AuthContext';
import { TOKEN_KEY } from '@/lib/constants';

const USER_KEY = `${TOKEN_KEY}_user`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    function clearSession() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setToken(null);
    }
    window.addEventListener('taskflow:unauthorized', clearSession);
    async function restoreSession() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (!savedToken || !savedUser) {
        clearSession();
        setIsLoading(false);
        return;
      }
      let parsedUser: User;
      try {
        parsedUser = JSON.parse(savedUser);
        if (!parsedUser?.id || !parsedUser.email) throw new Error('Datos de sesión inválidos');
      } catch {
        clearSession();
        setIsLoading(false);
        return;
      }
      try {
        // Esta API no tiene /auth/me. Una ruta privada comprueba el JWT en el servidor.
        await apiFetch('/projects');
        if (active && localStorage.getItem(TOKEN_KEY) === savedToken) {
          setUser(parsedUser);
          setToken(savedToken);
        }
      } catch (error) {
        if (active && localStorage.getItem(TOKEN_KEY)) {
          setSessionError(error instanceof Error ? error.message : 'Error de conexión');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }
    void restoreSession();
    return () => {
      active = false;
      window.removeEventListener('taskflow:unauthorized', clearSession);
    };
  }, [retry]);

  async function login(credentials: LoginDTO) {
    const { data } = await loginRequest(credentials);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }
  async function register(credentials: RegisterDTO) {
    await registerRequest(credentials);
    await login({ email: credentials.email, password: credentials.password });
  }
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
    setSessionError('');
  }
  if (sessionError) return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100 space-y-4">
      <h1 className="text-xl">No se pudo verificar la sesión</h1>
      <p role="alert">{sessionError}</p>
      <button className="rounded bg-indigo-600 p-3" onClick={() => {
        setSessionError(''); setIsLoading(true); setRetry((value) => value + 1);
      }}>Reintentar</button>{' '}
      <button className="rounded border p-3" onClick={logout}>Ir al inicio de sesión</button>
    </main>
  );
  return <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: Boolean(user && token), login, register, logout }}>
    {children}
  </AuthContext.Provider>;
}
