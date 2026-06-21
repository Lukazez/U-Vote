import { useState } from "react";
import { Vote, Shield, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";

interface Props {
  onLogin: (username: string) => void;
  onBack: () => void;
}

export function AdminLogin({ onLogin, onBack }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (username.trim() && password.length >= 4) {
      setError(false);
      onLogin(username.trim());
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex font-['Inter',sans-serif]">
      {/* Left panel */}
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
              <p className="text-blue-200 text-xs">Panel de Administración</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-200" />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-['Plus_Jakarta_Sans',sans-serif]">Acceso exclusivo para administradores</h2>
              <p className="mt-3 text-blue-200 text-sm leading-relaxed">
                Gestiona elecciones, candidatos y votantes desde este panel centralizado.
              </p>
            </div>
            <div className="space-y-3">
              {["Gestión completa de elecciones", "Control de candidatos y votantes", "Auditoría y trazabilidad total"].map((t) => (
                <div key={t} className="flex items-center gap-3 text-sm text-blue-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="relative z-10 text-blue-300 text-xs">© 2025 U-Vote — Universidad Digital. Todos los derechos reservados.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-[#f0f4f9] p-6">
        <div className="w-full max-w-md">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-[#5a7190] hover:text-[#1a3a6b] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-[#1a3a6b]/8 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-[#e8eef7] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#2563eb]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Acceso Administrador</h2>
                <p className="text-[#5a7190] text-xs mt-0.5">Solo personal autorizado</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(false); }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="admin@duocuc.cl"
                  className={`w-full px-4 py-3 rounded-xl bg-[#f4f7fb] border text-[#0f1f3d] placeholder:text-[#94afc7] text-sm outline-none transition-all ${error ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-[#1a3a6b]/12 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"}`}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pr-11 rounded-xl bg-[#f4f7fb] border text-[#0f1f3d] placeholder:text-[#94afc7] text-sm outline-none transition-all ${error ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-[#1a3a6b]/12 focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"}`}
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94afc7] hover:text-[#5a7190] transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Usuario o contraseña incorrectos.</span>
                </div>
              )}

              <button
                onClick={handleLogin}
                className="w-full py-3 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-semibold rounded-xl transition-all text-sm shadow-sm hover:shadow-md"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
