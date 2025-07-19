import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, User, LayoutDashboard, PlusSquare } from "lucide-react";
import { useAuth } from "./AuthProvider";

const BottomNav = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isSeller = user?.isSeller;

  const links = [
    {
      to: "/",
      icon: <Home size={20} />,
      label: "Home",
    },
    {
      to: "/explore",
      icon: <Search size={20} />,
      label: "Explore",
    },
    {
      to: "/wishlist",
      icon: <Heart size={20} />,
      label: "Wishlist",
      authOnly: true,
    },
    {
      to: isSeller ? "/dashboard" : "/verify",
      icon: isSeller ? <LayoutDashboard size={20} /> : <PlusSquare size={20} />,
      label: isSeller ? "Dashboard" : "Sell",
      authOnly: true,
    },
    {
      to: user ? "/profile" : "/auth",
      icon: <User size={20} />,
      label: "Account",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-sm z-50 md:hidden flex justify-around py-3">
      {links.map(({ to, icon, label, authOnly }) => {
        if (authOnly && !user) return null;
        const isActive = pathname === to;

        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center text-xs ${
              isActive
                ? "text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {icon}
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
