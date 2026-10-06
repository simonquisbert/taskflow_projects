import { useContext } from "react";
import { AuthContext, type AuthContextType } from "@/context/AuthContext";

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  // Verificación de seguridad y fail-fast en tiempo de desarrollo
  if (!context) {
    throw new Error(
      "useAuth debe ser utilizado dentro de un componente envuelto por <AuthProvider>",
    );
  }

  return context;
}
