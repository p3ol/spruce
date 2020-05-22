const { createServer } = require('../../packages/spruce');
const stats = require('./dist/stats.json');

const { App, metasStore } = require(`./dist/public/${stats.bundles.main}`);

(async () => {
  const server = await createServer({
    services: [{
      name: 'main',
      routes: [{
        path: '/*',
        view: 'default/index.ejs',
        content: App,
        metas: () => metasStore.renderStatic(),
      }],
    }],
  });

  server.listen(process.env.PORT || 5000);
})();
