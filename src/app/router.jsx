import * as React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { Home } from './routes/Home';
import { Skeleton } from '@/components/ui/skeleton';

// Route-level code splitting (Section 9)
const BookDemoPage = React.lazy(() =>
  import('./routes/BookDemoPage').then((m) => ({ default: m.BookDemoPage }))
);
const CheckoutPage = React.lazy(() =>
  import('./routes/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const OnboardingPage = React.lazy(() =>
  import('./routes/OnboardingPage').then((m) => ({ default: m.OnboardingPage }))
);
const PrivacyPage = React.lazy(() =>
  import('./routes/PrivacyPage').then((m) => ({ default: m.PrivacyPage }))
);
const TermsPage = React.lazy(() =>
  import('./routes/TermsPage').then((m) => ({ default: m.TermsPage }))
);
const NotFoundPage = React.lazy(() =>
  import('./routes/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

function RouteSuspense({ children }) {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center p-8">
          <div className="w-full max-w-md space-y-4">
            <Skeleton className="mx-auto h-8 w-3/4 rounded-xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
        </div>
      }
    >
      {children}
    </React.Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'book-demo',
        element: (
          <RouteSuspense>
            <BookDemoPage />
          </RouteSuspense>
        ),
      },
      {
        path: 'checkout',
        element: (
          <RouteSuspense>
            <CheckoutPage />
          </RouteSuspense>
        ),
      },
      {
        path: 'success',
        element: <Navigate to="/onboarding" replace />,
      },
      {
        path: 'onboarding',
        element: (
          <RouteSuspense>
            <OnboardingPage />
          </RouteSuspense>
        ),
      },
      {
        path: 'privacy',
        element: (
          <RouteSuspense>
            <PrivacyPage />
          </RouteSuspense>
        ),
      },
      {
        path: 'terms',
        element: (
          <RouteSuspense>
            <TermsPage />
          </RouteSuspense>
        ),
      },
      {
        path: '*',
        element: (
          <RouteSuspense>
            <NotFoundPage />
          </RouteSuspense>
        ),
      },
    ],
  },
]);
