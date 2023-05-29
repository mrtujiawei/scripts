import path from 'path';
import { spawn, SpawnOptions, spawnSync } from 'child_process';

const options: SpawnOptions = {
  stdio: 'inherit',
};

const build = (watch?: boolean) => {
  const cwd = process.cwd();
  const command = 'npx';
  // -L 日志详细程度，越少越简单
  const args = [
    'gulp',
    '-LL',
    '--cwd',
    cwd,
    '-f',
    path.resolve(__dirname, './gulpfile.js'),
  ];
  const watchArg = ['start'];

  if (watch) {
    console.log([command].concat(args, watchArg).join(' '));
    const gulp = spawn(command, args.concat(watchArg), options);

    gulp.on('close', (code) => {
      console.log(`gulp exit with code ${code}`);
    });
  } else {
    console.log([command].concat(args).join(' '));
    spawnSync(command, args, options);
  }
};

export default build;
