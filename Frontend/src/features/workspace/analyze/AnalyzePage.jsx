import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { usePaperSummary } from '../../../lib/hooks';
import { MetadataBlock } from './components/MetadataBlock';
import { TLDRBlock } from './components/TLDRBlock';
import { AnalyzeAccordion } from './components/AnalyzeAccordion';

export function AnalyzePage() {
  const { paperId } = useOutletContext();
  const { data: summaryResult, isLoading, error } = usePaperSummary(paperId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs font-mono text-[var(--text-secondary)]">
        Ingesting & Summarizing Document...
      </div>
    );
  }

  if (error || !summaryResult?.data) {
    return (
      <div className="p-6 border border-rose-500/20 bg-[var(--bg-surface)] text-rose-400 rounded text-xs font-mono">
        Failed to fetch summary data. Please ensure the backend server is operational.
      </div>
    );
  }

  const payload = summaryResult.data.summary;

  const accordionSections = [
    {
      key: 'problem',
      title: 'Problem Statement',
      content: <p>{payload.problem || 'No problem statement metadata available.'}</p>
    },
    {
      key: 'methodology',
      title: 'Methodology',
      content: <p>{payload.method || 'No methodology metadata available.'}</p>
    },
    {
      key: 'results',
      title: 'Results & Evaluation',
      content: <p>{payload.results || 'No results metadata available.'}</p>
    },
    {
      key: 'limitations',
      title: 'Limitations',
      content: <p>{payload.limitations || 'No limitations metadata available.'}</p>
    },
    {
      key: 'future',
      title: 'Future Work',
      content: <p>{payload.future_work || 'No future work directions metadata available.'}</p>
    }
  ];

  return (
    <div className="space-y-6">
      <MetadataBlock 
        authors={payload.authors || 'Extracted Authors'} 
        year={payload.year || 'N/A'} 
        tags={payload.tags || ['Academic Research']} 
      />

      <TLDRBlock tldr={payload.tldr || payload.problem || 'No executive summary block extracted.'} />

      <div className="space-y-3">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] select-none">
          Detailed Analysis
        </div>
        <AnalyzeAccordion sections={accordionSections} />
      </div>
    </div>
  );
}

export default AnalyzePage;
