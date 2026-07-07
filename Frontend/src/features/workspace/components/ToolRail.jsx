import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart2, CheckSquare, ListTodo, MessageSquare } from 'lucide-react';

export function ToolRail({ paperId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const railItems = [
    {
      id: 'analyze',
      label: 'Analyze',
      icon: BarChart2,
      path: `/workspace/${paperId}/analyze`
    },
    {
      id: 'review',
      label: 'Review',
      icon: CheckSquare,
      path: `/workspace/${paperId}/review`
    },
    {
      id: 'action-plan',
      label: 'Action Plan',
      icon: ListTodo,
      path: `/workspace/${paperId}/action-plan`
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageSquare,
      path: `/workspace/${paperId}/chat`
    }
  ];

  return (
    <nav 
      aria-label="Workspace tools" 
      className="w-20 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col items-center py-4 gap-4 h-full select-none"
    >
      {railItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname.includes(item.path) || 
          (item.id === 'analyze' && location.pathname === `/workspace/${paperId}`);

        return (
          <div 
            key={item.id} 
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <button
              onClick={() => navigate(item.path)}
              className={`w-12 h-12 rounded flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[var(--accent-indigo)]/10 text-[var(--accent-indigo)] border border-[var(--accent-indigo)]/20'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-base)] hover:text-[var(--text-primary)]'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-medium leading-none font-sans">{item.label}</span>
            </button>

            {/* Custom Tooltip */}
            {hoveredIndex === index && (
              <div 
                className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-[10px] font-medium font-sans whitespace-nowrap shadow-lg z-50 pointer-events-none"
                role="tooltip"
              >
                {item.label} Workspace
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default ToolRail;
