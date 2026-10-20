import { RenderMode, ServerRoute } from '@angular/ssr';

// Every page depends on the request (query params drive the listing), so
// all routes are rendered on the server per request.
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Server }];
