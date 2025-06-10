'use client';
import React, { useState } from 'react';
import CombinationTable from '@/components/combinationtable';
import ProcessTable from '@/components/processtable';
import { typography } from './styles/typography';

export default function Home() {
  const [tab, setTab] = useState<'combination' | 'process'>('combination');

  return (
    <main className="min-h-screen p-8 bg-white/60">
      <h1 className={`${typography.Title1} mb-8 text-black`}>Workflow Combinations</h1>
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2 rounded-t-lg border-b-2 transition-colors duration-200 ${tab === 'combination' ? 'border-[var(--color-brand-orange)] bg-white text-black font-bold' : 'border-transparent bg-transparent text-black/60'}`}
          onClick={() => setTab('combination')}
        >
          Combination
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg border-b-2 transition-colors duration-200 ${tab === 'process' ? 'border-[var(--color-brand-orange)] bg-white text-black font-bold' : 'border-transparent bg-transparent text-black/60'}`}
          onClick={() => setTab('process')}
        >
          Process
        </button>
      </div>
      {tab === 'combination' ? <CombinationTable /> : <ProcessTable />}
    </main>
  );
}
