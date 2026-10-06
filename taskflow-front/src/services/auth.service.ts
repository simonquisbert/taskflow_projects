import {
  apiFetch,
  type ApiResponse,
  type LoginResponseData,
  type RegisterResponseData,
} from "./api";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export async function registerRequest(
  credentials: RegisterDTO,
): Promise<ApiResponse<RegisterResponseData>> {
  return apiFetch<RegisterResponseData>("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

/**
 * Iniciar sesión con email y contraseña
 * Endpoint: POST /auth/login
 * Respuesta: { success: true, message: "Inicio de sesión exitoso", data: { token, user } }
 */
export async function loginRequest(
  credentials: LoginDTO,
): Promise<ApiResponse<LoginResponseData>> {
  return apiFetch<LoginResponseData>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}
