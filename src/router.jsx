import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from './components/layouts/Layout';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const Practice = lazy(() => import('./pages/Practice'));
const Review = lazy(() => import('./pages/Review'));
const Progress = lazy(() => import('./pages/Progress'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Chat = lazy(() => import('./components/Chat'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

// Auth guard for protected routes
const RequireAuth = ({ children }) => {
  // For demo purposes, we'll check if user exists in localStorage
  const isAuthenticated = localStorage.getItem('Mastery.ai_user') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Search />
          </Suspense>
        )
      },
      {
        path: 'practice',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RequireAuth>
              <Practice />
            </RequireAuth>
          </Suspense>
        )
      },
      {
        path: 'review',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RequireAuth>
              <Review />
            </RequireAuth>
          </Suspense>
        )
      },
      {
        path: 'progress',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RequireAuth>
              <Progress />
            </RequireAuth>
          </Suspense>
        )
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RequireAuth>
              <Profile />
            </RequireAuth>
          </Suspense>
        )
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        )
      },
      {
        path: 'chat',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RequireAuth>
              <Chat />
            </RequireAuth>
          </Suspense>
        )
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        )
      }
    ]
  }
]);

export default router;