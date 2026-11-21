import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, ShieldCheck, X } from 'lucide-react';

export function MockRazorpayModal({
  open,
  onOpenChange,
  order,
  customer,
  plan,
  onSuccess,
  onFailure,
}) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState('card');

  if (!order) return null;

  const displayAmount = (order.amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: order.currency || 'USD',
  });

  const handleSimulateSuccess = async () => {
    setIsProcessing(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsProcessing(false);
    onSuccess({
      orderId: order.orderId,
      paymentId: `pay_mock_${Date.now()}`,
      signature: `sig_mock_${Math.random().toString(36).substring(2, 12)}`,
    });
  };

  const handleSimulateDecline = async () => {
    setIsProcessing(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsProcessing(false);
    onFailure('Payment declined by card issuer: Insufficient test funds or transaction restricted.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="max-w-md overflow-hidden rounded-[24px] border border-border bg-card p-0 md:p-0 gap-0 shadow-2xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Razorpay Payment Gateway Simulation</DialogTitle>
          <DialogDescription>
            Simulate a successful payment or a card decline for {plan?.name} plan subscription.
          </DialogDescription>
        </DialogHeader>

        {/* Razorpay Simulation Header */}
        <div className="bg-[#0c1427] p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 font-mono text-xs font-bold text-white">
                R
              </span>
              <span className="font-bold text-sm tracking-tight">Razorpay</span>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Sandbox Test Mode
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-white/60 hover:text-white cursor-pointer p-1 rounded-md transition-opacity"
              aria-label="Close payment modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <div className="text-xs text-white/60">Vantrix Screen — {plan?.name}</div>
              <div className="text-xl font-extrabold text-white">{displayAmount}</div>
            </div>
            <div className="font-mono text-[11px] text-white/50">{order.orderId}</div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Method tabs */}
          <div className="mb-4 flex rounded-xl border border-[var(--line)] bg-[var(--fill)] p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`flex-1 rounded-lg py-1.5 text-center transition-all cursor-pointer ${
                selectedMethod === 'card'
                  ? 'bg-[image:var(--gold-grad)] text-[var(--on-gold)] shadow-sm font-bold'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Test Card
            </button>
            <button
              type="button"
              onClick={() => setSelectedMethod('netbanking')}
              className={`flex-1 rounded-lg py-1.5 text-center transition-all cursor-pointer ${
                selectedMethod === 'netbanking'
                  ? 'bg-[image:var(--gold-grad)] text-[var(--on-gold)] shadow-sm font-bold'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              Corporate UPI / NetBanking
            </button>
          </div>

          {/* Test Card Form Preview */}
          {selectedMethod === 'card' ? (
            <div className="space-y-3 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted2)]">
                  Card Number (Pre-filled Test Card)
                </label>
                <div className="mt-1 flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--fill)] px-3 py-2 text-xs font-mono text-[var(--text)]">
                  <span>4111 2222 3333 4444</span>
                  <CreditCard className="h-4 w-4 text-[var(--accent)]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted2)]">
                    Expiry
                  </label>
                  <div className="mt-1 rounded-lg border border-[var(--line)] bg-[var(--fill)] px-3 py-2 text-xs font-mono text-[var(--text)]">
                    12 / 28
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted2)]">
                    CVV
                  </label>
                  <div className="mt-1 rounded-lg border border-[var(--line)] bg-[var(--fill)] px-3 py-2 text-xs font-mono text-[var(--text)]">
                    123
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted2)]">
                  Cardholder
                </label>
                <div className="mt-1 rounded-lg border border-[var(--line)] bg-[var(--fill)] px-3 py-2 text-xs text-[var(--text)]">
                  {customer?.name || 'Vantrix Engineering Buyer'}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 text-xs text-[var(--text)]">
              <div className="mb-2 font-semibold">Simulated NetBanking / Corporate UPI</div>
              <p className="text-[var(--muted)]">
                Pre-authorized test account for {customer?.company || 'Enterprise Org'}.
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="my-4 flex items-center gap-2 text-[11px] text-[var(--ok)]">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>Simulated TLS 1.3 test environment • No real money charged</span>
          </div>

          {/* Action Simulation Buttons */}
          <div className="space-y-2.5 pt-2 pb-2">
            <Button
              type="button"
              disabled={isProcessing}
              onClick={handleSimulateSuccess}
              className="w-full bg-[image:var(--gold-grad)] font-bold text-[var(--on-gold)] hover:brightness-105 cursor-pointer h-11"
            >
              {isProcessing ? 'Verifying payment...' : `Simulate Successful Payment (${displayAmount})`}
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={isProcessing}
              onClick={handleSimulateDecline}
              className="w-full border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger-bg)] cursor-pointer h-11"
            >
              Simulate Bank Decline / Failure
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
