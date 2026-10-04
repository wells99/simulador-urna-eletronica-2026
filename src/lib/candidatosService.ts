import rawCandidates from '@/data/candidatos_2026.json';
import { Candidate, CandidateLookupResult, CargoType } from '@/types/voting';

export const CANDIDATES_DATA: Candidate[] = rawCandidates as Candidate[];

export function lookupCandidateByCargoAndNumber(
  cargoKey: CargoType,
  numberEntered: string,
  previousSenatorVoteNumber?: string
): CandidateLookupResult & { isDuplicateSenator?: boolean } {
  if (!numberEntered) {
    return { primary: null, vice: null, suplente1: null, suplente2: null, isNulo: false };
  }

  // Senator 2 validation
  if (cargoKey === 'Senador 2' && previousSenatorVoteNumber && numberEntered === previousSenatorVoteNumber) {
    return {
      primary: null,
      vice: null,
      suplente1: null,
      suplente2: null,
      isNulo: false,
      isDuplicateSenator: true,
    };
  }

  let dbCargoName = '';
  let dbViceName = '';

  switch (cargoKey) {
    case 'Deputado Federal':
      dbCargoName = 'Deputado Federal';
      break;
    case 'Deputado Estadual':
      dbCargoName = 'Deputado Estadual';
      break;
    case 'Senador 1':
    case 'Senador 2':
      dbCargoName = 'Senador';
      break;
    case 'Governador':
      dbCargoName = 'Governador';
      dbViceName = 'Vice-governador';
      break;
    case 'Presidente':
      dbCargoName = 'Presidente';
      dbViceName = 'Vice-presidente';
      break;
  }

  const primary = CANDIDATES_DATA.find(
    (c) => c.ds_cargo === dbCargoName && c.nr_candidato === numberEntered
  ) || null;

  const vice = dbViceName
    ? CANDIDATES_DATA.find((c) => c.ds_cargo === dbViceName && c.nr_candidato === numberEntered) || null
    : null;

  const suplente1 =
    cargoKey === 'Senador 1' || cargoKey === 'Senador 2'
      ? CANDIDATES_DATA.find((c) => c.ds_cargo === '1º Suplente' && c.nr_candidato === numberEntered) || null
      : null;

  const suplente2 =
    cargoKey === 'Senador 1' || cargoKey === 'Senador 2'
      ? CANDIDATES_DATA.find((c) => c.ds_cargo === '2º Suplente' && c.nr_candidato === numberEntered) || null
      : null;

  const isNulo = !primary;

  return { primary, vice, suplente1, suplente2, isNulo };
}

export function searchCandidates(query: string, cargoFilter: string = 'TODOS'): Candidate[] {
  const cleanQuery = query.toLowerCase().trim();

  return CANDIDATES_DATA.filter((c) => {
    // Exclude vices/suplentes from main search list to keep list clean, unless query matches specifically
    if (c.ds_cargo === 'Vice-governador' || c.ds_cargo === 'Vice-presidente' || c.ds_cargo.includes('Suplente')) {
      return false;
    }

    if (cargoFilter !== 'TODOS') {
      if (cargoFilter === 'Senador' && c.ds_cargo !== 'Senador') return false;
      if (cargoFilter === 'Deputado Federal' && c.ds_cargo !== 'Deputado Federal') return false;
      if (cargoFilter === 'Deputado Estadual' && c.ds_cargo !== 'Deputado Estadual') return false;
      if (cargoFilter === 'Governador' && c.ds_cargo !== 'Governador') return false;
      if (cargoFilter === 'Presidente' && c.ds_cargo !== 'Presidente') return false;
    }

    if (!cleanQuery) return true;

    return (
      c.nm_urna_candidato.toLowerCase().includes(cleanQuery) ||
      c.nm_candidato.toLowerCase().includes(cleanQuery) ||
      c.nr_candidato.includes(cleanQuery) ||
      c.sg_partido.toLowerCase().includes(cleanQuery)
    );
  });
}
