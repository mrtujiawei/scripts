import { Configuration, webpack } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { absolutePath } from './utils';

const start = (config: Configuration) => {
  new WebpackDevServer(
    {
      compress: false,
      historyApiFallback: true,
      static: {
        directory: absolutePath('public'),
        serveIndex: true,
      },
    },
    webpack(config)
  ).start();
};

export default start;
