# 🌲 Spruce

> A React SSR toolbelt for your everyday life

## Installation

```bash
yarn add @poool/spruce @poool/spruce-dom @poool/spruce-webpack-config
```

If you don't want to install the `peerDependencies` by hand, you can install them using `install-peerdeps`:

```bash
npx install-peerdeps @poool/spruce -Y
npx install-peerdeps @poool/spruce-dom -Y
npx install-peerdeps @poool/spruce-webpack-config -Y --dev
```

\* `-Y` stands for `yarn`, omit it if you need to use `npm`

## Usage

Because React server-side rendering can be a real pain in the ass, we __tried__ to do it the easiest way we could come up with.

The minimum possible usage consists of an app:

```javascript
// index.js
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => (
  <div>
    <h1>Hello world, this is a demo!</h1>
  </div>
);

if (typeof document !== 'undefined') {
  const appContainer = document.getElementById('app');

  if (appContainer.innerHTML) {
    ReactDOM.hydrate(<App />, document.getElementById('app'));
  } else {
    ReactDOM.render(<App />, document.getElementById('app'));
  }
}

export default App;
```

```html
<!-- index.ejs -->
<!DOCTYPE html>
<html>
  <head>
    <base href="/" />
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no">

    <title><%= typeof spruce !== 'undefined' ? spruce.title : '' %></title>
  </head>
  <body>
    <div id="app"><%- typeof spruce !== 'undefined' ? spruce.content : '' %></div>
  </body>
</html>
```

Built with webpack:

```javascript
// webpack.config.js
const SpruceWebpackConfig = require('@poool/spruce-webpack-config');

module.exports = SpruceWebpackConfig({
  entry: './index.js',
  templateEntry: './index.ejs',
});
```
```bash
webpack --config webpack.config.js
```

And a server (that runs `fastify` under the hood):

```javascript
// server.js
const { createServer } = require('@poool/spruce');
const stats = require('./dist/stats.json');

const App = require(`./dist/public/${stats.bundles.main}`).default;

(async () => {
  const server = await createServer({
    services: [{
      name: 'main',
      routes: [{
        path: '/*',
        view: 'default/index.ejs',
        content: App,
      }],
    }],
  });

  server.listen(process.env.PORT || 5000);
})();
```

You can find additional and advanced examples in the [`examples/`](https://github.com/p3ol/spruce/blob/master/examples) folder.

## Configuration

You can take a look at each individual package to find the configuration that fits your needs:

| Name | Description | |
| --- | --- | --- |
| `@poool/spruce` | The main package that will create and run the server | [documentation](https://github.com/p3ol/spruce/blob/master/packages/spruce) |
| `@poool/spruce-dom` | All the front-end components you will need for specific SSR tasks, like `Metas` | [documentation](https://github.com/p3ol/spruce/blob/master/packages/spruce-dom) |
| `@poool/spruce-webpack-config` |  The minimal config needed to build your app to be compatible with SSR | [documentation](https://github.com/p3ol/spruce/blob/master/packages/spruce-webpack-config)

## Contributing

Please check the [CONTRIBUTING.md](https://github.com/p3ol/buddy/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## Development

Install root & example dependencies:

```bash
yarn install
cd examples/basic && yarn install
```

Run example at http://localhost:8000/ with webpack dev server:

```bash
cd examples/basic && yarn serve
```

And test your code:

```bash
yarn test
```

## License

This software is licensed under [MIT](https://github.com/p3ol/spruce/blob/master/LICENSE).

## Contributors

<!-- Contributors START
Ugo_Stephant dackmin https://ugostephant.io code doc tools
Contributors END -->
<!-- Contributors table START -->
| <img src="https://avatars.githubusercontent.com/dackmin?s=100" width="100" alt="Ugo Stephant" /><br />[<sub>Ugo Stephant</sub>](https://github.com/dackmin)<br />[💻](https://github.com/p3ol/buddy/commits?author=dackmin) [📖](https://github.com/p3ol/buddy/commits?author=dackmin) 🔧 |
| :---: |
<!-- Contributors table END -->
