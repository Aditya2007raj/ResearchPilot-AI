import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Layers, 
  Search, 
  GitMerge, 
  CheckCircle, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  BookOpen, 
  Sparkles, 
  Shield, 
  Cpu,
  CornerDownRight,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Terminal,
  Activity,
  GitBranch,
  Network,
  HelpCircle,
  FileCode,
  FolderGit2,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';

export function LandingPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeTab, setActiveTab] = useState('meta');
  
  // Interactive 3D Hero Workspace State
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  // SVG Knowledge Graph Widget State
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphHoveredNode, setGraphHoveredNode] = useState(null);
  
  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState([
    { role: 'user', content: 'What are the main findings of this paper?' },
    { role: 'assistant', content: 'The paper identifies key challenges, proposed solutions, supporting evidence, and future directions. Every response is linked back to the source material.' }
  ]);
  const [isChatTyping, setIsChatTyping] = useState(false);

  // Intersection Observer for scroll reveals
  const revealRefs = useRef([]);
  revealRefs.current = [];

  const addToRevealRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.15 });

    revealRefs.current.forEach((ref) => observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const handleHeroMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Smooth angle rotation (max 8 degrees)
    const factorX = 8 / (box.height / 2);
    const factorY = 8 / (box.width / 2);
    
    setRotate({ x: -y * factorX, y: x * factorY });
  };

  const handleHeroMouseEnter = () => {
    setIsHoveringHero(true);
  };

  const handleHeroMouseLeave = () => {
    setIsHoveringHero(false);
    setRotate({ x: 0, y: 0 });
  };

  const handleStartResearch = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 700);
  };

  // Mock Question handler for interactive simulator
  const handleAskQuestion = (question, answer) => {
    if (isChatTyping) return;
    setIsChatTyping(true);
    
    // Add User message
    const updatedMessages = [
      ...chatMessages,
      { role: 'user', content: question }
    ];
    setChatMessages(updatedMessages);

    // Simulate system typing response
    setTimeout(() => {
      setChatMessages([
        ...updatedMessages,
        { role: 'assistant', content: answer }
      ]);
      setIsChatTyping(false);
    }, 1200);
  };

  // Graph Data
  const graphNodes = [
    { id: 'n1', label: 'Attention Is All You Need (Vaswani)', x: 120, y: 80, val: 'Transformer foundations', citationCount: 92430 },
    { id: 'n2', label: 'BERT (Devlin et al.)', x: 70, y: 170, val: 'Bidirectional representations', citationCount: 45120 },
    { id: 'n3', label: 'GPT-3 (Brown et al.)', x: 230, y: 140, val: 'Few-shot learners scale', citationCount: 22100 },
    { id: 'n4', label: 'LoRA (Hu et al.)', x: 180, y: 240, val: 'Low-rank adaptation constraints', citationCount: 9800 },
    { id: 'n5', label: 'LLaMA (Touvron et al.)', x: 310, y: 220, val: 'Open foundation models', citationCount: 15400 },
  ];

  const graphLinks = [
    { source: 'n1', target: 'n2' },
    { source: 'n1', target: 'n3' },
    { source: 'n2', target: 'n4' },
    { source: 'n3', target: 'n4' },
    { source: 'n3', target: 'n5' },
    { source: 'n4', target: 'n5' }
  ];

  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-500 font-sans selection:bg-[var(--accent-indigo)] selection:text-white overflow-x-hidden">
      
      {/* 1. CINEMATIC GRADIENT MESH BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[800px] h-[800px] rounded-full bg-indigo-600/5 dark:bg-indigo-600/10 blur-[170px] animate-orb-one" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/5 blur-[150px] animate-orb-two" />
        <div className="absolute w-[900px] h-[900px] rounded-full bg-purple-600/5 dark:bg-purple-600/5 blur-[200px] animate-orb-three" />
        
        {/* Dynamic theme-aware grid backdrop */}
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none" />
      </div>

      {/* Page Flash Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] dark:bg-[#0b0b0c] animate-fade-in pointer-events-none">
          <div className="w-32 h-1 bg-[var(--border-subtle)] overflow-hidden rounded-full mb-6">
            <div className="h-full bg-[var(--accent-indigo)] w-2/3 animate-loading-bar" />
          </div>
          <span className="font-mono text-xs tracking-[0.25em] text-[var(--text-secondary)] uppercase animate-pulse">
            Booting ResearchOS Shell
          </span>
        </div>
      )}

      {/* Embedded CSS for custom high-fidelity animation classes */}
      <style>{`
        /* Slow-motion orb systems */
        @keyframes orbOne {
          0% { transform: translate(-20%, 10%) scale(1); }
          50% { transform: translate(20%, 30%) scale(1.15); }
          100% { transform: translate(-20%, 10%) scale(1); }
        }
        @keyframes orbTwo {
          0% { transform: translate(40%, -10%) scale(1.1); }
          50% { transform: translate(10%, 40%) scale(0.95); }
          100% { transform: translate(40%, -10%) scale(1.1); }
        }
        @keyframes orbThree {
          0% { transform: translate(15%, 50%) scale(0.95); }
          50% { transform: translate(50%, 10%) scale(1.1); }
          100% { transform: translate(15%, 50%) scale(0.95); }
        }
        .animate-orb-one { animation: orbOne 25s ease-in-out infinite; left: -10%; top: 5%; }
        .animate-orb-two { animation: orbTwo 28s ease-in-out infinite; right: -5%; top: 15%; }
        .animate-orb-three { animation: orbThree 30s ease-in-out infinite; left: 20%; bottom: 10%; }

        /* Grid Background pattern adapting to theme borders */
        .bg-cyber-grid {
          background-size: 60px 60px;
          background-image: 
            linear-gradient(to right, var(--border-subtle) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px);
          opacity: 0.15;
        }

        /* Float effects */
        @keyframes floatSlow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float-slow {
          animation: floatSlow 9s ease-in-out infinite;
        }
        
        @keyframes floatMedium {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-22px) rotate(-1.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float-medium {
          animation: floatMedium 11s ease-in-out infinite;
        }

        @keyframes laserScan {
          0% { top: 0%; opacity: 0.7; }
          50% { top: 100%; opacity: 0.7; }
          100% { top: 0%; opacity: 0.7; }
        }
        .animate-laser {
          animation: laserScan 4.5s ease-in-out infinite;
        }

        /* Pulse glow for graph nodes */
        @keyframes nodePulse {
          0% { r: 6px; opacity: 0.3; }
          50% { r: 11px; opacity: 0.8; }
          100% { r: 6px; opacity: 0.3; }
        }
        .animate-node-pulse {
          animation: nodePulse 2.8s infinite ease-in-out;
        }

        /* Scroll reveals */
        .reveal-block {
          opacity: 0;
          transform: translateY(30px) scale(0.99);
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Loading progress overlay animation */
        @keyframes loadingBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loadingBar 1.6s infinite ease-in-out;
        }

        /* Diagonal stripes */
        .diag-stripes {
          background-image: repeating-linear-gradient(45deg, var(--border-subtle) 0px, var(--border-subtle) 2px, transparent 2px, transparent 12px);
        }

        /* Unified Premium Card Hover Effects */
        .hover-card-premium {
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-card-premium:hover {
          transform: translateY(-5px) scale(1.015);
          border-color: var(--accent-indigo);
          box-shadow: 0 15px 35px rgba(99, 102, 241, 0.08);
        }
      `}</style>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/85 backdrop-blur-md px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[var(--accent-indigo)] flex items-center justify-center text-white font-mono font-black tracking-tighter shadow-lg shadow-indigo-500/20">
            RP
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-extrabold tracking-widest uppercase">ResearchPilot</span>
            <span className="text-[9px] text-[var(--accent-cyan)] font-mono tracking-widest uppercase">Operating System</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2.5 rounded-lg hover:bg-[var(--bg-base)] transition-all border border-[var(--border-subtle)] flex items-center justify-center text-xs text-[var(--text-primary)]"
            aria-label="Toggle visual theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button
            onClick={handleStartResearch}
            className="px-5 py-2.5 text-xs font-mono font-bold rounded bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white transition-all shadow-lg shadow-indigo-500/10 flex items-center gap-2 group"
          >
            Access Console <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative z-20">

        {/* 1. HERO SECTION */}
        <section className="px-8 pt-16 pb-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          {/* Hero Left Content */}
          <div className="flex-1 text-left flex flex-col items-start">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 text-[var(--accent-cyan)] text-[10px] font-mono uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 animate-pulse" /> The Scientific Knowledge Matrix
            </div>

            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight leading-[1.05] text-[var(--text-primary)] mb-4">
              A Living AI<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-indigo)] to-[var(--accent-cyan)]">
                Research OS.
              </span>
            </h1>

            <p className="text-sm md:text-lg text-[var(--text-secondary)] font-mono max-w-xl mb-5 leading-relaxed">
              Understand academic papers faster and make better decisions. Query, review, and organize insights verified back to source evidence.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full">
              <button
                onClick={handleStartResearch}
                className="px-8 py-4 font-mono text-xs font-bold rounded bg-gradient-to-r from-[var(--accent-indigo)] to-[var(--accent-indigo-hover)] text-white shadow-xl shadow-indigo-500/15 transition-all duration-300 flex items-center gap-3 active:scale-95 hover:scale-[1.03]"
              >
                Launch ResearchOS <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Micro Telemetry HUD readout */}
            <div className="mt-8 flex gap-10 border-t border-[var(--border-subtle)] pt-6 w-full max-w-lg font-mono text-[10px] text-[var(--text-muted)]">
              <div>
                <span className="block text-[var(--text-secondary)] font-bold mb-1">RAG Context Array</span>
                <span>Active 1024-D Vectors</span>
              </div>
              <div>
                <span className="block text-[var(--text-secondary)] font-bold mb-1">Citation Integrity</span>
                <span>0% Coordinates Loss</span>
              </div>
              <div>
                <span className="block text-[var(--text-secondary)] font-bold mb-1">Verification Model</span>
                <span>Trace-Anchored Parsing</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Expanded Visual Density Workspace */}
          <div className="flex-1 w-full flex items-center justify-center relative">
            
            {/* Dynamic Mouse-tracked 3D Window Container */}
            <div 
              onMouseMove={handleHeroMouseMove}
              onMouseEnter={handleHeroMouseEnter}
              onMouseLeave={handleHeroMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transition: isHoveringHero ? 'none' : 'transform 0.5s ease-out',
              }}
              className="w-full max-w-[560px] aspect-[4/3] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-xl shadow-2xl overflow-hidden relative group cursor-grab active:cursor-grabbing"
            >
              {/* Window Header */}
              <div className="h-10 border-b border-[var(--border-subtle)] px-4 flex items-center justify-between bg-[var(--bg-base)]/50">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] tracking-wider">research_workspace.sys</span>
                <span className="w-4" />
              </div>

              {/* Spatial Layout with Sidebar */}
              <div className="flex h-[calc(100%-2.5rem)] font-mono text-[10px]">
                
                {/* Left File Explorer Sidebar */}
                <div className="w-1/4 border-r border-[var(--border-subtle)] bg-[var(--bg-base)]/30 p-2 flex flex-col gap-2">
                  <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-wider font-bold mb-1 block">Ingested Papers</span>
                  <div className="flex items-center gap-1.5 p-1 rounded bg-[var(--accent-indigo)]/10 text-[var(--text-primary)] text-[8px] font-bold">
                    <FileText className="w-3 h-3 text-[var(--accent-indigo)]" />
                    <span>vaswani_2017.pdf</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 text-[var(--text-muted)] text-[8px]">
                    <FileText className="w-3 h-3" />
                    <span>lora_bounds.pdf</span>
                  </div>
                </div>

                {/* Central Canvas */}
                <div className="flex-1 p-3 flex flex-col gap-2">
                  <div className="flex-1 border border-[var(--border-subtle)] rounded bg-[var(--bg-base)]/40 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 diag-stripes pointer-events-none opacity-20" />
                    
                    {/* Central Node */}
                    <div className="absolute z-10 w-16 h-16 rounded-full bg-[var(--accent-indigo)]/5 border border-[var(--accent-indigo)]/30 flex flex-col items-center justify-center text-center p-1 shadow-lg">
                      <Network className="w-4 h-4 text-[var(--accent-indigo)]" />
                      <span className="text-[6px] font-bold uppercase tracking-tighter">Core Node</span>
                    </div>

                    {/* Connected Orbiting Nodes */}
                    <div className="absolute top-4 left-6 p-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center gap-1 shadow">
                      <FileText className="w-3 h-3 text-[var(--accent-cyan)]" />
                      <span>Vaswani_2017</span>
                    </div>

                    <div className="absolute bottom-4 right-6 p-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center gap-1 shadow animate-pulse">
                      <Activity className="w-3 h-3 text-emerald-500" />
                      <span>N = 70,000</span>
                    </div>

                    {/* Canvas SVG Connecting Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <line x1="25%" y1="20%" x2="50%" y2="50%" stroke="var(--accent-indigo)" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                      <line x1="75%" y1="80%" x2="50%" y2="50%" stroke="var(--accent-indigo)" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                    </svg>
                  </div>

                  {/* Telemetry Status Readout */}
                  <div className="border border-[var(--border-subtle)] p-2 rounded bg-[var(--bg-base)]/50 text-[9px] flex items-center justify-between text-[var(--text-muted)]">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[var(--accent-cyan)]" />
                      <span className="text-[var(--text-secondary)]">RAG Array:</span>
                      <span className="text-green-500 font-bold">STABLE_SYNC</span>
                    </div>
                    <span>12 ms delay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Workspace Artifact 1: Paper Ingest */}
            <div className="absolute -left-8 top-1/4 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur shadow-2xl w-48 pointer-events-none select-none animate-float-slow z-30">
              <div className="flex items-center gap-1.5 text-[8px] font-mono text-[var(--accent-indigo)] mb-2.5">
                <FileText className="w-3.5 h-3.5" /> upload_ingestion.sys
              </div>
              <div className="text-[10px] font-bold mb-1.5 text-[var(--text-primary)]">attention_is_all.pdf</div>
              <div className="w-full h-1 bg-[var(--border-subtle)] rounded overflow-hidden">
                <div className="h-full bg-[var(--accent-indigo)] w-4/5 animate-pulse" />
              </div>
            </div>

            {/* Floating Workspace Artifact 2: Critique Score */}
            <div className="absolute -right-10 bottom-1/4 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur shadow-2xl w-44 pointer-events-none select-none animate-float-medium z-30">
              <div className="flex items-center gap-1.5 text-[8px] font-mono text-[var(--accent-cyan)] mb-2.5">
                <Shield className="w-3.5 h-3.5" /> critique_matrix
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[var(--text-primary)]">Methodology</span>
                <span className="px-2 py-0.5 rounded bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] text-[8px] font-bold font-mono">A+ Grounded</span>
              </div>
            </div>

          </div>
        </section>

        {/* 2. THE MANIFESTO: WHAT & WHY IT EXISTS */}
        <section ref={addToRevealRefs} className="reveal-block border-t border-[var(--border-subtle)] px-8 py-36 bg-[var(--bg-surface)]/30 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <span className="text-[10px] font-mono text-[var(--accent-indigo)] uppercase tracking-widest block mb-3">System Manifesto</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">Built for verification.<br />Not text generation.</h2>
            
            <p className="text-sm md:text-base text-[var(--text-secondary)] font-mono max-w-3xl leading-relaxed mb-12">
              Traditional AI models ignore spatial structures. ResearchPilot links claims directly back to the PDF coordinates, assuring proof verification.
            </p>

            <div className="grid md:grid-cols-2 gap-10 text-sm font-mono mt-12">
              <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)]/50 hover-card-premium shadow-sm">
                <h3 className="font-bold text-red-500 mb-5 flex items-center gap-2">
                  <span>✕</span> Traditional Chatbots
                </h3>
                <ul className="space-y-4 text-[var(--text-secondary)] text-xs leading-relaxed">
                  <li>• Fabricate metrics and citations.</li>
                  <li>• Restricted to single document contexts.</li>
                  <li>• Lose historical structural relationships.</li>
                </ul>
              </div>

              <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)]/50 hover-card-premium shadow-sm">
                <h3 className="font-bold text-[var(--accent-indigo)] mb-5 flex items-center gap-2">
                  <span>✓</span> ResearchPilot Operating System
                </h3>
                <ul className="space-y-4 text-[var(--text-secondary)] text-xs leading-relaxed">
                  <li>• Trace claims to direct page highlights.</li>
                  <li>• Map citation lines across the library.</li>
                  <li>• Automated consensus checking rules.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WORKFLOW: STEP-BY-STEP WORKFLOW WALKTHROUGH */}
        <section ref={addToRevealRefs} className="reveal-block border-t border-[var(--border-subtle)] px-8 py-36 max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-20">
            <span className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest block mb-3">System Pipeline</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">The Complete Research Loop</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 font-mono">
            <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover-card-premium">
              <div className="text-[10px] text-[var(--accent-indigo)] font-bold mb-3">01 / INGEST</div>
              <h4 className="text-xs font-bold mb-2">Ingestion</h4>
              <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                Drop multiple files to parse metadata DOIs.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover-card-premium">
              <div className="text-[10px] text-[var(--accent-cyan)] font-bold mb-3">02 / ANALYZE</div>
              <h4 className="text-xs font-bold mb-2">Consensus</h4>
              <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                Map cross-paper datasets automatically.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover-card-premium">
              <div className="text-[10px] text-[var(--accent-indigo)] font-bold mb-3">03 / REVIEW</div>
              <h4 className="text-xs font-bold mb-2">Validation</h4>
              <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                Verify assertions using PDF anchor highlights.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover-card-premium">
              <div className="text-[10px] text-[var(--accent-cyan)] font-bold mb-3">04 / SYNTHESIZE</div>
              <h4 className="text-xs font-bold mb-2">Outlining</h4>
              <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                Export markdown matrices ready for drafting.
              </p>
            </div>
          </div>
        </section>

        {/* 4. WORKSPACE PREVIEW: INTERACTIVE ENGINE */}
        <section ref={addToRevealRefs} className="reveal-block border-t border-[var(--border-subtle)] px-8 py-36 bg-[var(--bg-surface)]/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-[10px] font-mono text-[var(--accent-indigo)] uppercase tracking-widest block mb-3">Workspace Simulator</span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">Interactive Knowledge Engine</h2>
              <p className="text-sm text-[var(--text-secondary)] font-mono max-w-2xl mx-auto">
                Research is more than reading PDFs. ResearchPilot connects summaries, reviews, citations, action plans, and AI conversations into a single workspace so you can understand papers faster and make better decisions.
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-10">
              
              {/* Node Citation Map (Card 1) */}
              <div className="lg:col-span-3 border border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-surface)]/60 overflow-hidden flex flex-col h-[480px] shadow-lg hover-card-premium">
                <div className="h-12 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-[var(--accent-indigo)] font-bold uppercase tracking-wider flex items-center gap-2">
                    <Network className="w-4 h-4" /> Connected Research Insights
                  </span>
                  <span className="text-[8px] text-[var(--text-muted)]">Hover nodes to view citation paths</span>
                </div>

                <div className="text-[10px] text-[var(--text-secondary)] border-b border-[var(--border-subtle)] pb-2 mb-2 mx-4 mt-3 font-mono">
                  See how ideas, claims, and references connect across a document instead of searching through pages manually.
                </div>
                
                <div className="flex-1 relative bg-[var(--bg-base)]/10 flex items-center justify-center p-2">
                  <svg className="w-full h-full min-h-[250px]" viewBox="0 0 500 350" width="100%" height="100%">
                    <g transform="translate(60, -45)">
                      {/* Render Links */}
                      {graphLinks.map((link, idx) => {
                        const sourceNode = graphNodes.find(n => n.id === link.source);
                        const targetNode = graphNodes.find(n => n.id === link.target);
                        
                        const isHighlighted = (graphHoveredNode === link.source || graphHoveredNode === link.target);

                        return (
                          <line
                            key={idx}
                            x1={sourceNode.x}
                            y1={sourceNode.y}
                            x2={targetNode.x}
                            y2={targetNode.y}
                            stroke={isHighlighted ? 'var(--accent-cyan)' : 'var(--border-subtle)'}
                            strokeWidth={isHighlighted ? 2 : 1}
                            strokeDasharray={isHighlighted ? 'none' : '3,3'}
                            className="transition-all duration-300"
                          />
                        );
                      })}

                      {/* Render Nodes */}
                      {graphNodes.map((node) => {
                        const isHovered = graphHoveredNode === node.id;
                        const isSelected = selectedNode?.id === node.id;

                        return (
                          <g 
                            key={node.id} 
                            className="cursor-pointer group"
                            onMouseEnter={() => setGraphHoveredNode(node.id)}
                            onMouseLeave={() => setGraphHoveredNode(null)}
                            onClick={() => setSelectedNode(node)}
                          >
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={isHovered || isSelected ? 9 : 7}
                              fill={isHovered ? 'var(--accent-cyan)' : isSelected ? 'var(--accent-indigo)' : 'var(--bg-surface)'}
                              stroke={isHovered || isSelected ? 'var(--text-primary)' : 'var(--text-muted)'}
                              strokeWidth={1.5}
                              className="transition-all duration-200"
                            />
                            {(isHovered || isSelected) && (
                              <circle
                                cx={node.x}
                                cy={node.y}
                                r={14}
                                fill="none"
                                stroke="var(--accent-cyan)"
                                strokeWidth={0.5}
                                className="animate-node-pulse"
                              />
                            )}
                            <text
                              x={node.x + 12}
                              y={node.y + 4}
                              fill={isHovered || isSelected ? 'var(--text-primary)' : 'var(--text-muted)'}
                              fontSize="8.5"
                              fontFamily="monospace"
                              className="font-bold select-none transition-colors duration-200"
                            >
                              {node.id.toUpperCase()}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </svg>

                  {/* Selected Node Details Card Overlay */}
                  {selectedNode && (
                    <div className="absolute bottom-20 left-4 right-4 p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 shadow-lg flex items-center justify-between text-xs font-mono animate-fade-in">
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{selectedNode.label}</div>
                        <div className="text-[9px] text-[var(--accent-cyan)] mt-0.5">{selectedNode.val}</div>
                      </div>
                      <div className="text-[9px] text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)]" onClick={() => setSelectedNode(null)}>✕</div>
                    </div>
                  )}
                </div>

                {/* Permanent Card Description Footer */}
                <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 font-mono text-[9px] text-[var(--text-muted)]">
                  Explore relationships between important findings and supporting evidence.
                </div>
              </div>

              {/* Interactive Chat Console (Card 2) */}
              <div className="lg:col-span-2 border border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-surface)]/60 overflow-hidden flex flex-col h-[480px] shadow-lg hover-card-premium">
                <div className="h-12 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-[var(--accent-cyan)] font-bold uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Ask Questions. Get Evidence.
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>

                {/* Message Log */}
                <div className="flex-1 p-4 overflow-y-auto font-mono text-[9px] space-y-3.5 flex flex-col scrollbar-thin">
                  <div className="text-[10px] text-[var(--text-secondary)] border-b border-[var(--border-subtle)] pb-2 mb-2">
                    Chat with your research paper and receive answers grounded in the original document.
                  </div>
                  
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`max-w-[90%] rounded-lg p-3 border ${
                        msg.role === 'user' 
                          ? 'bg-[var(--accent-indigo)]/5 border-[var(--accent-indigo)]/20 self-end text-[var(--text-primary)]' 
                          : 'bg-[var(--bg-base)]/50 border-[var(--border-subtle)] self-start'
                      }`}
                    >
                      <div className="font-bold uppercase tracking-wider text-[8px] text-[var(--text-muted)] mb-1">
                        {msg.role === 'user' ? '✓ QUESTION' : '⚡ GROUNDED ANSWER'}
                      </div>
                      <p className="whitespace-pre-line leading-relaxed text-[var(--text-secondary)]">{msg.content}</p>
                    </div>
                  ))}
                  
                  {isChatTyping && (
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded p-2.5 self-start max-w-[85%] animate-pulse">
                      <span className="text-[8px] text-[var(--text-muted)] font-bold block mb-1">⚡ SCANNED VERIFICATION...</span>
                      <div className="flex gap-1.5 items-center mt-1">
                        <span className="w-1.5 h-1.5 bg-[var(--accent-indigo)] rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-[var(--accent-cyan)] rounded-full animate-bounce delay-100" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Pre-configured Prompt Actions */}
                <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]/40 flex flex-col gap-2">
                  <span className="text-[8px] text-[var(--text-muted)] font-mono uppercase px-1">Interactive Triggers:</span>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleAskQuestion("Summarize Findings", "The paper identifies key challenges, proposed solutions, supporting evidence, and future directions. Every response is linked back to the source material.")}
                      className="px-2.5 py-1.5 rounded bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] text-[8px] font-mono text-[var(--text-secondary)] hover:text-white transition-all text-left"
                    >
                      Summarize Findings
                    </button>
                    <button 
                      onClick={() => handleAskQuestion("Show Limitations", "The primary constraint noted is computational limits and training sample limitations. Data coordinates verify these challenges are detailed on page 9.")}
                      className="px-2.5 py-1.5 rounded bg-[var(--bg-surface)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] text-[8px] font-mono text-[var(--text-secondary)] hover:text-white transition-all text-left"
                    >
                      Show Limitations
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. BENTO GRAPH GRID */}
        <section ref={addToRevealRefs} className="reveal-block border-t border-[var(--border-subtle)] px-8 py-36 max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase tracking-widest block mb-3">Evidence Verification</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">Research You Can Trust</h2>
            <p className="text-sm text-[var(--text-secondary)] font-mono">
              Every insight is tied back to evidence, helping you verify information instead of blindly trusting AI-generated summaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Bento Card 1: Source-Linked Insights */}
            <div className="md:col-span-2 border border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-surface)] hover-card-premium p-8 flex flex-col justify-between overflow-hidden relative group shadow-sm">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-indigo)]/10 flex items-center justify-center border border-[var(--accent-indigo)]/20">
                    <Search className="w-5 h-5 text-[var(--accent-indigo)]" />
                  </div>
                  <h3 className="font-mono text-base font-bold">Source-Linked Insights</h3>
                </div>
                <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg">
                  Every important claim stays connected to the exact location where it was found in the document.
                </p>
              </div>

              {/* Dynamic Document Scan Graphic */}
              <div className="border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-base)]/50 aspect-[16/7] w-full overflow-hidden relative p-4 font-mono text-[8px] text-[var(--text-muted)] select-none">
                <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-cyan)] to-transparent opacity-80 animate-laser z-20" />
                <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2 mb-3 text-[7px]">
                  <span>DOCUMENT_READER // EXP_BOUNDS_41093</span>
                  <span className="text-emerald-500 font-bold">COORDINATES OK</span>
                </div>
                <div className="space-y-2 opacity-70">
                  <div className="h-2 w-3/4 bg-[var(--border-subtle)] rounded" />
                  <div className="h-2 w-full bg-[var(--border-subtle)] rounded" />
                  {/* Highlighted matched row */}
                  <div className="h-4 w-5/6 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 rounded flex items-center px-2 text-[7.5px] text-[var(--accent-cyan)] font-bold">
                    [TRACE TARGET] Validating accuracy constraints N = 50k dataset samples.
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Actionable Research Plans */}
            <div className="border border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-surface)] hover-card-premium p-8 flex flex-col justify-between overflow-hidden relative group shadow-sm">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-cyan)]/10 flex items-center justify-center border border-[var(--accent-cyan)]/20">
                    <CheckCircle className="w-5 h-5 text-[var(--accent-cyan)]" />
                  </div>
                  <h3 className="font-mono text-base font-bold">Actionable Research Plans</h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Turn research findings into practical learning paths, implementation steps, and next actions.
                </p>
              </div>

              {/* Dynamic Checklist Simulator */}
              <div className="border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-base)]/50 p-4 font-mono text-[8.5px] space-y-3">
                <div className="flex items-center gap-2.5 text-green-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify baseline accuracy variables</span>
                </div>
                <div className="flex items-center gap-2.5 text-green-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>Isolate dataset parameters (N=50k)</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Critique & Peer Review */}
            <div className="border border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-surface)] hover-card-premium p-8 flex flex-col justify-between overflow-hidden relative group shadow-sm">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-indigo)]/10 flex items-center justify-center border border-[var(--accent-indigo)]/20">
                    <Shield className="w-5 h-5 text-[var(--accent-indigo)]" />
                  </div>
                  <h3 className="font-mono text-base font-bold">Critique & Peer Review</h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Identify strengths, weaknesses, assumptions, and research gaps automatically.
                </p>
              </div>

              <div className="border border-[var(--border-subtle)] p-4 rounded-xl bg-[var(--bg-base)]/50 font-mono text-[8.5px] space-y-2 text-[var(--text-muted)]">
                <div className="flex justify-between border-b border-[var(--border-subtle)] pb-1.5 mb-1.5">
                  <span className="text-[var(--text-secondary)]">LIMITATION READOUTS</span>
                  <span className="text-amber-500 font-bold">WARN_LIMIT</span>
                </div>
                <div>• Overfitting limits beyond epoch 50</div>
              </div>
            </div>

            {/* Bento Card 4: Everything In One Place */}
            <div className="md:col-span-2 border border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-surface)] hover-card-premium p-8 flex flex-col justify-between overflow-hidden relative group shadow-sm">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-cyan)]/10 flex items-center justify-center border border-[var(--accent-cyan)]/20">
                    <BookOpen className="w-5 h-5 text-[var(--accent-cyan)]" />
                  </div>
                  <h3 className="font-mono text-base font-bold">Everything In One Place</h3>
                </div>
                <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg">
                  Upload, analyze, review, plan, and chat without switching between multiple tools.
                </p>
              </div>

              <div className="border border-[var(--border-subtle)] rounded-xl bg-[var(--bg-base)]/50 p-4 font-mono text-[9px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[var(--accent-indigo)]" />
                  <span className="text-[var(--text-secondary)]">Multi-paper Context Pipeline</span>
                </div>
                <span className="text-green-500 font-bold uppercase text-[8px] border border-green-500/20 bg-green-500/5 px-2 py-0.5 rounded">Running</span>
              </div>
            </div>

          </div>
        </section>

        {/* 6. WHO IT IS FOR &Philosophy */}
        <section ref={addToRevealRefs} className="reveal-block border-t border-[var(--border-subtle)] px-8 py-36 max-w-5xl mx-auto text-left">
          <span className="text-[10px] font-mono text-[var(--accent-indigo)] uppercase tracking-widest block mb-3">Target Audiences</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-16">Built for Academic Integrity</h2>

          <div className="grid md:grid-cols-3 gap-10 font-mono">
            <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover-card-premium">
              <h4 className="font-bold text-sm mb-3">PhD Candidates</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Compile literature reviews in weeks rather than months.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover-card-premium">
              <h4 className="font-bold text-sm mb-3">R&D Labs</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Query consensus methodologies across the entire library directory.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover-card-premium">
              <h4 className="font-bold text-sm mb-3">Academic Chairs</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Verify student research papers against mathematical proof validations.
              </p>
            </div>
          </div>
        </section>

        {/* 7. AUDIT FEATURE COMPARISON TABLE */}
        <section ref={addToRevealRefs} className="reveal-block border-t border-[var(--border-subtle)] px-8 py-36 bg-[var(--bg-surface)]/30 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest block mb-3">Feature Comparison</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-16">Why Researchers Prefer ResearchOS</h2>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="py-6 uppercase text-[10px] text-[var(--text-muted)]">Capability</th>
                    <th className="py-6 px-4 uppercase text-[10px] text-[var(--text-muted)]">General AI Wrappers</th>
                    <th className="py-6 px-4 uppercase text-[10px] text-[var(--text-muted)]">Basic PDF Chatbots</th>
                    <th className="py-6 px-4 uppercase text-[10px] text-[var(--accent-indigo)] font-bold">ResearchPilot OS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  <tr>
                    <td className="py-6 font-bold">Trace-Anchored coordinate links</td>
                    <td className="py-6 px-4 text-red-500">✕ None</td>
                    <td className="py-6 px-4 text-[var(--text-secondary)]">Δ Crude guesses</td>
                    <td className="py-6 px-4 text-green-500 font-bold">✓ 100% Precise Coordinates</td>
                  </tr>
                  <tr>
                    <td className="py-6 font-bold">Cross-Paper parameter indexing</td>
                    <td className="py-6 px-4 text-red-500">✕ Lost in context</td>
                    <td className="py-6 px-4 text-red-500">✕ Single file restriction</td>
                    <td className="py-6 px-4 text-green-500 font-bold">✓ Consensus Matrices</td>
                  </tr>
                  <tr>
                    <td className="py-6 font-bold">Critique & Limitation validation</td>
                    <td className="py-6 px-4 text-red-500">✕ Hallucinates</td>
                    <td className="py-6 px-4 text-red-500">✕ No empirical checking</td>
                    <td className="py-6 px-4 text-green-500 font-bold">✓ Automated Limit Extractors</td>
                  </tr>
                  <tr>
                    <td className="py-6 font-bold">Consensus Outlining & Checklist export</td>
                    <td className="py-6 px-4 text-red-500">✕ Chat responses only</td>
                    <td className="py-6 px-4 text-red-500">✕ Chat responses only</td>
                    <td className="py-6 px-4 text-green-500 font-bold">✓ Actionable Summaries</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 8. CINEMATIC OUTRO & FINAL CALL TO ACTION */}
        <section ref={addToRevealRefs} className="reveal-block border-t border-[var(--border-subtle)] px-8 py-40 text-center bg-black/60 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-indigo-500/10 blur-[100px] animate-pulse pointer-events-none" />
          
          <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Elevate Your Literature Reviews</h2>
            <p className="text-sm md:text-base text-[var(--text-secondary)] font-mono max-w-lg mb-10 leading-relaxed">
              Experience the power of a localized research console designed around coordinate trace-grounding.
            </p>
            <button
              onClick={handleStartResearch}
              className="px-10 py-5 font-mono text-xs font-bold rounded bg-gradient-to-r from-[var(--accent-indigo)] to-[var(--accent-indigo-hover)] text-white shadow-2xl shadow-indigo-500/20 transition-all duration-200 flex items-center gap-3 hover:scale-[1.03] active:scale-95"
            >
              Initialize Workspace <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--border-subtle)] px-8 py-16 bg-black text-xs text-[var(--text-muted)] font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[var(--accent-indigo)] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-500/15">
                RP
              </div>
              <div>
                <div className="font-bold text-[var(--text-primary)]">ResearchPilot AI</div>
                <div className="text-[10px]">The Living AI Research OS</div>
              </div>
            </div>
            <div className="text-center sm:text-right text-[10px] leading-relaxed">
              Built for labs, scientists, and doctoral candidates.<br />
              Secure, trace-anchored local vector workspace.
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
export default LandingPage;
