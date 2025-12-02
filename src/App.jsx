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
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  }

  // 🔐 AUTH STATE
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user || null);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
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
      <MainLayout accessToken={session?.access_token} />
    </ProtectedRoute>
  }
/>


      </Routes>
    </BrowserRouter>
  );
}
