import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Home from "./pages/Home";
import About from "./pages/About";
import MainLayout from "./MainLayout";
import Navbar from "./components/Navbar";
import AuthPage from "./AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {

  // 🌗 Theme
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  }

  // 🔐 AUTH STATE
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
      setAccessToken(data?.session?.access_token || null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setAccessToken(session?.access_token || null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null);
  }

  // ✅ Prevent flicker while session loads
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center
        bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>

      <Navbar
        user={user}
        onLogout={logout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute user={user}>
              <MainLayout accessToken={accessToken} />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
