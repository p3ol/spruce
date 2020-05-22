import React from 'react';
import { shallow, mount } from 'enzyme';

import { Metas, createStore } from '../../packages/spruce-dom/lib/metas';

describe('metas.js', () => {

  describe('<Metas />', () => {

    it('should render without any issue', () => {
      const component = shallow(<Metas />);
      expect(component.length).toBe(1);
    });

    it('should render a title tag', () => {
      document.title = 'foo';
      shallow(<Metas><title>bar</title></Metas>);
      expect(document.title).toBe('bar');
    });

    it('should render metas tags using a name attribute', () => {
      mount(<Metas><meta name="foo" content="bar" /></Metas>);
      expect(document.querySelector('meta[name=foo]').content).toBe('bar');
    });

    it('should render metas tags using a property attribute', () => {
      mount(
        <Metas><meta property="og:site" content="http://localhost" /></Metas>);
      expect(document.querySelector('meta[property="og:site"]').content)
        .toBe('http://localhost');
    });

    it('should update an existing meta when already present', () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      meta.setAttribute('content', 'http://localhost/foo.jpg');
      document.head.appendChild(meta);

      mount(
        <Metas>
          <meta property="og:image" content="http://localhost/bar.png" />
        </Metas>
      );

      expect(document.querySelector('meta[property="og:image"]').content)
        .toBe('http://localhost/bar.png');
    });

    it('should not render unsupported tags (like <style>)', () => {
      mount(
        <Metas>
          <style type="text/css" />
        </Metas>
      );
      expect(document.querySelector('style[type="text/css"]')).toBeNull();
    });

  });

  describe('createStore()', () => {

    it('should allow to create a object to store meta datas', () => {
      expect(createStore()).toMatchObject({
        title: null,
        metaName: expect.any(Object),
        metaProperty: expect.any(Object),
        renderStatic: expect.any(Function),
      });
    });

    it('should allow to retrieve stored metas for static rendering', () => {
      const store = createStore();
      mount(
        <Metas store={store}>
          <title>foo/bar</title>
          <meta name="viewport" content="user-scale: 1" />
          <meta property="og:site" content="http://localhost" />
        </Metas>
      );
      expect(store.renderStatic()).toMatchObject({
        title: 'foo/bar',
        metas: '' +
          '<meta name="viewport" content="user-scale: 1" />' +
          '<meta property="og:site" content="http://localhost" />',
      });
    });

  });
});
