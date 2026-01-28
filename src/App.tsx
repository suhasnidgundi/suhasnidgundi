import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Preloader from "./components/Preloader";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import WPAboutMe from "./pages/WPAboutMe";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminExperience from "./pages/admin/AdminExperience";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import { useIsMobile } from "./hooks/use-mobile";
import WPProjects from "./pages/WPProjects";
import WPProjectDetail from "./pages/WPProjectDetail";
import WPExperienceDetail from "./pages/WPExperienceDetail";
import WPNotFound from "./pages/WPNotFound";
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(() => {
    return !localStorage.getItem("hasVisited");
  });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newValue;
    });
  };

  const handlePreloaderComplete = () => {
    localStorage.setItem("hasVisited", "true");
    setIsLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SpeedInsights />
          <Analytics />
          {isLoading ? (
            <Preloader onComplete={handlePreloaderComplete} />
          ) : (
            <BrowserRouter>
              <AppRoutes isDark={isDark} toggleTheme={toggleTheme} />
            </BrowserRouter>
          )}
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const AppRoutes = ({
  isDark,
  toggleTheme,
}: {
  isDark: boolean;
  toggleTheme: () => void;
}) => {
  const isMobile = useIsMobile();

  return (
    <Routes>
      <Route
        path="/"
        element={<Home isDark={isDark} toggleTheme={toggleTheme} />}
      />
      <Route
        path="/projects"
        element={<Projects isDark={isDark} toggleTheme={toggleTheme} />}
      />
      <Route
        path="/projects/:id"
        element={
          isMobile ? (
            <WPProjectDetail />
          ) : (
            <Projects isDark={isDark} toggleTheme={toggleTheme} />
          )
        }
      />

      <Route
        path="/experience"
        element={<Experience isDark={isDark} toggleTheme={toggleTheme} />}
      />
      <Route
        path="/experience/:id"
        element={
          isMobile ? (
            <WPExperienceDetail />
          ) : (
            <Experience isDark={isDark} toggleTheme={toggleTheme} />
          )
        }
      />

      <Route
        path="/about"
        element={
          isMobile ? (
            <WPAboutMe isDark={isDark} toggleTheme={toggleTheme} />
          ) : (
            <Home isDark={isDark} toggleTheme={toggleTheme} />
          )
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={isMobile ? <WPNotFound /> : <NotFound />} />
    </Routes>
  );
};

export default App;
