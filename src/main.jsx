// Compatibility patch for Zod / @hookform/resolvers
if (!('errors' in Error.prototype)) {
  Object.defineProperty(Error.prototype, 'errors', {
    get() {
      return this.issues;
    },
    configurable: true,
  });
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './styles/globals.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
