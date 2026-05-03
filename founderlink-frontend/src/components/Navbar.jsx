import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import NotificationBell from "./NotificationBell";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-emerald-500 transition-colors focus:outline-none">
      {isDark ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
    </button>
  );
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path ? "text-slate-900 dark:text-emerald-500 font-bold border-b-2 border-slate-900 dark:border-emerald-500 pb-0.5" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-emerald-500 transition-colors font-medium";

  return (
    <nav className="bg-white dark:bg-[#0B0F0E] border-b border-slate-200 dark:border-white/5 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LEFT: Logo & Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
                Founder<span className="text-blue-600 dark:text-emerald-500 transition-colors duration-300">Link</span>
              </span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-8 text-sm">
                <Link to="/dashboard" className={isActive("/dashboard")}>
                  Dashboard
                </Link>

                {user?.role === "FOUNDER" && (
                  <>
                    <Link to="/my-startups" className={isActive("/my-startups")}>
                      My Startups
                    </Link>
                    <Link to="/create-startup" className={isActive("/create-startup")}>
                      Create Startup
                    </Link>
                  </>
                )}

                {(user?.role === "INVESTOR" || user?.role === "COFOUNDER") && (
                  <Link to="/browse-startups" className={isActive("/browse-startups")}>
                    Browse Startups
                  </Link>
                )}

                {user?.role === "INVESTOR" && (
                  <Link to="/investments" className={isActive("/investments")}>
                    My Investments
                  </Link>
                )}

                {user?.role === "COFOUNDER" && (
                  <Link to="/team-requests" className={isActive("/team-requests")}>
                    Team Requests
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: User Actions */}
          <div className="flex items-center space-x-6">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-emerald-500 transition-colors duration-300">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary py-1.5 px-4 text-sm">
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <ThemeToggle />
                <div className="dark:text-slate-400">
                  <NotificationBell />
                </div>
                
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-2 group">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 group-hover:bg-slate-100 dark:group-hover:bg-emerald-500/10 group-hover:text-slate-900 dark:group-hover:text-emerald-500 transition-colors">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-emerald-500 transition-colors">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 uppercase tracking-wider transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;