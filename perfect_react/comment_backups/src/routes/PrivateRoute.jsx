import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, hasAnyRole, getRole } from "../utils/auth";

export default function PrivateRoute({ roles = [], children }) {
  const authed = isAuthenticated();
  const location = useLocation();

  // debug tạm: xem FE đang thấy gì
  // console.log('[Guard] authed:', authed, 'have:', getRole(), 'need:', roles);

  if (!authed) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles.length && !hasAnyRole(roles)) return <Navigate to="/403" replace />;
  return children;
}
