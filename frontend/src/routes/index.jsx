import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from '../components/common';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute, { PublicRoute } from './ProtectedRoute';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const AuthCallbackPage = lazy(() => import('../pages/auth/AuthCallbackPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const WorkoutPage = lazy(() => import('../pages/workout/WorkoutPage'));
const NutritionPage = lazy(() => import('../pages/nutrition/NutritionPage'));
const ProgressPage = lazy(() => import('../pages/progress/ProgressPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const AchievementsPage = lazy(() => import('../pages/achievements/AchievementsPage'));

const PageLoader = () => <Loader fullScreen text="Loading..." />;

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/auth/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        </Route>

        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
