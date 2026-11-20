import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const billingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid business email'),
  company: z.string().min(2, 'Company name is required'),
  gstin: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || val === '' || GSTIN_REGEX.test(val.toUpperCase()),
      'Invalid GSTIN format (e.g. 29ABCDE1234F1Z5)'
    ),
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State / Province is required'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms of Service and Privacy Policy',
  }),
  _trap: z.string().max(0, 'Bot detected').optional(),
});

export function BillingForm({ onSubmit, isProcessing, error }) {
  const mountTimeRef = React.useRef(Date.now());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      gstin: '',
      country: 'India',
      state: 'Karnataka',
      consent: false,
      _trap: '',
    },
  });

  const handleFormSubmit = (data) => {
    const elapsedSeconds = (Date.now() - mountTimeRef.current) / 1000;
    if (elapsedSeconds < 1.0) {
      console.warn('Suspiciously rapid form submission');
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input type="text" tabIndex={-1} autoComplete="off" {...register('_trap')} />
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-2.5 rounded-[14px] border border-[var(--line)] bg-[var(--danger-bg)] p-3 text-xs text-[var(--danger)]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1.5">
        <Label htmlFor="billing-name">Full Name *</Label>
        <Input
          id="billing-name"
          placeholder="Jane Doe"
          {...register('name')}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="text-xs text-[var(--danger)]">{errors.name.message}</p>}
      </div>

      {/* Business Email */}
      <div className="space-y-1.5">
        <Label htmlFor="billing-email">Billing Email *</Label>
        <Input
          id="billing-email"
          type="email"
          placeholder="billing@company.com"
          {...register('email')}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <p className="text-xs text-[var(--danger)]">{errors.email.message}</p>}
      </div>

      {/* Company Name */}
      <div className="space-y-1.5">
        <Label htmlFor="billing-company">Company Legal Name *</Label>
        <Input
          id="billing-company"
          placeholder="Acme Technologies Pvt Ltd"
          {...register('company')}
          aria-invalid={Boolean(errors.company)}
        />
        {errors.company && <p className="text-xs text-[var(--danger)]">{errors.company.message}</p>}
      </div>

      {/* GSTIN (Optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="billing-gstin">GSTIN / Tax ID (Optional)</Label>
        <Input
          id="billing-gstin"
          placeholder="29ABCDE1234F1Z5"
          className="font-mono uppercase"
          {...register('gstin')}
          aria-invalid={Boolean(errors.gstin)}
        />
        {errors.gstin && <p className="text-xs text-[var(--danger)]">{errors.gstin.message}</p>}
      </div>

      {/* Country and State */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="billing-country">Country *</Label>
          <Input
            id="billing-country"
            placeholder="India"
            {...register('country')}
            aria-invalid={Boolean(errors.country)}
          />
          {errors.country && <p className="text-xs text-[var(--danger)]">{errors.country.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="billing-state">State / Province *</Label>
          <Input
            id="billing-state"
            placeholder="Karnataka"
            {...register('state')}
            aria-invalid={Boolean(errors.state)}
          />
          {errors.state && <p className="text-xs text-[var(--danger)]">{errors.state.message}</p>}
        </div>
      </div>

      {/* Terms and Privacy Consent */}
      <div className="space-y-1 pt-2">
        <label className="flex cursor-pointer items-start gap-2.5 text-xs text-[var(--muted)]">
          <input
            type="checkbox"
            className="mt-0.5 rounded border-[var(--line)] bg-[var(--fill)] accent-[var(--accent)]"
            {...register('consent')}
          />
          <span>
            I agree to the{' '}
            <Link to="/terms" target="_blank" className="text-[var(--accent)] underline font-medium">
              Terms of Service
            </Link>{' '}
            and acknowledge the{' '}
            <Link to="/privacy" target="_blank" className="text-[var(--accent)] underline font-medium">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && <p className="text-xs text-[var(--danger)]">{errors.consent.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="btn-gold w-full gap-2"
          disabled={isProcessing}
        >
          <Lock className="h-4 w-4" />
          <span>{isProcessing ? 'INITIALIZING CHECKOUT...' : 'PROCEED TO PAYMENT'}</span>
        </button>
      </div>
    </form>
  );
}
