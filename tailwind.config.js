/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '20px',
        sm: '24px',
        lg: '32px',
      },
      screens: {
        '2xl': '1180px',
      },
    },
    extend: {
      colors: {
        bg: 'var(--bg)',
        background: 'var(--bg)',
        text: 'var(--text)',
        foreground: 'var(--text)',
        muted: 'var(--muted)',
        muted2: 'var(--muted2)',
        fill: 'var(--fill)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        panel: 'var(--panel)',
        'code-bg': 'var(--code-bg)',
        accent: 'var(--accent)',
        'gold-soft': 'var(--gold-soft)',
        'on-gold': 'var(--on-gold)',
        glow: 'var(--glow)',
        ok: 'var(--ok)',
        'ok-bg': 'var(--ok-bg)',
        danger: 'var(--danger)',
        'danger-bg': 'var(--danger-bg)',
        card: 'var(--panel)',
        border: 'var(--line)',
        input: 'var(--fill)',
        ring: 'var(--accent)',
        surface: {
          DEFAULT: 'var(--fill)',
          border: 'var(--line)',
          hover: 'var(--fill)',
        },
        'syn-plain': 'var(--syn-plain)',
        'syn-keyword': 'var(--syn-keyword)',
        'syn-string': 'var(--syn-string)',
        'syn-comment': 'var(--syn-comment)',
        'syn-grid': 'var(--syn-grid)',
        vantrix: {
          text: 'var(--text)',
          muted: 'var(--muted)',
          muted2: 'var(--muted2)',
          primary: 'var(--accent)',
          accent: 'var(--accent)',
          amber: 'var(--accent)',
          'amber-hover': 'var(--accent)',
        },
      },
      borderRadius: {
        card: '32px',
        panel: '24px',
        pill: '9999px',
        button: '9999px',
        input: '14px',
        lg: '24px',
        md: '14px',
        sm: '8px',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['12px', { lineHeight: '16px', letterSpacing: '0.16em', fontWeight: '700' }],
        btn: ['13px', { lineHeight: '18px', letterSpacing: '0.07em', fontWeight: '700' }],
      },
      maxWidth: {
        container: '1180px',
        prose: '65ch',
      },
      boxShadow: {
        glass: 'var(--glass-shadow)',
        panel: '0 40px 120px var(--glow)',
        popular: '0 0 80px var(--glow)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
