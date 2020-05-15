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

export default async ({
  services: [],
} = {}) => {
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

  for (const service of services) {
    try {
      const serviceConfig = (await import(/* webpackMode: "eager" */
        `../services/${service}/app.config.js`)).default;

      for (const route of serviceConfig.routes) {
        const App = route.handler || React.Fragment;
        const Metas = route.metasHandler;
        const stats = (await import(/* webpackMode: "eager" */
          `../dist/${service}.json`)).default;

        app.get(route.path, (req, reply) => {
          if (/\./.test(req.raw.url)) {
            return reply.sendFile(req.raw.url);
          }

          process.env.NAVIGATOR_LANGUAGE = req.headers['accept-language'];
          process.env.LOCATION_URL = req.url;
          process.env.LOCATION_HREF = req.originalUrl;
          process.env.LOCATION_PATHNAME = route.path;

          try {
            const content = renderToString(<App />);

            return reply.view(`/${service}/index.ejs`, {
              content,
              head: Metas?.renderStatic?.(),
              jsBundle: stats?.js,
              stylesBundle: stats?.css,
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
};
