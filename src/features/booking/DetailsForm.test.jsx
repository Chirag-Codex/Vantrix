import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DetailsForm } from './DetailsForm';

describe('DetailsForm Component', () => {
  it('renders all required form controls', () => {
    render(<DetailsForm onSubmit={vi.fn()} isSubmitting={false} error="" />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/engineering team size/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm demo booking/i })).toBeInTheDocument();
  });

  it('displays soft warning when free-mail domain is provided', async () => {
    render(<DetailsForm onSubmit={vi.fn()} isSubmitting={false} error="" />);

    const emailInput = screen.getByLabelText(/work email/i);
    fireEvent.change(emailInput, { target: { value: 'user@gmail.com' } });

    await waitFor(() => {
      expect(
        screen.getByText(/we recommend using your work email for faster organization onboarding/i)
      ).toBeInTheDocument();
    });
  });

  it('validates required fields on empty submit', async () => {
    const handleSubmit = vi.fn();
    render(<DetailsForm onSubmit={handleSubmit} isSubmitting={false} error="" />);

    fireEvent.click(screen.getByRole('button', { name: /confirm demo booking/i }));

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
