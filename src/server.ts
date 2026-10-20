import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Hardening headers on every response.
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Hashed bundles and assets, cached for a year.
app.use(express.static(browserDistFolder, { maxAge: '1y', index: false, redirect: false }));

// Everything else is rendered by Angular (see app.routes.server.ts).
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT'] ?? 4000);
  app.listen(port, () => console.log(`SSR server listening on http://localhost:${port}`));
}

// Used by the Angular CLI dev server and build (and by serverless hosts).
export const reqHandler = createNodeRequestHandler(app);
