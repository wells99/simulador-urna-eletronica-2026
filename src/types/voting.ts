export type CargoType =
  | 'Deputado Federal'
  | 'Deputado Estadual'
  | 'Senador 1'
  | 'Senador 2'
  | 'Governador'
  | 'Presidente';

export interface CargoConfig {
  key: CargoType;
  title: string;
  digits: number;
  dbCargoName: string;
  hasVice?: boolean;
  viceTitle?: string;
  hasSuplente?: boolean;
}

export interface Candidate {
  sq_candidato: string;
  nr_candidato: string;
  nm_candidato: string;
  nm_urna_candidato: string;
  sg_partido: string;
  ds_cargo: string;
  sg_uf: string;
  nm_ue: string;
}

export interface CandidateLookupResult {
  primary: Candidate | null;
  vice: Candidate | null;
  suplente1: Candidate | null;
  suplente2: Candidate | null;
  isNulo: boolean;
}

export interface VoteRecord {
  cargoKey: CargoType;
  cargoTitle: string;
  numberEntered: string;
  type: 'CANDIDATO' | 'BRANCO' | 'NULO';
  candidateName?: string;
  candidateUrnaName?: string;
  party?: string;
  viceName?: string;
}
