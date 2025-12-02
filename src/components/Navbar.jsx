import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout, theme, toggleTheme }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm backdrop-blur px-6 py-3 flex items-center justify-between">
      
      {/* Left */}
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg text-blue-600">API Tool</span>

        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/app" className="hover:underline">App</Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
        >
          {theme === "dark" ? "☀ Light" : "🌙 Dark"}
        </button>

        {user ? (
          <>
            <span className="text-sm">
              👤 {user?.user_metadata?.full_name || user?.email}
            </span>

            <button
              onClick={onLogout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600">Login</Link>
            <Link
              to="/signup"
              className="border px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Signup
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}
