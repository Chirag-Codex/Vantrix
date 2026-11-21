import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TalentApproachSection, TALENT_STEPS } from './TalentApproachSection';

describe('TalentApproachSection Component', () => {
  it('renders section eyebrow, heading, and subtitle accurately', () => {
    render(<TalentApproachSection />);

    expect(screen.getByText('EXECUTION FRAMEWORK')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /the vantrix talent approach/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/we don't just forward cvs/i)
    ).toBeInTheDocument();
  });

  it('renders all 7 steps from 01 Understand through 07 Support', () => {
    render(<TalentApproachSection />);

    TALENT_STEPS.forEach((item) => {
      expect(screen.getByText(item.step)).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 3, name: item.title })
      ).toBeInTheDocument();
    });
  });

  it('initializes step 01 (Understand) as expanded by default', () => {
    render(<TalentApproachSection />);

    const stepButtons = screen.getAllByRole('button');
    expect(stepButtons).toHaveLength(7);

    // First card expanded
    expect(stepButtons[0]).toHaveAttribute('aria-expanded', 'true');
    expect(stepButtons[1]).toHaveAttribute('aria-expanded', 'false');
  });

  it('activates and expands a card on click', () => {
    render(<TalentApproachSection />);

    const stepButtons = screen.getAllByRole('button');
    const evaluateCard = stepButtons[2]; // Step 03 - Evaluate

    fireEvent.click(evaluateCard);

    expect(evaluateCard).toHaveAttribute('aria-expanded', 'true');
    expect(stepButtons[0]).toHaveAttribute('aria-expanded', 'false');
  });

  it('activates and expands a card on mouseEnter', () => {
    render(<TalentApproachSection />);

    const stepButtons = screen.getAllByRole('button');
    const coordinateCard = stepButtons[4]; // Step 05 - Coordinate

    fireEvent.mouseEnter(coordinateCard);

    expect(coordinateCard).toHaveAttribute('aria-expanded', 'true');
    expect(stepButtons[0]).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports keyboard accessibility via Enter and Space keys', () => {
    render(<TalentApproachSection />);

    const stepButtons = screen.getAllByRole('button');
    const closeCard = stepButtons[5]; // Step 06 - Close
    const supportCard = stepButtons[6]; // Step 07 - Support

    // Space key
    fireEvent.keyDown(closeCard, { key: ' ' });
    expect(closeCard).toHaveAttribute('aria-expanded', 'true');
    expect(stepButtons[0]).toHaveAttribute('aria-expanded', 'false');

    // Enter key
    fireEvent.keyDown(supportCard, { key: 'Enter' });
    expect(supportCard).toHaveAttribute('aria-expanded', 'true');
    expect(closeCard).toHaveAttribute('aria-expanded', 'false');
  });
});
