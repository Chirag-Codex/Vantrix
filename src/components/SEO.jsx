import { Helmet } from 'react-helmet-async';

export function SEO({
  title = 'Vantrix Screen — Hire Better Engineers. Faster.',
  description = 'Secure technical assessments with AI-assisted evaluation, coding challenges, integrity monitoring, and recruiter-first workflows, all in one enterprise-grade platform.',
  canonical = 'https://screen.vantrix.ai/',
  noindex = false,
  jsonLd = null,
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://screen.vantrix.ai/assets/og-image.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://screen.vantrix.ai/assets/og-image.png" />

      {/* Structured Data */}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
