import path from 'path';
import React from 'react';
import fastify from 'fastify';
import ejs from 'ejs';
import compress from 'fastify-compress';
import serveStatic from 'fastify-static';
import pointOfView from 'point-of-view';
import { renderToString } from 'react-dom/server';
import { Metas } from './metas';

export default async ({
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
        const paths = [].concat(route.path);

        for (const path of paths) {
          app.get(path, (req, reply) => {
            if (/\./.test(req.raw.url)) {
              return reply.sendFile(req.raw.url);
            }

            try {
              const content = renderToString(<App />) || '';

              return reply.view(route.view, {
                spruce: {
                  title: route.title,
                  content,
                  metas: Metas.renderStatic(route.metas) || {},
                },
              });
            } catch (e) {
              console.error(e);
              return reply.code(500).send('');
            }
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return app;
};
