import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Sidebar - Fixed Left Rail */}
      <Sidebar />

      {/* Main View Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar - Fixed Header */}
        <Topbar />

        {/* Dynamic Nested View Area */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg-base)]">
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-full text-sm text-[var(--text-secondary)] font-mono">
              Initializing Workspace...
            </div>
          }>
            <Outlet />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}
export default AppShell;
