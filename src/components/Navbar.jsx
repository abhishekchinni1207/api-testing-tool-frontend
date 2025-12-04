import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout, theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();

  function goToApp() {
    if (user) navigate("/app");
    else navigate("/login");
  }

  const isActive = path =>
    location.pathname === path ? "text-blue-600 font-semibold" : "";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50
      bg-white/90 dark:bg-gray-800/90
      border-b dark:border-gray-700
      backdrop-blur
      shadow-sm
      px-6 py-3
      flex justify-between items-center">

      {/* LEFT */}
      <div className="flex items-center gap-6 text-sm">

        <span className="font-bold text-lg text-blue-600">
          API Tool
        </span>

        <Link to="/" className={`hover:underline ${isActive("/")}`}>
          Home
        </Link>

        <Link to="/about" className={`hover:underline ${isActive("/about")}`}>
          About
        </Link>

        <button
          onClick={goToApp}
          className={`hover:underline ${isActive("/app")}`}
        >
          App
        </button>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 text-sm">

        {/* 🌗 THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="px-3 py-1 rounded
            bg-gray-200 dark:bg-gray-700
            border dark:border-gray-600
            hover:opacity-80"
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>

        {/* 👤 AUTH */}
        {user ? (
          <>
            <span className="truncate max-w-[160px] opacity-80">
              👤 {user?.user_metadata?.full_name || user?.email}
            </span>

            <button
              onClick={onLogout}
              className="bg-red-600 text-white
                px-3 py-1 rounded
                hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>

            <Link
              to="/signup"
              className="border px-3 py-1 rounded
                hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Signup
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}
