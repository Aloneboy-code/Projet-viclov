import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Box, Pill, BookMarked, HelpCircle, Menu, X, Sun, Moon, Bot, Star, Heart, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const medicalLearnerNavItems = [
  { path: "/", icon: Home, label: "Accueil" },
  { path: "/cours", icon: BookOpen, label: "Cours" },
  { path: "/anatomie", icon: Box, label: "Anatomie 3D" },
  { path: "/pharmacologie", icon: Pill, label: "Pharmacologie" },
  { path: "/dictionnaire", icon: BookMarked, label: "Dictionnaire" },
  { path: "/quiz", icon: HelpCircle, label: "Quiz" },
  { path: "/favoris", icon: Heart, label: "Favoris" },
  { path: "/chat", icon: MessageCircle, label: "Chat" },
  { path: "/ia", icon: Bot, label: "IA" },
  { path: "/avis", icon: Star, label: "Avis" },
];

const simpleUserNavItems = [
  { path: "/pharmacologie", icon: Pill, label: "Pharmacologie" },
  { path: "/ia", icon: Bot, label: "VicLov Assistant (IA)" },
];

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { profile } = useAuth();
  const navItems = profile === 'medical_learner' ? medicalLearnerNavItems : simpleUserNavItems;
  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F172A] flex flex-col">
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#005F73] to-[#0A9396] flex items-center justify-center shadow-lg border-2 border-[#0A9396] overflow-hidden">
            <img src="/viclov-logo.jpeg" alt="VicLov" className="w-full h-full object-cover" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-sm">VicLov</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setMobileOpen((v) => !v)} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.nav initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="md:hidden fixed top-14 right-0 bottom-0 w-64 z-50 bg-white dark:bg-[#1E293B] border-l border-gray-200 dark:border-gray-700 flex flex-col py-4 gap-1 px-3 shadow-2xl">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${active ? "bg-[#005F73]/10 text-[#005F73] font-semibold" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                  <item.icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
                  <span className="text-sm">{item.label}</span>
                </Link>;
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 pt-14 md:pt-0 md:pl-20">
        <Outlet />
      </div>

      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 flex-col items-center py-6 gap-2 z-50">
        <div className="mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#005F73] to-[#0A9396] flex items-center justify-center shadow-lg border-2 border-[#0A9396] overflow-hidden">
            <img src="/viclov-logo.jpeg" alt="VicLov" className="w-full h-full object-cover" />
          </div>
        </div>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 ${active ? "bg-[#005F73]/10 text-[#005F73]" : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
            <item.icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>;
        })}
        <div className="mt-auto">
          <button onClick={toggleTheme} className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="text-[10px] font-medium">{isDark ? "Clair" : "Sombre"}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
