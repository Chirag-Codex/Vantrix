import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PricingSection } from './PricingSection';
import { MemoryRouter } from 'react-router-dom';

function renderPricing(onOpenDemoModal = vi.fn()) {
  return render(
    <MemoryRouter>
      <PricingSection onOpenDemoModal={onOpenDemoModal} />
    </MemoryRouter>
  );
}

describe('PricingSection Component Selection & Interactivity', () => {
  it('initializes selectedPlan to "growth" with active styling and aria-pressed=true', () => {
    renderPricing();

    const cards = screen.getAllByRole('button');
    // Find Starter, Growth, Enterprise cards
    const starterCard = cards.find((el) => el.textContent.includes('Starter') && el.textContent.includes('$199'));
    const growthCard = cards.find((el) => el.textContent.includes('Growth') && el.textContent.includes('$499'));
    const enterpriseCard = cards.find((el) => el.textContent.includes('Enterprise') && el.textContent.includes('Custom'));

    expect(growthCard).toHaveAttribute('aria-pressed', 'true');
    expect(growthCard.className).toContain('border-2');
    expect(growthCard.className).toContain('shadow-lg');
    expect(growthCard.className).toContain('scale-[1.01]');

    expect(starterCard).toHaveAttribute('aria-pressed', 'false');
    expect(enterpriseCard).toHaveAttribute('aria-pressed', 'false');
  });

  it('dynamically moves the active highlight when clicking Starter card', () => {
    renderPricing();

    const cards = screen.getAllByRole('button');
    const starterCard = cards.find((el) => el.textContent.includes('Starter') && el.textContent.includes('$199'));
    const growthCard = cards.find((el) => el.textContent.includes('Growth') && el.textContent.includes('$499'));

    fireEvent.click(starterCard);

    expect(starterCard).toHaveAttribute('aria-pressed', 'true');
    expect(starterCard.className).toContain('border-2');
    expect(starterCard.className).toContain('shadow-lg');
    expect(starterCard.className).toContain('scale-[1.01]');

    expect(growthCard).toHaveAttribute('aria-pressed', 'false');
  });

  it('keeps the Popular badge on Growth regardless of selection', () => {
    renderPricing();

    const cards = screen.getAllByRole('button');
    const starterCard = cards.find((el) => el.textContent.includes('Starter') && el.textContent.includes('$199'));

    expect(screen.getByText('Popular')).toBeInTheDocument();

    // Select Starter
    fireEvent.click(starterCard);
    expect(screen.getByText('Popular')).toBeInTheDocument();

    // Select Enterprise
    const enterpriseCard = cards.find((el) => el.textContent.includes('Enterprise') && el.textContent.includes('Custom'));
    fireEvent.click(enterpriseCard);
    expect(screen.getByText('Popular')).toBeInTheDocument();
  });

  it('supports keyboard navigation via Enter and Space keys', () => {
    renderPricing();

    const cards = screen.getAllByRole('button');
    const starterCard = cards.find((el) => el.textContent.includes('Starter') && el.textContent.includes('$199'));

    // Space key
    fireEvent.keyDown(starterCard, { key: ' ' });
    expect(starterCard).toHaveAttribute('aria-pressed', 'true');

    // Enter key on Enterprise
    const enterpriseCard = cards.find((el) => el.textContent.includes('Enterprise') && el.textContent.includes('Custom'));
    fireEvent.keyDown(enterpriseCard, { key: 'Enter' });
    expect(enterpriseCard).toHaveAttribute('aria-pressed', 'true');
    expect(starterCard).toHaveAttribute('aria-pressed', 'false');
  });

  it('triggers onOpenDemoModal when Book a demo button is clicked on Enterprise', () => {
    const handleOpenDemo = vi.fn();
    renderPricing(handleOpenDemo);

    const cards = screen.getAllByRole('button');
    const enterpriseCard = cards.find(
      (el) => el.textContent.includes('Enterprise') && el.textContent.includes('Custom')
    );
    const bookDemoBtn = enterpriseCard.querySelector('button');
    fireEvent.click(bookDemoBtn);

    expect(handleOpenDemo).toHaveBeenCalledTimes(1);
  });
});
