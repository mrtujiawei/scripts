import { Command } from 'commander';
import { getUmdConfig, getUmdLibConfig } from './webpack';
import start from './start';
import build from './build';
import { buildCss, buildLess } from './gulp';

interface Options {
  mode?: string;
  lib?: boolean;
  css?: boolean;
  less?: boolean;
}

new Command('t-scripts')
  .addCommand(
    new Command('start').action(() => {
      start(getUmdConfig());
    })
  )
  .addCommand(
    new Command('build')
      .option('--mode <mode>', 'development | production')
      .option('--lib', '打包 lib')
      .option('--less', '打包 less')
      .option('--css', '打包 css')
      .action(({ mode, lib, css, less }: Options) => {
        if (lib) {
          build(getUmdLibConfig(mode));
        }

        if (css) {
          buildCss();
        }

        if (less) {
          buildLess();
        }

        if (!lib && !css && !less) {
          build(getUmdConfig(mode));
        }
      })
  )
  .parse();
