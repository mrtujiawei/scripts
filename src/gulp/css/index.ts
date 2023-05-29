import path from 'path';
import { SpawnOptions, spawnSync } from 'child_process';

const options: SpawnOptions = {
  stdio: 'inherit',
};

const command = 'npx';
// -L 日志详细程度，越少越简单
const args = [
  'gulp',
  '-LL',
  '--cwd',
  process.cwd(),
  '-f',
  path.resolve(__dirname, './gulpfile.js'),
];

const build = () => {
  console.log([command].concat(args).join(' '));
  spawnSync(command, args, options);
};

export default build;
