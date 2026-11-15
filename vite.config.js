import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Política de segurança de conteúdo (CSP): o navegador só roda script e só conversa com os
// endereços listados. Se alguém conseguir injetar um link ou script, ele não carrega.
// Vai só no site publicado (o modo de desenvolvimento do Vite precisa de script inline).
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval' https://cdn.jsdelivr.net blob:", // OCR (tesseract) vem do jsDelivr
  "worker-src 'self' blob: https://cdn.jsdelivr.net",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cdn.jsdelivr.net https://tessdata.projectnaptha.com blob: data:",
  "img-src 'self' data: blob: https://*.supabase.co",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "frame-src blob: https://*.supabase.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = {
  name: 'csp-no-build',
  apply: 'build',
  transformIndexHtml(html) {
    return html.replace(
      '<meta charset="UTF-8" />',
      `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />\n    <meta name="referrer" content="strict-origin-when-cross-origin" />`,
    );
  },
};

// base './' permite publicar em qualquer pasta (GitHub Pages, Netlify, Vercel).
export default defineConfig({
  plugins: [react(), securityHeaders],
  base: './',
  server: { port: 5180, host: true },
});
