import { useState } from "react";
import {
  LayoutDashboard, Vote, Users, BarChart3,
  ClipboardList, Shield, LogOut, ChevronRight, Bell, Search, Menu, X,
} from "lucide-react";
import type { AdminScreen } from "./types";
import { AdminDashboard } from "./AdminDashboard";
import { AdminElections } from "./AdminElections";
import { AdminCandidates } from "./AdminCandidates";
import { AdminVoters } from "./AdminVoters";
import { AdminResults } from "./AdminResults";
import { AdminAudit } from "./AdminAudit";

const NAV = [
  { id: "dashboard" as AdminScreen, label: "Dashboard", icon: LayoutDashboard },
  { id: "elections" as AdminScreen, label: "Elecciones", icon: Vote },
  { id: "candidates" as AdminScreen, label: "Candidatos", icon: Users },
  { id: "voters" as AdminScreen, label: "Votantes", icon: ClipboardList },
  { id: "results" as AdminScreen, label: "Resultados", icon: BarChart3 },
  { id: "audit" as AdminScreen, label: "Auditoría", icon: Shield },
];

const SCREEN_TITLE: Record<AdminScreen, { title: string; sub: string }> = {
  dashboard: { title: "Dashboard", sub: "Resumen general del sistema" },
  elections: { title: "Gestión de Elecciones", sub: "Crear, editar y publicar elecciones" },
  candidates: { title: "Gestión de Candidatos", sub: "Administrar candidatos por elección" },
  voters: { title: "Gestión de Votantes", sub: "Habilitar y controlar acceso de estudiantes" },
  results: { title: "Resultados", sub: "Gráficos y exportación de datos" },
  audit: { title: "Historial y Auditoría", sub: "Registro de acciones administrativas" },
};

interface Props {
  username: string;
  onLogout: () => void;
}

export function AdminApp({ username, onLogout }: Props) {
  const [screen, setScreen] = useState<AdminScreen>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const info = SCREEN_TITLE[screen];
  const initials = username.split("@")[0].slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex font-['Inter',sans-serif] bg-[#f0f4f9]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 min-h-screen bg-[#1a3a6b] flex flex-col text-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} shrink-0`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Vote className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif]">U-Vote</span>
                <p className="text-[10px] text-blue-300 leading-tight">Panel Administrador</p>
              </div>
            </div>
            <button className="lg:hidden w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center" onClick={() => setSidebarOpen(false)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Admin badge */}
          <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 rounded-lg">
            <Shield className="w-3 h-3 text-blue-300" />
            <span className="text-[10px] text-blue-200 font-semibold uppercase tracking-wide">Acceso Administrador</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = screen === id;
            return (
              <button
                key={id}
                onClick={() => { setScreen(id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-white/15 text-white" : "text-blue-200 hover:bg-white/8 hover:text-white"}`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? "text-white" : "text-blue-300"}`} />
                <span>{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-300" />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 cursor-pointer transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{username.split("@")[0]}</p>
              <p className="text-[11px] text-blue-300 truncate">{username}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-300 hover:bg-white/8 hover:text-white transition-all mt-1">
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-[#1a3a6b]/8 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden w-9 h-9 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/8 flex items-center justify-center text-[#5a7190]" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">{info.title}</h1>
              <p className="text-xs text-[#5a7190]">{info.sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/8 flex items-center justify-center text-[#5a7190] hover:text-[#1a3a6b] transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="relative w-9 h-9 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/8 flex items-center justify-center text-[#5a7190] hover:text-[#1a3a6b] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563eb] rounded-full border border-white" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {screen === "dashboard" && <AdminDashboard onNavigate={setScreen} />}
          {screen === "elections" && <AdminElections />}
          {screen === "candidates" && <AdminCandidates />}
          {screen === "voters" && <AdminVoters />}
          {screen === "results" && <AdminResults />}
          {screen === "audit" && <AdminAudit />}
        </main>
      </div>
    </div>
  );
}
