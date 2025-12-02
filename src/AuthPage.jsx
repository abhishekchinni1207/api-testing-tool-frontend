import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ MODE FROM URL
  const mode = location.pathname === "/signup" ? "signup" : "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ AUTH LISTENER
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/app");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/app");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  async function handleAuth(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const safeEmail = email.trim().toLowerCase();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: safeEmail,
          password,
        });

        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: safeEmail,
          password,
          options: { data: { full_name: name } },
        });

        if (error) throw error;

        alert("Signup successful. Please log in.");
        navigate("/login");
      }

    } catch (err) {

      // ✅ Friendly duplicate email handling
      if (
        err.message?.toLowerCase().includes("already") ||
        err.message?.toLowerCase().includes("exists") ||
        err.code === "user_already_exists"
      ) {
        setError("This email is already registered. Please login instead.");
      } 
      // ✅ Invalid credentials
      else if (err.message?.toLowerCase().includes("invalid login")) {
        setError("Invalid email or password.");
      } 
      // ✅ Fallback error
      else {
        setError(err.message || "Unexpected error occurred");
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-slate-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full max-w-sm space-y-4 text-gray-900 dark:text-gray-100">

        <h2 className="text-xl font-semibold text-center">
          {mode === "login" ? "Login" : "Create Account"}
        </h2>

        <form onSubmit={handleAuth} className="space-y-3">

          {/* ✅ NAME (Signup only) */}
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-2 rounded 
                bg-white text-black 
                dark:bg-gray-700 dark:text-white 
                dark:border-gray-600 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          {/* ✅ Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded 
              bg-white text-black 
              dark:bg-gray-700 dark:text-white 
              dark:border-gray-600 focus:outline-none"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value.trim().toLowerCase())
            }
            required
          />

          {/* ✅ Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded 
              bg-white text-black 
              dark:bg-gray-700 dark:text-white 
              dark:border-gray-600 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ✅ Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* ✅ Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
          </button>

        </form>

        {/* ✅ SWITCH MODE */}
        <button
          onClick={() => navigate(mode === "login" ? "/signup" : "/login")}
          className="w-full text-sm text-blue-600"
        >
          {mode === "login"
            ? "Need an account? Sign up"
            : "Already have an account? Login"}
        </button>

      </div>
    </div>
  );
}
