import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function PublicRoute({ children }) {
  const authed = isAuthenticated();
  const location = useLocation();
  return authed
    ? <Navigate to={location.state?.from?.pathname || "/"} replace />
    : children;
}
