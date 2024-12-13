import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Lazy-loaded components
const HomePage = lazy(() => import('./App.jsx'));
const DashboardPage = lazy(() => import('./pages/dashboard/page/index.jsx'));
const FeedbackForm = lazy(() => import('./pages/feedback/page/index.jsx'));

// Loader Component for Suspense Fallback
const LoadingSpinner = () => <div>Loading...</div>;

// Define the router
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <HomePage />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<LoadingSpinner />}>
        <div>Error loading the Home Page</div>
      </Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardPage />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<LoadingSpinner />}>
        <div>Error loading the Dashboard</div>
      </Suspense>
    ),
  },
  {
    path: '/feedback',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <FeedbackForm />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<LoadingSpinner />}>
        <div>Error loading the Feedback Form</div>
      </Suspense>
    ),
  },
]);

export default router;
