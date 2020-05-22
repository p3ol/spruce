import path from 'path';
import React from 'react';
import puppeteer from 'puppeteer';

import { Metas, createStore } from '../../packages/spruce-dom/lib/metas';
import createServer from '../../packages/spruce/lib/server';
import { findFreePort, isServerRunning } from '../utils';

describe('server.js', () => {
  jest.setTimeout(30000);

  describe('createServer()', () => {
    let browser;

    beforeAll(async () => {
      browser = await puppeteer.launch();
    });

    describe('basic', () => {
      let App, port, server, page;

      beforeAll(async () => {
        App = () => <h1>Test app</h1>;
        port = await findFreePort();
        server = await createServer({
          viewsPath: path.resolve('./tests/fixtures/'),
          publicPath: path.resolve('./tests/fixtures/'),
          services: [{
            routes: [{
              path: '/*',
              view: 'index.ejs',
              content: App,
            }],
          }],
        });
        await server.listen(port);
        page = await browser.newPage();
        await page.goto(`http://localhost:${port}/`);
      });

      it('should render content inside the page', async () => {
        await page.waitForSelector('h1');
        const title = await page.evaluate(() =>
          document.querySelector('h1').innerText);

        expect(title).toBe('Test app');
      });

      it('should allow to load external assets', async () => {
        await page.waitForSelector('.test-asset');
        const content = await page.evaluate(() =>
          document.querySelector('.test-asset').innerText);

        expect(content).toBe('assets work');
      });

      afterAll(async () => {
        await server.close();
      });
    });

    describe('advanced with metas', () => {
      let App, port, server, page, metasStore;

      beforeAll(async () => {
        metasStore = createStore();

        App = () => (
          <>
            <Metas store={metasStore}>
              <title>Test title</title>
            </Metas>
            <h1>Test app</h1>
          </>
        );

        port = await findFreePort();
        server = await createServer({
          viewsPath: path.resolve('./tests/fixtures/'),
          publicPath: path.resolve('./tests/fixtures/'),
          services: [{
            routes: [{
              path: '/*',
              view: 'index.ejs',
              content: App,
              metas: () => metasStore.renderStatic(),
            }],
          }],
        });
        await server.listen(port);
        page = await browser.newPage();
        await page.goto(`http://localhost:${port}/`);
      });

      it('should render content inside the page', async () => {
        await page.waitForSelector('h1');
        const title = await page.evaluate(() =>
          document.querySelector('h1').innerText);

        expect(title).toBe('Test app');
      });

      it('should allow to load external assets', async () => {
        await page.waitForSelector('.test-asset');
        const content = await page.evaluate(() =>
          document.querySelector('.test-asset').innerText);

        expect(content).toBe('assets work');
      });

      it('should load custom rendered metas', async () => {
        await page.waitForSelector('title');
        const content = await page.evaluate(() =>
          document.querySelector('title').innerText);

        expect(content).toBe('Test title');
      });

      afterAll(async () => {
        await server.close();
      });
    });

    describe('minimal config', () => {
      let port, server;

      beforeAll(async () => {
        port = await findFreePort();
        server = await createServer();
        await server.listen(port);
      });

      it('should allow to run a server with no configuration ' +
        'whatsoever', async () => {
        expect(await isServerRunning(port)).toBe(true);
      });

      afterAll(async () => {
        await server.close();
      });
    });

    describe('default route has no content', () => {
      let port, server, page;

      beforeAll(async () => {
        port = await findFreePort();
        server = await createServer({
          viewsPath: path.resolve('./tests/fixtures/'),
          publicPath: path.resolve('./tests/fixtures/'),
          services: [{
            routes: [{
              path: '/*',
              view: './index.ejs',
            }],
          }],
        });
        await server.listen(port);
        page = await browser.newPage();
        await page.goto(`http://localhost:${port}/`);
      });

      it('should allow to run a server with no content inside the default ' +
        'route', async () => {
        await page.waitForSelector('#app');
        const content = await page.evaluate(() =>
          document.querySelector('#app').innerText);

        expect(content).toBe('');
      });

      afterAll(async () => {
        await server.close();
      });
    });

    afterAll(async () => {
      await browser.close();
    });
  });
});
