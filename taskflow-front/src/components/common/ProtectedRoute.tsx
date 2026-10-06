import { type ReactNode } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children?: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Mientras se valida la persistencia del token con GET /projects
  if (isLoading) {
    return (
      <div className="bg-background text-foreground flex min-h-screen w-full flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm">
          Verificando sesión...
        </p>
      </div>
    );
  }

  // 2. Si terminó de cargar y no está autenticado, expulsamos al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Acceso autorizado: soporta tanto envoltura directa como rutas anidadas (Outlet)
  return children ? <>{children}</> : <Outlet />;
}
