import path from 'path';
import React from 'react';
import fastify from 'fastify';
import ejs from 'ejs';
import compression from 'fastify-compress';
import serveStatic from 'fastify-static';
import pointOfView from 'point-of-view';
import { renderToString } from 'react-dom/server';

process.env.IS_SSR = true;
const port = process.env.PORT || 5000;

(async () => {
  const configPath = path.resolve('spruce.config.js');
  const spruceConfig = (await import(
    /* webpackMode: "eager" */
    configPath
  )).default;

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
      const serviceConfig = (await import(
        /* webpackMode: "eager" */
        path.resolve(service.server.entry)
      )).default;

      for (const route of serviceConfig.routes) {
        const App = route.content || React.Fragment;
        const Metas = route.metas;

        app.get(route.path, (req, reply) => {
          if (/\./.test(req.raw.url)) {
            return reply.sendFile(req.raw.url);
          }

          try {
            const content = renderToString(<App />);

            return reply.view(`/${service.name}/index.ejs`, {
              content,
              head: Metas?.renderStatic?.(),
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
