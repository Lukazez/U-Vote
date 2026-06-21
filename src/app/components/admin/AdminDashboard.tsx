import { Vote, Users, BarChart3, TrendingUp, ChevronRight, Clock, CheckCircle2, Calendar } from "lucide-react";
import { MOCK_ELECTIONS, MOCK_CANDIDATES, MOCK_VOTERS } from "./mockData";
import type { AdminScreen } from "./types";

interface Props {
  onNavigate: (screen: AdminScreen) => void;
}

const STATUS_LABEL: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: "Activa", color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  scheduled: { label: "Programada", color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-400" },
  closed: { label: "Cerrada", color: "text-slate-600 bg-slate-100 border-slate-200", dot: "bg-slate-400" },
};

export function AdminDashboard({ onNavigate }: Props) {
  const totalVoters = MOCK_VOTERS.length;
  const enabledVoters = MOCK_VOTERS.filter((v) => v.enabled).length;
  const totalVotes = MOCK_ELECTIONS.reduce((s, e) => s + e.totalVotes, 0);
  const activeCount = MOCK_ELECTIONS.filter((e) => e.status === "active").length;

  const stats = [
    { label: "Elecciones activas", value: String(activeCount), icon: Vote, color: "text-[#2563eb]", bg: "bg-[#e8eef7]", sub: `${MOCK_ELECTIONS.length} en total` },
    { label: "Estudiantes habilitados", value: String(enabledVoters), icon: Users, color: "text-emerald-600", bg: "bg-emerald-50", sub: `de ${totalVoters} registrados` },
    { label: "Votos emitidos", value: totalVotes.toLocaleString(), icon: TrendingUp, color: "text-[#f59e0b]", bg: "bg-amber-50", sub: "en todas las elecciones" },
    { label: "Candidatos activos", value: String(MOCK_CANDIDATES.length), icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50", sub: "en elección actual" },
  ];

  const quickActions = [
    { label: "Gestionar Elecciones", sub: "Crear, editar o publicar elecciones", icon: Vote, screen: "elections" as AdminScreen },
    { label: "Gestionar Candidatos", sub: "Agregar, editar o eliminar candidatos", icon: Users, screen: "candidates" as AdminScreen },
    { label: "Gestionar Votantes", sub: "Habilitar o deshabilitar estudiantes", icon: CheckCircle2, screen: "voters" as AdminScreen },
    { label: "Ver Resultados", sub: "Gráficos y exportación de datos", icon: BarChart3, screen: "results" as AdminScreen },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#1a3a6b]/8 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#5a7190] font-medium">{label}</p>
                <p className="text-3xl font-bold text-[#0f1f3d] mt-1 font-['Plus_Jakarta_Sans',sans-serif]">{value}</p>
                <p className="text-xs text-[#5a7190] mt-1">{sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Elections list */}
      <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1a3a6b]/8 flex items-center justify-between">
          <h3 className="font-semibold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Resumen de elecciones</h3>
          <button onClick={() => onNavigate("elections")} className="text-xs text-[#2563eb] hover:underline font-medium flex items-center gap-1">
            Ver todas <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="divide-y divide-[#1a3a6b]/6">
          {MOCK_ELECTIONS.map((e) => {
            const st = STATUS_LABEL[e.status];
            const pct = e.totalVoters > 0 ? Math.round((e.totalVotes / e.totalVoters) * 100) : 0;
            return (
              <div key={e.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#e8eef7] flex items-center justify-center shrink-0">
                  <Vote className="w-4 h-4 text-[#2563eb]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#0f1f3d] truncate">{e.title}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex-1 max-w-[200px]">
                      <div className="h-1.5 bg-[#e8eef7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-[#5a7190]">{e.totalVotes.toLocaleString()} / {e.totalVoters.toLocaleString()} votos ({pct}%)</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#5a7190] shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{e.endDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-semibold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif] mb-4">Accesos rápidos</h3>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map(({ label, sub, icon: Icon, screen }) => (
            <button
              key={label}
              onClick={() => onNavigate(screen)}
              className="bg-white rounded-2xl border border-[#1a3a6b]/8 p-5 flex flex-col gap-3 hover:border-[#2563eb]/30 hover:shadow-sm transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e8eef7] flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#2563eb]" />
              </div>
              <div>
                <p className="font-semibold text-[#0f1f3d] text-sm group-hover:text-[#2563eb] transition-colors">{label}</p>
                <p className="text-xs text-[#5a7190] mt-0.5 leading-snug">{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#94afc7] group-hover:text-[#2563eb] transition-colors mt-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
