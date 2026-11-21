import * as React from 'react';

// Light-only design — ThemeContext kept for API compatibility.
export const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  React.useEffect(() => {
    try {
      localStorage.removeItem('theme');
    } catch {
      // ignore
    }

    const root = document.documentElement;
    root.classList.remove('dark');
    root.removeAttribute('data-theme');
    root.style.colorScheme = 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F6F7FC');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
