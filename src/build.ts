import { Configuration, webpack } from 'webpack';

const build = (config: Configuration) => {
  webpack(config, (err, stats) => {
    console.log(err?.message || stats?.toString());
  });
};

export default build;
