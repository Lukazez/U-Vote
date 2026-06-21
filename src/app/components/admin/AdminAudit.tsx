import { useState } from "react";
import { Search, Filter, Vote, Users, Settings, Shield } from "lucide-react";
import { MOCK_AUDIT } from "./mockData";
import type { AuditLog } from "./types";

const CATEGORY_STYLE: Record<AuditLog["category"], { label: string; color: string; icon: React.ElementType }> = {
  election: { label: "Elección", color: "text-[#2563eb] bg-[#e8eef7] border-[#2563eb]/20", icon: Vote },
  candidate: { label: "Candidato", color: "text-purple-700 bg-purple-50 border-purple-200", icon: Users },
  voter: { label: "Votante", color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: Users },
  system: { label: "Sistema", color: "text-slate-700 bg-slate-100 border-slate-200", icon: Settings },
};

export function AdminAudit() {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas");

  const filtered = logs.filter((l) => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase())
      || l.target.toLowerCase().includes(search.toLowerCase())
      || l.admin.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "Todas" || CATEGORY_STYLE[l.category].label === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Historial y Auditoría</h2>
        <p className="text-sm text-[#5a7190]">{logs.length} registros de actividad</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {(["election", "candidate", "voter", "system"] as AuditLog["category"][]).map((cat) => {
          const st = CATEGORY_STYLE[cat];
          const Icon = st.icon;
          const count = logs.filter((l) => l.category === cat).length;
          return (
            <div key={cat} className="bg-white rounded-2xl border border-[#1a3a6b]/8 p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${st.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">{count}</p>
                <p className="text-xs text-[#5a7190]">{st.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94afc7]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por acción, objetivo o administrador..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all placeholder:text-[#94afc7]" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#5a7190]" />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] transition-all">
            {["Todas", "Elección", "Candidato", "Votante", "Sistema"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Log table */}
      <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a3a6b]/8 bg-[#f4f7fb]">
                {["Fecha", "Hora", "Administrador", "Acción", "Objetivo", "Categoría"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#5a7190] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a3a6b]/6">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#5a7190] text-sm">No hay registros que coincidan con la búsqueda.</td>
                </tr>
              ) : (
                filtered.map((log) => {
                  const st = CATEGORY_STYLE[log.category];
                  const Icon = st.icon;
                  return (
                    <tr key={log.id} className="hover:bg-[#f4f7fb]/60 transition-colors">
                      <td className="px-5 py-4 text-[#5a7190] whitespace-nowrap text-xs">{log.date}</td>
                      <td className="px-5 py-4 text-[#5a7190] whitespace-nowrap text-xs font-mono">{log.time}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 uppercase">
                            {log.admin[0]}
                          </div>
                          <span className="text-xs text-[#5a7190]">{log.admin}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-[#0f1f3d] text-sm">{log.action}</td>
                      <td className="px-5 py-4 text-[#5a7190] text-sm max-w-[180px] truncate">{log.target}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${st.color}`}>
                          <Icon className="w-3 h-3" />{st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#1a3a6b]/8 bg-[#f4f7fb]">
          <p className="text-xs text-[#5a7190]">Mostrando {filtered.length} de {logs.length} registros</p>
        </div>
      </div>
    </div>
  );
}
