import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

export default function AuthGuard({ children }) {
  const authed = isAuthenticated();
  const loc = useLocation();
  if (!authed) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}
