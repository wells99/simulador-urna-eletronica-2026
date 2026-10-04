'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { CargoConfig, CargoType, VoteRecord, Candidate } from '@/types/voting';
import { lookupCandidateByCargoAndNumber } from '@/lib/candidatosService';
import { playKeyBeep, playUrnaEndChime } from '@/lib/soundEffects';
import { UrnaDisplay } from '@/components/UrnaDisplay';
import { UrnaKeypad } from '@/components/UrnaKeypad';
import { CandidateSearchModal } from '@/components/CandidateSearchModal';
import { VotingSummaryModal } from '@/components/VotingSummaryModal';
import { Search, RotateCcw, Award, Info, Sparkles } from 'lucide-react';

const CARGOS_SEQUENCE: CargoConfig[] = [
  {
    key: 'Deputado Federal',
    title: 'DEPUTADO FEDERAL',
    digits: 4,
    dbCargoName: 'Deputado Federal',
  },
  {
    key: 'Deputado Estadual',
    title: 'DEPUTADO ESTADUAL',
    digits: 5,
    dbCargoName: 'Deputado Estadual',
  },
  {
    key: 'Senador 1',
    title: 'SENADOR (1ª VAGA)',
    digits: 3,
    dbCargoName: 'Senador',
    hasSuplente: true,
  },
  {
    key: 'Senador 2',
    title: 'SENADOR (2ª VAGA)',
    digits: 3,
    dbCargoName: 'Senador',
    hasSuplente: true,
  },
  {
    key: 'Governador',
    title: 'GOVERNADOR',
    digits: 2,
    dbCargoName: 'Governador',
    hasVice: true,
    viceTitle: 'VICE-GOVERNADOR',
  },
  {
    key: 'Presidente',
    title: 'PRESIDENTE DA REPÚBLICA',
    digits: 2,
    dbCargoName: 'Presidente',
    hasVice: true,
    viceTitle: 'VICE-PRESIDENTE',
  },
];

export default function Home() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [digitsEntered, setDigitsEntered] = useState<string[]>([]);
  const [isWhiteVote, setIsWhiteVote] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [votesHistory, setVotesHistory] = useState<VoteRecord[]>([]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const currentCargo = CARGOS_SEQUENCE[currentStepIndex] || CARGOS_SEQUENCE[0];

  // Get Senator 1 vote number if currently on Senator 2
  const senator1VoteNumber = useMemo(() => {
    const s1Record = votesHistory.find((v) => v.cargoKey === 'Senador 1');
    return s1Record ? s1Record.numberEntered : undefined;
  }, [votesHistory]);

  // Candidate Lookup Result for current entered digits
  const candidateResult = useMemo(() => {
    const numberStr = digitsEntered.join('');
    return lookupCandidateByCargoAndNumber(currentCargo.key, numberStr, senator1VoteNumber);
  }, [currentCargo.key, digitsEntered, senator1VoteNumber]);

  // Handle Number Key Press
  const handleNumberPress = useCallback(
    (num: string) => {
      if (isFinished || isWhiteVote) return;
      if (digitsEntered.length < currentCargo.digits) {
        playKeyBeep();
        setDigitsEntered((prev) => [...prev, num]);
      }
    },
    [isFinished, isWhiteVote, digitsEntered.length, currentCargo.digits]
  );

  // Handle BRANCO Button
  const handleBrancoPress = useCallback(() => {
    if (isFinished) return;
    playKeyBeep();
    setDigitsEntered([]);
    setIsWhiteVote(true);
  }, [isFinished]);

  // Handle CORRIGE Button
  const handleCorrigePress = useCallback(() => {
    if (isFinished) return;
    playKeyBeep();
    setDigitsEntered([]);
    setIsWhiteVote(false);
  }, [isFinished]);

  // Handle CONFIRMA Button
  const handleConfirmaPress = useCallback(() => {
    if (isFinished) return;

    const numberStr = digitsEntered.join('');
    const isCompleteDigits = digitsEntered.length === currentCargo.digits;

    // Must either be BRANCO or complete digit entry to confirm
    if (!isWhiteVote && !isCompleteDigits) {
      playKeyBeep();
      return; // Digits incomplete
    }

    // Check Senator 2 duplicate error
    if (candidateResult.isDuplicateSenator) {
      playKeyBeep();
      return;
    }

    playKeyBeep();

    // Build vote record
    let newRecord: VoteRecord;
    if (isWhiteVote) {
      newRecord = {
        cargoKey: currentCargo.key,
        cargoTitle: currentCargo.title,
        numberEntered: '',
        type: 'BRANCO',
      };
    } else if (candidateResult.primary) {
      newRecord = {
        cargoKey: currentCargo.key,
        cargoTitle: currentCargo.title,
        numberEntered: numberStr,
        type: 'CANDIDATO',
        candidateName: candidateResult.primary.nm_candidato,
        candidateUrnaName: candidateResult.primary.nm_urna_candidato,
        party: candidateResult.primary.sg_partido,
        viceName: candidateResult.vice?.nm_urna_candidato,
      };
    } else {
      newRecord = {
        cargoKey: currentCargo.key,
        cargoTitle: currentCargo.title,
        numberEntered: numberStr,
        type: 'NULO',
      };
    }

    const updatedHistory = [...votesHistory, newRecord];
    setVotesHistory(updatedHistory);

    // Next step
    if (currentStepIndex < CARGOS_SEQUENCE.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setDigitsEntered([]);
      setIsWhiteVote(false);
    } else {
      // Finished all votes!
      setIsFinished(true);
      playUrnaEndChime();
    }
  }, [
    isFinished,
    digitsEntered,
    currentCargo.digits,
    currentCargo.key,
    currentCargo.title,
    isWhiteVote,
    candidateResult,
    votesHistory,
    currentStepIndex,
  ]);

  // Restart Voting Session
  const handleRestart = useCallback(() => {
    playKeyBeep();
    setCurrentStepIndex(0);
    setDigitsEntered([]);
    setIsWhiteVote(false);
    setIsFinished(false);
    setVotesHistory([]);
  }, []);

  // Quick select candidate number from search modal
  const handleSelectCandidateFromSearch = useCallback(
    (candidate: Candidate) => {
      // Find step matching candidate's cargo
      let targetIndex = -1;
      if (candidate.ds_cargo === 'Deputado Federal') targetIndex = 0;
      else if (candidate.ds_cargo === 'Deputado Estadual') targetIndex = 1;
      else if (candidate.ds_cargo === 'Senador') targetIndex = 2;
      else if (candidate.ds_cargo === 'Governador') targetIndex = 4;
      else if (candidate.ds_cargo === 'Presidente') targetIndex = 5;

      if (targetIndex !== -1 && targetIndex === currentStepIndex) {
        setDigitsEntered(candidate.nr_candidato.split(''));
        setIsWhiteVote(false);
      }
    },
    [currentStepIndex]
  );

  return (
    <main className="min-h-screen bg-[#e5dfd5] text-gray-900 flex flex-col justify-between p-3 md:p-6 relative">
      {/* Top Title & Subtitle Header */}
      <header className="w-full max-w-5xl mx-auto text-center my-2 space-y-1.5">
        <div className="inline-flex items-center gap-2 bg-emerald-800 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-300" /> Eleições 2026 - Ceará & Brasil
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
          Simulador de Voto
        </h1>
        <p className="text-base md:text-lg font-bold text-emerald-800">
          Instruindo pequenos cidadãos.
        </p>
        <p className="text-xs md:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed border-t border-gray-300 pt-1.5">
          Este simulador utiliza informações públicas do TSE para o estado do Ceará com o objetivo de demonstrar a crianças como funciona o processo eleitoral de 2026.
        </p>
      </header>

      {/* Main Urna Container */}
      <div className="w-full max-w-5xl mx-auto my-3">
        <div className="bg-[#dbd5c9] border-8 border-[#c4bcae] rounded-2xl shadow-2xl p-4 md:p-8 flex flex-col lg:flex-row gap-6 items-stretch justify-between relative">
          {/* Machine Header Logo */}
          <div className="absolute -top-6 left-8 bg-[#262626] text-amber-400 font-extrabold text-xs md:text-sm px-4 py-1 rounded-md shadow border border-amber-500/40 tracking-wider">
            URNA ELETRÔNICA SIMULADA
          </div>

          {/* Left Side: LCD Display Screen */}
          <div className="flex-1 min-h-[360px] md:min-h-[440px] flex">
            <UrnaDisplay
              currentCargo={currentCargo}
              digitsEntered={digitsEntered}
              candidateResult={candidateResult}
              isWhiteVote={isWhiteVote}
              isFinished={isFinished}
              voteStepIndex={currentStepIndex}
              totalSteps={CARGOS_SEQUENCE.length}
            />
          </div>

          {/* Right Side: Keypad */}
          <div className="flex items-center justify-center">
            <UrnaKeypad
              onNumberPress={handleNumberPress}
              onBrancoPress={handleBrancoPress}
              onCorrigePress={handleCorrigePress}
              onConfirmaPress={handleConfirmaPress}
            />
          </div>
        </div>
      </div>

      {/* Footer Area with Action Buttons */}
      <footer className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-300">
        {/* Bottom Left Button: Candidate Search (As requested in objetivo.md) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-extrabold text-xs md:text-sm rounded-lg shadow-md transition flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-emerald-300" />
            🔍 Pesquisar Candidatos (Colinha)
          </button>
        </div>

        {/* Status / Reset Actions */}
        <div className="flex items-center gap-2">
          {isFinished && (
            <button
              onClick={() => setIsSummaryOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs md:text-sm rounded-lg shadow transition flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" /> Ver Resumo dos Votos
            </button>
          )}

          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs md:text-sm rounded-lg shadow transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Reiniciar Simulação
          </button>
        </div>
      </footer>

      {/* Candidate Search Modal */}
      <CandidateSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCandidate={handleSelectCandidateFromSearch}
      />

      {/* Voting Summary Modal */}
      <VotingSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        votes={votesHistory}
        onRestart={handleRestart}
      />
    </main>
  );
}
