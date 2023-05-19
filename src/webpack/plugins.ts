import _MiniCssExtractPlugin from 'mini-css-extract-plugin';
import _CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import _TerserWebpackPlugin from 'terser-webpack-plugin';
import { isEnvProduction } from '../constants';

/**
 * =================
 * plugins
 * =================
 */

/**
 * 提取css
 */
export const MiniCssExtractPlugin = new _MiniCssExtractPlugin({
  filename: `[name]${isEnvProduction ? '.min' : ''}.css`,
});

/**
 * ======================
 * optimization.minimizer
 * ======================
 */

/**
 * js 压缩配置
 */
export const TerserWebpackPlugin = new _TerserWebpackPlugin({
  // 注释不单独生成一个文件
  extractComments: false,
  terserOptions: {
    compress: {
      // webpack 默认 配置为2
      // 没必要压缩两遍
      passes: 1,
    },
    mangle: {
      safari10: true,
    },
    output: {
      // 不生成特殊的注释
      comments: false,
    },
  },
});

/**
 * css 压缩配置
 */
export const CssMinimizerPlugin = new _CssMinimizerPlugin();
