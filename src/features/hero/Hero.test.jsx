import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Hero } from './Hero';

describe('Hero Component', () => {
  it('renders primary H1 and CTA buttons', () => {
    render(<Hero onOpenDemoModal={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/hire better engineers\./i)).toBeInTheDocument();
    expect(screen.getByText(/faster\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book a live product demo/i })).toBeInTheDocument();
  });

  it('renders hero slides and slide navigation indicators', () => {
    render(<Hero onOpenDemoModal={vi.fn()} />);

    expect(screen.getByText(/technical assessment platform/i)).toBeInTheDocument();
    expect(screen.getAllByRole('tab', { name: /go to slide/i }).length).toBe(4);
  });
});
