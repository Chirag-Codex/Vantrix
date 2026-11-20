import { Container } from '@/components/Container';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';

export function NotFoundPage() {
  return (
    <>
      <SEO
        title="404 — Page Not Found | Vantrix Screen"
        description="The requested page could not be found."
        noindex={true}
      />
      <div className="flex min-h-[70vh] items-center justify-center py-24 text-center">
        <Container className="max-w-md space-y-6">
          <div className="font-mono text-7xl font-extrabold text-[var(--accent)] opacity-40">404</div>
          <h1 className="heading-h2">Page Not Found</h1>
          <p className="text-[15px] leading-relaxed text-[var(--muted)]">
            The page you are looking for does not exist or has been relocated.
          </p>
          <div className="pt-4">
            <Link to="/" className="btn-gold px-8">
              RETURN TO HOMEPAGE
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
