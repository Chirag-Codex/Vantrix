import { Container } from '@/components/Container';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] pt-16 pb-12">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 text-[14px] text-[var(--muted)] sm:flex-row">
          <div>&copy; Vantrix. All rights reserved.</div>
          <div className="flex items-center gap-8">
            <Link to="/privacy" className="transition-colors hover:text-[var(--text)]">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-[var(--text)]">
              Terms
            </Link>
            <a href="mailto:hello@vantrix.ai" className="transition-colors hover:text-[var(--text)]">
              Contact
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
