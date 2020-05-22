import path from 'path';
import React from 'react';
import fastify from 'fastify';
import ejs from 'ejs';
import compress from 'fastify-compress';
import serveStatic from 'fastify-static';
import pointOfView from 'point-of-view';
import { renderToString } from 'react-dom/server';

export default async ({
  logger = false,
  compression = true,
  services = [],
  viewsEngine = { ejs },
  viewsPath = './dist/views',
  publicPath = './dist/public',
} = {}) => {
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
        const paths = [].concat(route.path);

        for (const path of paths) {
          app.get(path, (req, reply) => {
            if (/\./.test(req.raw.url)) {
              return reply.sendFile(req.raw.url);
            }

            try {
              const content = renderToString(<App />) || '';
              const { title = '', metas = '' } =
                typeof route.metas === 'function'
                  ? route.metas() : route.metas || {};

              return reply.view(route.view, {
                spruce: {
                  title,
                  content,
                  metas,
                },
              });
            } catch (e) {
              /* istanbul ignore next: not very useful */
              console.error(e);
              /* istanbul ignore next: same */
              return reply.code(500).send('Server error');
            }
          });
        }
      }
    } catch (e) {
      /* istanbul ignore next: just in case */
      console.error(e);
    }
  }

  return app;
};
