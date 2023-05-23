import { Command } from 'commander';
import { getUmdConfig, getUmdLibConfig } from './webpack';
import start from './start';
import build from './build';

new Command('t-scripts')
  .addCommand(new Command('start'))
  .action(() => {
    start(getUmdConfig());
  })
  .addCommand(
    new Command('build')
      .option('--mode <mode>', 'development | production')
      .action(({ mode }: { mode?: string }) => {
        build(getUmdConfig(mode));
      })
      .addCommand(
        new Command('lib')
          .option('--mode <mode>', 'development | production')
          .action(({ mode }: { mode?: string }) => {
            build(getUmdLibConfig(mode));
          })
      )
  )
  .parse();
