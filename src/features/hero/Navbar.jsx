import * as React from 'react';
import { Container } from '@/components/Container';
import { Logo } from '@/components/Logo';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar({ onOpenDemoModal }) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-40 h-[76px] transition-all duration-300',
        isScrolled
          ? 'border-b border-[var(--line)] bg-[rgb(var(--c-card)/0.9)] shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <Container className="flex h-full items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Nav Links (15px/500, 30px gap) */}
        <nav className="hidden items-center gap-[30px] md:flex" aria-label="Main navigation">
          {[
            { label: 'Product',       href: '/#platform'     },
            { label: 'Capabilities',  href: '/#capabilities' },
            { label: 'Enterprise',    href: '/#enterprise'   },
            { label: 'Pricing',       href: '/#pricing'      },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[15px] font-medium text-[rgb(var(--c-muted))] transition-colors duration-150 hover:text-[rgb(var(--c-text))]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right: Book a demo + Buy now */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={onOpenDemoModal}
            aria-label="Book a live demo"
            className="btn-ghost min-h-[46px] px-6 text-[15px]"
          >
            Book a demo
          </button>
          <a
            href="/#pricing"
            className="btn-gold min-h-[46px] px-6 text-[15px]"
          >
            Buy now
          </a>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open mobile navigation menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-[rgb(var(--c-chip))] text-[rgb(var(--c-text))] cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex flex-col border-[var(--line)] bg-[rgb(var(--c-card))] text-[rgb(var(--c-text))]"
            >
              <SheetHeader className="border-b border-[var(--line)] pb-4 text-left">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col justify-between py-6">
                <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
                  {[
                    { label: 'Product',      href: '/#platform'     },
                    { label: 'Capabilities', href: '/#capabilities' },
                    { label: 'Enterprise',   href: '/#enterprise'   },
                    { label: 'Pricing',      href: '/#pricing'      },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-4 py-3 text-base font-semibold text-[rgb(var(--c-text))] transition-colors hover:bg-[rgb(var(--c-chip))]"
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
                    Book a demo
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
