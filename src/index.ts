import { webpack } from 'webpack';
import getConfig from './webpack';

const config = getConfig();

webpack(config, (err, stats) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log(stats?.toString());
  }
});
