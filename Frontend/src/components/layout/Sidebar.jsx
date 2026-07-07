import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../lib/routes';
import { LayoutDashboard, FileUp, Star, Settings, ShieldAlert } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Upload Paper', path: ROUTES.UPLOAD, icon: FileUp },
    { label: 'Favorites', path: ROUTES.FAVORITES, icon: Star },
    { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col h-screen select-none">
      {/* Branding Section */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--border-subtle)] gap-2">
        <div className="w-8 h-8 rounded bg-[var(--accent-indigo)] flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-[var(--text-secondary)] bg-clip-text text-transparent">
          ResearchPilot
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--bg-base)] text-[var(--accent-indigo)] border-l-2 border-[var(--accent-indigo)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-base)] hover:text-[var(--text-primary)]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom context block */}
      <div className="p-4 border-t border-[var(--border-subtle)]">
        <div className="text-xs text-[var(--text-muted)] text-center font-mono">
          v1.0.0-beta
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;
