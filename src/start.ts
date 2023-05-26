import { Configuration, webpack } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { absolutePath } from './utils';

const start = (config: Configuration) => {
  new WebpackDevServer(
    {
      compress: true,
      historyApiFallback: true,
      static: {
        directory: absolutePath('public'),
        serveIndex: true,
        watch: {
          poll: true,
          ignored: /node_modules/,
        },
      },
    },
    webpack(config)
  ).start();
};

export default start;
