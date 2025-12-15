import { Navigate } from "react-router-dom";
import { getRole } from "../../utils/auth";

export default function RoleGuard({ children, allow = [] }) {
  const role = getRole(); 
  if (allow.length === 0) return children;
  if (!role || !allow.includes(role)) return <Navigate to="/403" replace />;
  return children;
}
