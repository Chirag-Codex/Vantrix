import { Container } from '@/components/Container';
import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  Company:  [{ label: 'About',    href: '/#enterprise' }],
  Platform: [{ label: 'Screen',   href: '/#capabilities' }, { label: 'Talent',    href: '/#platform' }, { label: 'Pricing', href: '/#pricing' }],
  Legal:    [{ label: 'Privacy',  href: '/privacy', isRoute: true }, { label: 'Terms', href: '/terms', isRoute: true }, { label: 'Security', href: '/security', isRoute: true }],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] pt-16 pb-12">
      <Container>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 mb-12">
          {Object.entries(FOOTER_LINKS).map(([col, links]) => (
            <div key={col}>
              <div className="mb-4 text-[13px] font-bold text-[rgb(var(--c-text))]">{col}</div>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    {l.isRoute ? (
                      <Link
                        to={l.href}
                        className="text-[13px] text-[rgb(var(--c-muted))] transition-colors duration-150 hover:text-[rgb(var(--c-text))]"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        className="text-[13px] text-[rgb(var(--c-muted))] transition-colors duration-150 hover:text-[rgb(var(--c-text))]"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--line)] pt-8 text-[13px] text-[rgb(var(--c-muted))] sm:flex-row">
          <div className="font-bold text-[rgb(var(--c-text))]">VANTRIX</div>
          <div>© Vantrix. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="mailto:hello@vantrix.ai" className="transition-colors duration-150 hover:text-[rgb(var(--c-text))]">
              Contact
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
