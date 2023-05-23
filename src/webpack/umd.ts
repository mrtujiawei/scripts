/**
 * 打包项目使用
 *
 * @filename src/webpack/umd.ts
 * @author Mr Prince
 * @date 2023-05-24 14:44:57
 */
import TerserWebpackPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import { absolutePath, getUmdEnv } from '../utils';

type Rule = webpack.RuleSetUseItem;

/**
 * 使用函数包裹是为了能够根据 constants 改变 config
 */
const getWebpackConfig = (mode?: string) => {
  const env = getUmdEnv(mode);
  const isEnvProduction = env.mode == 'production';
  const filename = isEnvProduction ? '[name].[contenthash:10]' : '[name]';
  const chunkFilename = isEnvProduction ? '[contenthash:10]' : '[name]';

  const getStyleLoaders = (...rules: Rule[]): Rule[] => {
    return [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: !isEnvProduction,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            config: false,
            plugins: ['postcss-preset-env'],
          },
        },
      },
      ...rules,
    ];
  };

  const config: webpack.Configuration = {
    mode: env.mode,
    bail: isEnvProduction,
    devtool: !isEnvProduction && 'source-map',
    stats: 'errors-warnings',
    entry: './src/index',
    output: {
      path: env.outputDir,
      filename: `${filename}.js`,
      chunkFilename: `${chunkFilename}.js`,
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
              use: {
                loader: 'babel-loader',
                options: {
                  targets: '> 0.01%',
                  sourceMaps: !isEnvProduction,
                  // 加载源文件本身的sourceMap
                  inputSourceMap: !isEnvProduction,
                  cacheDirectory: true,
                  cacheCompression: false,
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'usage',
                        corejs: '3.30.2',
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
                  ],
                },
              },
            },
            {
              test: /\.css$/,
              use: getStyleLoaders(),
            },
            {
              test: /\.less$/,
              use: getStyleLoaders({
                loader: 'less-loader',
                options: {
                  lessOptions: {
                    javascriptEnabled: true,
                  },
                  sourceMap: !isEnvProduction,
                },
              }),
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${filename}.css`,
        chunkFilename: `${chunkFilename}.css`,
      }),
      new HtmlWebpackPlugin({
        template: absolutePath('public/index.html'),
      }),
    ],
    resolve: {
      mainFields: ['#source', 'browser', 'module', 'main'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserWebpackPlugin({
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
        }),
        new CssMinimizerPlugin(),
      ],
    },
    performance: {
      maxEntrypointSize: 2 * 1024 * 1024,
      maxAssetSize: 2 * 1024 * 1024,
    },
  };

  return config;
};

export default getWebpackConfig;
