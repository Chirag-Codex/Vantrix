import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BillingForm } from './BillingForm';
import { BrowserRouter } from 'react-router-dom';

describe('BillingForm Component', () => {
  it('renders billing input fields', () => {
    render(
      <BrowserRouter>
        <BillingForm onSubmit={vi.fn()} isProcessing={false} error="" />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/billing email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company legal name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /proceed to payment/i })).toBeInTheDocument();
  });

  it('rejects invalid GSTIN format', async () => {
    render(
      <BrowserRouter>
        <BillingForm onSubmit={vi.fn()} isProcessing={false} error="" />
      </BrowserRouter>
    );

    const gstinInput = screen.getByLabelText(/gstin \/ tax id/i);
    fireEvent.change(gstinInput, { target: { value: 'INVALID_GSTIN_123' } });

    fireEvent.click(screen.getByRole('button', { name: /proceed to payment/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid gstin format/i)).toBeInTheDocument();
    });
  });
});
