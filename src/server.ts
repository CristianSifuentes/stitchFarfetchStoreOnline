import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';
import { CommonEngine } from '@angular/ssr/node';

const app = express();
const distFolder = dirname(fileURLToPath(import.meta.url));
const browserFolder = resolve(distFolder, '../browser');
const indexHtml = join(browserFolder, 'index.html');
const engine = new CommonEngine();

app.use(express.static(browserFolder, {
  maxAge: '1y',
  immutable: true
}));

app.get('*', async (req, res, next) => {
  try {
    const html = await engine.render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${req.protocol}://${req.get('host')}${req.originalUrl}`
    });

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.send(html);
  } catch (err) {
    next(err);
  }
});

const port = Number(process.env['PORT'] ?? 4000);
app.listen(port, () => console.log(`SSR server listening on ${port}`));
