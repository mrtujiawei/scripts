import { Command } from 'commander';
import { getUmdConfig, getUmdLibConfig } from './webpack';
import start from './start';
import build from './build';

new Command('t-scripts')
  .addCommand(
    new Command('start').action(() => {
      start(getUmdConfig());
    })
  )
  .addCommand(
    new Command('build')
      .option('--mode <mode>', 'development | production')
      .option('--lib', '打包成库')
      .action(({ mode, lib }: { mode?: string; lib?: boolean }) => {
        if (lib) {
          build(getUmdLibConfig(mode));
        } else {
          build(getUmdConfig(mode));
        }
      })
  )
  .parse();
