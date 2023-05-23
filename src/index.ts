import build from './build';
import * as configs from './webpack';
import { Command } from 'commander';

interface Option {
  type: 'umd' | 'cjs';
}

const command = new Command('t-scripts');

const buildCommand = new Command('build');

buildCommand
  .requiredOption('--type <type>', '打包输出类型: umd | cjs')
  .action(({ type }: Option) => {
    const key = `get${
      type[0]?.toUpperCase() + type.slice(1)
    }Config` as keyof typeof configs;
    build(configs[key]());
  });

command.addCommand(buildCommand).parse();
