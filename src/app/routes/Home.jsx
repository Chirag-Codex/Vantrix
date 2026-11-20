import * as React from 'react';
import { Hero } from '@/features/hero/Hero';
import { ExploreSection } from '@/features/explore/ExploreSection';
import { LogoStrip } from '@/features/explore/LogoStrip';
import { CapabilitiesSection } from '@/features/capabilities/CapabilitiesSection';
import { ProductPanel } from '@/features/product-panel/ProductPanel';
import { EnterpriseSection } from '@/features/enterprise/EnterpriseSection';
import { PricingSection } from '@/features/pricing/PricingSection';
import { DemoCtaBand } from '@/features/hero/DemoCtaBand';
import { NewsSection } from '@/features/news/NewsSection';
import { FaqSection } from '@/features/faq/FaqSection';
import { SEO } from '@/components/SEO';
import { BookingModalContext } from '../Layout';

export function Home() {
  const { openDemoModal } = React.useContext(BookingModalContext);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vantrix Screen',
    url: 'https://screen.vantrix.ai',
    logo: 'https://screen.vantrix.ai/assets/favicon.svg',
    description:
      'Secure technical assessments with AI-assisted evaluation, coding challenges, integrity monitoring, and recruiter-first workflows.',
  };

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Vantrix Screen',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web-based',
    offers: {
      '@type': 'Offer',
      price: '199',
      priceCurrency: 'USD',
      description: 'Enterprise evaluation plan with customized volume',
    },
  };

  return (
    <>
      <SEO
        title="Vantrix Screen — Hire Better Engineers. Faster."
        description="Secure technical assessments with AI-assisted evaluation, coding challenges, integrity monitoring, and recruiter-first workflows, all in one enterprise-grade platform."
        jsonLd={[organizationSchema, softwareAppSchema]}
      />
      <div className="flex flex-col">
        {/* 1. Hero */}
        <Hero onOpenDemoModal={openDemoModal} />

        {/* 2. Explore what Vantrix can do for you */}
        <ExploreSection onOpenDemoModal={openDemoModal} />

        {/* 3. Logo Strip */}
        <LogoStrip />

        {/* 4. Capabilities */}
        <CapabilitiesSection />

        {/* 5. Enterprise Product Panel (LRU Cache Challenge & Sandbox) */}
        <ProductPanel />

        {/* 6. Enterprise Standards (01-04) */}
        <EnterpriseSection />

        {/* 7. Pricing */}
        <PricingSection onOpenDemoModal={openDemoModal} />

        {/* 8. Demo CTA Band */}
        <DemoCtaBand onOpenDemoModal={openDemoModal} />

        {/* 9. Latest News */}
        <NewsSection />

        {/* 10. Frequently Asked Questions */}
        <FaqSection />
      </div>
    </>
  );
}
