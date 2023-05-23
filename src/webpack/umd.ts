/**
 * 打包 UMD 工具 使用
 *
 * @filename: scripts/webpack.config.ts
 * @author: Mr Prince
 * @date: 2022-11-02 15:05:44
 */
import webpack from 'webpack';
import { isEnvProduction, mode, sourceMap, WARN_FILE_SIZE } from '../constants';
import { getLibraryName } from '../utils';
import { BabelLoader } from './loaders';
import { TerserWebpackPlugin } from './plugins';

/**
 * 使用函数包裹是为了能够根据 constants 改变 config
 */
const getWebpackConfig = () => {
  const config: webpack.Configuration = {
    mode: mode,
    // 有错尽快结束
    bail: isEnvProduction,
    // sourcemap配置
    devtool: !isEnvProduction && sourceMap && 'source-map',

    // 有警告或错误才显示
    stats: 'errors-warnings',
    entry: './src/index',
    output: {
      globalObject: 'this',
      filename: `index${isEnvProduction ? '.min' : ''}.js`,
      library: {
        type: 'umd',
        name: getLibraryName(),
      },
    },
    module: {
      // 将缺失的导出提示成错误而不是警告
      strictExportPresence: true,
      rules: [
        {
          oneOf: [
            {
              test: /\.(t|j)sx?$/,
              exclude: /(node_modules)/,
              use: BabelLoader,
            },
          ],
        },
      ],
    },
    resolve: {
      mainFields: ['#source', 'browser', 'module', 'main'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [TerserWebpackPlugin],
    },
    performance: {
      maxEntrypointSize: WARN_FILE_SIZE,
      maxAssetSize: WARN_FILE_SIZE,
    },
  };
  return config;
};

export default getWebpackConfig;
