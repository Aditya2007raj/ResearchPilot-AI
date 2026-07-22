import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ROUTES } from '../lib/routes';
import { AppShell } from '../components/layout/AppShell';
import { LandingPage } from '../features/landing/LandingPage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { UploadPage } from '../features/upload/UploadPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { FavoritesPage } from '../features/favorites/FavoritesPage';
import { WorkspaceLayout } from '../features/workspace/WorkspaceLayout';
import { AnalyzePage } from '../features/workspace/analyze/AnalyzePage';
import { ReviewPage } from '../features/workspace/review/ReviewPage';
import { ActionPlanPage } from '../features/workspace/action-plan/ActionPlanPage';
import { ChatPage } from '../features/workspace/chat/ChatPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
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
        element: <FavoritesPage />,
      },
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
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
