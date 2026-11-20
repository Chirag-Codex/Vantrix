import * as React from 'react';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import { Container } from '@/components/Container';
import { PlanSummary } from '@/features/checkout/PlanSummary';
import { BillingForm } from '@/features/checkout/BillingForm';
import { executeCheckoutFlow } from '@/features/checkout/RazorpayController';
import { MockRazorpayModal } from '@/features/checkout/MockRazorpayModal';
import { createCheckoutOrder, verifyPayment } from '@/services/checkout';
import { pricingConfig } from '@/config/pricing';
import { SEO } from '@/components/SEO';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('plan');

  const selectedPlan = pricingConfig.plans.find((p) => p.id === planId && p.action === 'buy_now');

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  // Interactive mock payment modal state
  const [mockModalOpen, setMockModalOpen] = React.useState(false);
  const [currentOrder, setCurrentOrder] = React.useState(null);
  const [customerData, setCustomerData] = React.useState(null);

  if (!selectedPlan) {
    return <Navigate to="/#pricing" replace />;
  }

  const handleBillingSubmit = async (formData) => {
    setIsProcessing(true);
    setErrorMessage('');
    setStatusMessage('Initiating order...');

    const customer = {
      name: formData.name,
      email: formData.email,
      company: formData.company,
      country: formData.country,
      state: formData.state,
      gstin: formData.gstin || undefined,
    };
    setCustomerData(customer);

    if (USE_MOCKS) {
      try {
        const order = await createCheckoutOrder({
          planId: selectedPlan.id,
          billingCycle: 'monthly',
          name: customer.name,
          email: customer.email,
          company: customer.company,
          country: customer.country,
          state: customer.state,
        });

        setCurrentOrder(order);
        setStatusMessage('');
        setIsProcessing(false);
        setMockModalOpen(true);
      } catch (err) {
        setIsProcessing(false);
        setStatusMessage('');
        setErrorMessage(err.message || 'Failed to create subscription order.');
      }
      return;
    }

    // Real Razorpay gateway execution
    executeCheckoutFlow({
      payload: {
        planId: selectedPlan.id,
        billingCycle: 'monthly',
        name: customer.name,
        email: customer.email,
        company: customer.company,
        gstin: customer.gstin,
        country: customer.country,
        state: customer.state,
      },
      onStatusChange: (status) => {
        setStatusMessage(status);
      },
      onSuccess: (token) => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('vantrix_onboarding_token', token);
          sessionStorage.setItem('vantrix_customer_data', JSON.stringify(customer));
        }
        navigate('/onboarding', { state: { token, customer }, replace: true });
      },
      onError: (err) => {
        setIsProcessing(false);
        setStatusMessage('');
        setErrorMessage(err);
      },
    });
  };

  const handleMockPaymentSuccess = async (paymentResult) => {
    setMockModalOpen(false);
    setIsProcessing(true);
    setStatusMessage('Verifying payment signature with backend...');

    try {
      const verifyRes = await verifyPayment(paymentResult);
      if (verifyRes.success && verifyRes.onboardingToken) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('vantrix_onboarding_token', verifyRes.onboardingToken);
          sessionStorage.setItem('vantrix_customer_data', JSON.stringify(customerData));
        }
        navigate('/onboarding', {
          state: { token: verifyRes.onboardingToken, customer: customerData },
          replace: true,
        });
      } else {
        setIsProcessing(false);
        setStatusMessage('');
        setErrorMessage('Payment verification signature check failed.');
      }
    } catch (err) {
      setIsProcessing(false);
      setStatusMessage('');
      setErrorMessage(err.message || 'Payment signature verification failed.');
    }
  };

  const handleMockPaymentFailure = (declineReason) => {
    setMockModalOpen(false);
    setIsProcessing(false);
    setStatusMessage('');
    setErrorMessage(declineReason);
  };

  return (
    <>
      <SEO
        title={`Checkout — ${selectedPlan.name} | Vantrix Screen`}
        description="Secure checkout for Vantrix Screen technical assessment platform."
        noindex={true}
      />
      <div className="py-20 md:py-28">
        <Container>
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--gold-soft)] px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                Self-Serve Checkout
              </span>
            </div>
            <h1 className="heading-h2">
              Complete Your Subscription
            </h1>
            <p className="mt-3 text-[15px] text-[var(--muted)]">
              Instant workspace provisioning with self-serve billing.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Plan Summary (5 cols) */}
            <div className="lg:col-span-5">
              <PlanSummary plan={selectedPlan} />
            </div>

            {/* Billing Details (7 cols) */}
            <div className="lg:col-span-7">
              <div className="v-card p-6 md:p-8">
                <div className="mb-6 border-b border-[var(--line)] pb-4">
                  <h2 className="text-xl font-bold text-[var(--text)]">Billing Information</h2>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    Enter your organization details for automated tax invoicing.
                  </p>
                </div>

                {statusMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="mb-6 rounded-[14px] border border-[var(--line-strong)] bg-[var(--gold-soft)] p-4 text-xs font-semibold text-[var(--accent)]"
                  >
                    {statusMessage}
                  </div>
                )}

                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-6 rounded-[14px] border border-[var(--line)] bg-[var(--danger-bg)] p-4 text-xs font-semibold text-[var(--danger)]"
                  >
                    {errorMessage}
                  </div>
                )}

                <BillingForm
                  onSubmit={handleBillingSubmit}
                  isProcessing={isProcessing}
                  planName={selectedPlan.name}
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Interactive Mock Payment Modal */}
      <MockRazorpayModal
        open={mockModalOpen}
        onOpenChange={setMockModalOpen}
        order={currentOrder}
        customer={customerData}
        plan={selectedPlan}
        onSuccess={handleMockPaymentSuccess}
        onFailure={handleMockPaymentFailure}
      />
    </>
  );
}
