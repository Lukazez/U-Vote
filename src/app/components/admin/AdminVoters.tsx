import { useState } from "react";
import { Plus, Search, UserCheck, UserX, Trash2, X, CheckCircle2, Filter } from "lucide-react";
import type { Voter } from "./types";
import { MOCK_VOTERS } from "./mockData";

const CAREERS = ["Todas", "Ing. de Sistemas", "Administración", "Diseño Gráfico", "Ing. Civil", "Enfermería", "Arquitectura", "Contabilidad"];

const EMPTY_VOTER = { name: "", email: "", career: "Ing. de Sistemas", semester: 1, enabled: true, voted: false };

export function AdminVoters() {
  const [voters, setVoters] = useState<Voter[]>(MOCK_VOTERS);
  const [search, setSearch] = useState("");
  const [filterCareer, setFilterCareer] = useState("Todas");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_VOTER });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const filtered = voters.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase());
    const matchCareer = filterCareer === "Todas" || v.career === filterCareer;
    const matchStatus = filterStatus === "Todos" || (filterStatus === "Habilitados" ? v.enabled : !v.enabled);
    return matchSearch && matchCareer && matchStatus;
  });

  const toggleEnabled = (id: number) => {
    setVoters((prev) => prev.map((v) => {
      if (v.id !== id) return v;
      showToast(v.enabled ? "Votante deshabilitado" : "Votante habilitado");
      return { ...v, enabled: !v.enabled };
    }));
  };

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setVoters((prev) => [{ ...form, id: Date.now() }, ...prev]);
    setShowModal(false);
    showToast("Estudiante agregado correctamente");
    setForm({ ...EMPTY_VOTER });
  };

  const handleDelete = () => {
    setVoters((prev) => prev.filter((v) => v.id !== deleteId));
    setDeleteId(null);
    showToast("Estudiante eliminado");
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#1a3a6b] text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />{toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Gestión de Votantes</h2>
          <p className="text-sm text-[#5a7190]">{voters.filter(v => v.enabled).length} habilitados · {voters.length} registrados</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Agregar estudiante
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94afc7]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all placeholder:text-[#94afc7]" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#5a7190]" />
          <select value={filterCareer} onChange={(e) => setFilterCareer(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] transition-all">
            {CAREERS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] transition-all">
            {["Todos", "Habilitados", "Deshabilitados"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a3a6b]/8 bg-[#f4f7fb]">
                {["Estudiante", "Correo", "Carrera", "Semestre", "Estado", "Voto", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#5a7190] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a3a6b]/6">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-[#5a7190] text-sm">
                    No se encontraron estudiantes con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-[#f4f7fb]/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 uppercase">
                          {v.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <span className="font-medium text-[#0f1f3d] whitespace-nowrap">{v.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#5a7190]">{v.email}</td>
                    <td className="px-5 py-4 text-[#5a7190] whitespace-nowrap">{v.career}</td>
                    <td className="px-5 py-4 text-center text-[#5a7190]">{v.semester}°</td>
                    <td className="px-5 py-4">
                      {v.enabled ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Habilitado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />Deshabilitado
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {v.voted ? (
                        <span className="text-xs font-semibold text-[#2563eb]">Votó</span>
                      ) : (
                        <span className="text-xs text-[#94afc7]">Pendiente</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleEnabled(v.id)} title={v.enabled ? "Deshabilitar" : "Habilitar"}
                          className={`p-1.5 rounded-lg transition-colors ${v.enabled ? "text-red-400 hover:bg-red-50 hover:text-red-600" : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"}`}>
                          {v.enabled ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setDeleteId(v.id)} className="p-1.5 rounded-lg text-[#5a7190] hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-[#1a3a6b]/8">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a3a6b]/8">
              <h3 className="font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Agregar estudiante</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-[#f4f7fb] flex items-center justify-center text-[#5a7190] hover:text-[#0f1f3d]"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Nombre completo *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Juan Pérez"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-sm text-[#0f1f3d] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all placeholder:text-[#94afc7]" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Correo institucional *</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="j.perez@duocuc.cl"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-sm text-[#0f1f3d] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all placeholder:text-[#94afc7]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Carrera</label>
                  <select value={form.career} onChange={(e) => setForm({ ...form, career: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-sm text-[#0f1f3d] outline-none focus:border-[#2563eb] transition-all">
                    {CAREERS.filter(c => c !== "Todas").map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Semestre</label>
                  <select value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-sm text-[#0f1f3d] outline-none focus:border-[#2563eb] transition-all">
                    {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>{s}° semestre</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#1a3a6b]/12 rounded-xl text-[#5a7190] text-sm font-medium hover:bg-[#f4f7fb] transition-colors">Cancelar</button>
              <button onClick={handleAdd} disabled={!form.name.trim() || !form.email.trim()}
                className="flex-1 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all">
                Agregar estudiante
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-[#1a3a6b]/8 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif] mb-2">¿Eliminar estudiante?</h3>
            <p className="text-sm text-[#5a7190] mb-6">Se eliminará permanentemente del registro de votantes.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-[#1a3a6b]/12 rounded-xl text-[#5a7190] text-sm font-medium hover:bg-[#f4f7fb]">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
