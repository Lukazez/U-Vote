import { useState } from "react";
import { Plus, Pencil, Trash2, Globe, Lock, Calendar, X, CheckCircle2, AlertCircle } from "lucide-react";
import type { Election } from "./types";
import { MOCK_ELECTIONS } from "./mockData";

const STATUS_STYLE: Record<string, { label: string; color: string; dot: string }> = {
  active: { label: "Activa", color: "text-emerald-700 bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  scheduled: { label: "Programada", color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-400" },
  closed: { label: "Cerrada", color: "text-slate-600 bg-slate-100 border-slate-200", dot: "bg-slate-400" },
};

const EMPTY: Omit<Election, "id" | "totalVotes" | "totalVoters"> = {
  title: "",
  startDate: "",
  endDate: "",
  status: "scheduled",
};

export function AdminElections() {
  const [elections, setElections] = useState<Election[]>(MOCK_ELECTIONS);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Election | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setShowModal(true);
  };

  const openEdit = (e: Election) => {
    setEditing(e);
    setForm({ title: e.title, startDate: e.startDate, endDate: e.endDate, status: e.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title || !form.startDate || !form.endDate) return;
    if (editing) {
      setElections((prev) => prev.map((e) => e.id === editing.id ? { ...e, ...form } : e));
      showToast("Elección actualizada correctamente");
    } else {
      const newEl: Election = { ...form, id: Date.now(), totalVotes: 0, totalVoters: 0 };
      setElections((prev) => [newEl, ...prev]);
      showToast("Elección creada correctamente");
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setElections((prev) => prev.filter((e) => e.id !== deleteId));
    setDeleteId(null);
    showToast("Elección eliminada");
  };

  const toggleStatus = (id: number) => {
    setElections((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const next = e.status === "active" ? "closed" : e.status === "closed" ? "scheduled" : "active";
        showToast(`Elección ${next === "active" ? "publicada" : next === "closed" ? "cerrada" : "programada"}`);
        return { ...e, status: next };
      })
    );
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#1a3a6b] text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Gestión de Elecciones</h2>
          <p className="text-sm text-[#5a7190]">{elections.length} elecciones registradas</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Nueva elección
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#1a3a6b]/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a3a6b]/8 bg-[#f4f7fb]">
                {["Título", "Inicio", "Término", "Estado", "Participación", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-[#5a7190] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a3a6b]/6">
              {elections.map((e) => {
                const st = STATUS_STYLE[e.status];
                const pct = e.totalVoters > 0 ? Math.round((e.totalVotes / e.totalVoters) * 100) : 0;
                return (
                  <tr key={e.id} className="hover:bg-[#f4f7fb]/60 transition-colors">
                    <td className="px-5 py-4 font-medium text-[#0f1f3d] max-w-[220px]">
                      <p className="truncate">{e.title}</p>
                    </td>
                    <td className="px-5 py-4 text-[#5a7190] whitespace-nowrap">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{e.startDate}</div>
                    </td>
                    <td className="px-5 py-4 text-[#5a7190] whitespace-nowrap">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{e.endDate}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${st.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="flex-1 h-1.5 bg-[#e8eef7] rounded-full overflow-hidden">
                          <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-[#5a7190] shrink-0">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleStatus(e.id)} title={e.status === "active" ? "Cerrar" : "Publicar"}
                          className={`p-1.5 rounded-lg transition-colors ${e.status === "active" ? "text-red-400 hover:bg-red-50 hover:text-red-600" : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"}`}>
                          {e.status === "active" ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg text-[#5a7190] hover:bg-[#e8eef7] hover:text-[#2563eb] transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(e.id)} className="p-1.5 rounded-lg text-[#5a7190] hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-[#1a3a6b]/8">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a3a6b]/8">
              <h3 className="font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">{editing ? "Editar elección" : "Nueva elección"}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-[#f4f7fb] flex items-center justify-center text-[#5a7190] hover:text-[#0f1f3d] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Título de la elección</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ej: Centro de Estudiantes 2025"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all placeholder:text-[#94afc7]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Fecha de inicio</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Fecha de término</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Estado inicial</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all">
                  <option value="scheduled">Programada</option>
                  <option value="active">Activa (publicar ahora)</option>
                  <option value="closed">Cerrada</option>
                </select>
              </div>
              {(!form.title || !form.startDate || !form.endDate) && (
                <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Todos los campos son requeridos
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#1a3a6b]/12 rounded-xl text-[#5a7190] text-sm font-medium hover:bg-[#f4f7fb] transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={!form.title || !form.startDate || !form.endDate}
                className="flex-1 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all">
                {editing ? "Guardar cambios" : "Crear elección"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-[#1a3a6b]/8 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif] mb-2">¿Eliminar elección?</h3>
            <p className="text-sm text-[#5a7190] mb-6">Esta acción no se puede deshacer. Los datos asociados se perderán.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-[#1a3a6b]/12 rounded-xl text-[#5a7190] text-sm font-medium hover:bg-[#f4f7fb] transition-colors">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-all">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
