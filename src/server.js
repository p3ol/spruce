import path from 'path';
import React from 'react';
import fastify from 'fastify';
import ejs from 'ejs';
import compression from 'fastify-compress';
import serveStatic from 'fastify-static';
import pointOfView from 'point-of-view';
import { renderToString } from 'react-dom/server';
import spruceConfig from '@poool/spruce-config';

process.env.IS_SSR = true;
const port = process.env.PORT || 5000;

const importLocal = require
  .context(path.resolve(), true, /\.js$/, 'eager');

(async () => {
  const app = fastify({ logger: true });
  app.register(compression);

  app.register(pointOfView, {
    engine: { ejs },
    root: path.resolve('./dist/views'),
  });

  app.register(serveStatic, {
    serve: false,
    root: path.resolve('./dist/public'),
  });

  for (const service of spruceConfig.services) {
    service.name = service.name || 'default';

    try {
      const serciveConfigPath = path.resolve(service.server.entry);
      const serviceConfig = (await importLocal(
        serciveConfigPath
      )).default;

      for (const route of serviceConfig.routes) {
        const App = route.content || React.Fragment;
        const Metas = route.metas;

        app.get(route.path, (req, reply) => {
          if (/\./.test(req.raw.url)) {
            return reply.sendFile(req.raw.url);
          }

          try {
            const content = renderToString(<App />) || '';

            return reply.view(`/${service.name}/index.ejs`, {
              spruce: {
                content,
                metas: Metas?.renderStatic?.() || {},
              },
            });
          } catch (e) {
            console.error(e);
            return reply.code(500).send('');
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  app.listen(port);
})();
