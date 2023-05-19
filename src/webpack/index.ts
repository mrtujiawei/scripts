/**
 * 提供最基础的模板
 * 经过修改后才能使用
 *
 * 主要是要添加
 *
 * @filename: scripts/webpack.config.ts
 * @author: Mr Prince
 * @date: 2022-11-02 15:05:44
 */
import webpack from 'webpack';
import { isEnvProduction, mode, sourceMap, WARN_FILE_SIZE } from '../constants';
import {
  BabelLoader,
  CssLoader,
  LessLoader,
  MiniCssExtractLoader,
  PostcssLoader,
} from './loaders';
import {
  CssMinimizerPlugin,
  MiniCssExtractPlugin,
  TerserWebpackPlugin,
} from './plugins';

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
            {
              test: /\.css$/,
              use: [MiniCssExtractLoader, CssLoader, PostcssLoader],
            },
            {
              test: /\.less$/,
              use: [MiniCssExtractLoader, CssLoader, PostcssLoader, LessLoader],
            },
          ],
        },
      ],
    },
    plugins: [MiniCssExtractPlugin],
    resolve: {
      mainFields: ['#source', 'browser', 'module', 'main'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [TerserWebpackPlugin, CssMinimizerPlugin],
    },
    performance: {
      maxEntrypointSize: WARN_FILE_SIZE,
      maxAssetSize: WARN_FILE_SIZE,
    },
  };
  return config;
};

export default getWebpackConfig;
