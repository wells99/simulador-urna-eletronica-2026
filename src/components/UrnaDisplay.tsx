'use client';

import React from 'react';
import { CargoConfig, CandidateLookupResult } from '@/types/voting';
import { User } from 'lucide-react';

interface UrnaDisplayProps {
  currentCargo: CargoConfig;
  digitsEntered: string[];
  candidateResult: CandidateLookupResult & { isDuplicateSenator?: boolean };
  isWhiteVote: boolean;
  isFinished: boolean;
  voteStepIndex: number;
  totalSteps: number;
}

export const UrnaDisplay: React.FC<UrnaDisplayProps> = ({
  currentCargo,
  digitsEntered,
  candidateResult,
  isWhiteVote,
  isFinished,
  voteStepIndex,
  totalSteps,
}) => {
  // If voting complete -> Show FIM screen!
  if (isFinished) {
    return (
      <div className="w-full h-full bg-[#d8e2dc] border-4 border-[#a3b1a6] shadow-inner p-6 flex flex-col items-center justify-center text-center relative overflow-hidden select-none font-mono">
        <div className="absolute top-2 left-4 text-xs font-bold text-gray-600 tracking-wider">
          JUSTIÇA ELEITORAL - SIMULADOR 2026
        </div>
        <div className="my-auto flex flex-col items-center justify-center animate-pulse">
          <h1 className="text-7xl md:text-9xl font-extrabold text-black tracking-widest uppercase">
            FIM
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-800 font-bold">
            VOTAÇÃO CONCLUÍDA COM SUCESSO! 🎉
          </p>
        </div>
        <div className="absolute bottom-3 text-xs text-gray-600 font-bold">
          VOTO GRAVADO COM SUCESSO
        </div>
      </div>
    );
  }

  const isDigitsComplete = digitsEntered.length === currentCargo.digits;
  const showCandidateInfo = isDigitsComplete && !isWhiteVote && candidateResult.primary;
  const showNulo = isDigitsComplete && !isWhiteVote && candidateResult.isNulo && !candidateResult.isDuplicateSenator;
  const showDuplicateError = candidateResult.isDuplicateSenator;

  return (
    <div className="w-full h-full bg-[#dce5de] border-4 border-[#9aa99c] shadow-inner p-3 md:p-5 flex flex-col justify-between select-none font-sans text-gray-900 relative">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-400 pb-2">
        <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-700">
          JUSTIÇA ELEITORAL
        </span>
        <span className="text-xs bg-emerald-700 text-white font-semibold px-2 py-0.5 rounded">
          ETAPA {voteStepIndex + 1} DE {totalSteps}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 my-2 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-2">
            <div className="text-xs md:text-sm font-semibold uppercase text-gray-600">
              SEU VOTO VAI PARA
            </div>
            <h2 className="text-lg md:text-2xl font-black uppercase text-black tracking-wide my-1">
              {currentCargo.title}
            </h2>

            {/* Digits Boxes */}
            {!isWhiteVote && (
              <div className="flex items-center gap-1.5 md:gap-2 my-3">
                {Array.from({ length: currentCargo.digits }).map((_, idx) => {
                  const val = digitsEntered[idx] || '';
                  const isActive = idx === digitsEntered.length;
                  return (
                    <div
                      key={idx}
                      className={`w-9 h-11 md:w-11 md:h-14 border-2 border-gray-700 bg-white flex items-center justify-center text-xl md:text-3xl font-mono font-bold text-black ${
                        isActive ? 'border-emerald-600 bg-emerald-50 animate-pulse' : ''
                      }`}
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            )}

            {/* VOTO EM BRANCO */}
            {isWhiteVote && (
              <div className="my-6 text-2xl md:text-4xl font-extrabold text-black tracking-widest animate-pulse">
                VOTO EM BRANCO
              </div>
            )}

            {/* DUPLICATE SENATOR ERROR */}
            {showDuplicateError && (
              <div className="my-3 p-3 bg-amber-100 border border-amber-500 rounded text-amber-900 text-xs md:text-sm font-bold">
                ⚠️ VOCÊ JÁ VOTOU NESTE CANDIDATO PARA SENADOR! ESCOLHA UM CANDIDATO DIFERENTE PARA A 2ª VAGA.
              </div>
            )}

            {/* VOTO NULO */}
            {showNulo && (
              <div className="my-3 text-xl md:text-2xl font-bold text-gray-800">
                <div className="text-red-700 font-extrabold text-2xl md:text-3xl tracking-wider uppercase mb-1">
                  NÚMERO ERRADO
                </div>
                <div className="text-xl md:text-2xl font-black text-black tracking-wider uppercase border-t border-b border-gray-400 py-1">
                  VOTO NULO
                </div>
              </div>
            )}

            {/* CANDIDATE INFO DISPLAY */}
            {showCandidateInfo && candidateResult.primary && (
              <div className="space-y-1.5 md:space-y-2 text-xs md:text-base font-semibold text-black mt-2">
                <div>
                  <span className="text-xs text-gray-600 font-bold uppercase block">NOME:</span>
                  <span className="text-sm md:text-lg font-black text-black block uppercase">
                    {candidateResult.primary.nm_urna_candidato}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-600 font-bold uppercase block">PARTIDO:</span>
                  <span className="text-sm md:text-base font-bold text-black uppercase">
                    {candidateResult.primary.sg_partido}
                  </span>
                </div>

                {/* Vice / Suplentes */}
                {candidateResult.vice && (
                  <div className="mt-2 pt-1 border-t border-gray-400">
                    <span className="text-xs text-gray-600 font-bold uppercase block">
                      {currentCargo.key === 'Governador' ? 'VICE-GOVERNADOR:' : 'VICE-PRESIDENTE:'}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-gray-900 uppercase">
                      {candidateResult.vice.nm_urna_candidato} ({candidateResult.vice.sg_partido})
                    </span>
                  </div>
                )}

                {candidateResult.suplente1 && (
                  <div className="mt-1">
                    <span className="text-[10px] md:text-xs text-gray-600 font-bold uppercase block">
                      1º SUPLENTE: {candidateResult.suplente1.nm_urna_candidato}
                    </span>
                  </div>
                )}
                {candidateResult.suplente2 && (
                  <div>
                    <span className="text-[10px] md:text-xs text-gray-600 font-bold uppercase block">
                      2º SUPLENTE: {candidateResult.suplente2.nm_urna_candidato}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Candidate Photo Box (User Avatar Placeholder) */}
          <div className="flex flex-col items-center gap-2 pl-2">
            {/* Primary Candidate Photo Box */}
            <div className="w-24 h-28 md:w-32 md:h-36 bg-gray-200 border-2 border-gray-700 p-1 flex flex-col items-center justify-between shadow-sm">
              <div className="flex-1 w-full flex flex-col items-center justify-center bg-gray-100 border border-gray-300 rounded-sm">
                <User className="w-12 h-12 md:w-16 md:h-16 text-gray-500" />
              </div>
              <div className="text-[9px] md:text-[11px] font-bold text-center leading-tight text-gray-800 uppercase mt-1 w-full border-t border-gray-400 pt-0.5">
                foto do seu candidato
              </div>
            </div>

            {/* Vice / Suplente Photo Box */}
            {(candidateResult.vice || candidateResult.suplente1) && showCandidateInfo && (
              <div className="w-16 h-20 md:w-20 md:h-24 bg-gray-200 border border-gray-700 p-1 flex flex-col items-center justify-between shadow-sm">
                <div className="flex-1 w-full flex items-center justify-center bg-gray-100 border border-gray-300">
                  <User className="w-7 h-7 md:w-9 md:h-9 text-gray-500" />
                </div>
                <div className="text-[8px] md:text-[9px] font-bold text-center leading-tight text-gray-800 uppercase mt-0.5 border-t border-gray-300">
                  {candidateResult.vice ? 'foto do vice' : 'foto suplente'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Instructions Panel */}
      <div className="border-t border-gray-400 pt-2 text-[10px] md:text-xs font-semibold text-gray-800 leading-tight">
        <div>Aperte a tecla:</div>
        <div className="font-bold text-emerald-900 mt-0.5">
          CONFIRMA <span className="font-normal text-gray-700">para CONFIRMAR este voto</span>
        </div>
        <div className="font-bold text-amber-900">
          CORRIGE <span className="font-normal text-gray-700">para REINICIAR este voto</span>
        </div>
      </div>
    </div>
  );
};
