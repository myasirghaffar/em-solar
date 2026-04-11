import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../data/dummyAuth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  /** If set, only these roles may access the route. */
  allowedRoles?: UserRole[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF7A00] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && user && !allowedRoles.includes(user.role)) {
    if (user.role === "user") {
      return <Navigate to="/profile" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
