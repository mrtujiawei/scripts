/**
 * 带配置项的 loader
 * @filename src/webpack/loaders.ts
 * @author Mr Prince
 * @date 2023-05-19 15:47:07
 */

import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { browserslist, sourceMap } from '../constants';

type Rule = webpack.RuleSetUseItem;

/**
 * =================
 * js 相关的 loader
 * =================
 */

/**
 * (t|s)sx?
 *
 * 处理 js/ts jsx tsx
 */
export const BabelLoader: Rule = {
  loader: 'babel-loader',
  options: {
    targets: browserslist,
    sourceMaps: sourceMap,
    // 加载源文件本身的sourceMap
    inputSourceMap: sourceMap,
    cacheDirectory: true,
    cacheCompression: false,
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: '3.19.1',
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          proposals: true,
        },
      ],
      // 支持顶层 await
      ['@babel/plugin-syntax-top-level-await'],
    ],
  },
};

/**
 * =================
 * css 相关的 loader
 * =================
 */

/**
 * 提取 style 成 单个 css 文件
 */
export const MiniCssExtractLoader: Rule = {
  loader: MiniCssExtractPlugin.loader,
};

/**
 * 处理 css
 */
export const CssLoader: Rule = {
  loader: 'css-loader',
  options: {
    sourceMap: sourceMap,
  },
};

/**
 * 预处理 css
 * 加前缀啥的
 */
export const PostcssLoader: Rule = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      config: false,
      plugins: ['postcss-preset-env'],
    },
  },
};

/**
 * 处理 less
 */
export const LessLoader: Rule = {
  loader: 'less-loader',
  options: {
    lessOptions: {
      javascriptEnabled: true,
    },
    sourceMap: sourceMap,
  },
};
