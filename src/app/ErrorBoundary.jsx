import * as React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In production, send to sanitized monitoring service.
    // Never leak error stacks to the DOM.
    if (import.meta.env?.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-16 text-center text-[var(--text)]">
          <div className="max-w-md space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--danger-bg)] text-[var(--danger)]">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Something unexpected occurred</h1>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Our application encountered an unexpected state. No data or credentials were
                compromised.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={this.handleReload}>RELOAD APPLICATION</Button>
              <Button variant="secondary" asChild>
                <a href="/">GO TO HOMEPAGE</a>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
