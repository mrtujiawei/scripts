/**
 * 打包项目使用
 *
 * @filename src/webpack/umd.ts
 * @author Mr Prince
 * @date 2023-05-24 14:44:57
 */
import webpack from 'webpack';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
// import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import { absolutePath, createEnvironmentHash, getUmdEnv } from '../utils';

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
              test: /\.(tsx?|jsx?|mjs)$/,
              include: absolutePath('src'),
              // exclude: /(node_modules)/,
              use: {
                loader: 'babel-loader',
                options: {
                  // sourceType: 'unambiguous',
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
                        useBuiltIns: 'entry',
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
              test: /\.(tsx?|jsx?|mjs)$/,
              exclude: absolutePath('src'),
              use: {
                loader: 'babel-loader',
                options: {
                  sourceType: 'unambiguous',
                  sourceMaps: !isEnvProduction,
                  inputSourceMap: !isEnvProduction,
                  cacheDirectory: true,
                  cacheCompression: false,
                  compact: isEnvProduction,
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'entry',
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
              exclude: [
                /^$/,
                /\.(html|json|jsx?|tsx?|mjs|css|less|s(a|c)ss|png|jpe?g|svga?|avif|bmp|gif)$/,
              ],
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
        // 参数注入
        // templateParameters: {
        //   title: '标题'
        // }
      }),
      new CleanWebpackPlugin(),
      // moment 导入限制
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),

      // 生成文件清单
      // new WebpackManifestPlugin({
      //   // fileName: 'asset-manifest.json',
      //   publicPath: env.publicPath,
      //   generate(seed, files, entries) {
      //     const manifestFiles = files.reduce((manifest, file) => {
      //       manifest[file.name] = file.path;
      //       return manifest;
      //     }, seed);
      //     const entrypointFiles = entries?.['main']?.filter(
      //       (fileName) => !fileName.endsWith('.map')
      //     );
      //
      //     return {
      //       files: manifestFiles,
      //       entrypoints: entrypointFiles,
      //     };
      //   },
      // }),

      // 注入 manifest.json
      // new WorkboxWebpackPlugin.InjectManifest({
      //   swSrc: '',
      //   dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
      //   exclude: [/\.map$/, /manifest\.json$/, /LICENSE/],
      //   maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      // }),
      // 编辑器检查，而不是打包工具
      // new ForkTsCheckerWebpackPlugin({
      //   async: isEnvDevelopment,
      //   typescript: {
      //     typescriptPath: resolve.sync('typescript', {
      //       basedir: paths.appNodeModules,
      //     }),
      //     configOverwrite: {
      //       compilerOptions: {
      //         sourceMap: isEnvProduction
      //           ? shouldUseSourceMap
      //           : isEnvDevelopment,
      //         skipLibCheck: true,
      //         inlineSourceMap: false,
      //         declarationMap: false,
      //         noEmit: true,
      //         incremental: true,
      //         tsBuildInfoFile: paths.appTsBuildInfoFile,
      //       },
      //     },
      //     context: paths.appPath,
      //     diagnosticOptions: {
      //       syntactic: true,
      //     },
      //     mode: 'write-references',
      //     // profile: true,
      //   },
      //   issue: {
      //     // This one is specifically to match during CI tests,
      //     // as micromatch doesn't match
      //     // '../cra-template-typescript/template/src/App.tsx'
      //     // otherwise.
      //     include: [
      //       { file: '../**/src/**/*.{ts,tsx}' },
      //       { file: '**/src/**/*.{ts,tsx}' },
      //     ],
      //     exclude: [
      //       { file: '**/src/**/__tests__/**' },
      //       { file: '**/src/**/?(*.){spec|test}.*' },
      //       { file: '**/src/setupProxy.*' },
      //       { file: '**/src/setupTests.*' },
      //     ],
      //   },
      //   logger: {
      //     infrastructure: 'silent',
      //   },
      // }),

      // eslint 暂时不需要
      // new ESLintPlugin({
      //   // Plugin options
      //   extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
      //   formatter: require.resolve('react-dev-utils/eslintFormatter'),
      //   eslintPath: require.resolve('eslint'),
      //   failOnError: !(isEnvDevelopment && emitErrorsAsWarnings),
      //   context: paths.appSrc,
      //   cache: true,
      //   cacheLocation: path.resolve(
      //     paths.appNodeModules,
      //     '.cache/.eslintcache'
      //   ),
      //   // ESLint class options
      //   cwd: paths.appPath,
      //   resolvePluginsRelativeTo: __dirname,
      //   baseConfig: {
      //     extends: [require.resolve('eslint-config-react-app/base')],
      //     rules: {
      //       ...(!hasJsxRuntime && {
      //         'react/react-in-jsx-scope': 'error',
      //       }),
      //     },
      //   },
      // }),
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
            parse: {
              ecma: 2017,
            },
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
