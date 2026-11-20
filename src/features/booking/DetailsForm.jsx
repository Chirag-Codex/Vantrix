import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

const FREE_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

export const bookingDetailsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name is required'),
  role: z.string().min(2, 'Role is required'),
  teamSize: z.string().min(1, 'Please select your team size'),
  note: z.string().max(500, 'Note must not exceed 500 characters').optional(),
  _companyWebsite: z.string().max(0, 'Bot submission rejected').optional(),
});

export function DetailsForm({ initialValues, onSubmit, isSubmitting, error, onBack }) {
  const mountTimeRef = React.useRef(Date.now());
  const [emailWarning, setEmailWarning] = React.useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingDetailsSchema),
    defaultValues: initialValues || {
      name: '',
      email: '',
      company: '',
      role: '',
      teamSize: '',
      note: '',
      _companyWebsite: '',
    },
  });

  const emailValue = watch('email');

  React.useEffect(() => {
    if (emailValue && emailValue.includes('@')) {
      const domain = emailValue.split('@')[1]?.toLowerCase().trim();
      if (domain && FREE_EMAIL_DOMAINS.includes(domain)) {
        setEmailWarning('We recommend using your work email for faster organization onboarding.');
      } else {
        setEmailWarning('');
      }
    } else {
      setEmailWarning('');
    }
  }, [emailValue]);

  const handleFormSubmit = (data) => {
    const elapsedSeconds = (Date.now() - mountTimeRef.current) / 1000;
    if (elapsedSeconds < 1.0) {
      console.warn('Form submitted suspiciously fast.');
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Honeypot field */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="_companyWebsite">Do not fill this field</label>
        <input
          id="_companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('_companyWebsite')}
        />
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-2 rounded-[14px] border border-[var(--line)] bg-[var(--danger-bg)] p-3 text-xs text-[var(--danger)]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="booking-name">Full Name *</Label>
        <Input
          id="booking-name"
          placeholder="Jane Doe"
          {...register('name')}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="text-xs text-[var(--danger)]">{errors.name.message}</p>}
      </div>

      {/* Work Email */}
      <div className="space-y-1.5">
        <Label htmlFor="booking-email">Work Email *</Label>
        <Input
          id="booking-email"
          type="email"
          placeholder="jane@company.com"
          {...register('email')}
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <p className="text-xs text-[var(--danger)]">{errors.email.message}</p>}
        {emailWarning && (
          <p className="flex items-center gap-1.5 text-xs text-[var(--accent)] font-medium">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {emailWarning}
          </p>
        )}
      </div>

      {/* Company & Role */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="booking-company">Company *</Label>
          <Input
            id="booking-company"
            placeholder="Acme Corp"
            {...register('company')}
            aria-invalid={Boolean(errors.company)}
          />
          {errors.company && <p className="text-xs text-[var(--danger)]">{errors.company.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="booking-role">Your Role *</Label>
          <Input
            id="booking-role"
            placeholder="VP of Engineering / Recruiter"
            {...register('role')}
            aria-invalid={Boolean(errors.role)}
          />
          {errors.role && <p className="text-xs text-[var(--danger)]">{errors.role.message}</p>}
        </div>
      </div>

      {/* Team Size */}
      <div className="space-y-1.5">
        <Label htmlFor="booking-teamSize">Engineering Team Size *</Label>
        <select
          id="booking-teamSize"
          {...register('teamSize')}
          className="flex min-h-[48px] w-full rounded-[14px] border border-[var(--line)] bg-[var(--select-bg)] px-4 py-2 text-sm text-[var(--text)] transition-colors focus-visible:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
          aria-invalid={Boolean(errors.teamSize)}
        >
          <option value="">Select team size...</option>
          <option value="1-10">1 - 10 engineers</option>
          <option value="11-50">11 - 50 engineers</option>
          <option value="51-200">51 - 200 engineers</option>
          <option value="200+">200+ engineers</option>
        </select>
        {errors.teamSize && <p className="text-xs text-[var(--danger)]">{errors.teamSize.message}</p>}
      </div>

      {/* Note */}
      <div className="space-y-1.5">
        <Label htmlFor="booking-note">What are you looking to evaluate? (Optional)</Label>
        <textarea
          id="booking-note"
          rows={3}
          placeholder="E.g., Senior Fullstack role, take-home replacement, cheat prevention..."
          {...register('note')}
          className="flex w-full rounded-[14px] border border-[var(--line)] bg-[var(--fill)] p-3 text-sm text-[var(--text)] placeholder:text-[var(--muted2)] transition-colors focus-visible:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
        />
        {errors.note && <p className="text-xs text-[var(--danger)]">{errors.note.message}</p>}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-4 pt-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="btn-ghost"
          >
            BACK
          </button>
        )}
        <button
          type="submit"
          className="btn-gold flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'CONFIRMING...' : 'CONFIRM DEMO BOOKING'}
        </button>
      </div>
    </form>
  );
}
