'use client';

import React from 'react';
import { VoteRecord } from '@/types/voting';
import { CheckCircle2, RotateCcw, Award, X } from 'lucide-react';

interface VotingSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  votes: VoteRecord[];
  onRestart: () => void;
}

export const VotingSummaryModal: React.FC<VotingSummaryModalProps> = ({
  isOpen,
  onClose,
  votes,
  onRestart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-7 h-7 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold">Resumo da Sua Votação</h2>
              <p className="text-xs text-emerald-200">Parabéns por exercitar seu direito de cidadão!</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-emerald-700 text-emerald-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* List of Votes */}
        <div className="p-4 md:p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {votes.map((vote, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block">
                  {vote.cargoTitle}
                </span>
                {vote.type === 'CANDIDATO' ? (
                  <div>
                    <div className="text-base font-extrabold text-gray-900 uppercase">
                      {vote.candidateUrnaName || vote.candidateName}
                    </div>
                    <div className="text-xs text-gray-600 font-semibold">
                      Partido: <span className="font-bold text-black">{vote.party}</span>
                    </div>
                    {vote.viceName && (
                      <div className="text-xs text-gray-500 font-medium">
                        Vice: {vote.viceName}
                      </div>
                    )}
                  </div>
                ) : vote.type === 'BRANCO' ? (
                  <div className="text-base font-extrabold text-gray-700 uppercase">VOTO EM BRANCO</div>
                ) : (
                  <div className="text-base font-extrabold text-red-700 uppercase">VOTO NULO</div>
                )}
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-500 block">Número</span>
                <span className="text-lg md:text-xl font-mono font-black text-gray-900 bg-white px-2 py-0.5 border border-gray-300 rounded shadow-sm">
                  {vote.numberEntered || '---'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-900 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Todos os 6 votos foram registrados com sucesso!</span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                onRestart();
                onClose();
              }}
              className="flex-1 md:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow transition flex items-center justify-center gap-2 text-sm"
            >
              <RotateCcw className="w-4 h-4" /> Votar Novamente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
