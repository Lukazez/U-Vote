import { useState, useRef } from "react";
import {
  LayoutDashboard, Vote, BarChart3, Settings, LogOut,
  ChevronRight, CheckCircle2, Clock, Users, Shield,
  Eye, EyeOff, AlertCircle, ArrowLeft, Bell, Search, TrendingUp, Award,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminApp } from "./components/admin/AdminApp";

// ── Types ─────────────────────────────────────────────────────────────────
type RootScreen = "role-select" | "student-login" | "student-mfa" | "student-app" | "admin-login" | "admin-app";
type StudentScreen = "dashboard" | "vote" | "results";

// ── Student data ───────────────────────────────────────────────────────────
const SIDEBAR_NAV = [
  { id: "dashboard", label: "Inicio", icon: LayoutDashboard },
  { id: "vote", label: "Emitir Voto", icon: Vote },
  { id: "results", label: "Resultados", icon: BarChart3 },
  { id: "settings", label: "Configuración", icon: Settings },
];

const CANDIDATES = [
  { id: 1, name: "María Fernández", party: "Frente Estudiantil Unido", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&auto=format", color: "#2563eb", votes: 892, percent: 45 },
  { id: 2, name: "Diego Herrera", party: "Movimiento Universitario", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format", color: "#10b981", votes: 534, percent: 27 },
  { id: 3, name: "Catalina Torres", party: "Alianza Académica", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format", color: "#f59e0b", votes: 376, percent: 19 },
  { id: 4, name: "Andrés Morales", party: "Renovación Campus", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format", color: "#8b5cf6", votes: 178, percent: 9 },
];

// ── Root component ─────────────────────────────────────────────────────────
export default function App() {
  const [root, setRoot] = useState<RootScreen>("role-select");
  const [adminUser, setAdminUser] = useState("");

  // Student state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState(["", "", "", "", "", ""]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [voteConfirmed, setVoteConfirmed] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedFor, setVotedFor] = useState<number | null>(null);
  const [loginError, setLoginError] = useState(false);
  const [mfaError, setMfaError] = useState(false);
  const [activeNav, setActiveNav] = useState<StudentScreen>("dashboard");
  const [studentScreen, setStudentScreen] = useState<StudentScreen>("dashboard");
  const mfaRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleStudentLogin = () => {
    if (email.includes("@") && password.length >= 4) { setLoginError(false); setRoot("student-mfa"); }
    else setLoginError(true);
  };

  const handleMfaInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...mfaCode]; next[index] = value.slice(-1); setMfaCode(next);
    if (value && index < 5) mfaRefs.current[index + 1]?.focus();
  };
  const handleMfaKey = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !mfaCode[index] && index > 0) mfaRefs.current[index - 1]?.focus();
  };
  const handleMfa = () => {
    if (mfaCode.join("").length === 6) { setMfaError(false); setRoot("student-app"); }
    else setMfaError(true);
  };

  const navTo = (screen: StudentScreen) => { setStudentScreen(screen); setActiveNav(screen); };
  const handleConfirmVote = () => {
    if (selectedCandidate === null) return;
    setVoteConfirmed(true);
    setHasVoted(true);
    setVotedFor(selectedCandidate);
    setTimeout(() => { setVoteConfirmed(false); setSelectedCandidate(null); navTo("results"); }, 2000);
  };

  const studentLogout = () => { setRoot("role-select"); setEmail(""); setPassword(""); setMfaCode(["","","","","",""]); setStudentScreen("dashboard"); setActiveNav("dashboard"); setHasVoted(false); setVotedFor(null); };

  // ── Role selector ──────────────────────────────────────────────────────
  if (root === "role-select") {
    return (
      <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center p-6 font-['Inter',sans-serif]">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1a3a6b] flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">U-Vote</span>
            </div>
            <p className="text-[#5a7190] text-sm">Sistema de Votación Digital — DuocUC</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setRoot("student-login")}
              className="bg-white rounded-2xl border-2 border-[#1a3a6b]/10 p-7 flex flex-col items-center gap-4 hover:border-[#2563eb] hover:shadow-md transition-all group text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#e8eef7] flex items-center justify-center group-hover:bg-[#2563eb] transition-colors">
                <Users className="w-7 h-7 text-[#2563eb] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-bold text-[#0f1f3d] text-base font-['Plus_Jakarta_Sans',sans-serif]">Soy Estudiante</p>
                <p className="text-xs text-[#5a7190] mt-1 leading-snug">Accede para emitir tu voto y ver resultados</p>
              </div>
            </button>

            <button onClick={() => setRoot("admin-login")}
              className="bg-[#1a3a6b] rounded-2xl border-2 border-[#1a3a6b] p-7 flex flex-col items-center gap-4 hover:bg-[#0f2a52] hover:shadow-md transition-all group text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-base font-['Plus_Jakarta_Sans',sans-serif]">Soy Administrador</p>
                <p className="text-xs text-blue-300 mt-1 leading-snug">Panel de gestión y administración</p>
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-[#94afc7] mt-8">© 2025 U-Vote — Universidad Digital. Todos los derechos reservados.</p>
        </div>
      </div>
    );
  }

  // ── Admin flow ────────────────────────────────────────────────────────
  if (root === "admin-login") {
    return <AdminLogin onLogin={(u) => { setAdminUser(u); setRoot("admin-app"); }} onBack={() => setRoot("role-select")} />;
  }
  if (root === "admin-app") {
    return <AdminApp username={adminUser} onLogout={() => setRoot("role-select")} />;
  }

  // ── Student login ──────────────────────────────────────────────────────
  if (root === "student-login") {
    return (
      <div className="min-h-screen flex font-['Inter',sans-serif]">
        <div className="hidden lg:flex flex-col justify-between w-[420px] min-w-[380px] bg-[#1a3a6b] text-white p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-300 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-400 translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">U-Vote</span>
                <p className="text-blue-200 text-xs">Sistema de Votación Digital</p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold leading-tight font-['Plus_Jakarta_Sans',sans-serif]">Tu voz importa en la universidad</h1>
                <p className="mt-3 text-blue-200 text-sm leading-relaxed">Participa en las elecciones estudiantiles de forma segura, transparente y desde cualquier lugar.</p>
              </div>
              <div className="space-y-4">
                {[{ icon: Shield, text: "Votación segura y cifrada" }, { icon: CheckCircle2, text: "Resultados en tiempo real" }, { icon: Users, text: "Accesible para todos los estudiantes" }].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-blue-100">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="relative z-10 text-blue-300 text-xs">© 2025 U-Vote — Universidad Digital. Todos los derechos reservados.</p>
        </div>
        <div className="flex-1 flex items-center justify-center bg-[#f0f4f9] p-6">
          <div className="w-full max-w-md">
            <button onClick={() => setRoot("role-select")} className="flex items-center gap-1.5 text-sm text-[#5a7190] hover:text-[#1a3a6b] mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver
            </button>
            <div className="bg-white rounded-2xl shadow-sm border border-[#1a3a6b]/8 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Iniciar sesión</h2>
                <p className="text-[#5a7190] text-sm mt-1">Ingresa con tu correo institucional</p>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Correo institucional</label>
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setLoginError(false); }} onKeyDown={(e) => e.key === "Enter" && handleStudentLogin()} placeholder="estudiante@duocuc.cl"
                    className={`w-full px-4 py-3 rounded-xl bg-[#f4f7fb] border text-[#0f1f3d] placeholder:text-[#94afc7] text-sm outline-none transition-all ${loginError ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-[#1a3a6b]/12 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"}`} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-semibold text-[#0f1f3d]">Contraseña</label>
                    <button className="text-xs text-[#2563eb] hover:text-[#1a3a6b] transition-colors font-medium">¿Olvidaste tu contraseña?</button>
                  </div>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setLoginError(false); }} onKeyDown={(e) => e.key === "Enter" && handleStudentLogin()} placeholder="••••••••"
                      className={`w-full px-4 py-3 pr-11 rounded-xl bg-[#f4f7fb] border text-[#0f1f3d] placeholder:text-[#94afc7] text-sm outline-none transition-all ${loginError ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-[#1a3a6b]/12 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"}`} />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94afc7] hover:text-[#5a7190] transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {loginError && (
                  <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> Correo o contraseña incorrectos.
                  </div>
                )}
                <button onClick={handleStudentLogin} className="w-full py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl transition-all text-sm shadow-sm hover:shadow-md">
                  Iniciar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Student MFA ────────────────────────────────────────────────────────
  if (root === "student-mfa") {
    return (
      <div className="min-h-screen flex font-['Inter',sans-serif]">
        <div className="hidden lg:flex flex-col justify-between w-[420px] min-w-[380px] bg-[#1a3a6b] text-white p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-300 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-400 translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Vote className="w-5 h-5 text-white" /></div>
              <div>
                <span className="text-2xl font-bold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">U-Vote</span>
                <p className="text-blue-200 text-xs">Sistema de Votación Digital</p>
              </div>
            </div>
            <div>
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6"><Shield className="w-8 h-8 text-blue-200" /></div>
              <h2 className="text-2xl font-bold font-['Plus_Jakarta_Sans',sans-serif]">Verificación en dos pasos</h2>
              <p className="mt-3 text-blue-200 text-sm leading-relaxed">Tu seguridad es nuestra prioridad. Este paso adicional protege tu voto y tu cuenta.</p>
            </div>
          </div>
          <p className="relative z-10 text-blue-300 text-xs">© 2025 U-Vote — Universidad Digital. Todos los derechos reservados.</p>
        </div>
        <div className="flex-1 flex items-center justify-center bg-[#f0f4f9] p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-[#1a3a6b]/8 p-8">
              <button onClick={() => setRoot("student-login")} className="flex items-center gap-1.5 text-sm text-[#5a7190] hover:text-[#1a3a6b] mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
              </button>
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#e8eef7] flex items-center justify-center mb-4"><Shield className="w-7 h-7 text-[#2563eb]" /></div>
                <h2 className="text-2xl font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Verificación de identidad</h2>
                <p className="text-[#5a7190] text-sm mt-2 leading-relaxed">
                  Hemos enviado un código a <span className="font-semibold text-[#1a3a6b]">{email || "tu correo"}</span>
                </p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0f1f3d] text-center mb-4">Ingresa el código de 6 dígitos</label>
                <div className="flex gap-3 justify-center">
                  {mfaCode.map((digit, i) => (
                    <input key={i} ref={(el) => { mfaRefs.current[i] = el; }} type="text" inputMode="numeric" value={digit}
                      onChange={(e) => handleMfaInput(i, e.target.value)} onKeyDown={(e) => handleMfaKey(i, e)} maxLength={1}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-xl border bg-[#f4f7fb] text-[#0f1f3d] outline-none transition-all ${mfaError ? "border-red-400 text-red-500" : digit ? "border-[#2563eb] bg-[#e8eef7] text-[#1a3a6b]" : "border-[#1a3a6b]/12 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"}`} />
                  ))}
                </div>
                {mfaError && (
                  <div className="flex items-center justify-center gap-2 text-red-500 text-sm mt-4 bg-red-50 rounded-xl px-3 py-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> Código incompleto. Ingresa los 6 dígitos.
                  </div>
                )}
              </div>
              <button onClick={handleMfa} className="w-full py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl transition-all text-sm shadow-sm hover:shadow-md">
                Verificar código
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-5 text-sm text-[#5a7190]">
                <Clock className="w-4 h-4" />
                <span>¿No recibiste el código?{" "}</span>
                <button className="text-[#2563eb] hover:underline font-medium">Reenviar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Student app shell ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex font-['Inter',sans-serif] bg-[#f0f4f9]">
      <aside className="w-64 min-h-screen bg-[#1a3a6b] flex flex-col text-white shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"><Vote className="w-4 h-4 text-white" /></div>
            <div>
              <span className="text-lg font-bold font-['Plus_Jakarta_Sans',sans-serif]">U-Vote</span>
              <p className="text-blue-300 text-[10px] leading-tight">Sistema de Votación</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {SIDEBAR_NAV.map(({ id, label, icon: Icon }) => {
            const active = activeNav === id;
            return (
              <button key={id} onClick={() => { if (id !== "settings") { navTo(id as StudentScreen); } }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-white/15 text-white" : "text-blue-200 hover:bg-white/8 hover:text-white"}`}>
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-blue-300"}`} />
                <span>{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-300" />}
              </button>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 cursor-pointer transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold shrink-0 uppercase">
              {email.split("@")[0].slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{email.split("@")[0]}</p>
              <p className="text-[11px] text-blue-300 truncate">{email}</p>
            </div>
          </div>
          <button onClick={studentLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-300 hover:bg-white/8 hover:text-white transition-all mt-1">
            <LogOut className="w-4 h-4" /><span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-[#1a3a6b]/8 px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            {studentScreen === "dashboard" && <><h1 className="text-lg font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Hola, {email.split("@")[0]} 👋</h1><p className="text-sm text-[#5a7190]">Bienvenido al sistema de votaciones estudiantiles</p></>}
            {studentScreen === "vote" && <><h1 className="text-lg font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Emitir Voto</h1><p className="text-sm text-[#5a7190]">Elección Centro de Estudiantes 2025</p></>}
            {studentScreen === "results" && <><h1 className="text-lg font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Resultados</h1><p className="text-sm text-[#5a7190]">Elección Centro de Estudiantes 2025 · En curso</p></>}
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/8 flex items-center justify-center text-[#5a7190] hover:text-[#1a3a6b] transition-colors"><Search className="w-4 h-4" /></button>
            <button className="relative w-9 h-9 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/8 flex items-center justify-center text-[#5a7190] hover:text-[#1a3a6b] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563eb] rounded-full border border-white" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold uppercase">
              {email.split("@")[0].slice(0, 2)}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          {/* ── DASHBOARD ──── */}
          {studentScreen === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-5">
                {[
                  { label: "Elecciones activas", value: "1", icon: Vote, color: "text-[#2563eb]", bg: "bg-[#e8eef7]", delta: "Cierra en 3 días" },
                  { label: "Participación global", value: "58%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", delta: "+12% vs. 2024" },
                  { label: "Total votantes", value: "1,980", icon: Users, color: "text-[#f59e0b]", bg: "bg-amber-50", delta: "De 3,412 habilitados" },
                ].map(({ label, value, icon: Icon, color, bg, delta }) => (
                  <div key={label} className="bg-white rounded-2xl border border-[#1a3a6b]/8 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-[#5a7190] font-medium">{label}</p>
                        <p className="text-3xl font-bold text-[#0f1f3d] mt-1 font-['Plus_Jakarta_Sans',sans-serif]">{value}</p>
                        <p className="text-xs text-[#5a7190] mt-1">{delta}</p>
                      </div>
                      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}><Icon className={`w-5 h-5 ${color}`} /></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#1a3a6b]/8 flex items-center justify-between">
                  <h3 className="font-semibold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Elecciones activas</h3>
                  <span className="text-xs text-[#5a7190]">1 elección en curso</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />En curso
                        </span>
                        <span className="text-xs text-[#5a7190]">Cierra el 20 Jun 2025</span>
                      </div>
                      <h4 className="text-xl font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Elección Centro de Estudiantes 2025</h4>
                      <p className="text-sm text-[#5a7190] mt-1 mb-5">4 candidatos · Voto único · Toda la universidad</p>
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-[#5a7190] mb-2">
                          <span>Participación</span><span className="font-semibold text-[#0f1f3d]">58%</span>
                        </div>
                        <div className="h-2 bg-[#e8eef7] rounded-full overflow-hidden">
                          <div className="h-full bg-[#2563eb] rounded-full" style={{ width: "58%" }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-[#5a7190] mt-1">
                          <span>1,980 votos emitidos</span><span>3,412 habilitados</span>
                        </div>
                      </div>
                      {hasVoted ? (
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl">
                          <CheckCircle2 className="w-4 h-4" /> Voto emitido
                        </div>
                      ) : (
                        <button onClick={() => navTo("vote")} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md">
                          <Vote className="w-4 h-4" /> Emitir mi voto
                        </button>
                      )}
                    </div>
                    <div className="ml-8 hidden xl:block">
                      <div className="w-24 h-24 relative">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#e8eef7" strokeWidth="12" />
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#2563eb" strokeWidth="12" strokeDasharray={`${0.58 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">58%</span>
                          <span className="text-[9px] text-[#5a7190]">Participó</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <button onClick={() => navTo("results")} className="bg-white rounded-2xl border border-[#1a3a6b]/8 p-5 flex items-center gap-4 hover:border-[#2563eb]/30 hover:shadow-sm transition-all text-left group">
                  <div className="w-11 h-11 rounded-xl bg-[#e8eef7] flex items-center justify-center shrink-0"><BarChart3 className="w-5 h-5 text-[#2563eb]" /></div>
                  <div><p className="font-semibold text-[#0f1f3d] text-sm">Ver resultados</p><p className="text-xs text-[#5a7190] mt-0.5">Parciales en tiempo real</p></div>
                  <ChevronRight className="w-4 h-4 text-[#94afc7] ml-auto group-hover:text-[#2563eb] transition-colors" />
                </button>
                <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 p-5 flex items-center gap-4 opacity-60 cursor-not-allowed">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0"><Award className="w-5 h-5 text-amber-500" /></div>
                  <div><p className="font-semibold text-[#0f1f3d] text-sm">Próximas elecciones</p><p className="text-xs text-[#5a7190] mt-0.5">No hay convocatorias abiertas</p></div>
                </div>
              </div>
            </div>
          )}

          {/* ── VOTE ──── */}
          {studentScreen === "vote" && (
            <div className="space-y-6 max-w-3xl">
              {hasVoted && !voteConfirmed ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#e8eef7] border-4 border-[#2563eb]/30 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-10 h-10 text-[#2563eb]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Ya emitiste tu voto</h2>
                  <p className="text-[#5a7190] mt-2 text-sm max-w-xs">
                    Votaste por <span className="font-semibold text-[#1a3a6b]">{CANDIDATES.find(c => c.id === votedFor)?.name}</span>.
                    Solo se permite un voto por elección.
                  </p>
                  <button onClick={() => navTo("results")} className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
                    <BarChart3 className="w-4 h-4" /> Ver resultados
                  </button>
                </div>
              ) : voteConfirmed ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center mb-5"><CheckCircle2 className="w-10 h-10 text-emerald-500" /></div>
                  <h2 className="text-2xl font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">¡Voto registrado!</h2>
                  <p className="text-[#5a7190] mt-2 text-sm">Tu voto ha sido emitido de forma segura. Redirigiendo a resultados...</p>
                </div>
              ) : (
                <>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 flex items-center gap-3 text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-amber-800"><span className="font-semibold">Importante:</span> Solo puedes votar una vez. Tu voto es secreto y no podrá modificarse una vez confirmado.</span>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#1a3a6b]/8 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#5a7190] uppercase tracking-wider">Elección activa</p>
                        <h3 className="font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif] mt-0.5">Centro de Estudiantes 2025</h3>
                      </div>
                      <button onClick={() => navTo("dashboard")} className="flex items-center gap-1.5 text-xs text-[#5a7190] hover:text-[#1a3a6b] transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Volver
                      </button>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-[#5a7190] mb-5">Selecciona un candidato para emitir tu voto:</p>
                      <div className="grid grid-cols-2 gap-4">
                        {CANDIDATES.map((c) => {
                          const selected = selectedCandidate === c.id;
                          return (
                            <button key={c.id} onClick={() => setSelectedCandidate(c.id)}
                              className={`flex flex-col items-center p-5 rounded-2xl border-2 transition-all text-left ${selected ? "border-[#2563eb] bg-[#e8eef7] shadow-sm" : "border-[#1a3a6b]/10 hover:border-[#2563eb]/40 hover:bg-[#f4f7fb] bg-white"}`}>
                              <div className="relative mb-3">
                                <img src={c.photo} alt={c.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm" />
                                {selected && <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2563eb] border-2 border-white flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-white" /></div>}
                              </div>
                              <p className="font-bold text-[#0f1f3d] text-sm text-center font-['Plus_Jakarta_Sans',sans-serif]">{c.name}</p>
                              <p className="text-[11px] text-[#5a7190] text-center mt-0.5 leading-tight">{c.party}</p>
                              <div className="mt-3 flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full border-2 shrink-0 transition-all" style={{ borderColor: selected ? "#2563eb" : "#94afc7", backgroundColor: selected ? "#2563eb" : "transparent" }} />
                                <span className={`text-xs font-medium ${selected ? "text-[#2563eb]" : "text-[#94afc7]"}`}>{selected ? "Seleccionado" : "Seleccionar"}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      {selectedCandidate && (
                        <div className="bg-[#e8eef7] rounded-xl px-4 py-3 mb-4 flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                          <span className="text-[#1a3a6b] font-medium">Has seleccionado a <span className="font-bold">{CANDIDATES.find(c => c.id === selectedCandidate)?.name}</span></span>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setSelectedCandidate(null); navTo("dashboard"); }}
                          className="flex-1 py-3.5 border border-[#1a3a6b]/12 text-[#5a7190] hover:bg-[#f4f7fb] hover:text-[#1a3a6b] font-semibold rounded-xl transition-all text-sm"
                        >
                          Cancelar
                        </button>
                        <button onClick={handleConfirmVote} disabled={!selectedCandidate}
                          className={`flex-1 py-3.5 font-semibold rounded-xl transition-all text-sm ${selectedCandidate ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-sm hover:shadow-md" : "bg-[#e8eef7] text-[#94afc7] cursor-not-allowed"}`}>
                          Confirmar voto
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── RESULTS ──── */}
          {studentScreen === "results" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#5a7190] uppercase tracking-wider">Resultados parciales</p>
                  <h3 className="font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif] mt-0.5 text-lg">Elección Centro de Estudiantes 2025</h3>
                  <p className="text-sm text-[#5a7190] mt-0.5">Última actualización: hace 2 minutos</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />En curso
                </span>
              </div>
              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-1 bg-white rounded-2xl border border-[#1a3a6b]/8 p-5">
                  <p className="text-sm font-semibold text-[#0f1f3d] mb-1 font-['Plus_Jakarta_Sans',sans-serif]">Participación</p>
                  <p className="text-xs text-[#5a7190] mb-4">Total de votantes registrados</p>
                  <div className="relative w-full aspect-square max-w-[160px] mx-auto">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#e8eef7" strokeWidth="14" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#2563eb" strokeWidth="14" strokeDasharray={`${0.58 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">58%</span>
                      <span className="text-[10px] text-[#5a7190]">Participó</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-xs text-[#5a7190]">
                    <div className="flex justify-between"><span>Votos emitidos</span><span className="font-semibold text-[#0f1f3d]">1,980</span></div>
                    <div className="flex justify-between"><span>Total habilitados</span><span className="font-semibold text-[#0f1f3d]">3,412</span></div>
                  </div>
                </div>
                <div className="col-span-2 bg-white rounded-2xl border border-[#1a3a6b]/8 p-5">
                  <p className="text-sm font-semibold text-[#0f1f3d] mb-1 font-['Plus_Jakarta_Sans',sans-serif]">Resultados por candidato</p>
                  <p className="text-xs text-[#5a7190] mb-4">Votos y porcentaje del total</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={CANDIDATES} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: "#5a7190" }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v: number) => [`${v} votos`, "Votos"]} contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e8eef7" }} />
                      <Bar dataKey="votes" radius={[0, 6, 6, 0]}>
                        {CANDIDATES.map((c, i) => <Cell key={`student-bar-${i}`} fill={c.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#1a3a6b]/8">
                  <h4 className="font-semibold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Desglose por candidato</h4>
                </div>
                <div className="divide-y divide-[#1a3a6b]/6">
                  {CANDIDATES.map((c, i) => (
                    <div key={c.id} className="px-6 py-4 flex items-center gap-4">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: `${c.color}18`, color: c.color }}>{i + 1}</div>
                      <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div><p className="text-sm font-semibold text-[#0f1f3d]">{c.name}</p><p className="text-xs text-[#5a7190]">{c.party}</p></div>
                          <div className="text-right"><p className="text-sm font-bold text-[#0f1f3d]">{c.percent}%</p><p className="text-xs text-[#5a7190]">{c.votes.toLocaleString()} votos</p></div>
                        </div>
                        <div className="h-2 rounded-full bg-[#e8eef7] overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${c.percent}%`, backgroundColor: c.color }} />
                        </div>
                      </div>
                      {i === 0 && <span className="ml-2 shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full"><Award className="w-3 h-3" /> Líder</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
