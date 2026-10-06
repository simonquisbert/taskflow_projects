import { API_URL, TOKEN_KEY } from "@/lib/constants";

export interface User {
  id: string;
  name: string;
  email: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}
export interface LoginResponseData {
  token: string;
  user: User;
}
export type RegisterResponseData = User;

// Todas las llamadas pasan por aquí: enviamos JWT y convertimos errores en mensajes.
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(`${API_URL.replace(/\/$/, "")}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal ?? AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error(
      "No se pudo conectar con la API. Comprueba que el backend esté iniciado y revisa VITE_API_URL.",
    );
  }
  if (response.status === 401 && !endpoint.startsWith("/auth/")) {
    window.dispatchEvent(new Event("taskflow:unauthorized"));
  }
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    const validation = data?.errors
      ?.map((item: { msg: string }) => item.msg)
      .join(". ");
    throw new Error(
      validation ||
        data?.message ||
        `La API respondió con un error (${response.status}).`,
    );
  }
  return data;
}
