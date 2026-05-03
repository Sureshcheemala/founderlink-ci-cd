import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <ProtectedRoute>
      {!user ? (
        <div className="p-6">Loading...</div>
      ) : !allowedRoles.includes(user.role) ? (
        <Navigate to="/dashboard" replace />
      ) : (
        children
      )}
    </ProtectedRoute>
  );
};

export default RoleProtectedRoute;