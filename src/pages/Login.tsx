
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";


const Login = () => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, logout, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fakeUser = {
      id: Date.now().toString(),
      name: tab === "signup" ? name : "CampusPlug User",
      email,
    };

    login(fakeUser);
    navigate("/explore");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen px-4 py-10 flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">You're already logged in</h1>
          <p className="mb-6">Welcome, {user?.name}</p>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 flex items-center justify-center bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-md w-full">
        {/* Tabs */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            onClick={() => setTab("login")}
            className={`text-lg font-semibold pb-1 border-b-2 transition ${
              tab === "login"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`text-lg font-semibold pb-1 border-b-2 transition ${
              tab === "signup"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "signup" && (
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-sm text-gray-500 dark:text-gray-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
          >
            {tab === "login" ? "Login to CampusPlug" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
