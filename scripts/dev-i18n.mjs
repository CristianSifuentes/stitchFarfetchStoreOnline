// `npm start`: the store in every language, as in production. `ng serve`
// can only serve one locale, so this builds all of them in watch mode
// (English at /, the rest under /es-419/, /de/…) and runs the SSR server,
// restarting it after each rebuild. Refresh the browser to see changes.
// `npm run start:en` is the faster single-language dev server with HMR.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const PORT = process.env.PORT ?? '4200';
const SERVER = 'dist/vestra/server/server.mjs';

const build = spawn('npx', ['ng', 'build', '--configuration', 'development', '--localize', '--watch'], {
  stdio: ['ignore', 'pipe', 'inherit']
});

let server = null;
build.stdout.on('data', (chunk) => {
  process.stdout.write(chunk);
  // Start the server once the first build is written; node --watch picks
  // up every later one.
  if (!server && chunk.toString().includes('bundle generation complete') && existsSync(SERVER)) {
    server = spawn('node', ['--watch-path=dist/vestra/server', SERVER], {
      stdio: 'inherit',
      env: { ...process.env, PORT }
    });
    console.log(`\nVESTRA in every language: http://localhost:${PORT}/ · /es-419/ · /de/ · /fr/ · /ru/ · /zh-Hans/\n`);
  }
});

const stop = () => {
  build.kill();
  server?.kill();
  process.exit();
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
build.on('exit', (code) => {
  server?.kill();
  process.exit(code ?? 0);
});
