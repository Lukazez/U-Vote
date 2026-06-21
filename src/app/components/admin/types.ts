export type AdminScreen =
  | "dashboard"
  | "elections"
  | "candidates"
  | "voters"
  | "results"
  | "audit";

export interface Election {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "closed";
  totalVotes: number;
  totalVoters: number;
}

export interface Candidate {
  id: number;
  name: string;
  party: string;
  electionId: number;
  photo: string;
  description: string;
  votes: number;
}

export interface Voter {
  id: number;
  name: string;
  email: string;
  career: string;
  semester: number;
  enabled: boolean;
  voted: boolean;
}

export interface AuditLog {
  id: number;
  date: string;
  time: string;
  admin: string;
  action: string;
  target: string;
  category: "election" | "candidate" | "voter" | "system";
}
