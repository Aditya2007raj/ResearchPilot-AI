import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/routes';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { LayoutDashboard, FileUp, Star, ShieldAlert, LogOut } from 'lucide-react';

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Upload Paper', path: ROUTES.UPLOAD, icon: FileUp },
    { label: 'Favorites', path: ROUTES.FAVORITES, icon: Star },
  ];

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <aside className="w-64 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col h-screen select-none">
      {/* Branding Section */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--border-subtle)] gap-3">
        <div className="w-8 h-8 rounded bg-[var(--accent-indigo)] flex items-center justify-center shadow-md">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-white to-[var(--text-secondary)] bg-clip-text text-transparent">
            ResearchPilot
          </span>
          <span className="text-[9px] text-[var(--accent-cyan)] font-mono tracking-widest uppercase">Operating System</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--bg-base)] text-[var(--accent-indigo)] border-l-2 border-[var(--accent-indigo)] font-bold shadow-sm'
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

      {/* User Profile Card & Logout */}
      <div className="p-4 border-t border-[var(--border-subtle)] font-mono bg-[var(--bg-base)]/30">
        {user && (
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative shrink-0">
                <Avatar user={user} size="sm" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[var(--bg-surface)]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[var(--text-primary)] truncate">{user.full_name}</span>
                <span className="text-[9px] text-[var(--text-muted)] truncate">{user.email}</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-[var(--text-secondary)] transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
export default Sidebar;
