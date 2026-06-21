import type { Election, Candidate, Voter, AuditLog } from "./types";

export const MOCK_ELECTIONS: Election[] = [
  {
    id: 1,
    title: "Elección Centro de Estudiantes 2025",
    startDate: "2025-06-10",
    endDate: "2025-06-20",
    status: "active",
    totalVotes: 1980,
    totalVoters: 3412,
  },
  {
    id: 2,
    title: "Delegados Facultad de Ingeniería",
    startDate: "2025-07-01",
    endDate: "2025-07-05",
    status: "scheduled",
    totalVotes: 0,
    totalVoters: 840,
  },
  {
    id: 3,
    title: "Representante Consejo Académico 2024",
    startDate: "2024-11-01",
    endDate: "2024-11-10",
    status: "closed",
    totalVotes: 2100,
    totalVoters: 3200,
  },
];

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 1,
    name: "María Fernández",
    party: "Frente Estudiantil Unido",
    electionId: 1,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&auto=format",
    description: "Comprometida con mejorar los espacios de estudio y la conectividad del campus.",
    votes: 892,
  },
  {
    id: 2,
    name: "Diego Herrera",
    party: "Movimiento Universitario",
    electionId: 1,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
    description: "Enfocado en la transparencia administrativa y el bienestar estudiantil.",
    votes: 534,
  },
  {
    id: 3,
    name: "Catalina Torres",
    party: "Alianza Académica",
    electionId: 1,
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&auto=format",
    description: "Propone becas ampliadas y más actividades culturales en el campus.",
    votes: 376,
  },
  {
    id: 4,
    name: "Andrés Morales",
    party: "Renovación Campus",
    electionId: 1,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format",
    description: "Impulsa la digitalización de trámites y modernización de servicios.",
    votes: 178,
  },
];

export const MOCK_VOTERS: Voter[] = [
  { id: 1, name: "Camila Rodríguez", email: "c.rodriguez@duocuc.cl", career: "Ing. de Sistemas", semester: 7, enabled: true, voted: true },
  { id: 2, name: "Felipe Núñez", email: "f.nunez@duocuc.cl", career: "Administración", semester: 4, enabled: true, voted: true },
  { id: 3, name: "Valentina Soto", email: "v.soto@duocuc.cl", career: "Diseño Gráfico", semester: 3, enabled: true, voted: false },
  { id: 4, name: "Sebastián Vega", email: "s.vega@duocuc.cl", career: "Ing. Civil", semester: 8, enabled: true, voted: true },
  { id: 5, name: "Isidora Campos", email: "i.campos@duocuc.cl", career: "Enfermería", semester: 2, enabled: false, voted: false },
  { id: 6, name: "Matías Rojas", email: "m.rojas@duocuc.cl", career: "Arquitectura", semester: 6, enabled: true, voted: false },
  { id: 7, name: "Paula Vargas", email: "p.vargas@duocuc.cl", career: "Ing. de Sistemas", semester: 5, enabled: true, voted: true },
  { id: 8, name: "Tomás Espinoza", email: "t.espinoza@duocuc.cl", career: "Contabilidad", semester: 3, enabled: false, voted: false },
  { id: 9, name: "Javiera Muñoz", email: "j.munoz@duocuc.cl", career: "Administración", semester: 6, enabled: true, voted: true },
  { id: 10, name: "Nicolás Pérez", email: "n.perez@duocuc.cl", career: "Diseño Gráfico", semester: 1, enabled: true, voted: false },
];

export const MOCK_AUDIT: AuditLog[] = [
  { id: 1, date: "18/06/2025", time: "10:42", admin: "admin@duocuc.cl", action: "Publicó elección", target: "Centro de Estudiantes 2025", category: "election" },
  { id: 2, date: "18/06/2025", time: "10:15", admin: "admin@duocuc.cl", action: "Agregó candidato", target: "María Fernández", category: "candidate" },
  { id: 3, date: "17/06/2025", time: "16:30", admin: "superadmin@duocuc.cl", action: "Habilitó votante", target: "Felipe Núñez", category: "voter" },
  { id: 4, date: "17/06/2025", time: "14:00", admin: "admin@duocuc.cl", action: "Editó candidato", target: "Diego Herrera", category: "candidate" },
  { id: 5, date: "16/06/2025", time: "09:20", admin: "superadmin@duocuc.cl", action: "Creó elección", target: "Delegados Facultad Ing.", category: "election" },
  { id: 6, date: "15/06/2025", time: "11:45", admin: "admin@duocuc.cl", action: "Deshabilitó votante", target: "Isidora Campos", category: "voter" },
  { id: 7, date: "14/06/2025", time: "08:00", admin: "superadmin@duocuc.cl", action: "Exportó resultados", target: "Consejo Académico 2024", category: "system" },
  { id: 8, date: "13/06/2025", time: "17:10", admin: "admin@duocuc.cl", action: "Eliminó candidato", target: "Candidato prueba", category: "candidate" },
];
