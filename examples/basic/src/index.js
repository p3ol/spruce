import React from 'react';
import ReactDOM from 'react-dom';
import { Metas, createStore } from '../../../packages/spruce-dom';

const metasStore = createStore();

const App = () => (
  <div>
    <Metas store={metasStore}>
      <title>Demo test</title>
    </Metas>
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

export { App, metasStore };
