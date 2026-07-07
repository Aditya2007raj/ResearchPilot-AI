import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ROUTES } from '../lib/routes';
import { AppShell } from '../components/layout/AppShell';
import { UploadPage } from '../features/upload/UploadPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { WorkspaceLayout } from '../features/workspace/WorkspaceLayout';
import { AnalyzePage } from '../features/workspace/analyze/AnalyzePage';
import { ReviewPage } from '../features/workspace/review/ReviewPage';
import { ActionPlanPage } from '../features/workspace/action-plan/ActionPlanPage';
import { ChatPage } from '../features/workspace/chat/ChatPage';


function FavoritesPlaceholder() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Favorites</h1>
      <p className="text-[var(--text-secondary)]">Your starred papers will appear here.</p>
    </div>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="text-[var(--text-secondary)]">Application configurations.</p>
    </div>
  );
}

function WorkspacePlaceholder() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Workspace</h1>
      <p className="text-[var(--text-secondary)]">Research Operating System Workspace.</p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.UPLOAD,
        element: <UploadPage />,
      },
      {
        path: ROUTES.FAVORITES,
        element: <FavoritesPlaceholder />,
      },
      {
        path: ROUTES.SETTINGS,
        element: <SettingsPlaceholder />,
      },
      {
        path: ROUTES.WORKSPACE,
        element: <WorkspaceLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="analyze" replace />,
          },
          {
            path: 'analyze',
            element: <AnalyzePage />,
          },
          {
            path: 'review',
            element: <ReviewPage />,
          },
          {
            path: 'action-plan',
            element: <ActionPlanPage />,
          },
          {
            path: 'chat',
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
export default AppRoutes;
