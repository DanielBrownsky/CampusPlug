
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { LogOut, User, Heart, LayoutGrid } from "lucide-react";
import { useState } from "react";

const DesktopNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const links = [
    { label: "Explore", to: "/explore" },
    { label: "Wishlist", to: "/wishlist", icon: <Heart size={16} /> },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="hidden md:flex justify-between items-center px-6 py-4 border-b bg-white dark:bg-gray-900 dark:text-white text-gray-800 shadow-sm sticky top-0 z-50">
      {/* Left: Logo */}
      <Link to="/" className="text-lg font-bold">
        CampusPlug
      </Link>

      {/* Middle: Links */}
      <div className="flex gap-6 text-sm font-medium">
        {links.map(({ label, to, icon }) => (
          <Link
            key={label}
            to={to}
            className={`hover:underline flex items-center gap-1 transition-colors ${
              isActive(to) ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            {icon && icon} {label}
          </Link>
        ))}
        {/* Conditional Seller Link */}
        {user?.isVerified ? (
          <Link
            to="/dashboard"
            className={`hover:underline flex items-center gap-1 transition-colors ${
              isActive("/dashboard") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <LayoutGrid size={16} /> Dashboard
          </Link>
        ) : (
          <Link
            to="/verify"
            className={`hover:underline flex items-center gap-1 transition-colors ${
              isActive("/verify") ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"
            }`}
          >
            <User size={16} /> Sell
          </Link>
        )}
      </div>

      
      {user ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-sm text-red-600 hover:underline flex items-center gap-1"
        >
          <LogOut size={16} /> Sign out
        </button>
      ) : (
        <div className="flex gap-4 text-sm">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline"
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Confirm Logout Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-2">Are you sure you want to logout?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You’ll be logged out of your CampusPlug account.
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DesktopNavbar;
