import { render, screen, fireEvent } from '@testing-library/react';
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

  it('provides accessible pause/play control satisfying WCAG 2.2.2', () => {
    render(<Hero onOpenDemoModal={vi.fn()} />);

    const pauseButton = screen.getByRole('button', {
      name: /pause background video and slide transition/i,
    });
    expect(pauseButton).toBeInTheDocument();

    fireEvent.click(pauseButton);

    expect(
      screen.getByRole('button', {
        name: /play background video and slide transition/i,
      })
    ).toBeInTheDocument();
  });
});
