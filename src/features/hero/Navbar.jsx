import * as React from 'react';
import { Container } from '@/components/Container';
import { Logo } from '@/components/Logo';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

export function Navbar({ onOpenDemoModal }) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-40 h-20 transition-all duration-300',
        isScrolled
          ? 'border-b border-[var(--line)] bg-[var(--bg)]/90 shadow-md backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <Container className="flex h-full items-center justify-between gap-4">
        {/* Brand Logo with Gold V */}
        <Logo />

        {/* Desktop Nav Links (15px/500, 36px gap, Screen is --text, others --muted) */}
        <nav className="hidden items-center gap-9 md:flex" aria-label="Main navigation">
          {[
            { label: 'Screen', href: isHome ? '#capabilities' : '/#capabilities' },
            { label: 'Talent', href: isHome ? '#explore' : '/#explore' },
            { label: 'About', href: isHome ? '#enterprise' : '/#enterprise' },
            { label: 'Pricing', href: isHome ? '#pricing' : '/#pricing' },
          ].map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                'text-[15px] font-medium transition-colors hover:text-[var(--text)]',
                idx === 0 ? 'text-[var(--text)]' : 'text-[var(--muted)]'
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right: gold Book a demo */}
        <div className="hidden items-center gap-3.5 md:flex">
          {/* Book a Demo Button (min-height 44px, gold gradient) */}
          <button
            type="button"
            onClick={onOpenDemoModal}
            aria-label="Book a live demo"
            className="btn-gold min-h-[44px] px-6 text-[13px]"
          >
            BOOK A DEMO
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open mobile navigation menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--fill)] text-[var(--text)] cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex flex-col border-[var(--line)] bg-[var(--bg)] text-[var(--text)]"
            >
              <SheetHeader className="border-b border-[var(--line)] pb-4 text-left">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col justify-between py-6">
                <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
                  {[
                    { label: 'Screen', href: '#capabilities' },
                    { label: 'Talent', href: '#explore' },
                    { label: 'About', href: '#enterprise' },
                    { label: 'Pricing', href: '#pricing' },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={isHome ? item.href : `/${item.href}`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-4 py-3 text-base font-semibold text-[var(--text)] transition-colors hover:bg-[var(--fill)]"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
                <div className="space-y-3 pt-6 border-t border-[var(--line)]">
                  <button
                    type="button"
                    className="btn-gold w-full text-center"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenDemoModal();
                    }}
                  >
                    BOOK A DEMO
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
