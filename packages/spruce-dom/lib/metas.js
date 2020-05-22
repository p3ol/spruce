import React from 'react';
import ReactDOM from 'react-dom';

const renderStatic = function () {
  return {
    title: this.title,
    metas: '' +
      Object
        .entries(this.metaName || /* istanbul ignore next: just in case */ {})
        .map(([_, { name, content }]) =>
          `<meta name="${name}" content="${content}" />`
        ).join('') +
      Object
        .entries(this.metaProperty || /* istanbul ignore next: same */ {})
        .map(([_, { property, content }]) =>
          `<meta property="${property}" content="${content}" />`
        ).join(''),
  };
};

const createStore = () => ({
  title: null,
  metaProperty: {},
  metaName: {},
  renderStatic,
});

const defaultStore = createStore();

const Metas = ({
  store = defaultStore,
  translate = val => val,
  children,
}) => {

  const renderTitle = child => {
    const title = translate(child.props.children);
    store.title = title;

    /* istanbul ignore else: document is always available in jsdom */
    if (typeof document !== 'undefined') {
      document.title = title;
    }
  };

  const renderMeta = child => {
    const content = translate(child.props.content);
    let selector;

    if (child.props.property) {
      selector = `meta[property='${child.props.property}']`;
      store.metaProperty[child.props.property] = { ...child.props, content };
    } else {
      selector = `meta[name='${child.props.name}']`;
      store.metaName[child.props.name] = { ...child.props, content };
    }

    /* istanbul ignore else: document is always available in jsdom */
    if (typeof document !== 'undefined') {
      const tag = document.querySelector(selector);

      if (!tag) {
        return ReactDOM.createPortal(
          React.cloneElement(child, { content }), document.head
        );
      } else {
        tag.setAttribute('content', content);

        return null;
      }
    } else {
      return null;
    }
  };

  return React.Children.map(children, (child) => {
    switch (child.type) {
      case 'title':
        return renderTitle(child);

      case 'meta':
        return renderMeta(child);

      default:
        return null;
    }
  });
};

export { Metas, createStore };
