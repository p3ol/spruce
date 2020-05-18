import path from 'path';
import React from 'react';
import fastify from 'fastify';
import ejs from 'ejs';
import compress from 'fastify-compress';
import serveStatic from 'fastify-static';
import pointOfView from 'point-of-view';
import { renderToString } from 'react-dom/server';

process.env.IS_SSR = true;

export const create = async ({
  logger = true,
  compression = true,
  services = [],
  viewsEngine = { ejs },
  viewsPath = './dist/views',
  publicPath = './dist/public',
}) => {
  const app = fastify({ logger });

  compression && app.register(compress);

  app.register(pointOfView, {
    engine: viewsEngine,
    root: path.resolve(viewsPath),
  });

  app.register(serveStatic, {
    serve: false,
    root: path.resolve(publicPath),
  });

  for (const service of services) {
    try {
      for (const route of service.routes) {
        const App = route.content || React.Fragment;
        const Metas = route.metas;

        app.get(route.path, (req, reply) => {
          if (/\./.test(req.raw.url)) {
            return reply.sendFile(req.raw.url);
          }

          try {
            const content = renderToString(<App />) || '';

            return reply.view(route.view, {
              spruce: {
                content,
                js: route.jsBundle,
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

  return app;
};
