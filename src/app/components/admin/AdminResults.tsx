import { useState } from "react";
import { Download, Award, Users, TrendingUp, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { MOCK_ELECTIONS, MOCK_CANDIDATES } from "./mockData";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"];

export function AdminResults() {
  const [selectedElection, setSelectedElection] = useState(MOCK_ELECTIONS[0].id);
  const [toastVisible, setToastVisible] = useState(false);

  const election = MOCK_ELECTIONS.find((e) => e.id === selectedElection) ?? MOCK_ELECTIONS[0];
  const candidates = MOCK_CANDIDATES.filter((c) => c.electionId === selectedElection);
  const totalVotes = candidates.reduce((s, c) => s + c.votes, 0) || 1;
  const pct = election.totalVoters > 0 ? Math.round((election.totalVotes / election.totalVoters) * 100) : 0;

  const pieData = candidates.map((c, i) => ({
    name: c.name.split(" ")[0],
    value: c.votes,
    fill: COLORS[i % COLORS.length],
  }));

  const barData = candidates.map((c, i) => ({
    name: c.name.split(" ")[0],
    votos: c.votes,
    fill: COLORS[i % COLORS.length],
  }));

  const handleExport = () => {
    const rows = [
      ["Candidato", "Lista", "Votos", "Porcentaje"],
      ...candidates.map((c) => [c.name, c.party, c.votes, `${Math.round((c.votes / totalVotes) * 100)}%`]),
      ["TOTAL", "", totalVotes, "100%"],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resultados_${election.title.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="space-y-5">
      {toastVisible && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#1a3a6b] text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg">
          <Download className="w-4 h-4 text-emerald-400" /> Resultados exportados como CSV
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Resultados</h2>
          <p className="text-sm text-[#5a7190]">Visualización y exportación de resultados</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedElection} onChange={(e) => setSelectedElection(Number(e.target.value))}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all">
            {MOCK_ELECTIONS.map((el) => <option key={el.id} value={el.id}>{el.title}</option>)}
          </select>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a3a6b] hover:bg-[#0f2a52] text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: "Total votos emitidos", value: election.totalVotes.toLocaleString(), icon: BarChart3, color: "text-[#2563eb]", bg: "bg-[#e8eef7]" },
          { label: "Participación", value: `${pct}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total habilitados", value: election.totalVoters.toLocaleString(), icon: Users, color: "text-[#f59e0b]", bg: "bg-amber-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#1a3a6b]/8 p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">{value}</p>
              <p className="text-xs text-[#5a7190]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 p-5">
          <p className="font-semibold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif] mb-1">Distribución de votos</p>
          <p className="text-xs text-[#5a7190] mb-4">Porcentaje por candidato</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={`pie-${i}`} fill={entry.fill} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-[#5a7190]">{v}</span>} />
              <Tooltip formatter={(v: number) => [`${v} votos`, ""]} contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e8eef7" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 p-5">
          <p className="font-semibold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif] mb-1">Votos por candidato</p>
          <p className="text-xs text-[#5a7190] mb-4">Comparativa directa</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ left: -10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#5a7190" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5a7190" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${v} votos`, "Votos"]} contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e8eef7" }} />
              <Bar dataKey="votos" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => <Cell key={`bar-${i}`} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranking table */}
      <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1a3a6b]/8">
          <h4 className="font-semibold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Tabla de resultados detallada</h4>
        </div>
        <div className="divide-y divide-[#1a3a6b]/6">
          {candidates.sort((a, b) => b.votes - a.votes).map((c, i) => {
            const p = Math.round((c.votes / totalVotes) * 100);
            return (
              <div key={c.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: `${COLORS[i]}18`, color: COLORS[i] }}>{i + 1}</div>
                <img src={c.photo} alt={c.name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-sm font-semibold text-[#0f1f3d]">{c.name}</p>
                      <p className="text-xs text-[#5a7190]">{c.party}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0f1f3d]">{p}%</p>
                      <p className="text-xs text-[#5a7190]">{c.votes.toLocaleString()} votos</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[#e8eef7] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p}%`, backgroundColor: COLORS[i] }} />
                  </div>
                </div>
                {i === 0 && (
                  <span className="ml-2 shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <Award className="w-3 h-3" /> Líder
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
