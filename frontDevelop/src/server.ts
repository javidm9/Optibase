import { isMainModule } from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

// Sirvo los estáticos del bundle de cliente (JS, CSS, assets)
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// SPA fallback: cualquier ruta que no sea un fichero estático devuelve index.html
// Uso app.use en vez de app.get('*') porque path-to-regexp v8 no acepta wildcards sin nombre
app.use((_req, res) => {
  res.sendFile(join(browserDistFolder, 'index.html'));
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
