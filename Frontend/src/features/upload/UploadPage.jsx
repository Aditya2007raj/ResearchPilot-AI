import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragAndDrop } from './components/DragAndDrop';
import { UploadProgressBar } from './components/UploadProgressBar';
import { ROUTES } from '../../lib/routes';
import { useUploadPaper } from '../../lib/hooks';
import { 
  FileUp, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  ArrowLeft, 
  Clock, 
  User, 
  FileText 
} from 'lucide-react';

const UPLOAD_STATES = {
  INITIAL: 'initial',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error'
};

export function UploadPage() {
  const navigate = useNavigate();
  
  const [uploadState, setUploadState] = useState(UPLOAD_STATES.INITIAL);
  const [file, setFile] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [pipelineSteps, setPipelineSteps] = useState({
    extracted: false,
    chunked: false,
    embeddings: false,
    vectorDb: false
  });

  // Real response properties
  const [ingestedId, setIngestedId] = useState('');
  const [meta, setMeta] = useState({
    title: '',
    author: 'Extracted PDF Metadata',
    pageCount: 1,
    readingTime: 'Estimated Read Time'
  });

  const uploadMutation = useUploadPaper((percent) => {
    setProgress(percent);
    
    // Smoothly tick processing milestones based on progress feedback
    setPipelineSteps({
      extracted: percent >= 25,
      chunked: percent >= 50,
      embeddings: percent >= 75,
      vectorDb: percent >= 95
    });
  });

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
    setProgress(0);
    setPipelineSteps({
      extracted: false,
      chunked: false,
      embeddings: false,
      vectorDb: false
    });
    setUploadState(UPLOAD_STATES.UPLOADING);

    uploadMutation.mutate(selectedFile, {
      onSuccess: (data) => {
        setIngestedId(data.file_id);
        const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setMeta({
          title: cleanName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          author: 'Author Info (Analyzed Summary)',
          pageCount: 12, // Default fallback, overwritten during Analysis GET
          readingTime: '15 min read'
        });
        setUploadState(UPLOAD_STATES.SUCCESS);
      },
      onError: (err) => {
        setErrorType('upload-failure');
        setErrorMessage(err.response?.data?.detail || err.message || 'Processing failed');
        setUploadState(UPLOAD_STATES.ERROR);
      }
    });
  };

  const handleDragError = (type) => {
    setErrorType(type);
    setErrorMessage(null);
    setUploadState(UPLOAD_STATES.ERROR);
  };

  const handleRetry = () => {
    setFile(null);
    setProgress(0);
    setErrorType(null);
    setErrorMessage(null);
    setUploadState(UPLOAD_STATES.INITIAL);
  };

  const handleOpenWorkspace = () => {
    // Dynamic navigation based on the actual ingested file ID returned by backend
    const workspacePath = ROUTES.WORKSPACE_ANALYZE.replace(':paperId', ingestedId);
    navigate(workspacePath);
  };

  const getErrorContent = () => {
    if (errorMessage) {
      return {
        title: 'Ingestion Error',
        message: errorMessage
      };
    }
    switch (errorType) {
      case 'invalid-file':
        return {
          title: 'Invalid File Type',
          message: 'ResearchPilot only accepts valid academic PDF documents. Please check the file and try again.'
        };
      case 'file-too-large':
        return {
          title: 'File Too Large',
          message: 'The selected PDF exceeds the 50MB limit. Compress the document before uploading.'
        };
      case 'password-protected':
        return {
          title: 'Protected Document',
          message: 'The PDF is password protected. Please upload an unlocked version of the paper.'
        };
      case 'upload-failure':
      default:
        return {
          title: 'Ingestion Failed',
          message: 'An unexpected error occurred while parsing and embedding the paper. Please try again.'
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 select-none space-y-8">
      <div>
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-indigo)]"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {uploadState === UPLOAD_STATES.INITIAL && (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-indigo)]">
              Workspace Setup
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Initialize Research Workspace
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-xl mx-auto">
              Upload academic papers to extract insights, map citations, and generate actionable roadmaps.
            </p>
          </div>

          <DragAndDrop onFileSelected={handleFileSelected} onError={handleDragError} />
        </div>
      )}

      {uploadState === UPLOAD_STATES.UPLOADING && (
        <div className="p-8 border border-[var(--border-subtle)] rounded-lg bg-[var(--bg-surface)] space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded bg-[var(--bg-base)] flex items-center justify-center text-[var(--accent-indigo)] border border-[var(--border-subtle)]">
              <FileUp className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
                {file?.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
                {(file?.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          <UploadProgressBar progress={progress} pipelineSteps={pipelineSteps} />
        </div>
      )}

      {uploadState === UPLOAD_STATES.SUCCESS && (
        <div className="p-8 border border-[var(--accent-cyan)]/20 bg-[var(--bg-surface)] rounded-lg space-y-8">
          <div className="flex items-center gap-3 text-[var(--accent-cyan)]">
            <CheckCircle className="w-6 h-6 shrink-0" />
            <h2 className="text-lg font-semibold font-sans tracking-tight">
              Research Workspace Initialized
            </h2>
          </div>

          <div className="border-t border-b border-[var(--border-subtle)] py-6 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Parsed Document Title
              </span>
              <h3 className="text-md font-medium text-[var(--text-primary)] leading-snug">
                {meta.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span className="truncate">{meta.author}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>{meta.pageCount} pages</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>{meta.readingTime}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleOpenWorkspace}
              className="flex-1 px-5 py-2.5 rounded bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white text-sm font-medium transition-all duration-150 active:scale-[0.99] cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-indigo)]"
            >
              Open Workspace
            </button>
            <button
              onClick={handleRetry}
              className="px-5 py-2.5 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-secondary)] text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-indigo)]"
            >
              Upload Another Paper
            </button>
          </div>
        </div>
      )}

      {uploadState === UPLOAD_STATES.ERROR && (
        <div className="p-8 border border-rose-500/20 bg-[var(--bg-surface)] rounded-lg space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded bg-rose-500/5 border border-rose-500/10 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-sm font-medium text-[var(--text-primary)]">
                {getErrorContent().title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {getErrorContent().message}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[var(--border-subtle)]">
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white text-sm font-medium transition-all duration-150 active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-indigo)]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Ingestion</span>
            </button>
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="px-5 py-2.5 rounded border border-[var(--border-subtle)] hover:bg-[var(--bg-base)] text-[var(--text-secondary)] text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-indigo)]"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
