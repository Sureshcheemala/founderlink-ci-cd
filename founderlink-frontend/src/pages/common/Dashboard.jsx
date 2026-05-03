import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  // Not logged in
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // Prevent crash while loading user
  if (!user) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  // Role-based redirect (scalable mapping)
  const roleRoutes = {
    FOUNDER: "/founder-dashboard",
    INVESTOR: "/investor-dashboard",
    COFOUNDER: "/cofounder-dashboard",
    ADMIN: "/admin-dashboard",
  };

  const route = roleRoutes[user.role];

  if (route) {
    return <Navigate to={route} replace />;
  }

  return (
    <div className="p-6 text-red-500 font-semibold">
      Unknown role: {user.role}
    </div>
  );
};

export default Dashboard;