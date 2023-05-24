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
import { absolutePath, createEnvironmentHash, getUmdEnv } from '../utils';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

type Rule = webpack.RuleSetUseItem;

/**
 * 使用函数包裹是为了能够根据 constants 改变 config
 */
const getWebpackConfig = (mode?: string) => {
  const env = getUmdEnv(mode);
  const isEnvProduction = env.mode == 'production';
  const filename = isEnvProduction ? '[name].[contenthash:8]' : '[name]';
  const chunkFilename = isEnvProduction ? '[contenthash:8]' : '[name]';

  // postcss-preset-env 只会查找 BROWSERSLIST_ENV | NODE_ENV
  process.env['NODE_ENV'] = env.mode;

  const getStyleLoaders = (...rules: Rule[]): Rule[] => {
    return [
      {
        loader: isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader',
      },
      {
        loader: 'css-loader',
        options: {
          importLoaders: rules.length + 1,
          modules: {
            localIdentName: '[local]-[hash:base64:8]',
          },
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              'postcss-flexbugs-fixes',
              [
                'postcss-preset-env',

                {
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                },
              ],
              'postcss-normalize',
            ],
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
      filename: `js/${filename}.js`,
      chunkFilename: `js/${chunkFilename}.js`,
      assetModuleFilename: `media/[name].[hash:8][ext][query]`,
      publicPath: env.publicPath,
    },
    cache: {
      type: 'filesystem',
      version: createEnvironmentHash(env),
      cacheDirectory: env.cacheDirectory,
      store: 'pack',
      buildDependencies: {
        defaultWebpack: ['webpack/lib/'],
        config: [__filename],
      },
    },
    infrastructureLogging: {
      // level: 'none',
    },
    module: {
      // 将缺失的导出提示成错误而不是警告
      strictExportPresence: true,
      rules: [
        // source-map-loader 目前还没有使用的需要
        // {
        //   enforce: 'pre',
        //   exclude: /@babel(?:\/|\\{1,2})runtime/,
        //   test: /\.(js|mjs|jsx|ts|tsx|css)$/,
        //   loader: 'source-map-loader',
        // },
        {
          oneOf: [
            {
              test: /\.(ts|tsx|js|jsx|mjs)$/,
              exclude: /(node_modules)/,
              use: {
                loader: 'babel-loader',
                options: {
                  sourceMaps: !isEnvProduction,
                  // 加载源文件本身的sourceMap
                  inputSourceMap: !isEnvProduction,
                  cacheDirectory: true,
                  cacheCompression: false,
                  compact: isEnvProduction,
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
                    ...(isEnvProduction ? [] : [['react-refresh/babel']]),
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
                },
              }),
            },
            {
              test: /\.s(a|c)ss$/,
              use: getStyleLoaders({
                loader: 'sass-loader',
              }),
            },
            {
              test: /\.(png|jpe?g|svga?|avif|bmp|gif)$/,
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  // 10 Kb 一下的资源直接用 dataUrl
                  maxSize: 10 * 1024,
                },
              },
            },
            {
              exclude: [/^$/, /\.(html|json|m?jsx?|tsx?)$/],
              type: 'asset',
              parser: {
                dataUrlCondition: {
                  maxSize: 10 * 1024,
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `css/${filename}.css`,
        chunkFilename: `css/${chunkFilename}.css`,
      }),
      new HtmlWebpackPlugin({
        template: absolutePath('public/index.html'),
      }),
      new CleanWebpackPlugin(),
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
              ecma: 5,
              // webpack 默认 配置为2
              // 没必要压缩两遍
              passes: 1,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              // 不生成特殊的注释
              comments: false,
              ascii_only: true,
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
