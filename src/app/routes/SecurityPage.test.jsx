import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SecurityPage } from './SecurityPage';
import { HelmetProvider } from 'react-helmet-async';
import { PersonasSection } from '@/features/personas/PersonasSection';

describe('SecurityPage Component', () => {
  it('renders security architecture pillars and contact information', () => {
    render(
      <HelmetProvider>
        <SecurityPage />
      </HelmetProvider>
    );

    expect(screen.getByRole('heading', { level: 1, name: /security & infrastructure posture/i })).toBeInTheDocument();
    expect(screen.getByText(/encryption in transit & at rest/i)).toBeInTheDocument();
    expect(screen.getByText(/isolated micro-vm sandboxes/i)).toBeInTheDocument();
    expect(screen.getByText(/role-based access control \(rbac\)/i)).toBeInTheDocument();
    expect(screen.getByText(/immutable audit logging/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /hello@vantrix\.ai/i })).toHaveAttribute('href', 'mailto:hello@vantrix.ai');
  });
});

describe('PersonasSection Component', () => {
  it('renders the 3-stakeholder value columns (CTOs, Heads of Eng, Talent Acquisition)', () => {
    render(<PersonasSection />);

    expect(screen.getByText(/built for every hiring stakeholder/i)).toBeInTheDocument();
    expect(screen.getByText('FOR CTOs')).toBeInTheDocument();
    expect(screen.getByText('FOR HEADS OF ENGINEERING')).toBeInTheDocument();
    expect(screen.getByText('FOR TALENT ACQUISITION')).toBeInTheDocument();
    expect(screen.getByText(/isolated micro-vm execution sandbox per candidate session/i)).toBeInTheDocument();
    expect(screen.getByText(/save 60%\+ senior-engineer technical interview hours/i)).toBeInTheDocument();
    expect(screen.getByText(/seamless greenhouse, lever, and workday ats sync/i)).toBeInTheDocument();
  });
});
