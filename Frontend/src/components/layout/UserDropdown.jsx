import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { ROUTES } from '../../lib/routes';
import { User, Star, LogOut, ChevronDown } from 'lucide-react';

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate(ROUTES.LOGIN);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-3 pr-2 py-1 rounded-full border border-[var(--border-subtle)] hover:border-[var(--text-muted)] bg-[var(--bg-base)]/50 transition-all cursor-pointer group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Avatar user={user} size="sm" />
        <div className="flex flex-col text-left font-mono leading-tight pr-1 hidden sm:flex">
          <span className="text-xs font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-indigo)] transition-colors truncate max-w-[120px]">
            {user.full_name}
          </span>
          <span className="text-[9px] text-[var(--text-muted)] truncate max-w-[120px]">
            {user.bio || 'Researcher'}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[var(--accent-indigo)]' : ''}`} />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-64 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl z-50 overflow-hidden font-mono animate-fade-in">
          {/* User Header */}
          <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/40 flex items-center gap-3">
            <Avatar user={user} size="md" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[var(--text-primary)] truncate">{user.full_name}</span>
              <span className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</span>
              <span className="inline-flex items-center gap-1 mt-1 text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active User
              </span>
            </div>
          </div>

          {/* Menu Actions */}
          <div className="p-1.5 space-y-0.5">
            <Link
              to={ROUTES.PROFILE}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-colors"
            >
              <User className="w-4 h-4 text-[var(--accent-indigo)]" />
              <span>My Profile</span>
            </Link>

            <Link
              to={ROUTES.FAVORITES}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-colors"
            >
              <Star className="w-4 h-4 text-[var(--accent-cyan)]" />
              <span>Favorites</span>
            </Link>
          </div>

          {/* Logout Section */}
          <div className="p-1.5 border-t border-[var(--border-subtle)]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
