'use client';

import React, { useState, useMemo } from 'react';
import { searchCandidates } from '@/lib/candidatosService';
import { Candidate } from '@/types/voting';
import { Search, X, User, CheckCircle } from 'lucide-react';

interface CandidateSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCandidate?: (candidate: Candidate) => void;
}

export const CandidateSearchModal: React.FC<CandidateSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCandidate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cargoFilter, setCargoFilter] = useState<string>('TODOS');

  const filteredCandidates = useMemo(() => {
    return searchCandidates(searchTerm, cargoFilter);
  }, [searchTerm, cargoFilter]);

  if (!isOpen) return null;

  const cargoOptions = [
    'TODOS',
    'Presidente',
    'Governador',
    'Senador',
    'Deputado Federal',
    'Deputado Estadual',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-6 h-6 text-emerald-300" />
            <div>
              <h2 className="text-lg md:text-xl font-bold">Consulta de Números dos Candidatos</h2>
              <p className="text-xs text-emerald-200">
                Pesquise por nome, número ou partido do seu candidato (Ceará / Brasil 2026)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-700 transition text-emerald-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o nome do candidato (ex: Lula, Ciro, Elmano, Kleyton) ou número..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-sm md:text-base outline-none transition"
            />
          </div>

          {/* Cargo Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {cargoOptions.map((cargo) => (
              <button
                key={cargo}
                onClick={() => setCargoFilter(cargo)}
                className={`px-3 py-1.5 text-xs md:text-sm font-semibold rounded-full whitespace-nowrap transition ${
                  cargoFilter === cargo
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {cargo}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="font-bold text-base">Nenhum candidato encontrado</p>
              <p className="text-xs text-gray-400 mt-1">Tente pesquisar por outro nome ou mudar o filtro do cargo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredCandidates.map((c) => (
                <div
                  key={c.sq_candidato || `${c.nr_candidato}-${c.nm_urna_candidato}`}
                  className="bg-white border border-gray-200 rounded-lg p-3 hover:border-emerald-500 hover:shadow-md transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {/* User Avatar Placeholder */}
                    <div className="w-12 h-14 bg-gray-100 border border-gray-300 rounded flex flex-col items-center justify-center p-1">
                      <User className="w-7 h-7 text-gray-500" />
                      <span className="text-[7px] text-gray-600 font-bold uppercase text-center mt-0.5 leading-none">
                        Foto seu candidato
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                        {c.ds_cargo}
                      </div>
                      <div className="text-sm md:text-base font-extrabold text-gray-900 uppercase">
                        {c.nm_urna_candidato}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">
                        Partido: <span className="text-black font-bold">{c.sg_partido}</span>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Number Badge */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-gray-900 text-amber-400 font-mono font-extrabold text-lg md:text-xl px-3 py-1 rounded tracking-wider shadow-sm">
                      {c.nr_candidato}
                    </span>
                    {onSelectCandidate && (
                      <button
                        onClick={() => {
                          onSelectCandidate(c);
                          onClose();
                        }}
                        className="text-[11px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1 transition"
                      >
                        <CheckCircle className="w-3 h-3" /> Usar Número
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-600">
          <span>Mostrando <strong>{filteredCandidates.length}</strong> candidatos</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded transition"
          >
            Fechar Consulta
          </button>
        </div>
      </div>
    </div>
  );
};
