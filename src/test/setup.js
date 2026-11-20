import '@testing-library/jest-dom';

// Compatibility patch for Zod / @hookform/resolvers
if (!('errors' in Error.prototype)) {
  Object.defineProperty(Error.prototype, 'errors', {
    get() {
      return this.issues;
    },
    configurable: true,
  });
}

// Polyfill window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill HTMLMediaElement.prototype.play and pause for jsdom
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};
window.HTMLMediaElement.prototype.load = () => {};
