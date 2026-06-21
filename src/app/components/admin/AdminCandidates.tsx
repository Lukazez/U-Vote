import { useState } from "react";
import { Plus, Pencil, Trash2, X, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
import type { Candidate } from "./types";
import { MOCK_CANDIDATES, MOCK_ELECTIONS } from "./mockData";

const EMPTY_FORM = { name: "", party: "", electionId: 1, photo: "", description: "" };

export function AdminCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Candidate | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY_FORM }); setShowModal(true); };
  const openEdit = (c: Candidate) => {
    setEditing(c);
    setForm({ name: c.name, party: c.party, electionId: c.electionId, photo: c.photo, description: c.description });
    setShowModal(true);
  };

  const valid = form.name.trim() && form.party.trim();

  const handleSave = () => {
    if (!valid) return;
    if (editing) {
      setCandidates((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form } : c));
      showToast("Candidato actualizado");
    } else {
      setCandidates((prev) => [{ ...form, id: Date.now(), votes: 0 }, ...prev]);
      showToast("Candidato agregado");
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setCandidates((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
    showToast("Candidato eliminado");
  };

  const electionName = (id: number) => MOCK_ELECTIONS.find((e) => e.id === id)?.title ?? "—";

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#1a3a6b] text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />{toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">Gestión de Candidatos</h2>
          <p className="text-sm text-[#5a7190]">{candidates.length} candidatos registrados</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Agregar candidato
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {candidates.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-[#1a3a6b]/8 p-5 flex items-start gap-4 hover:border-[#2563eb]/20 transition-all">
            <div className="relative shrink-0">
              {c.photo ? (
                <img src={c.photo} alt={c.name} className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#e8eef7] flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-[#94afc7]" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-[#0f1f3d] truncate font-['Plus_Jakarta_Sans',sans-serif]">{c.name}</p>
                  <p className="text-xs text-[#2563eb] font-medium mt-0.5">{c.party}</p>
                  <p className="text-xs text-[#5a7190] mt-0.5 truncate">{electionName(c.electionId)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-[#5a7190] hover:bg-[#e8eef7] hover:text-[#2563eb] transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg text-[#5a7190] hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {c.description && <p className="text-xs text-[#5a7190] mt-2 line-clamp-2 leading-relaxed">{c.description}</p>}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#5a7190]">
                <div className="h-1.5 w-20 bg-[#e8eef7] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2563eb] rounded-full" style={{ width: `${Math.min(100, (c.votes / 900) * 100)}%` }} />
                </div>
                <span className="font-medium text-[#0f1f3d]">{c.votes}</span> votos
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-[#1a3a6b]/8">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a3a6b]/8">
              <h3 className="font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif]">{editing ? "Editar candidato" : "Nuevo candidato"}</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg bg-[#f4f7fb] flex items-center justify-center text-[#5a7190] hover:text-[#0f1f3d]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#e8eef7] border-2 border-dashed border-[#94afc7] flex items-center justify-center overflow-hidden shrink-0">
                  {form.photo ? (
                    <img src={form.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-[#94afc7]" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">URL de fotografía</label>
                  <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all placeholder:text-[#94afc7]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Nombre completo *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: María Fernández"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all placeholder:text-[#94afc7]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Lista / Partido *</label>
                <input value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })}
                  placeholder="Ej: Frente Estudiantil Unido"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all placeholder:text-[#94afc7]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Elección</label>
                <select value={form.electionId} onChange={(e) => setForm({ ...form, electionId: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all">
                  {MOCK_ELECTIONS.map((el) => <option key={el.id} value={el.id}>{el.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f1f3d] mb-1.5">Descripción / Propuesta</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} placeholder="Breve descripción del candidato y sus propuestas..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f4f7fb] border border-[#1a3a6b]/12 text-[#0f1f3d] text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all placeholder:text-[#94afc7] resize-none" />
              </div>
              {!valid && (
                <div className="flex items-center gap-2 text-amber-600 text-xs bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> Nombre y lista son campos requeridos
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-[#1a3a6b]/12 rounded-xl text-[#5a7190] text-sm font-medium hover:bg-[#f4f7fb] transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={!valid}
                className="flex-1 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all">
                {editing ? "Guardar cambios" : "Agregar candidato"}
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
            <h3 className="font-bold text-[#0f1f3d] font-['Plus_Jakarta_Sans',sans-serif] mb-2">¿Eliminar candidato?</h3>
            <p className="text-sm text-[#5a7190] mb-6">Esta acción eliminará permanentemente al candidato y sus datos.</p>
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
