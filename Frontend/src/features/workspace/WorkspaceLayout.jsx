import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { ToolRail } from './components/ToolRail';
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { ReferencesPanel } from './components/ReferencesPanel';
import { usePaperSummary } from '../../lib/hooks';

export function WorkspaceLayout() {
  const { paperId } = useParams();

  // Load summary using react-query
  const { data: summaryResult, isLoading } = usePaperSummary(paperId);
  const activePaper = summaryResult?.data;

  // Initialize dynamic references list
  const [dynamicReferences, setDynamicReferences] = useState([]);
  const [highlightedReferenceId, setHighlightedReferenceId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Derive paper parameters; fallback to clean placeholder if not yet loaded
  const paper = {
    title: activePaper?.summary?.title || activePaper?.filename || 'Analyzing Research Document...',
    tags: activePaper?.summary?.tags || ['Academic Research'],
    health: activePaper ? 'Fully Analyzed' : 'Summary Only',
    references: dynamicReferences
  };

  const handleCitationClick = (referenceId) => {
    setHighlightedReferenceId(referenceId);
    setIsPanelOpen(true);
    
    setTimeout(() => {
      const element = document.getElementById(`reference-card-${referenceId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);

    setTimeout(() => {
      setHighlightedReferenceId(null);
    }, 4000);
  };

  const handleReferenceClick = (referenceId) => {
    setHighlightedReferenceId(referenceId);
  };

  // Callback to append citations discovered in chat dynamically to the references panel
  const handleAddDynamicCitation = (source) => {
    setDynamicReferences((prev) => {
      if (prev.some((ref) => ref.id === source.id)) return prev;
      return [...prev, source];
    });
  };

  const contextValue = {
    paper,
    paperId,
    onCitationClick: handleCitationClick,
    highlightedReferenceId,
    isLoading,
    onAddCitation: handleAddDynamicCitation
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center bg-[var(--bg-base)] text-sm text-[var(--text-secondary)] font-mono select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-indigo)] border-t-transparent animate-spin" />
          <span>Generating Research Index...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[var(--bg-base)]">
      <WorkspaceHeader 
        title={paper.title} 
        tags={paper.tags} 
        health={paper.health} 
      />

      <div className="flex-1 flex overflow-hidden min-h-0 w-full">
        <ToolRail paperId={paperId} />

        <div className="flex-1 overflow-y-auto bg-[var(--bg-base)] px-6 py-8 min-w-0">
          <div className="max-w-4xl mx-auto">
            <Outlet context={contextValue} />
          </div>
        </div>

        <ReferencesPanel 
          references={paper.references}
          highlightedReferenceId={highlightedReferenceId}
          onReferenceClick={handleReferenceClick}
          isOpen={isPanelOpen}
          setIsOpen={setIsPanelOpen}
        />
      </div>
    </div>
  );
}

export default WorkspaceLayout;
