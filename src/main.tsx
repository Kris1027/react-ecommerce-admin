import '@/config/env';
import '@/api/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app.tsx';
import { initAuth } from './features/auth/lib/auth-init.ts';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element');

initAuth().finally(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
