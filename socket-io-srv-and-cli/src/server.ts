/**
 *   ___ __  __ ____   ___  ____ _____  _    _   _ _____
 *  |_ _|  \/  |  _ \ / _ \|  _ \_   _|/ \  | \ | |_   _|
 *   | || |\/| | |_) | | | | |_) || | / _ \ |  \| | | |
 *   | || |  | |  __/| |_| |  _ < | |/ ___ \| |\  | | |
 *  |___|_|  |_|_|    \___/|_| \_\|_/_/   \_\_| \_| |_|
 *
 *  As stated here:
 *  https://angular.dev/guide/ssr#configure-server-side-rendering
 *
 *  Angular v17 and later, server.ts is no longer used by ng serve.
 *  The dev server will use main.server.ts directly
 *  to perform server side rendering.
 */


import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';
import * as IO from 'socket.io';
import * as Http from 'node:http';


const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const server = new Http.Server(app);
const commonEngine = new CommonEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  /**
   * Note: we only see this code executed if we manually start our server
   * see readme for further instructions
   */

  console.log('Its the main module...')
  const port = process.env['PORT'] || 4000;
  // import * as IO from 'socket.io';
  // ....
  const io = new IO.Server(server, {
    // path: '/foo/'
  });
  io.on('connection', (socket) => {
    console.log('Socket: New connection from socket #: ' + socket.id);
    console.log('Sending hi to the client... open browser console to see the message');
    socket.send({ message: `Server says hi to socket #${socket.id}` });
  })

  /**
   * Event listener for HTTP server "error" event.
   */
  let onError = (error: any) => {
    // closeAppLocator();
    const bind = 'Port ' + port;
    let msg;
    switch (error.code) {
      case 'EACCES':
        msg = bind + ' requires elevated privileges';
        break;
      case 'EADDRINUSE':
        msg = bind + ' is already in use';
        break;
      default:
        msg = 'Server could not be started. Err: ' + error.message;
    }
    console.log(msg);
    process.exit();
  };


  server.on('error', onError);
  server.listen(port, () => {
    console.log(`#1 HTTP server listening on http://localhost:${port}`);
  });
}
