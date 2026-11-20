export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-[var(--accent)] focus:px-6 focus:py-3 focus:text-sm focus:font-bold focus:text-[var(--on-gold)] focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--line-strong)]"
    >
      Skip to main content
    </a>
  );
}
