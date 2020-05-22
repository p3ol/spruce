import net from 'net';

export const findFreePort = async () => {
  let port;
  let i = 10000;

  while (!port && i < 65535) {
    await new Promise(resolve => {
      const c = net.createConnection({ port: i, host: 'localhost' });
      c.on('connect', () => {
        c.destroy();
        resolve();
      });
      c.on('error', () => {
        port = i;
        c.destroy();
        resolve();
      });
    });
    i++;
  }

  return port;
};

export const isServerRunning = (port, host = 'localhost') =>
  new Promise(resolve => {
    const c = net.createConnection({ port, host });
    c.on('connect', () => {
      c.destroy();
      resolve(true);
    });
    c.on('error', () => {
      c.destroy();
      resolve(false);
    });
  });
