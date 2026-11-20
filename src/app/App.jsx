import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ErrorBoundary } from './ErrorBoundary';
import { ThemeProvider } from '@/context/ThemeContext';

export function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
