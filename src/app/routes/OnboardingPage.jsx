import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';
import { SEO } from '@/components/SEO';

export function OnboardingPage() {
  return (
    <>
      <SEO
        title="Schedule Onboarding — Vantrix Screen"
        description="Book your dedicated Vantrix Screen architecture and integration onboarding session."
        noindex={true}
      />
      <OnboardingFlow />
    </>
  );
}
